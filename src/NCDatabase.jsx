import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { supabase } from "./supabase";

// StackBlitz/Vite-friendly: load SheetJS from CDN (no npm "xlsx" package required)
const XLSX_CDN = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
function loadXLSX() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) { resolve(window.XLSX); return; }
    const existing = document.querySelector(`script[src="${XLSX_CDN}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.XLSX));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = XLSX_CDN;
    script.onload = () => resolve(window.XLSX);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Lightweight icon stubs (no lucide-react dependency)
const ic = (emoji) => function Icon({ size = 16, className, style }) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        fontSize: Math.max(12, size - 2),
        lineHeight: 1,
        ...style,
      }}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
};
const Ship = ic("🚢");
const Upload = ic("⬆");
const Search = ic("🔍");
const ChevronDown = ic("▾");
const ChevronUp = ic("▴");
const X = ic("✕");
const RefreshCw = ic("↻");
const AlertTriangle = ic("⚠");
const CheckCircle2 = ic("✓");
const Loader2 = ic("◌");
const FileSpreadsheet = ic("📄");
const Info = ic("ℹ");

/* =========================================================
   SEED DATA removed — live data from Supabase nc_records
   One-time import: backups/nc_records_seed.sql
   ========================================================= */
const SEED_RECORDS = []; // data moved to Supabase table nc_records (see nc_records_seed.sql)
/* =========================================================
   Design tokens
   ========================================================= */
/* Theme tokens — follow Voyage Portal light/dark (data-theme / prop) */
const TOKENS = {
  dark: {
    bg: "var(--c-bg, #0B1420)",
    panel: "var(--c-panel, #101B2B)",
    panel2: "var(--c-panel2, #0D1826)",
    border: "var(--c-border, #1E2E44)",
    borderStrong: "var(--c-dim, #2C4059)",
    textPrimary: "var(--c-text, #E8EDF4)",
    textSecondary: "var(--c-muted, #8CA0B8)",
    textMuted: "var(--c-muted, #5B6E85)",
    amber: "var(--c-amber, #E8A33D)",
    amberDim: "rgba(251, 191, 36, 0.12)",
    teal: "var(--c-green, #45B39D)",
    tealDim: "rgba(34, 211, 238, 0.12)",
    red: "var(--c-red, #DC5B54)",
    redDim: "rgba(248, 113, 113, 0.12)",
    slate: "var(--c-muted, #5F7A94)",
  },
  light: {
    bg: "var(--c-bg, #f4f7fb)",
    panel: "var(--c-panel, #ffffff)",
    panel2: "var(--c-panel2, #e7eef7)",
    border: "var(--c-border, rgba(2,132,199,0.22))",
    borderStrong: "var(--c-dim, #cbd5e1)",
    textPrimary: "var(--c-text, #0f172a)",
    textSecondary: "var(--c-muted, #475569)",
    textMuted: "var(--c-muted, #64748b)",
    amber: "var(--c-amber, #b45309)",
    amberDim: "rgba(180, 83, 9, 0.10)",
    teal: "var(--c-green, #0891b2)",
    tealDim: "rgba(8, 145, 178, 0.10)",
    red: "var(--c-red, #dc2626)",
    redDim: "rgba(220, 38, 38, 0.10)",
    slate: "var(--c-muted, #64748b)",
  },
};

function resolveTheme(themeProp) {
  if (themeProp === "light" || themeProp === "dark") return themeProp;
  if (typeof document !== "undefined") {
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "light" || t === "dark") return t;
  }
  return "dark";
}

const VESSELS = [
  "Express Mas",
  "Mavendra Mas",
  "Prakarsa Mas",
  "Pratama Mas",
  "Sahabat Mas",
  "Segoro Mas",
  "Selaras Mas",
  "Semangat Mas",
];

const RISK_ORDER = ["Critical", "Warning", "Normal"];

const STORAGE_KEY = "nc-database-records-v1";

/* =========================================================
   Helpers
   ========================================================= */
function normKey(k) {
  return String(k || "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function findField(row, exactCandidates, includesCandidates) {
  const keys = Object.keys(row);
  for (const cand of exactCandidates) {
    const hit = keys.find((k) => normKey(k) === cand);
    if (hit !== undefined) return row[hit];
  }
  for (const cand of includesCandidates) {
    const hit = keys.find((k) => normKey(k).includes(cand));
    if (hit !== undefined) return row[hit];
  }
  return "";
}

function toDateStr(val) {
  if (val === null || val === undefined || val === "") return "";
  if (val instanceof Date && !isNaN(val)) {
    return val.toISOString().slice(0, 10);
  }
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const parsed = new Date(s);
  if (!isNaN(parsed) && /\d/.test(s)) return parsed.toISOString().slice(0, 10);
  return s;
}

function normalizeStatus(val) {
  const s = String(val || "").trim().toUpperCase();
  if (s.includes("CLOSE")) return "CLOSED";
  if (s.includes("OPEN")) return "OPEN";
  return s || "OPEN";
}

/** DB row (snake_case) → app record (camelCase) */
function rowToRecord(row) {
  if (!row) return null;
  return {
    no: Number(row.no),
    vessel: row.vessel || "",
    description: row.description || "",
    auditType: row.audit_type || "",
    cluster1: row.cluster1 || "",
    cluster2: row.cluster2 || "",
    category: row.category || "",
    subCategory: row.sub_category || "",
    risk: row.risk || "Normal",
    issuedDate: row.issued_date || "",
    auditYear: row.audit_year || "",
    auditRound: row.audit_round || "",
    dueDate: row.due_date || "",
    closedDate: row.closed_date || "",
    status: normalizeStatus(row.status),
    remark: row.remark || "",
    captain: row.captain || "",
    auditor: row.auditor || "",
  };
}

/** app record → DB row */
function recordToRow(r) {
  const emptyToNull = (d) => {
    const s = String(d || "").trim();
    return s ? s : null;
  };
  return {
    no: Number(r.no),
    vessel: r.vessel || "",
    description: r.description || "",
    audit_type: r.auditType || "",
    cluster1: r.cluster1 || "",
    cluster2: r.cluster2 || "",
    category: r.category || "",
    sub_category: r.subCategory || "",
    risk: r.risk || "Normal",
    issued_date: emptyToNull(r.issuedDate),
    audit_year: r.auditYear || "",
    audit_round: r.auditRound || "",
    due_date: emptyToNull(r.dueDate),
    closed_date: emptyToNull(r.closedDate),
    status: normalizeStatus(r.status),
    remark: r.remark || "",
    captain: r.captain || "",
    auditor: r.auditor || "",
  };
}


/** Parse a workbook (array buffer) into our internal record shape. */
function parseWorkbook(workbook, XLSX = window.XLSX) {
  let sheetName =
    workbook.SheetNames.find((n) => normKey(n).includes("database")) ||
    workbook.SheetNames[0];

  // scan for the header row (contains both "no." and "vessel")
  const ws = workbook.Sheets[sheetName];
  const grid = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });
  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(grid.length, 20); i++) {
    const rowNorm = grid[i].map(normKey);
    if (rowNorm.includes("no.") && rowNorm.some((c) => c.includes("vessel"))) {
      headerRowIdx = i;
      break;
    }
  }
  if (headerRowIdx === -1) {
    throw new Error(
      "Tidak ketemu baris header (kolom 'No.' dan 'Vessel') di sheet ini."
    );
  }

  const rows = XLSX.utils.sheet_to_json(ws, {
    range: headerRowIdx,
    raw: false,
    defval: "",
    dateNF: "yyyy-mm-dd",
  });

  const records = [];
  for (const row of rows) {
    const noRaw = findField(row, ["no."], ["no"]);
    const no = parseInt(String(noRaw).replace(/[^\d]/g, ""), 10);
    if (!no || isNaN(no)) continue;

    const vessel = String(findField(row, ["vessel"], ["vessel"])).trim();
    if (!vessel) continue;

    records.push({
      no,
      vessel,
      description: String(
        findField(row, ["nc description"], ["description"])
      ).trim(),
      auditType: String(
        findField(row, [], ["category of audit", "audit/survey"])
      ).trim(),
      cluster1: String(findField(row, [], ["cluster 1"])).trim(),
      cluster2: String(findField(row, [], ["cluster 2"])).trim(),
      category: String(findField(row, ["category of nc"], ["category of nc"])).trim(),
      subCategory: String(findField(row, ["sub category"], ["sub category"])).trim(),
      risk: String(findField(row, ["risk category"], ["risk"])).trim() || "Normal",
      issuedDate: toDateStr(findField(row, ["issued date"], ["issued date"])),
      auditYear: String(findField(row, [], ["years", "year"])).trim().replace(/\.0$/, ""),
      auditRound: String(findField(row, [], ["help 2", "audit 1", "audit round"])).trim(),
      dueDate: toDateStr(findField(row, ["due date"], ["due date"])),
      closedDate: toDateStr(findField(row, ["closed date"], ["closed date"])),
      status: normalizeStatus(findField(row, ["status2"], ["status2", "status"])),
      remark: String(findField(row, ["remark"], ["remark"])).trim(),
      captain: String(findField(row, ["captain name"], ["captain"])).trim(),
      auditor: String(findField(row, ["auditor name"], ["auditor"])).trim(),
    });
  }
  return { sheetName, records };
}

export default function NCDatabase({ theme: themeProp, user } = {}) {
  const [theme, setTheme] = useState(() => resolveTheme(themeProp));
  const T = useMemo(() => TOKENS[resolveTheme(theme)] || TOKENS.dark, [theme]);

  // Sync from prop (Voyage Portal header toggle)
  useEffect(() => {
    if (themeProp === "light" || themeProp === "dark") setTheme(themeProp);
  }, [themeProp]);

  // Also watch <html data-theme> so any global toggle is reflected
  useEffect(() => {
    const el = document.documentElement;
    const apply = () => setTheme(resolveTheme(themeProp));
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, [themeProp]);

  const [records, setRecords] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadState, setUploadState] = useState(null); // {status, message, inserted, updated}
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [search, setSearch] = useState("");
  const [vesselFilter, setVesselFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [roundFilter, setRoundFilter] = useState("All");
  const [sortKey, setSortKey] = useState("issuedDate");
  const [sortDir, setSortDir] = useState("desc");
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;

  // Same as Voyage Portal: ship-login only sees own vessel NC.
  // Resolve ship from several fields because StackBlitz/profiles can differ.
  const shipScope = useMemo(() => {
    if (!user) return null;
    const role = String(user.role || "").toLowerCase();
    const candidates = [user.ship, user.name, user.full_name, user.email?.split("@")[0]]
      .map((x) => (x == null ? "" : String(x).trim()))
      .filter(Boolean);
    // Prefer explicit ship field
    if (user.ship && String(user.ship).trim()) return String(user.ship).trim();
    // Kapal accounts: name is usually the vessel name (e.g. "Express Mas")
    if (role === "kapal" || role === "ship" || role === "vessel") {
      // Only treat as ship-scope if name matches a known vessel
      const hit = candidates.find((c) =>
        VESSELS.some((v) => v.toLowerCase() === c.toLowerCase())
      );
      if (hit) {
        const v = VESSELS.find((x) => x.toLowerCase() === hit.toLowerCase());
        return v || hit;
      }
    }
    // Fallback: if any candidate exactly matches a vessel name, scope to it
    // (covers accounts where role is not "kapal" but name is the ship)
    const hit2 = candidates.find((c) =>
      VESSELS.some((v) => v.toLowerCase() === c.toLowerCase())
    );
    if (hit2) {
      const v = VESSELS.find((x) => x.toLowerCase() === hit2.toLowerCase());
      return v || hit2;
    }
    return null;
  }, [user]);

  const sameVessel = (a, b) =>
    String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();

  useEffect(() => {
    if (shipScope) setVesselFilter(shipScope);
  }, [shipScope]);


  // Load from Supabase nc_records (fallback: local seed if table empty/unavailable)
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("nc_records")
          .select("*")
          .order("no", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setRecords(data.map(rowToRecord).filter(Boolean));
          const maxUpdated = data.reduce((acc, r) => {
            const t = r.updated_at || r.created_at;
            return t && (!acc || t > acc) ? t : acc;
          }, null);
          setLastUpdated(maxUpdated);
        } else {
          // Table exists but empty — keep empty (office can upload Excel)
          setRecords([]);
          setLastUpdated(null);
        }
      } catch (err) {
        console.warn("NC load from Supabase failed:", err?.message || err);
        setRecords([]);
        setLastUpdated(null);
        setUploadState({
          status: "error",
          message:
            "Gagal load dari Supabase: " +
            (err?.message || String(err)) +
            " — cek tabel nc_records & login.",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Upsert changed rows to Supabase (by primary key: no)
  const persist = useCallback(async (nextRecords, ts, changedRecords = null) => {
    const rows = (changedRecords || nextRecords).map(recordToRow);
    if (!rows.length) return { ok: true };

    // chunk upserts to avoid payload limits
    const chunkSize = 200;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const { error } = await supabase
        .from("nc_records")
        .upsert(chunk, { onConflict: "no" });
      if (error) {
        console.error("NC upsert error:", error);
        throw error;
      }
    }

    // optional local cache
    try {
      await window.storage?.set?.(
        STORAGE_KEY,
        JSON.stringify({ records: nextRecords, lastUpdated: ts }),
        false
      );
    } catch {
      // ignore
    }
    return { ok: true };
  }, []);

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      setUploadState({ status: "loading", message: "Membaca file..." });
      try {
        const buf = await file.arrayBuffer();
        const XLSX = await loadXLSX();
        if (!XLSX) throw new Error("Gagal memuat library Excel (SheetJS)");
        const wb = XLSX.read(buf, { type: "array", cellDates: true });
        const { sheetName, records: incoming } = parseWorkbook(wb, XLSX);

        if (incoming.length === 0) {
          setUploadState({
            status: "error",
            message:
              "Tidak ada baris data yang valid ditemukan (kolom No. atau Vessel kosong semua).",
          });
          return;
        }

        setRecords((prev) => {
          const map = new Map(prev.map((r) => [r.no, r]));
          let inserted = 0;
          let updated = 0;
          let skipped = 0;

          const norm = (v) => String(v ?? "").trim();
          const sameRecord = (a, b) => {
            if (!a || !b) return false;
            // Compare all meaningful fields (not just status)
            const keys = [
              "no", "vessel", "description", "auditType", "cluster1", "cluster2",
              "category", "subCategory", "risk", "issuedDate", "auditYear",
              "auditRound", "dueDate", "closedDate", "status", "remark",
              "captain", "auditor",
            ];
            return keys.every((k) => {
              if (k === "no") return Number(a.no) === Number(b.no);
              return norm(a[k]) === norm(b[k]);
            });
          };

          for (const rec of incoming) {
            const existing = map.get(rec.no);
            if (!existing) {
              inserted++;
              map.set(rec.no, rec);
            } else if (sameRecord(existing, rec)) {
              skipped++;
              // keep existing as-is
            } else {
              updated++;
              map.set(rec.no, rec);
            }
          }

          const merged = Array.from(map.values());
          const ts = new Date().toISOString();
          // Only touch lastUpdated/persist if something actually changed
          if (inserted > 0 || updated > 0) {
            const changed = [];
            for (const rec of incoming) {
              const prevRec = prev.find((p) => Number(p.no) === Number(rec.no));
              if (!prevRec) changed.push(rec);
              else {
                // was counted updated only if different — re-check quickly
                const keys = [
                  "vessel","description","auditType","cluster1","cluster2","category","subCategory",
                  "risk","issuedDate","auditYear","auditRound","dueDate","closedDate","status","remark","captain","auditor",
                ];
                const diff = keys.some((k) => String(prevRec[k] ?? "").trim() !== String(rec[k] ?? "").trim());
                if (diff) changed.push(rec);
              }
            }
            setLastUpdated(ts);
            // fire-and-forget async persist; surface error on UI
            Promise.resolve()
              .then(() => persist(merged, ts, changed))
              .then(() => {
                setUploadState({
                  status: "success",
                  message:
                    `Sheet "${sheetName}": ${incoming.length} baris — ` +
                    `${inserted} baru, ${updated} di-update, ${skipped} dilewati · tersimpan ke Supabase.`,
                });
              })
              .catch((err) => {
                setUploadState({
                  status: "error",
                  message:
                    "Data terbaca, tapi gagal simpan ke Supabase: " +
                    (err?.message || String(err)) +
                    " — pastikan tabel nc_records sudah dibuat & RLS mengizinkan.",
                });
              });
          } else {
            setUploadState({
              status: "success",
              message:
                `Sheet "${sheetName}": ${incoming.length} baris dibaca — ` +
                `${inserted} baru, ${updated} di-update, ${skipped} dilewati (sudah sama).`,
            });
          }
          return (inserted > 0 || updated > 0) ? merged : prev;
        });
      } catch (err) {
        setUploadState({
          status: "error",
          message: "Gagal parsing file: " + (err?.message || String(err)),
        });
      }
    },
    [persist]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // scoped dataset for ship accounts
  const scopedRecords = useMemo(() => {
    if (!shipScope) return records;
    return records.filter((r) => sameVessel(r.vessel, shipScope));
  }, [records, shipScope]);

  // derived stats (scoped)
  const stats = useMemo(() => {
    const total = scopedRecords.length;
    const open = scopedRecords.filter((r) => r.status === "OPEN").length;
    const closed = total - open;
    const critical = scopedRecords.filter(
      (r) => r.status === "OPEN" && normKey(r.risk) === "critical"
    ).length;
    return { total, open, closed, critical };
  }, [scopedRecords]);

  const categoryOptions = useMemo(() => {
    const set = new Set(scopedRecords.map((r) => r.category).filter(Boolean));
    return Array.from(set).sort();
  }, [scopedRecords]);

  const yearOptions = useMemo(() => {
    const set = new Set(scopedRecords.map((r) => r.auditYear).filter(Boolean));
    return Array.from(set).sort();
  }, [scopedRecords]);

  const roundOptions = useMemo(() => {
    const set = new Set(scopedRecords.map((r) => r.auditRound).filter(Boolean));
    return Array.from(set).sort();
  }, [scopedRecords]);

  const perVessel = useMemo(() => {
    const list = shipScope ? VESSELS.filter((v) => sameVessel(v, shipScope)) : VESSELS;
    return list.map((v) => {
      const rows = scopedRecords.filter((r) => sameVessel(r.vessel, v));
      return {
        vessel: v,
        total: rows.length,
        open: rows.filter((r) => r.status === "OPEN").length,
      };
    });
  }, [scopedRecords, shipScope]);

  const filtered = useMemo(() => {
    let rows = scopedRecords;
    if (shipScope) {
      rows = rows.filter((r) => sameVessel(r.vessel, shipScope));
    } else if (vesselFilter !== "All") {
      rows = rows.filter((r) => r.vessel === vesselFilter);
    }
    if (statusFilter !== "All") rows = rows.filter((r) => r.status === statusFilter);
    if (riskFilter !== "All") rows = rows.filter((r) => normKey(r.risk) === normKey(riskFilter));
    if (categoryFilter !== "All") rows = rows.filter((r) => r.category === categoryFilter);
    if (yearFilter !== "All") rows = rows.filter((r) => r.auditYear === yearFilter);
    if (roundFilter !== "All") rows = rows.filter((r) => r.auditRound === roundFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          String(r.no).includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.subCategory.toLowerCase().includes(q) ||
          r.remark.toLowerCase().includes(q) ||
          r.captain.toLowerCase().includes(q) ||
          r.auditor.toLowerCase().includes(q)
      );
    }
    rows = [...rows].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === "no") {
        av = a.no;
        bv = b.no;
      } else {
        av = String(av || "");
        bv = String(bv || "");
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [
    scopedRecords,
    shipScope,
    vesselFilter,
    statusFilter,
    riskFilter,
    categoryFilter,
    yearFilter,
    roundFilter,
    search,
    sortKey,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [
    vesselFilter,
    statusFilter,
    riskFilter,
    categoryFilter,
    yearFilter,
    roundFilter,
    search,
  ]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const riskColor = (risk) => {
    const r = normKey(risk);
    if (r === "critical") return T.red;
    if (r === "warning") return T.amber;
    return T.slate;
  };

  if (loading) {
    return (
      <div
        style={{ background: T.bg, color: T.textSecondary }}
        className="w-full min-h-[400px] flex items-center justify-center gap-2 rounded-xl"
      >
        <Loader2 className="animate-spin" size={18} />
        <span className="text-sm">Memuat database NC...</span>
      </div>
    );
  }

  return (
    <div
      style={{ background: T.bg, color: T.textPrimary, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
      className="w-full rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div
        style={{ borderBottom: `1px solid ${T.border}`, background: T.panel2 }}
        className="px-6 py-5"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              style={{ background: T.amberDim, color: T.amber }}
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            >
              <Ship size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight leading-tight">
                Database NC
              </h1>
              <p style={{ color: T.textMuted }} className="text-xs mt-0.5">
                PT Mentari Mas Multimoda — 2025/2026
                {lastUpdated && (
                  <>
                    {" "}
                    · update terakhir{" "}
                    {new Date(lastUpdated).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!shipScope && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xlsm,.xls"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    // Match App.jsx "Buat Laporan" (ss.btn)
                    background: "linear-gradient(135deg, #0ea5e9, #0369a1)",
                    color: "#ffffff",
                    border: "none",
                    boxShadow: "0 2px 10px rgba(14,165,233,0.35)",
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Upload size={15} />
                  Upload Excel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <StatCard label="Total NC" value={stats.total} color={T.textPrimary} bg={T.panel} border={T.border} />
          <StatCard label="Open" value={stats.open} color={T.amber} bg={T.panel} border={T.border} />
          <StatCard label="Closed" value={stats.closed} color={T.teal} bg={T.panel} border={T.border} />
          <StatCard label="Open — Critical" value={stats.critical} color={T.red} bg={T.panel} border={T.border} />
        </div>

      </div>

      {/* Upload feedback */}
      {uploadState && (
        <div
          style={{
            borderBottom: `1px solid ${T.border}`,
            background:
              uploadState.status === "error"
                ? T.redDim
                : uploadState.status === "success"
                ? T.tealDim
                : T.panel,
            color:
              uploadState.status === "error"
                ? "#F5B4B0"
                : uploadState.status === "success"
                ? "#9FE0D0"
                : T.textSecondary,
          }}
          className="px-6 py-2.5 text-xs flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            {uploadState.status === "loading" && <Loader2 className="animate-spin" size={14} />}
            {uploadState.status === "success" && <CheckCircle2 size={14} />}
            {uploadState.status === "error" && <AlertTriangle size={14} />}
            <span>{uploadState.message}</span>
          </div>
          <button onClick={() => setUploadState(null)} className="opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Drop zone (visible always, subtle) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: `1.5px dashed ${dragOver ? T.amber : T.border}`,
          background: dragOver ? T.amberDim : "transparent",
          margin: "16px 24px 0",
        }}
        className="rounded-lg px-4 py-3 flex items-center gap-2 text-xs transition-colors"
      >
        <FileSpreadsheet size={14} style={{ color: T.textMuted }} />
        <span style={{ color: T.textMuted }}>
          Drag & drop file Excel entry baru di sini untuk update database (upsert berdasarkan No. NC), atau pakai tombol Upload di atas.
        </span>
      </div>

      {/* Toolbar: search full width, all filters below */}
      <div className="px-6 pt-4 pb-2">
        <div
          style={{ background: T.panel, border: `1px solid ${T.border}` }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg w-full"
        >
          <Search size={14} style={{ color: T.textMuted }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari deskripsi, kategori, auditor..."
            style={{ color: T.textPrimary }}
            className="bg-transparent outline-none text-sm w-full placeholder:text-current"
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ color: T.textMuted }}>
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="px-6 pb-3 flex flex-wrap gap-2 items-center">
        <Select
          value={shipScope || vesselFilter}
          onChange={(v) => { if (!shipScope) setVesselFilter(v); }}
          options={shipScope ? [shipScope] : ["All", ...VESSELS]}
          label={shipScope ? "Kapal (akun ini)" : "Kapal"}
          T={T}
        />
        <Select value={statusFilter} onChange={setStatusFilter} options={["All", "OPEN", "CLOSED"]} label="Status" T={T} />
        <Select value={riskFilter} onChange={setRiskFilter} options={["All", ...RISK_ORDER]} label="Risk" T={T} />
        <Select value={categoryFilter} onChange={setCategoryFilter} options={["All", ...categoryOptions]} label="Kategori" T={T} />
        <Select value={yearFilter} onChange={setYearFilter} options={["All", ...yearOptions]} label="Tahun Audit" T={T} />
        <Select
          value={roundFilter}
          onChange={setRoundFilter}
          options={["All", ...roundOptions]}
          label="Audit Ke-"
          T={T}
        />
        {(vesselFilter !== "All" ||
          statusFilter !== "All" ||
          riskFilter !== "All" ||
          categoryFilter !== "All" ||
          yearFilter !== "All" ||
          roundFilter !== "All" ||
          search) && (
          <button
            onClick={() => {
              setVesselFilter("All");
              setStatusFilter("All");
              setRiskFilter("All");
              setCategoryFilter("All");
              setYearFilter("All");
              setRoundFilter("All");
              setSearch("");
            }}
            style={{ color: T.textMuted, border: `1px solid ${T.border}` }}
            className="text-xs px-2.5 py-2 rounded-lg flex items-center gap-1"
          >
            <X size={12} />
            Reset filter
          </button>
        )}
      </div>

      {/* Per-vessel open mini strip */}
      <div className="px-6 pb-3 flex flex-wrap gap-2">
        {perVessel.map((v) => (
          <button
            key={v.vessel}
            onClick={() => {
              if (shipScope) return; // locked to own ship
              setVesselFilter(vesselFilter === v.vessel ? "All" : v.vessel);
            }}
            style={{
              background: (shipScope ? true : vesselFilter === v.vessel) ? T.amberDim : T.panel,
              border: `1px solid ${(shipScope ? true : vesselFilter === v.vessel) ? T.amber : T.border}`,
              color: (shipScope ? true : vesselFilter === v.vessel) ? T.amber : T.textSecondary,
            }}
            className="px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5"
          >
            {v.vessel}
            <span style={{ color: T.textMuted }}>· {v.total}</span>
            {v.open > 0 && (
              <span style={{ color: T.amber }} className="font-medium">
                {v.open} open
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="px-6 pb-2 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              <Th label="No." sortKey="no" active={sortKey} dir={sortDir} onClick={toggleSort} T={T} />
              <Th label="Kapal" sortKey="vessel" active={sortKey} dir={sortDir} onClick={toggleSort} T={T} />
              <th className="text-left py-2 px-2 font-medium" style={{ color: T.textMuted }}>
                Deskripsi
              </th>
              <Th label="Kategori" sortKey="category" active={sortKey} dir={sortDir} onClick={toggleSort} T={T} />
              <Th label="Risk" sortKey="risk" active={sortKey} dir={sortDir} onClick={toggleSort} T={T} />
              <Th label="Issued" sortKey="issuedDate" active={sortKey} dir={sortDir} onClick={toggleSort} T={T} />
              <Th label="Due" sortKey="dueDate" active={sortKey} dir={sortDir} onClick={toggleSort} T={T} />
              <Th label="Status" sortKey="status" active={sortKey} dir={sortDir} onClick={toggleSort} T={T} />
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => {
              const isOpen = expandedRow === r.no;
              return (
                <React.Fragment key={r.no}>
                  <tr
                    onClick={() => setExpandedRow(isOpen ? null : r.no)}
                    style={{ borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}
                    className="hover:brightness-125 transition-[filter]"
                  >
                    <td className="py-2 px-2 font-mono text-xs" style={{ color: T.textMuted }}>
                      {r.no}
                    </td>
                    <td className="py-2 px-2 whitespace-nowrap">{r.vessel}</td>
                    <td className="py-2 px-2 max-w-[320px] truncate" title={r.description}>
                      {r.description}
                    </td>
                    <td className="py-2 px-2 whitespace-nowrap" style={{ color: T.textSecondary }}>
                      {r.category}
                    </td>
                    <td className="py-2 px-2">
                      <span
                        style={{ color: riskColor(r.risk) }}
                        className="text-xs font-medium"
                      >
                        {r.risk}
                      </span>
                    </td>
                    <td className="py-2 px-2 font-mono text-xs whitespace-nowrap" style={{ color: T.textSecondary }}>
                      {r.issuedDate}
                    </td>
                    <td className="py-2 px-2 font-mono text-xs whitespace-nowrap" style={{ color: T.textSecondary }}>
                      {r.dueDate}
                    </td>
                    <td className="py-2 px-2">
                      <StatusStamp status={r.status} T={T} />
                    </td>
                  </tr>
                  {isOpen && (
                    <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.panel }}>
                      <td colSpan={8} className="px-4 py-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <Detail label="Deskripsi lengkap" value={r.description} T={T} span2 />
                          <Detail label="Audit / Survey" value={r.auditType} T={T} />
                          <Detail label="Cluster 1" value={r.cluster1} T={T} />
                          <Detail label="Cluster 2" value={r.cluster2} T={T} />
                          <Detail label="Sub kategori" value={r.subCategory} T={T} />
                          <Detail label="Tahun audit" value={r.auditYear || "—"} T={T} />
                          <Detail label="Audit ke-" value={r.auditRound || "—"} T={T} />
                          <Detail label="Closed date" value={r.closedDate || "—"} T={T} />
                          <Detail label="Captain" value={r.captain || "—"} T={T} />
                          <Detail label="Auditor" value={r.auditor || "—"} T={T} />
                          <Detail label="Remark" value={r.remark || "—"} T={T} span2 />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-sm" style={{ color: T.textMuted }}>
                  Tidak ada entry NC yang cocok dengan filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 flex items-center justify-between text-xs" style={{ color: T.textMuted }}>
        <span>
          Menampilkan {pageRows.length ? (page - 1) * PAGE_SIZE + 1 : 0}–
          {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} entry
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{ border: `1px solid ${T.border}`, opacity: page <= 1 ? 0.4 : 1 }}
            className="px-2.5 py-1 rounded-md"
          >
            Prev
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={{ border: `1px solid ${T.border}`, opacity: page >= totalPages ? 0.4 : 1 }}
            className="px-2.5 py-1 rounded-md"
          >
            Next
          </button>
        </div>
      </div>

      <div
        style={{ borderTop: `1px solid ${T.border}`, color: T.textMuted }}
        className="px-6 py-3 flex items-center gap-1.5 text-[11px]"
      >
        <Info size={12} />
        Data tersimpan di Supabase (tabel nc_records). Upload Excel: No. baru = insert, No. sama + data beda = update, No. sama + data identik = skip.
      </div>
    </div>
  );
}

function StatCard({ label, value, color, bg, border }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}` }} className="rounded-lg px-3.5 py-3">
      <div style={{ color: "#5B6E85" }} className="text-[11px] mb-1">
        {label}
      </div>
      <div style={{ color }} className="text-2xl font-semibold tabular-nums">
        {value}
      </div>
    </div>
  );
}

function Select({ value, onChange, options, label, T }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: T.panel,
        border: `1px solid ${T.border}`,
        color: T.textPrimary,
      }}
      className="text-sm px-3 py-2 rounded-lg outline-none"
    >
      {options.map((o) => (
        <option key={o} value={o} style={{ background: T.panel2 }}>
          {o === "All" ? `Semua ${label}` : o}
        </option>
      ))}
    </select>
  );
}

function Th({ label, sortKey, active, dir, onClick, T }) {
  const isActive = active === sortKey;
  return (
    <th
      onClick={() => onClick(sortKey)}
      className="text-left py-2 px-2 font-medium cursor-pointer select-none whitespace-nowrap"
      style={{ color: isActive ? T.textPrimary : T.textMuted }}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive &&
          (dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
      </span>
    </th>
  );
}

function StatusStamp({ status, T }) {
  const isOpen = status === "OPEN";
  return (
    <span
      style={{
        color: isOpen ? T.amber : T.teal,
        border: `1px solid ${isOpen ? T.amber : T.teal}`,
        background: isOpen ? T.amberDim : T.tealDim,
      }}
      className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded"
    >
      {status}
    </span>
  );
}

function Detail({ label, value, T, span2 }) {
  return (
    <div className={span2 ? "col-span-2 md:col-span-4" : ""}>
      <div style={{ color: T.textMuted }} className="mb-0.5">
        {label}
      </div>
      <div style={{ color: T.textSecondary }}>{value}</div>
    </div>
  );
}
