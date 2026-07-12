import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
// --- XLSX FOR EXPORT ---
const XLSX_CDN = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
let XLSX = null;

function loadXLSX() {
  return new Promise((resolve, reject) => {
    if (XLSX) { resolve(XLSX); return; }
    const script = document.createElement("script");
    script.src = XLSX_CDN;
    script.onload = () => { XLSX = window.XLSX; resolve(XLSX); };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function downloadMultiSheetExcel(sheets, filename) {
  try {
    await loadXLSX();
    const wb = XLSX.utils.book_new();
    sheets.forEach((sheet) => {
      const ws = XLSX.utils.aoa_to_sheet(sheet.data);
      if (sheet.widths) {
        ws['!cols'] = sheet.widths.map(w => ({ wch: w }));
      }
      XLSX.utils.book_append_sheet(wb, ws, sheet.name);
    });
    XLSX.writeFile(wb, filename);
  } catch (err) {
    console.error("Error:", err);
    alert("Gagal generate Excel. Pastikan koneksi internet stabil.");
  }
}

// --- CONSTANTS ----------------------------------------------------------------
const SHIPS = ["Express Mas","Mavendra Mas","Prakarsa Mas","Pratama Mas","Semangat Mas","Segoro Mas","Sahabat Mas","Selaras Mas"];

// Fuel consumption parameter per ship: ME (L/hour) and AE (L/hour)
const FUEL_PARAMS = {
  "Express Mas":  { me: 230, ae: 31 },
  "Mavendra Mas": { me: 191, ae: 25 },
  "Prakarsa Mas": { me: 206, ae: 24 },
  "Pratama Mas":  { me: 216, ae: 25 },
  "Segoro Mas":   { me: 203, ae: 20 },
  "Semangat Mas": { me: 202, ae: 23 },
  "Sahabat Mas":  { me: 195, ae: 25 },
  "Selaras Mas":  { me: 190, ae: 25 },
};

const RT = [
  { id:"departure",     label:"Departure Report",             short:"DEP"     },
  { id:"dep_anchor",    label:"Departure from Anchor Report", short:"DEP-ANC" },
  { id:"arr_berth",     label:"Arrival Berthing Report",      short:"ARR-BRT" },
  { id:"arr_anchor",    label:"Arrival Anchorage Report",     short:"ARR-ANC" },
  { id:"shift_anchor",  label:"Shifting to Anchorage Report", short:"SHF-ANC" },
  { id:"shift_berth",   label:"Shifting to Berth Report",     short:"SHF-BRT" },
  { id:"shelter_arr",   label:"Shelter Anchorage Report",     short:"SHL-ANC" },
  { id:"shelter_dep",   label:"Shelter Departure Report",     short:"SHL-DEP" },
  { id:"shift_bb",      label:"Shifting Berth to Berth",      short:"SHF-BB"  },
  { id:"shift_aa",      label:"Shifting Anchorage to Anchorage", short:"SHF-AA"},
  { id:"sea_trial",     label:"Sea Trial Report",              short:"SEA-TRL" },
  { id:"noon",          label:"Noon Report",                  short:"NOON"    },
  { id:"downtime",      label:"Downtime Report",              short:"DWN"     },
];

const DTCATS = ["Engine Breakdown","Weather Delay","Port Congestion","Cargo Op. Delay","Crew Issue","Fuel Bunkering","Inspection/Survey","Other"];
const TANKS  = ["MFO","MDO","MEDRIPAL 430","MEDITRANS S-40","TURALIK 52/68","TURBOLUBE 68","KOMPEN 68","MASRI RG 150","Sumptank","FW"];
const PHASES = [{ k:"ohn", l:"OHN" }, { k:"sbe", l:"SBE/Standby" }, { k:"fwe", l:"FWE" }]; // "fwe" label is overridden per-report-type in TankSection (FAW for departure, FWE for arrival/shifting/shelter)

const EVT_DEF = {
  departure:    ["OHN","Comm Disch","Compl Disch","Comm Load","Compl Load","SBE","POB","Tug Fast","Single Up","Cast Off","Tug Off","BOSV","Pilot Off"],
  dep_anchor:   ["OHN","SBE","H.Up Anchor","Anchor Up","POB","Pilot Off","BOSV"],
  arr_berth:    ["OHN","SBE/EOSV","POB","Tug Fast","1st Line To Shore","Inposition","Tug Off","Pilot Off","FWE"],
  arr_anchor:   ["OHN","SBE/EOSV","Drop Anchorage","Finish With Eng"],
  shift_anchor: ["OHN","Comm Disch","Compl Disch","Comm Load","Compl Load","SBE","POB","Tug Fast","Single Up","Cast Off","Tug Off","Pilot Off","Drop Anchor","FWE"],
  shift_berth:  ["OHN","SBE","H.Up Anchor","Anchor Up","POB","Tug Fast","1st Line To Shore","Inposition","Tug Off","Pilot Off","FWE"],
  shelter_arr:  ["OHN","SBE/EOSV","Drop Anchorage","Finish With Eng"],
  shelter_dep:  ["OHN","SBE","H.Up Anchor","Anchor Up","BOSV"],
  noon:         [],
  downtime:     [],
  shift_bb:     ["OHN","SBE","POB","Tug Fast","Single Up","Cast Off","Tug Off","Pilot Off","POB 2","1st Line To Shore","Inposition","Finish With Eng","Pilot Off 2"],
  shift_aa:     ["OHN","SBE","H.Up Anchor","Anchor Up","POB","Drop Anchor","Pilot Off"],
  sea_trial:    ["OHN","SBE","H.Up Anchor","Anchor Up","POB","Drop Anchor","Pilot Off","Manouver Dist"],
};

// --- HELPERS ------------------------------------------------------------------
function nowStr() { 
  const now = new Date();
  // Konversi ke string ISO tapi tetap pertahankan waktu lokal
  // Dengan mengurangi offset timezone
  const offset = now.getTimezoneOffset();
  now.setMinutes(now.getMinutes() - offset);
  return now.toISOString().slice(0, 16); 
}
function diffH(a, b) { if (!a || !b) return 0; return Math.max(0, (new Date(b) - new Date(a)) / 3600000); }
function fmtH(h) { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); return `${hh}h ${String(mm).padStart(2,"0")}m`; }

// Format date for CSV (Excel-friendly format: dd/mm/yyyy hh:mm)
function fmtDateForCSV(ts) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    // yyyy-mm-dd hh:mm – Excel recognises this as a date/time
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}
function fmtDT(ts) {
  if (!ts) return "-";
  try {
    // Parse UTC timestamp and convert to local time for display
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "-";
    const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const day = String(d.getDate()).padStart(2, "0");
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    return `${parseInt(day)} ${month} ${year} ${hour}.${minute}`;
  } catch {
    return "-";
  }
}
function evKey(k) { return "ev_" + k.replace(/[^a-zA-Z0-9]/g, "_"); }
function tankKey(t) { return t.replace(/ /g, "_").toLowerCase(); }

// Detect mobile viewport for responsive layout switches
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

// Get BOSV timestamp from the "BOSV" event field in Departure/Dep.Anchor report,
// fallback to the report's own ts if BOSV event not filled
function getBOSV(dep) {
  if (!dep) return null;
  const k = evKey("BOSV");
  return dep[k] || dep.ts || null;
}

// Get EOSV timestamp (from arrival report's "SBE/EOSV" event, fallback to ts)
function getEOSV(arr) {
  if (!arr) return null;
  const k = evKey("SBE/EOSV");
  return arr[k] || arr.ts || null;
}

// Compute in-port & anchorage intervals for a voyage
// In Port  = EOSV of arr_berth  →  BOSV of next departure (same ship, next voy)
// Anchorage = Drop Anchorage event → H.Up Anchor event (within arr_anchor / dep_anchor pair)
function getInPortInterval(arr) {
  // returns { t0, t1 } — t1 filled later when we know next BOSV
  if (!arr || arr.type !== "arr_berth") return null;
  const t0 = arr[evKey("SBE/EOSV")] || arr.ts;
  return t0 ? { t0, t1: null } : null;
}

function getAnchorIntervals(voyList) {
  // Total Anchorage = Drop Anchorage/Drop Anchor (arr_anchor or shift_anchor)
  //                 -> Anchor Up (dep_anchor or shift_berth)
  const intervals = [];
  const dropReports = voyList.filter(r =>
    (r.type === "arr_anchor" && r[evKey("Drop Anchorage")]) ||
    (r.type === "shift_anchor" && r[evKey("Drop Anchor")])
  );
  dropReports.forEach(dr => {
    const t0 = dr[evKey("Drop Anchorage")] || dr[evKey("Drop Anchor")];
    // Anchor Up is in dep_anchor or shift_berth
    const auReport = voyList.find(r =>
      ["dep_anchor","shift_berth"].includes(r.type) && r[evKey("Anchor Up")]
    );
    const t1 = auReport ? auReport[evKey("Anchor Up")] : null;
    if (t0) intervals.push({ t0, t1 });
  });
  return intervals;
}

// Extract numeric value from tank field (strip units like "KL", "MT", "Ltr")
function parseTank(val) {
  if (!val) return null;
  const n = parseFloat(String(val).replace(/[^0-9.]/g,""));
  return isNaN(n) ? null : n;
}

// Get MFO & MDO from tank condition at a given phase (ohn/sbe/fwe)
function getFuel(report, phase) {
  if (!report) return { mfo: null, mdo: null };
  return {
    mfo: parseTank(report[`tk_mfo_${phase}`]),
    mdo: parseTank(report[`tk_mdo_${phase}`]),
  };
}

// Split an interval [start,end) into per-month overlap durations (in hours)
// Returns array of { year, month (0-11), hours }
function splitByMonth(start, end) {
  if (!start || !end) return [];
  const s = new Date(start), e = new Date(end);
  if (e <= s) return [];
  const segments = [];
  let cur = new Date(s);
  while (cur < e) {
    const monthEnd = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
    const segEnd = monthEnd < e ? monthEnd : e;
    const hours = (segEnd - cur) / 3600000;
    // start/end are included as ISO strings so callers needing the actual
    // segment boundary timestamps (e.g. detail tables) don't have to
    // recompute month boundaries themselves.
    segments.push({ year: cur.getFullYear(), month: cur.getMonth(), hours, start: cur.toISOString(), end: segEnd.toISOString() });
    cur = segEnd;
  }
  return segments;
}

function calcTeus(rows) {
  let box = 0, teus = 0, ton = 0;
  (rows || []).forEach(r => {
    // Full & Empty
    ["full","empty"].forEach(c => {
      const t = parseFloat(r[c+"_t"]) || 0;
      const fe = parseFloat(r[c+"_f"]) || 0;
      box  += (t + fe);
      teus += t + (fe * 2);
    });

    // Full Refer (dari refer_t/refer_f)
    const refT = parseFloat(r.refer_t) || 0;
    const refF = parseFloat(r.refer_f) || 0;
    box  += (refT + refF);
    teus += refT + (refF * 2);

    // MT Refer
    const mtT = parseFloat(r.mt_refer_t) || 0;
    const mtF = parseFloat(r.mt_refer_f) || 0;
    box  += (mtT + mtF);
    teus += mtT + (mtF * 2);

    // ISO Tank
    const isoT = parseFloat(r.iso_tank_t) || 0;
    const isoF = parseFloat(r.iso_tank_f) || 0;
    box  += (isoT + isoF);
    teus += isoT + (isoF * 2);

    // Office Container
    const offT = parseFloat(r.office_t) || 0;
    const offF = parseFloat(r.office_f) || 0;
    box  += (offT + offF);
    teus += offT + (offF * 2);

    // Flatrack
    const flT = parseFloat(r.flatrack_t) || 0;
    const flF = parseFloat(r.flatrack_f) || 0;
    box  += (flT + flF);
    teus += flT + (flF * 2);

    ton += parseFloat(r.ton) || 0;
  });
  return { 
    box: Math.round(box), 
    teus: Math.round(teus * 10) / 10,
    ton: Math.round(ton * 10) / 10
  };
}

function getActivePortDest(ship, voy, reports, currentType) {
  if (!ship || !voy) return { port: "", dest: "" };
  const startTypes = ["departure","shift_anchor","dep_anchor"];
  const candidates = (reports || [])
    .filter(r => r.ship === ship && r.voy === voy && startTypes.includes(r.type) && (r.port || r.dest || r.destination));
  if (!candidates.length) return { port: "", dest: "" };
  candidates.sort((a, b) => new Date(b.ts || 0) - new Date(a.ts || 0));
  const latest = candidates[0];
  const port = latest.port || "";
  const dest = latest.dest || latest.destination || "";
  // For arrival/shift, the port should be the departure's destination (where they arrived to)
  const arrivalShiftTypes = ["arr_berth","arr_anchor","shift_anchor","shift_berth"];
  const isArrShift = arrivalShiftTypes.includes(currentType);
  return { port: isArrShift && dest ? dest : port, dest: isArrShift && dest ? dest : dest };
}

// Get active (underway) voyage for a given ship from reports list
// Also returns pre-departure voy if only shifting/downtime exist (no departure yet)
function getActiveVoyage(ship, reports) {
  if (!ship) return null;
  // Use computeVoyages so the "Completed" determination (based on Compl Load
  // in the NEXT voyage) is consistent everywhere in the app.
  const shipVoys = computeVoyages(reports).filter(v => v.ship === ship);
  shipVoys.sort((a,b) => new Date(a.dep?.ts || a.list[0]?.ts || 0) - new Date(b.dep?.ts || b.list[0]?.ts || 0));

  // Priority 1: voyage with departure that is still Underway
  const underway = shipVoys.find(v => v.status === "Underway");
  if (underway) return underway.no;

  // Priority 2: voyage with only shifting/downtime (pre-departure loading),
  // i.e. no departure report yet but a shift_anchor/downtime report exists
  for (const v of shipVoys) {
    const hasDep = v.list.some(r => ["departure","dep_anchor"].includes(r.type));
    const hasPreDep = v.list.some(r => ["shift_anchor","downtime"].includes(r.type));
    if (!hasDep && hasPreDep) return v.no;
  }
  return null;
}

// Check if departure exists for a voyage (not just shifting/downtime)
function voyageHasDeparture(ship, voy, reports) {
  return reports.some(r =>
    r.ship === ship && r.voy === voy &&
    ["departure","dep_anchor"].includes(r.type)
  );
}

// Check if a ship has an open voyage with actual departure (blocks new departure)
function hasOpenVoyage(ship, reports) {
  const voy = getActiveVoyage(ship, reports);
  if (!voy) return false;
  return voyageHasDeparture(ship, voy, reports);
}

function initForm() {
  const f = {
    type:"departure", ship:"", voy:"", ts:nowStr(), master:"", port:"", rmk:"",
    dist_go:"", eta_dest:"", tug:"",dest:"",posisi:"",ttl_avg_spd:"",
    ttl_dist:"", steam:"", avg_spd:"", man_dist:"", man_time:"",
    lat:"", lon:"", spd:"", crs:"", drun:"", drem:"",
    wx:"Fine", wdir:"N", wbf:"3", sea:"Slight",
    t0:nowStr(), t1:nowStr(), cat:"Engine Breakdown", desc:"", action:"",
    ballast:"", gm:"", drf:"", drm:"", dra:"",
    cargoRows: [{ 
      pol:"", pod:"", 
      full_t:"", full_f:"", 
      empty_t:"", empty_f:"", 
      refer_t:"", refer_f:"", 
      mt_refer_t:"", mt_refer_f:"", 
      iso_tank_t:"", iso_tank_f:"", 
      office_t:"", office_f:"", 
      flatrack_t:"", flatrack_f:"", 
      ton:"" 
    }]
  };
  TANKS.forEach(t => {
    const k = tankKey(t);
    PHASES.forEach(p => { f[`tk_${k}_${p.k}`] = ""; });
    f[`bk_${k}`] = "";
    f[`rob_${k}`] = "";
  });
  Object.values(EVT_DEF).flat().forEach(k => { f[evKey(k)] = ""; });
  return f;
}

function computeVoyages(reports) {
  const map = {};
  reports.forEach(r => {
    // Ambil tahun dari timestamp (aman untuk format "2026-06-18 10:18:00+00")
    const year = r.ts ? new Date(r.ts).getFullYear() : new Date().getFullYear();
    const key = r.ship + "||" + r.voy + "||" + year;
    if (!map[key]) map[key] = { ship: r.ship, no: r.voy, year: year, list: [] };
    map[key].list.push(r);
  });

  const voysWithoutStatus = Object.values(map).map(v => {
    const dep = v.list.find(r => ["departure","dep_anchor"].includes(r.type));
    const arr = v.list.find(r => ["arr_berth","arr_anchor"].includes(r.type));
    // shelter counts as downtime (weather stop), not arrival/departure
    const shelterReports = v.list.filter(r => r.type==="shelter_arr"||r.type==="shelter_dep");
    const dts = v.list.filter(r => r.type === "downtime");
    const bosv = getBOSV(dep);
    const eosv = getEOSV(arr);
    const anchorIntervals = getAnchorIntervals(v.list);
    // In Port can start from either arr_berth or arr_anchor — whichever is filled
    const inPortT0 = arr ? (arr[evKey("SBE/EOSV")] || arr.ts) : null;

    // Fuel sailing cons = FAW/FWE departure - SBE/EOSV arrival
    const fuelDepFWE = getFuel(dep, "fwe");   // FAW/FWE of departure
    const fuelArrSBE = getFuel(arr, "sbe");   // SBE/EOSV of arrival
    const sailConsMFO = (fuelDepFWE.mfo != null && fuelArrSBE.mfo != null) ? Math.max(0, fuelDepFWE.mfo - fuelArrSBE.mfo) : null;
    const sailConsMDO = (fuelDepFWE.mdo != null && fuelArrSBE.mdo != null) ? Math.max(0, fuelDepFWE.mdo - fuelArrSBE.mdo) : null;

    // Fuel in-port cons = (SBE arrival + received bunker) - FAW next departure
    // received bunker is summed from tank bunker fields of ALL reports in this voyage
    const receivedMFO = v.list.reduce((s,r) => s + (parseTank(r["bk_mfo"]) || 0), 0);
    const receivedMDO = v.list.reduce((s,r) => s + (parseTank(r["bk_mdo"]) || 0), 0);

    return {
      ...v, dep, arr, dts, bosv, eosv,
      anchorIntervals,
      inPortT0,
      fuelDepFWE, fuelArrSBE,
      receivedMFO, receivedMDO,
      sailConsMFO, sailConsMDO,
      sailH: bosv && eosv ? diffH(bosv, eosv) : null,
      dtH: [
        ...dts,
        // Shelter downtime = SBE/EOSV of shelter_arr → BOSV of shelter_dep
        ...shelterReports.filter(r=>r.type==="shelter_arr").map(sa=>{
          const sd = shelterReports.find(r=>r.type==="shelter_dep");
          const t0 = sa[evKey("SBE/EOSV")] || sa.ts;   // SBE shelter anchorage
          const t1 = sd ? (sd[evKey("BOSV")] || sd.ts) : null; // BOSV shelter departure
          return { t0, t1 };
        }).filter(p=>p.t0&&p.t1)
      ].reduce((s,r)=>s+diffH(r.t0,r.t1),0),
    };
  });

  // Determine status: a voyage is "Completed" when the NEXT voyage of the
  // same ship has a Compl Load filled in its own departure/shift_anchor report
  // (Compl Load reported when starting voyage N+1 signals that voyage N has ended).
  // If there's no next voyage yet, or the next voyage hasn't filed Compl Load,
  // this voyage is still "Underway" (or "Idle" if it has no departure at all).
  const byShip = {};
  voysWithoutStatus.forEach(v => { if (!byShip[v.ship]) byShip[v.ship]=[]; byShip[v.ship].push(v); });
  Object.values(byShip).forEach(shipVoys => {
    shipVoys.sort((a,b) => new Date(a.dep?.ts || a.list[0]?.ts || 0) - new Date(b.dep?.ts || b.list[0]?.ts || 0));
  });

  return voysWithoutStatus.map(v => {
    if (!v.dep) return { ...v, status: "Idle" };
    const shipVoys = byShip[v.ship];
    const myIdx = shipVoys.findIndex(x => x.no === v.no && x.year === v.year); // berdasarkan tahun juga
    const nextV = shipVoys[myIdx + 1];
    const nextHasComplLoad = nextV ? hasCompletedFWE(nextV.list) : false;
    return { ...v, status: nextHasComplLoad ? "Completed" : "Underway" };
  });
}

// Returns true if the given report list contains a Compl Load event in
// either a departure or shift_anchor report. Used to determine whether the
// PREVIOUS voyage (of the same ship) should be marked Completed — see
// computeVoyages(), where this is checked against the NEXT voyage's list,
// not the voyage's own list.
function hasCompletedFWE(list) {
  return (list || []).some(r =>
    (r.type === "departure" || r.type === "shift_anchor") && r[evKey("Compl Load")]
  );
}

function buildWA(r) {
  const rt = RT.find(t => t.id === r.type);
  const L = [
    `*${rt?.label?.toUpperCase()} — MV ${r.ship}*`,
    (() => {
      const isArrival = ["arr_berth","arr_anchor"].includes(r.type);
      const isShift = ["shift_anchor","shift_berth"].includes(r.type);
      const isDeparture = ["departure","dep_anchor","shelter_dep","sea_trial"].includes(r.type);
      if (isArrival || isShift) {
        const displayPort = r.dest || r.port || "-";
        return `Voyage: ${r.voy || "-"} | Port: ${displayPort}`;
      }
      if (isDeparture) return `Voyage: ${r.voy || "-"} | From: ${r.port || "-"} ${r.dest ? "→ " + r.dest : ""}`;
      return `Voyage: ${r.voy || "-"} | Port: ${r.port || "-"} ${r.dest ? "→ " + r.dest : ""}`;
    })(),
    `Date/Time: ${fmtDT(r.ts)}`,
    `Master: ${r.master || "-"}`,
    `---`,
  ];
  const evts = (EVT_DEF[r.type] || []).filter(k => r[evKey(k)]);
  if (evts.length) { L.push("*Event Times:*"); evts.forEach(k => L.push(`  ${k}: ${fmtDT(r[evKey(k)])}`)); }
  if (r.dist_go)   L.push(`Dist To Go: ${r.dist_go} NM`);
  if (r.eta_dest)  L.push(`ETA: ${fmtDT(r.eta_dest)}`);
  if (r.tug)       L.push(`Tug Used: ${r.tug}`);
  if (r.lat) {
    let posText = `Position: ${r.lat} / ${r.lon}`;
    if (r.type === "noon" && r.posisi) {
      posText += ` (${r.posisi})`;
    }
    L.push(posText);
    }
  if (r.ttl_dist) {
    // Khusus Noon Report: hanya tampilkan Total Dist
    if (r.type === "noon") {
      L.push(`Total Dist: ${r.ttl_dist} NM`,);
    } else {
      // Laporan lain: tampilkan Total Dist, Steaming, dan Avg Speed jika ada
      let distLine = `Total Dist: ${r.ttl_dist} NM`;
      if (r.steam) distLine += ` | Steaming: ${r.steam}`;
      if (r.avg_spd) distLine += ` | Avg: ${r.avg_spd} kts`;
      L.push(distLine);
    }
  }
  if (r.drun)      L.push(`Dist Run (24H): ${r.drun} NM | Remaining: ${r.drem} NM`);
  if (r.spd || r.total_avg_spd) {
    let speedLine = "";
    if (r.spd) speedLine += `Avg Speed: ${r.spd} kts`;
    if (r.ttl_avg_spd && r.type === "noon") {
      speedLine += speedLine ? ` | Total Avg Speed: ${r.ttl_avg_spd} kts` : `Total Avg Speed: ${r.ttl_avg_spd} kts`;
    }
    if (r.crs) speedLine += ` | Course: ${r.crs}°`;
    L.push(speedLine);
  }
  
  if (r.wx && ["noon","shelter_arr","shelter_dep"].includes(r.type)) L.push(`Weather: ${r.wx} | Wind: ${r.wdir} Bf${r.wbf} | Sea: ${r.sea}`);
  if (r.type === "downtime") {
    L.push(`Downtime: ${fmtDT(r.t0)} → ${fmtDT(r.t1)} (${fmtH(diffH(r.t0, r.t1))})`);
    L.push(`Category: ${r.cat}`);
    if (r.desc)   L.push(`Desc: ${r.desc}`);
    if (r.action) L.push(`Action: ${r.action}`);
  }
  const totals = calcTeus(r.cargoRows || []);
if (totals.box > 0) {
  L.push("---", "*Cargo Figure:*");
  (r.cargoRows || []).forEach((row, idx) => {
    // Hitung total box untuk row ini (semua kategori)
    const rowBox = 
      (parseFloat(row.full_t)||0) + (parseFloat(row.full_f)||0) +
      (parseFloat(row.empty_t)||0) + (parseFloat(row.empty_f)||0) +
      (parseFloat(row.refer_t)||0) + (parseFloat(row.refer_f)||0) +
      (parseFloat(row.mt_refer_t)||0) + (parseFloat(row.mt_refer_f)||0) +
      (parseFloat(row.iso_tank_t)||0) + (parseFloat(row.iso_tank_f)||0) +
      (parseFloat(row.office_t)||0) + (parseFloat(row.office_f)||0) +
      (parseFloat(row.flatrack_t)||0) + (parseFloat(row.flatrack_f)||0);
  
    if (!rowBox) return; // Lewati jika tidak ada kargo
  
    L.push(`  POL: ${row.pol||"-"} → POD: ${row.pod||"-"}`);
  
    // 1. FULL
    const fullT = parseFloat(row.full_t) || 0;
    const fullF = parseFloat(row.full_f) || 0;
    if (fullT || fullF) {
      L.push(`    Full: ${fullT} TEUS / ${fullF} FEUS = ${Math.round((fullT+fullF*2)*10)/10} TEUS`);
    }
  
    // 2. EMPTY
    const emptyT = parseFloat(row.empty_t) || 0;
    const emptyF = parseFloat(row.empty_f) || 0;
    if (emptyT || emptyF) {
      L.push(`    Empty: ${emptyT} TEUS / ${emptyF} FEUS = ${Math.round((emptyT+emptyF*2)*10)/10} TEUS`);
    }
  
    // 3. FULL REFER
    const refT = parseFloat(row.refer_t) || 0;
    const refF = parseFloat(row.refer_f) || 0;
    if (refT || refF) {
      L.push(`    Full Refer: ${refT} TEUS / ${refF} FEUS = ${Math.round((refT+refF*2)*10)/10} TEUS`);
    }
  
    // 4. MT REFER
    const mtT = parseFloat(row.mt_refer_t) || 0;
    const mtF = parseFloat(row.mt_refer_f) || 0;
    if (mtT || mtF) {
      L.push(`    MT Refer: ${mtT} TEUS / ${mtF} FEUS = ${Math.round((mtT+mtF*2)*10)/10} TEUS`);
    }
  
    // 5. ISO TANK
    const isoT = parseFloat(row.iso_tank_t) || 0;
    const isoF = parseFloat(row.iso_tank_f) || 0;
    if (isoT || isoF) {
      L.push(`    ISO Tank: ${isoT} TEUS / ${isoF} FEUS = ${Math.round((isoT+isoF*2)*10)/10} TEUS`);
    }
  
    // 6. OFFICE CONTAINER
    const offT = parseFloat(row.office_t) || 0;
    const offF = parseFloat(row.office_f) || 0;
    if (offT || offF) {
      L.push(`    Office: ${offT} TEUS / ${offF} FEUS = ${Math.round((offT+offF*2)*10)/10} TEUS`);
    }
  
    // 7. FLATRACK
    const flT = parseFloat(row.flatrack_t) || 0;
    const flF = parseFloat(row.flatrack_f) || 0;
    if (flT || flF) {
      L.push(`    Flatrack: ${flT} TEUS / ${flF} FEUS = ${Math.round((flT+flF*2)*10)/10} TEUS`);
    }
  
    // Tonase
    if (row.ton) L.push(`    Tonase: ${parseFloat(row.ton).toFixed()} Ton`);
  });
  
  // ✅ GRAND TOTAL - pakai totals
  L.push(`  Grand Total: ${totals.box} Box | ${totals.teus.toFixed()} TEUS | ${totals.ton.toFixed()} Ton`);
  if (r.ballast) L.push(`Ballast: ${r.ballast} Ton | GM: ${r.gm||"-"} M`);
  if (r.drf)     L.push(`Draft: F ${r.drf}m / M ${r.drm||"-"}m / A ${r.dra||"-"}m`);
  }
  // Tank Condition
if (r.type === "noon") {
  // Noon Report: hanya ROB
  const hasROB = TANKS.some(t => r[`rob_${tankKey(t)}`]);
  if (hasROB) {
    L.push("---", "*Tank Condition (ROB):*");
    TANKS.forEach(t => {
      const k = tankKey(t);
      if (r[`rob_${k}`]) L.push(`  ${t}: ${r[`rob_${k}`]}`);
    });
  }
} else if (r.type === "downtime") {
  // Downtime Report: ROB + FAW only
  const hasROB = TANKS.some(t => r[`rob_${tankKey(t)}`]);
  const hasFAW = TANKS.some(t => r[`tk_${tankKey(t)}_fwe`]);

  if (hasROB) {
    L.push("---", "*Tank Condition (ROB):*");
    TANKS.forEach(t => {
      const k = tankKey(t);
      if (r[`rob_${k}`]) L.push(`  ${t}: ${r[`rob_${k}`]}`);
    });
  }

  if (hasFAW) {
    L.push("---", "*Tank Condition (FAW | Recv):*");
    TANKS.forEach(t => {
      const k = tankKey(t);
      const faw = r[`tk_${k}_fwe`] || "-";
      const recv = r[`bk_${k}`] || "-";
      if (faw !== "-" || recv !== "-") {
        L.push(`  ${t}: ${faw} | Recv: ${recv}`);
      }
    });
  }
  } else {
    // Tentukan label fase ketiga berdasarkan tipe laporan
    const phaseLabel3 = (r.type === "departure" || r.type === "dep_anchor" || r.type === "shelter_dep") ? "FAW" : "FWE";
    L.push(`---`, `*Tank Condition (OHN / SBE / ${phaseLabel3} | Recv):*`);
    TANKS.forEach(t => {
      const k = tankKey(t);
      const vals = PHASES.map(p => r[`tk_${k}_${p.k}`] || "-").join(" / ");
      L.push(`  ${t}: ${vals} | Recv: ${r[`bk_${k}`] || "-"}`);
    });
  }
  // Shelter specific
  if (r.type==="shelter_arr") {
    L.push("---", "*SHELTER ANCHORAGE — Weather Stop*");
    if (r.lat) L.push(`Position: ${r.lat} / ${r.lon}`);
    if (r.wx)  L.push(`Weather: ${r.wx} | Wind: ${r.wdir} Bf${r.wbf} | Sea: ${r.sea}`);
    L.push("Kapal berlabuh jangkar menunggu cuaca baik");
  }
  if (r.type==="shelter_dep") {
    L.push("---", "*SHELTER DEPARTURE — Lanjut Berlayar*");
    if (r.lat) L.push(`Position: ${r.lat} / ${r.lon}`);
    if (r.dist_go)  L.push(`Dist To Go: ${r.dist_go} NM`);
    if (r.eta_dest) L.push(`ETA: ${r.eta_dest}`);
    if (r.wx)  L.push(`Weather: ${r.wx} | Wind: ${r.wdir} Bf${r.wbf} | Sea: ${r.sea}`);
    L.push("Kapal telah lepas jangkar dan melanjutkan voyage");
  }
  if (r.rmk) L.push("---", `Remarks: ${r.rmk}`);
  L.push("---", "_Sent via Voyage Portal — PT Mentari Mas Multimoda_");
  return L.join("\n");
}

// --- STYLES -------------------------------------------------------------------
// Colors reference CSS custom properties so toggling [data-theme] on <html>
// instantly repaints every component without needing a React re-render —
// this avoids having to refactor the hundreds of `ss.xxx` / `C.xxx` usages
// throughout the file, since the STRING "var(--bg)" never changes; only what
// it resolves to (via CSS) changes when the theme attribute flips.
const C = {
  bg:"var(--c-bg)", bg2:"var(--c-bg2)", bg3:"var(--c-bg3)",
  accent:"var(--c-accent)", accentDim:"var(--c-accentDim)", horizon:"var(--c-horizon)", sea:"var(--c-sea)",
  text:"var(--c-text)", muted:"var(--c-muted)", dim:"var(--c-dim)",
  green:"var(--c-green)", red:"var(--c-red)", amber:"var(--c-amber)", orange:"var(--c-orange)",
  border:"var(--c-border)",
  surface:"var(--c-surface)", onAccent:"var(--c-onAccent)",
  panel:"var(--c-panel)", panel2:"var(--c-panel2)", panel3:"var(--c-panel3)",
};
const ss = {
  app:    { minHeight:"100vh", background:`linear-gradient(160deg,${C.bg},${C.bg2})`, fontFamily:"'Inter','DM Sans','Segoe UI',sans-serif", color:C.text, fontSize:13 },
  hdr:    { height:54, background:C.panel, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", position:"sticky", top:0, zIndex:100 },
  layout: { display:"flex", minHeight:"calc(100vh - 54px)" },
  nav:    { width:200, background:C.panel2, borderRight:`1px solid ${C.border}`, padding:"12px 6px", flexShrink:0 },
  main:   { flex:1, padding:"16px 14px", overflowX:"auto" },
  bottomNav: { position:"fixed", bottom:0, left:0, right:0, height:64, background:C.panel3, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-around", alignItems:"center", zIndex:200, backdropFilter:"blur(10px)" },
  bottomNavItem: (a) => ({ display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"transparent", border:"none", color:a?C.accent:C.muted, fontWeight:a?700:400, cursor:"pointer", padding:"6px 10px", flex:1 }),
  card:   (b) => ({ background:C.bg3, border:`1px solid ${b||C.border}`, borderRadius:12, padding:"16px 18px", marginBottom:12 }),
  inp:    { width:"100%", padding:"7px 10px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:12, outline:"none", boxSizing:"border-box" },
  sel:    { width:"100%", padding:"7px 10px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:12, outline:"none", cursor:"pointer", boxSizing:"border-box" },
  lbl:    { display:"block", fontSize:10, fontWeight:600, color:C.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.05em" },
  fg:     { marginBottom:12 },
  row2:   { display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 },
  row3:   { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:11 },
  btn:    { padding:"8px 16px", background:`linear-gradient(135deg,${C.horizon},${C.sea})`, border:"none", borderRadius:8, color:C.onAccent, fontWeight:600, fontSize:12, cursor:"pointer" },
  btnG:   { padding:"8px 13px", background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, fontSize:12, cursor:"pointer" },
  btnSm:  (a) => ({ padding:"4px 10px", background:a?C.accentDim:"transparent", border:`1px solid ${a?C.accent:C.border}`, borderRadius:6, color:a?C.accent:C.muted, fontSize:11, cursor:"pointer", fontWeight:a?600:400, margin:"2px" }),
  tag:    (c) => ({ display:"inline-block", padding:"2px 9px", borderRadius:20, fontSize:10, fontWeight:600, background:c+"22", color:c, border:`1px solid ${c}44` }),
  wa: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:13, fontFamily:"monospace", fontSize:12, color:C.text, lineHeight:1.7, whiteSpace:"pre-wrap", wordBreak:"break-word", maxHeight:280, overflowY:"auto" },
  tbl:    { width:"100%", borderCollapse:"collapse", fontSize:11 },
  th:     { background:"rgba(56,189,248,0.08)", padding:"9px 11px", textAlign:"left", fontWeight:600, color:C.accent, fontSize:10, textTransform:"uppercase", letterSpacing:"0.07em", border:`1px solid ${C.border}` },
  td:     (a) => ({ padding:"9px 11px", border:`1px solid rgba(0,0,0,0.1)`, background:a?"rgba(255,255,255,0.015)":"transparent" }),
  secHd:  { fontSize:12, fontWeight:700, color:C.accent, margin:"14px 0 9px", paddingBottom:7, borderBottom:`1px solid ${C.border}` },
  navItem:(a) => ({ display:"flex", alignItems:"center", gap:9, padding:"8px 11px", margin:"2px 0", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:a?600:400, color:a?C.accent:C.muted, background:a?C.accentDim:"transparent", border:"none", width:"100%", textAlign:"left" }),
  login:  { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:`radial-gradient(ellipse at 30% 40%,rgba(14,165,233,0.1),transparent 60%),linear-gradient(160deg,${C.bg},#0d1e38)` },
  tankGrid:{ display:"grid", gridTemplateColumns:"110px 1fr 1fr 1fr 1fr", gap:6, alignItems:"center", marginBottom:6 },
  cargoGrid:{ display:"grid", gridTemplateColumns:"72px 1fr 1fr 80px", gap:8, alignItems:"center", marginBottom:7 },
  teusBox: { background:C.accentDim, border:`1px solid ${C.accent}40`, borderRadius:9, padding:"10px 14px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", marginBottom:12 },
  divider: { border:"none", borderTop:`1px solid ${C.border}`, margin:"14px 0" },
};

// --- FIELD (uncontrolled — no re-render on keystroke) -------------------------
// KEY FIX: use defaultValue + onChange to store in ref object, never re-render parent
function Field({ label, fkey, fref, type = "text", opts, placeholder, style }) {
  return (
    <div style={ss.fg}>
      {label && <label style={ss.lbl}>{label}</label>}
      {opts
        ? <select style={{ ...ss.sel, ...style }}
            defaultValue={fref.current[fkey]}
            onChange={e => { fref.current[fkey] = e.target.value; }}>
            {opts.map(o => <option key={o}>{o}</option>)}
          </select>
        : <input style={{ ...ss.inp, ...style }}
            type={type}
            defaultValue={fref.current[fkey]}
            placeholder={placeholder}
            onChange={e => { fref.current[fkey] = e.target.value; }}
          />
      }
    </div>
  );
}

// --- LOGIN --------------------------------------------------------------------
function GlobalStyles() {
  return (
    <style>{`
        :root {
          --c-bg:#0b1120; --c-bg2:#111d35; --c-bg3:rgba(255,255,255,0.03);
          --c-accent:#38bdf8; --c-accentDim:rgba(56,189,248,0.12); --c-horizon:#0ea5e9; --c-sea:#0369a1;
          --c-text:#e2eaf5; --c-muted:#64748b; --c-dim:#1e3a5f;
          --c-green:#22d3ee; --c-red:#f87171; --c-amber:#fbbf24; --c-orange:#fb923c;
          --c-border:rgba(56,189,248,0.15);
          --c-surface:rgba(11,17,32,0.9); --c-onAccent:#ffffff;
          --c-panel:rgba(11,17,32,0.95); --c-panel2:rgba(11,17,32,0.7); --c-panel3:rgba(11,17,32,0.97);
        }
        :root[data-theme="dark"] {
          --c-bg:#0b1120; --c-bg2:#111d35; --c-bg3:rgba(255,255,255,0.03);
          --c-accent:#38bdf8; --c-accentDim:rgba(56,189,248,0.12); --c-horizon:#0ea5e9; --c-sea:#0369a1;
          --c-text:#e2eaf5; --c-muted:#64748b; --c-dim:#1e3a5f;
          --c-green:#22d3ee; --c-red:#f87171; --c-amber:#fbbf24; --c-orange:#fb923c;
          --c-border:rgba(56,189,248,0.15);
          --c-surface:rgba(11,17,32,0.9); --c-onAccent:#ffffff;
          --c-panel:rgba(11,17,32,0.95); --c-panel2:rgba(11,17,32,0.7); --c-panel3:rgba(11,17,32,0.97);
        }
        :root[data-theme="light"] {
          --c-bg:#f4f7fb; --c-bg2:#e7eef7; --c-bg3:rgba(15,23,42,0.045);
          --c-accent:#0284c7; --c-accentDim:rgba(2,132,199,0.10); --c-horizon:#0369a1; --c-sea:#0c4a6e;
          --c-text:#0f172a; --c-muted:#475569; --c-dim:#cbd5e1;
          --c-green:#0891b2; --c-red:#dc2626; --c-amber:#b45309; --c-orange:#c2410c;
          --c-border:rgba(2,132,199,0.22);
          --c-surface:#ffffff; --c-onAccent:#ffffff;
          --c-panel:rgba(255,255,255,0.95); --c-panel2:rgba(255,255,255,0.85); --c-panel3:rgba(255,255,255,0.97);
        }
        @media (max-width: 767px) {
          /* Override inline styles with high specificity */
          [style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          [style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
          [style*="grid-template-columns: repeat(auto-fill,minmax(250px,1fr))"] { grid-template-columns: 1fr !important; }
          [style*="grid-template-columns: repeat(auto-fill,minmax(175px,1fr))"] { grid-template-columns: repeat(auto-fill,minmax(140px,1fr)) !important; }
          [style*="grid-template-columns: repeat(3,1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
          [style*="grid-template-columns: repeat(4,1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
          [style*="grid-template-columns: repeat(2,1fr)"] { grid-template-columns: 1fr !important; }
          /* Form inputs */
          input, select, textarea { font-size: 16px !important; padding: 10px 12px !important; }
          /* Table responsive */
          table { font-size: 11px !important; }
          th, td { padding: 6px 8px !important; }
          /* Bottom nav safe area */
          [style*="paddingBottom"] { padding-bottom: 80px !important; }
        }
        @media (max-width: 480px) {
          /* Extra small screens */
          [style*="grid-template-columns: 110px"] { grid-template-columns: 80px 1fr !important; }
          [style*="grid-template-columns: 72px"] { grid-template-columns: 60px 1fr !important; }
          [style*="grid-template-columns: 140px"] { grid-template-columns: 100px 1fr !important; }
          .voyage-stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
  );
}

function Login({ onLogin }) {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const eRef = useRef(null), pRef = useRef(null);

  const go = async () => {
    const email = eRef.current?.value;
    const password = pRef.current?.value;
    if (!email || !password) { setErr("Masukkan email dan password."); return; }
    setLoading(true);
    setErr("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErr(error.message === "Invalid login credentials" ? "Email atau password salah." : error.message);
      } else if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        const isShipAccount = profile?.role === 'kapal';
        onLogin({
          id: data.user.id, email: data.user.email,
          name: profile?.full_name || email.split('@')[0],
          role: profile?.role || 'master',
          ship: isShipAccount ? (profile?.full_name || null) : null,
        });
      }
    } catch (err) { setErr("Terjadi kesalahan."); }
    finally { setLoading(false); }
  };

  return (
    <div style={ss.login}>
      <div style={{ ...ss.card(), width:320, margin:0, boxShadow:"0 24px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ textAlign:"center", marginBottom:22 }}>
                    <img src="/mmm-logo.png" alt="MMM" style={{ width:120, height:60, marginBottom:6 }} onError={(e)=>{e.target.style.display='none'}}/>
          <div style={{ fontSize:17, fontWeight:700, color:C.accent }}>Voyage Report Portal</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>PT Mentari Mas Multimoda</div>
        </div>
        <div style={ss.fg}><label style={ss.lbl}>Email</label>
          <input ref={eRef} style={ss.inp} type="email" name="email" autoComplete="email" defaultValue="" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
        <div style={ss.fg}><label style={ss.lbl}>Password</label>
          <input ref={pRef} style={ss.inp} type="password" name="current-password" autoComplete="current-password" defaultValue="" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
        {err && <div style={{ color:C.red, fontSize:11, marginBottom:8 }}>{err}</div>}
        <button style={{ ...ss.btn, width:"100%", opacity: loading ? 0.7 : 1 }} onClick={go} disabled={loading}>
          {loading ? "Loading..." : "Masuk"}
        </button>
      </div>
    </div>
  );
}

// --- TANK SECTION -------------------------------------------------------------
function TankSection({ fref, type }) {
  const isMobile = useIsMobile();
  const phaseLabel3 = (type === "departure" || type === "dep_anchor" || type === "shelter_dep") ? "FAW" : "FWE";
  const displayPhases = PHASES.map(p => p.k === "fwe" ? { ...p, l: phaseLabel3 } : p);

  // Gaya header dan baris tank menyesuaikan mobile
  const headerStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '70px 1fr 1fr 1fr 60px' : '110px 1fr 1fr 1fr 1fr',
    gap: 6,
    marginBottom: 5,
    alignItems: 'center'
  };

  const rowStyle = (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '70px 1fr 1fr 1fr 60px' : '110px 1fr 1fr 1fr 1fr',
    gap: 6,
    marginBottom: isMobile ? 10 : 6,
    alignItems: 'center',
    background: isMobile ? 'rgba(255,255,255,0.02)' : 'transparent',
    padding: isMobile ? '6px 4px' : 0,
    borderRadius: isMobile ? 6 : 0
  });

  const inputStyle = (isReceived = false) => ({
    padding: '5px 7px',
    background: isReceived ? 'rgba(251,191,36,0.06)' : 'rgba(255,255,255,0.05)',
    border: `1px solid ${isReceived ? 'rgba(251,191,36,0.35)' : C.border}`,
    borderRadius: 6,
    color: C.text,
    fontSize: 11,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  });

  return (
    <div>
      <div style={{...ss.secHd, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}><span>💧 Tank Condition & Received Bunker</span><span>(Dalam Liter)</span>
</div>

      {/* Header */}
      <div style={headerStyle}>
        <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", fontWeight:600 }}>Jenis</div>
        {displayPhases.map(p => (
          <div key={p.k} style={{ fontSize:9, color:C.muted, textTransform:"uppercase", textAlign:"center" }}>
            {p.l}
          </div>
        ))}
        <div style={{ fontSize:9, color:C.amber, textTransform:"uppercase", textAlign:"center" }}>Recv</div>
      </div>

      {/* Data tank */}
      {TANKS.map(t => {
        const k = tankKey(t);
        return (
          <div key={t} style={rowStyle(isMobile)}>
            <div style={{ fontSize:11, fontWeight:500 }}>{t}</div>
            {PHASES.map(p => (
              <input
                key={p.k}
                style={inputStyle(false)}
                defaultValue={fref.current[`tk_${k}_${p.k}`]}
                placeholder="-"
                onChange={e => { fref.current[`tk_${k}_${p.k}`] = e.target.value; }}
              />
            ))}
            <input
              style={inputStyle(true)}
              defaultValue={fref.current[`bk_${k}`]}
              placeholder="-"
              onChange={e => { fref.current[`bk_${k}`] = e.target.value; }}
            />
          </div>
        );
      })}
    </div>
  );
}

function TankSectionROB({ fref }) {
  const isMobile = useIsMobile();

  const headerStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '70px 1fr' : '140px 1fr',
    gap: 8,
    marginBottom: 5
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '70px 1fr' : '140px 1fr',
    gap: 8,
    alignItems: 'center',
    marginBottom: isMobile ? 10 : 6,
    background: isMobile ? 'rgba(255,255,255,0.02)' : 'transparent',
    padding: isMobile ? '6px 4px' : 0,
    borderRadius: isMobile ? 6 : 0
  };

  return (
    <div>
      <div style={{...ss.secHd, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}><span>💧 Tank Condition (ROB))</span><span>(Dalam Liter)</span>
    </div>
      <div style={headerStyle}>
        <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", fontWeight:600 }}>Jenis</div>
        <div style={{ fontSize:9, color:C.amber, textTransform:"uppercase" }}>ROB</div>
      </div>
      {TANKS.map(t => {
        const k = tankKey(t);
        return (
          <div key={t} style={rowStyle}>
            <div style={{ fontSize:11, fontWeight:500 }}>{t}</div>
            <input
              style={{
                padding:"5px 7px",
                background:"rgba(251,191,36,0.06)",
                border:`1px solid rgba(251,191,36,0.35)`,
                borderRadius:6,
                color:C.text,
                fontSize:11,
                outline:"none",
                width:"100%",
                boxSizing:"border-box"
              }}
              defaultValue={fref.current[`rob_${k}`]}
              placeholder="-"
              onChange={e => { fref.current[`rob_${k}`] = e.target.value; }}
            />
          </div>
        );
      })}
    </div>
  );
}
function TankSectionFAWOnly({ fref }) {
  const isMobile = useIsMobile();

  const headerStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '70px 1fr 1fr' : '140px 1fr 1fr',
    gap: 6,
    marginBottom: 5,
    alignItems: 'center'
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '70px 1fr 1fr' : '140px 1fr 1fr',
    gap: 6,
    marginBottom: isMobile ? 10 : 6,
    alignItems: 'center',
    background: isMobile ? 'rgba(255,255,255,0.02)' : 'transparent',
    padding: isMobile ? '6px 4px' : 0,
    borderRadius: isMobile ? 6 : 0
  };

  return (
    <div>
      <div style={{...ss.secHd, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}><span>💧 Tank Condition (FAW)</span><span>(Dalam Liter)</span>
    </div>

      {/* Header */}
      <div style={headerStyle}>
        <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", fontWeight:600 }}>Jenis</div>
        <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", textAlign:"center" }}>FAW</div>
        <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", textAlign:"center" }}>RECEIVED</div>
      </div>

      {/* Data tank */}
      {TANKS.map(t => {
        const k = tankKey(t);
        return (
          <div key={t} style={rowStyle}>
            <div style={{ fontSize:11, fontWeight:500 }}>{t}</div>
            <input
              style={{
                padding:"5px 7px",
                background:"rgba(255,255,255,0.05)",
                border:`1px solid ${C.border}`,
                borderRadius:6,
                color:C.text,
                fontSize:11,
                outline:"none",
                width:"100%",
                boxSizing:"border-box"
              }}
              defaultValue={fref.current[`tk_${k}_fwe`]}
              placeholder="-"
              onChange={e => { fref.current[`tk_${k}_fwe`] = e.target.value; }}
            />
            <input
              style={{
                padding:"5px 7px",
                background:"rgba(251,191,36,0.06)",
                border:`1px solid rgba(251,191,36,0.35)`,
                borderRadius:6,
                color:C.text,
                fontSize:11,
                outline:"none",
                width:"100%",
                boxSizing:"border-box"
              }}
              defaultValue={fref.current[`bk_${k}`]}
              placeholder="-"
              onChange={e => { fref.current[`bk_${k}`] = e.target.value; }}
            />
          </div>
        );
      })}
    </div>
  );
}

// --- CARGO SECTION ------------------------------------------------------------
function CargoSection({ fref }) {
  const [rows, setRows] = useState(() =>
    fref.current.cargoRows?.length
      ? fref.current.cargoRows
      : [{ pol:"", pod:"", full_t:"", full_f:"", empty_t:"", empty_f:"", refer_t:"", refer_f:"", mt_refer_t:"", mt_refer_f:"", iso_tank_t:"", iso_tank_f:"", office_t:"", office_f:"", flatrack_t:"", flatrack_f:"", ton:"" }]
  );

  const syncToRef = (updated) => {
    fref.current.cargoRows = updated;
    setRows(updated);
  };

  const addRow = () => {
    const updated = [...fref.current.cargoRows, { pol:"", pod:"", full_t:"", full_f:"", empty_t:"", empty_f:"", refer_t:"", refer_f:"", mt_refer_t:"", mt_refer_f:"", iso_tank_t:"", iso_tank_f:"", office_t:"", office_f:"", flatrack_t:"", flatrack_f:"", ton:"" }];
    syncToRef(updated);
  };

  const removeRow = idx => syncToRef(fref.current.cargoRows.filter((_,i) => i !== idx));
  const updateRow = (idx, key, val) => {
    const updated = fref.current.cargoRows.map((r,i) => i===idx ? {...r, [key]:val} : r);
    fref.current.cargoRows = updated;
    setRows(updated);
  };

  const { box, teus, ton } = calcTeus(rows);

  const colHd = (txt, color) => (
    <div style={{ fontSize:9, color:color||C.muted, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600, textAlign:"center" }}>{txt}</div>
  );

  return (
    <div>
      <div style={ss.secHd}>📦 Cargo Figure</div>

      {rows.map((row, idx) => (
        <div key={idx} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
          {/* Header row */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.accent }}>Port {idx+1}</div>
            {rows.length > 1 && (
              <button style={{ ...ss.btnG, padding:"2px 9px", fontSize:11, color:C.red, borderColor:C.red+"50" }} onClick={() => removeRow(idx)}>✕ Hapus</button>
            )}
          </div>

          {/* POL / POD */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div style={ss.fg}>
              <label style={ss.lbl}>POL (Port of Loading)</label>
              <input style={ss.inp} placeholder="Surabaya" value={row.pol}
                onChange={e => updateRow(idx,"pol",e.target.value)}/>
            </div>
            <div style={ss.fg}>
              <label style={ss.lbl}>POD (Port of Discharge)</label>
              <input style={ss.inp} placeholder="Lembar" value={row.pod}
                onChange={e => updateRow(idx,"pod",e.target.value)}/>
            </div>
          </div>

          {/* Cargo grid header */}
          <div style={{ display:"grid", gridTemplateColumns:"70px 1fr 1fr 80px", gap:8, marginBottom:5 }}>
            {colHd("Kategori")}
            {colHd("TEUS (20ft)")}
            {colHd("FEUS (40ft)")}
            {colHd("TEUS Equiv", C.accent)}
          </div>

          {/* FULL */}
          <div style={{ display:"grid", gridTemplateColumns:"70px 1fr 1fr 80px", gap:8, marginBottom:7, alignItems:"center" }}>
            <div style={{ fontSize:11, fontWeight:500 }}>Full</div>
            <input style={ss.inp} type="text" placeholder="0" value={row.full_t}
              onChange={e => updateRow(idx, "full_t", e.target.value)}/>
            <input style={ss.inp} type="text" placeholder="0" value={row.full_f}
              onChange={e => updateRow(idx, "full_f", e.target.value)}/>
            <div style={{ fontSize:12, fontWeight:600, color:C.accent, textAlign:"center" }}>
              {(() => {
                const t = parseFloat(row.full_t) || 0;
                const fe = parseFloat(row.full_f) || 0;
                const teq = t + (fe * 2);
                return teq > 0 ? Math.round(teq*10)/10 : "—";
              })()}
            </div>
          </div>

          {/* EMPTY */}
          <div style={{ display:"grid", gridTemplateColumns:"70px 1fr 1fr 80px", gap:8, marginBottom:7, alignItems:"center" }}>
            <div style={{ fontSize:11, fontWeight:500 }}>Empty</div>
            <input style={ss.inp} type="text" placeholder="0" value={row.empty_t}
              onChange={e => updateRow(idx, "empty_t", e.target.value)}/>
            <input style={ss.inp} type="text" placeholder="0" value={row.empty_f}
              onChange={e => updateRow(idx, "empty_f", e.target.value)}/>
            <div style={{ fontSize:12, fontWeight:600, color:C.accent, textAlign:"center" }}>
              {(() => {
                const t = parseFloat(row.empty_t) || 0;
                const fe = parseFloat(row.empty_f) || 0;
                const teq = t + (fe * 2);
                return teq > 0 ? Math.round(teq*10)/10 : "—";
              })()}
            </div>
          </div>

          {/* FULL REFER */}
          <div style={{ display:"grid", gridTemplateColumns:"70px 1fr 1fr 80px", gap:8, marginBottom:7, alignItems:"center" }}>
            <div style={{ fontSize:11, fontWeight:500 }}>Full Refer</div>
            <input style={ss.inp} type="text" placeholder="0" value={row.refer_t}
              onChange={e => updateRow(idx, "refer_t", e.target.value)}/>
            <input style={ss.inp} type="text" placeholder="0" value={row.refer_f}
              onChange={e => updateRow(idx, "refer_f", e.target.value)}/>
            <div style={{ fontSize:12, fontWeight:600, color:C.accent, textAlign:"center" }}>
              {(() => {
                const t = parseFloat(row.refer_t) || 0;
                const fe = parseFloat(row.refer_f) || 0;
                const teq = t + (fe * 2);
                return teq > 0 ? Math.round(teq*10)/10 : "—";
              })()}
            </div>
          </div>

          {/* MT REFER */}
          <div style={{ display:"grid", gridTemplateColumns:"70px 1fr 1fr 80px", gap:8, marginBottom:7, alignItems:"center" }}>
            <div style={{ fontSize:11, fontWeight:500 }}>MT Refer</div>
            <input style={ss.inp} type="text" placeholder="0" value={row.mt_refer_t}
              onChange={e => updateRow(idx, "mt_refer_t", e.target.value)}/>
            <input style={ss.inp} type="text" placeholder="0" value={row.mt_refer_f}
              onChange={e => updateRow(idx, "mt_refer_f", e.target.value)}/>
            <div style={{ fontSize:12, fontWeight:600, color:C.accent, textAlign:"center" }}>
              {(() => {
                const t = parseFloat(row.mt_refer_t) || 0;
                const fe = parseFloat(row.mt_refer_f) || 0;
                const teq = t + (fe * 2);
                return teq > 0 ? Math.round(teq*10)/10 : "—";
              })()}
            </div>
          </div>

          {/* ISO TANK */}
          <div style={{ display:"grid", gridTemplateColumns:"70px 1fr 1fr 80px", gap:8, marginBottom:7, alignItems:"center" }}>
            <div style={{ fontSize:11, fontWeight:500 }}>ISO Tank</div>
            <input style={ss.inp} type="text" placeholder="0" value={row.iso_tank_t}
              onChange={e => updateRow(idx, "iso_tank_t", e.target.value)}/>
            <input style={ss.inp} type="text" placeholder="0" value={row.iso_tank_f}
              onChange={e => updateRow(idx, "iso_tank_f", e.target.value)}/>
            <div style={{ fontSize:12, fontWeight:600, color:C.accent, textAlign:"center" }}>
              {(() => {
                const t = parseFloat(row.iso_tank_t) || 0;
                const fe = parseFloat(row.iso_tank_f) || 0;
                const teq = t + (fe * 2);
                return teq > 0 ? Math.round(teq*10)/10 : "—";
              })()}
            </div>
          </div>

          {/* OFFICE CONTAINER */}
          <div style={{ display:"grid", gridTemplateColumns:"70px 1fr 1fr 80px", gap:8, marginBottom:7, alignItems:"center" }}>
            <div style={{ fontSize:11, fontWeight:500 }}>Office Cont</div>
            <input style={ss.inp} type="text" placeholder="0" value={row.office_t}
              onChange={e => updateRow(idx, "office_t", e.target.value)}/>
            <input style={ss.inp} type="text" placeholder="0" value={row.office_f}
              onChange={e => updateRow(idx, "office_f", e.target.value)}/>
            <div style={{ fontSize:12, fontWeight:600, color:C.accent, textAlign:"center" }}>
              {(() => {
                const t = parseFloat(row.office_t) || 0;
                const fe = parseFloat(row.office_f) || 0;
                const teq = t + (fe * 2);
                return teq > 0 ? Math.round(teq*10)/10 : "—";
              })()}
            </div>
          </div>

          {/* FLATRACK */}
          <div style={{ display:"grid", gridTemplateColumns:"70px 1fr 1fr 80px", gap:8, marginBottom:7, alignItems:"center" }}>
            <div style={{ fontSize:11, fontWeight:500 }}>Flatrack</div>
            <input style={ss.inp} type="text" placeholder="0" value={row.flatrack_t}
              onChange={e => updateRow(idx, "flatrack_t", e.target.value)}/>
            <input style={ss.inp} type="text" placeholder="0" value={row.flatrack_f}
              onChange={e => updateRow(idx, "flatrack_f", e.target.value)}/>
            <div style={{ fontSize:12, fontWeight:600, color:C.accent, textAlign:"center" }}>
              {(() => {
                const t = parseFloat(row.flatrack_t) || 0;
                const fe = parseFloat(row.flatrack_f) || 0;
                const teq = t + (fe * 2);
                return teq > 0 ? Math.round(teq*10)/10 : "—";
              })()}
            </div>
          </div>

          {/* Tonase */}
          <div style={{ display:"grid", gridTemplateColumns:"70px 1fr", gap:8, alignItems:"center", marginTop:4 }}>
            <div style={{ fontSize:11, fontWeight:500, color:C.amber }}>Tonase</div>
            <input style={{ ...ss.inp, borderColor:"rgba(251,191,36,0.4)" }} type="text" placeholder="0" value={row.ton||""}
              onChange={e => updateRow(idx,"ton",e.target.value)}/>
          </div>
        </div>
      ))}

      {/* Add row button */}
      <button style={{ ...ss.btnG, width:"100%", marginBottom:12, fontSize:12 }} onClick={addRow}>
        + Tambah POL → POD
      </button>

      {/* Grand total */}
      <div style={{ ...ss.teusBox, marginBottom:12 }}>
        <div>
          <div style={{ fontSize:9, color:C.accent, textTransform:"uppercase", letterSpacing:"0.06em" }}>Grand Total Box</div>
          <div style={{ fontSize:18, fontWeight:700, color:C.text }}>{box || "—"}</div>
        </div>
        <div style={{ width:1, height:26, background:C.accent+"40" }}/>
        <div>
          <div style={{ fontSize:9, color:C.accent, textTransform:"uppercase", letterSpacing:"0.06em" }}>Grand Total TEUS</div>
          <div style={{ fontSize:18, fontWeight:700, color:C.accent }}>{teus || "—"}</div>
        </div>
        <div style={{ width:1, height:26, background:C.accent+"40" }}/>
        <div>
          <div style={{ fontSize:9, color:C.amber, textTransform:"uppercase", letterSpacing:"0.06em" }}>Grand Total Tonase</div>
          <div style={{ fontSize:18, fontWeight:700, color:C.amber }}>{ton ? ton.toFixed() : "—"}</div>
        </div>
      </div>

      {/* Ballast + Draft */}
      <div className="voyage-row3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:11 }}>
        <div style={ss.fg}><label style={ss.lbl}>Ballast (Ton)</label>
          <input style={ss.inp} type="text" step="0.1" defaultValue={fref.current.ballast}
            onChange={e=>{fref.current.ballast=e.target.value;}}/></div>
        <div style={ss.fg}><label style={ss.lbl}>GM (M)</label>
          <input style={ss.inp} type="text" step="0.1" defaultValue={fref.current.gm}
            onChange={e=>{fref.current.gm=e.target.value;}}/></div>
        <div/>
      </div>
      <div className="voyage-row3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:11 }}>
        {[{l:"Draft F (M)",k:"drf"},{l:"Draft M (M)",k:"drm"},{l:"Draft A (M)",k:"dra"}].map(x=>(
          <div key={x.k} style={ss.fg}><label style={ss.lbl}>{x.l}</label>
            <input style={ss.inp} type="text" step="0.01" defaultValue={fref.current[x.k]}
              onChange={e=>{fref.current[x.k]=e.target.value;}}/></div>
        ))}
      </div>
    </div>
  );
}

function ReportForm({ onSave, onCancel, editReport, onUpdate, allReports, user }) {
  // Helper: Convert ISO string to datetime-local format (YYYY-MM-DDTHH:MM)
  // Supabase stores as UTC ISO string, we need to extract just the date/time part
  // and display as-is (since datetime-local shows local time)
  const isoToLocalInput = (isoStr) => {
    if (!isoStr) return "";
    try {
      // Parse ISO string sebagai Date object (otomatis ke lokal)
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return "";
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return "";
    }
  };

  // Helper: Convert datetime-local value to ISO string for Supabase storage
  // Just append 'Z' to indicate UTC, since we want the time as entered
  const localInputToISO = (localStr) => {
    if (!localStr) return null;
    try {
      // Parse string sebagai waktu lokal
      const d = new Date(localStr);
      if (isNaN(d.getTime())) return null;
      // Konversi ke ISO string (UTC)
      return d.toISOString();
    } catch {
      return null;
    }
  };

  const [tsValue, setTsValue] = useState(() => isoToLocalInput(editReport?.ts));
  const [etaValue, setEtaValue] = useState(() => isoToLocalInput(editReport?.eta_dest));
  const fref = useRef(editReport ? { ...initForm(), ...editReport, destination: editReport.destination || editReport.dest || "" } : initForm());
  const [type, setType]   = useState(editReport ? editReport.type : "departure");
  const [ship, setShip]   = useState(editReport ? editReport.ship : (user?.ship || ""));
  const [dtDur, setDtDur] = useState(() => fmtH(diffH(fref.current.t0, fref.current.t1)));
  const [dtT0, setDtT0] = useState(() => isoToLocalInput(fref.current.t0) || "");
  const [dtT1, setDtT1] = useState(() => isoToLocalInput(fref.current.t1) || "");
  const [done, setDone]   = useState(false);
  const [waMsg, setWaMsg] = useState("");
  const [voyError, setVoyError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = !!editReport;

  // Derived state: active voyage for selected ship
  const activeVoy = ship ? getActiveVoyage(ship, allReports || []) : null;
  const shipIsUnderway = !!activeVoy;

  // Auto-fill voyage no + port/dest for reports OTHER than departure/shift_anchor
  // Those two are always left free for manual entry — see fields UI below
  useEffect(() => {
    if (ship && activeVoy) {
      const alwaysFree = type === "departure" || type === "shift_anchor";
      if (!alwaysFree) {
        fref.current.voy = activeVoy;
        const pd = getActivePortDest(ship, activeVoy, allReports || [], type);
        if (!fref.current.port && pd.port) fref.current.port = pd.port;
        if (!fref.current.destination && pd.dest) fref.current.destination = pd.dest;
      }
    }
  }, [ship, activeVoy, type, isEdit]);

  useEffect(() => { fref.current.type = type; }, [type]);
  useEffect(() => { fref.current.ship = ship; }, [ship]);

  const F = (label, fkey, opts, type2, placeholder) => {
    // Jika type2 adalah "datetime-local" atau "date", gunakan value + onChange
    if (type2 === "datetime-local" || type2 === "date") {
      const isEta = fkey === "eta_dest";
      const [value, setValue] = isEta 
        ? [etaValue, setEtaValue] 
        : [tsValue, setTsValue];
      
      return (
        <div style={ss.fg}>
          {label && <label style={ss.lbl}>{label}</label>}
          <input 
            style={ss.inp} 
            type={type2}
            value={value}
            onChange={e => {
              setValue(e.target.value);
              fref.current[fkey] = localInputToISO(e.target.value);
            }}
          />
        </div>
      );
    }
  
    // Kode asli untuk type lainnya
    return (
      <div style={ss.fg}>
        {label && <label style={ss.lbl}>{label}</label>}
        {opts
          ? <select style={ss.sel} defaultValue={fref.current[fkey]} onChange={e=>{fref.current[fkey]=e.target.value;}}>
              {opts.map(o=><option key={o}>{o}</option>)}
            </select>
          : <input style={ss.inp} type={type2||"text"}
              key={`${fkey}-${isEdit ? editReport.id : 'new'}`}
              defaultValue={fref.current[fkey]}
              placeholder={placeholder}
              onChange={e=>{
                fref.current[fkey]=e.target.value;
                if(fkey==="t0"||fkey==="t1") setDtDur(fmtH(diffH(fref.current.t0,fref.current.t1)));
              }}/>
        }
      </div>
    );
  };

  const evtKeys = EVT_DEF[type] || [];
  const showCargo = !["noon","downtime"].includes(type);

  const handleSave = async () => {
    if (!ship) { alert("Pilih kapal terlebih dahulu!"); return; }
    // "departure" and "shift_anchor" can ALWAYS be created freely, even if a
    // voyage is currently active — the user may need to start loading for the
    // next voyage before the previous one's Compl Load report has been filed.
    // Only "dep_anchor" still follows the old blocking rule.
    if (!isEdit && type === "dep_anchor" && shipIsUnderway) {
      setVoyError(`MV ${ship} masih dalam Voyage ${activeVoy}. Selesaikan voyage terlebih dahulu.`);
      return;
    }
    if (!isEdit && type === "departure" && fref.current.voy === activeVoy) {
      setVoyError(`MV ${ship} sedang dalam Voyage ${activeVoy}. Departure harus menggunakan voyage baru yang berbeda dari voyage active.`);
      return;
    }
    // Auto-fill voy if empty and ship has active voyage
    if (!fref.current.voy && activeVoy) fref.current.voy = activeVoy;
    if (!fref.current.voy) { alert("Isi Voyage No terlebih dahulu!"); return; }
    setVoyError("");
    setSaving(true);

    // Build events and tanks data
    const events = {};
    evtKeys.forEach(k => { const key = evKey(k); if (fref.current[key]) events[key] = fref.current[key]; });
    const tanks = {};
    TANKS.forEach(t => {
      const k = tankKey(t);
      tanks[`tk_${k}`] = {};
      PHASES.forEach(p => { tanks[`tk_${k}`][p.k] = fref.current[`tk_${k}_${p.k}`] || ""; });
      tanks[`bk_${k}`] = fref.current[`bk_${k}`] || "";
      tanks[`rob_${k}`] = fref.current[`rob_${k}`] || "";
    });

    const reportData = {
      user_id: user?.id,
      ship,
      voy: fref.current.voy,
      type,
      ts: fref.current.ts,
      master: fref.current.master,
      port: fref.current.port,
      dest: fref.current.destination,
      posisi: fref.current.posisi,
      rmk: fref.current.rmk,
      dist_go: fref.current.dist_go ? parseFloat(fref.current.dist_go) : null,
      eta_dest: fref.current.eta_dest,
      tug: fref.current.tug ? parseFloat(fref.current.tug) : null,
      ttl_dist: fref.current.ttl_dist ? parseFloat(fref.current.ttl_dist) : null,
      steam: fref.current.steam,
      avg_spd: fref.current.avg_spd ? parseFloat(fref.current.avg_spd) : null,
      ttl_avg_spd: fref.current.ttl_avg_spd ? parseFloat(fref.current.ttl_avg_spd) : null,
  crs: fref.current.crs,
      manouvr_dist: fref.current.manouvr_dist ? parseFloat(fref.current.manouvr_dist) : null,
      lat: fref.current.lat,
      lon: fref.current.lon,
      posisi: fref.current.posisi,
      spd: fref.current.spd ? parseFloat(fref.current.spd) : null,
      crs: fref.current.crs,
      drun: fref.current.drun ? parseFloat(fref.current.drun) : null,
      drem: fref.current.drem ? parseFloat(fref.current.drem) : null,
      wx: fref.current.wx,
      wdir: fref.current.wdir,
      wbf: fref.current.wbf ? parseFloat(fref.current.wbf) : null,
      sea: fref.current.sea,
      t0: fref.current.t0,
      t1: fref.current.t1,
      cat: fref.current.cat,
      desc: fref.current.desc,
      action: fref.current.action,
      cargo_rows: JSON.stringify(fref.current.cargoRows || []),
      ballast: fref.current.ballast ? parseFloat(fref.current.ballast) : null,
      gm: fref.current.gm ? parseFloat(fref.current.gm) : null,
      drf: fref.current.drf ? parseFloat(fref.current.drf) : null,
      drm: fref.current.drm ? parseFloat(fref.current.drm) : null,
      dra: fref.current.dra ? parseFloat(fref.current.dra) : null,
      events: JSON.stringify(events),
      tanks: JSON.stringify(tanks),
    };

    try {
      let savedReport;
      if (isEdit) {
        const { data, error } = await supabase.from('reports').update(reportData).eq('id', editReport.id).select().single();
        if (error) throw error;
        savedReport = data;
      } else {
        const { data, error } = await supabase.from('reports').insert([reportData]).select().single();
        if (error) throw error;
        savedReport = data;
      }

      // Parse cargo_rows and events for buildWA
      const r = {
        ...fref.current,
        id: savedReport.id,
        type,
        ship,
        cargoRows: fref.current.cargoRows || [],
      };

      setWaMsg(buildWA(r));
      setDone(true);
      if (isEdit) onUpdate(r); else onSave(r);
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (done) return (
    <div>
      <div style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>{isEdit ? "✅ Laporan Diperbarui" : "✅ Laporan Tersimpan"}</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>{isEdit ? "Perubahan berhasil disimpan" : "Data berhasil disimpan ke sistem"}</div>
      <div style={ss.card()}>
        <div style={{ fontSize:12, fontWeight:700, color:"#25D366", marginBottom:10 }}>📱 Preview WhatsApp</div>
        <div style={ss.wa}>{waMsg}</div>
        <div style={{ display:"flex", gap:10, marginTop:12, flexWrap:"wrap" }}>
          <button style={{ ...ss.btn, background:"linear-gradient(135deg,#25D366,#128C7E)" }}
            onClick={() => window.open("https://wa.me/?text="+encodeURIComponent(waMsg),"_blank")}>
            📤 Kirim ke Grup WA
          </button>
          <button style={ss.btnG} onClick={onCancel}>← {isEdit ? "Semua Laporan" : "Dashboard"}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16 }}>
        <button style={ss.btnG} onClick={onCancel}>← Batal</button>
        <div>
          <div style={{ fontSize:17, fontWeight:700 }}>{isEdit ? "Edit Laporan" : "Buat Laporan Baru"}</div>
          <div style={{ fontSize:11, color:C.muted }}>{isEdit ? `${RT.find(r=>r.id===type)?.label} — Voyage ${fref.current.voy||"-"}` : "Sesuai format form kapal"}</div>
        </div>
      </div>

      {/* Header card */}
      <div style={ss.card()}>
        <div className="voyage-row3" style={ss.row3}>
          <div style={ss.fg}>
            <label style={ss.lbl}>Nama Kapal</label>
            {user?.ship ? (
              <div style={{ ...ss.sel, display:"flex", alignItems:"center", color:C.text, cursor:"default" }}>
                🔒 {user.ship}
              </div>
            ) : (
              <select style={ss.sel} value={ship} onChange={e=>{ setShip(e.target.value); setVoyError(""); }}>
                <option value="">-- Pilih Kapal --</option>
                {SHIPS.map(s=><option key={s}>{s}</option>)}
              </select>
            )}
            {ship && shipIsUnderway && (
              <div style={{ fontSize:10, color:C.green, marginTop:4, fontWeight:600 }}>
                ✓ Voyage aktif: {activeVoy}
              </div>
            )}
            {ship && !shipIsUnderway && !isEdit && (
              <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>
                Tidak ada voyage aktif
              </div>
            )}
          </div>
          {(() => {
            // "departure" and "shift_anchor" are ALWAYS freely editable, regardless
            // of whether a voyage is currently active. This lets the user start a
            // new voyage number immediately even if the previous voyage hasn't been
            // marked Completed yet (Completed now requires "Compl Load" in either
            // a departure or shift_anchor report — see hasCompletedFWE()).
            const isAlwaysEditableType = ["departure","shift_anchor"].includes(type);

            const isPreDepType  = ["dep_anchor","downtime"].includes(type);
            const depExists     = ship ? voyageHasDeparture(ship, activeVoy, allReports||[]) : false;

            let isReadonly = false;
            let displayVoy = fref.current.voy || "";
            let autoLabel  = "";

            if (!isEdit) {
              if (isAlwaysEditableType) {
                isReadonly = false;
              } else if (isPreDepType && depExists) {
                isReadonly = true; displayVoy = activeVoy; autoLabel = "★ Auto dari Departure";
              } else if (isPreDepType && !depExists) {
                isReadonly = false; displayVoy = fref.current.voy || "";
              } else {
                // noon, arrival, shelter, etc — always auto from activeVoy
                isReadonly = true; displayVoy = activeVoy || ""; autoLabel = activeVoy ? "★ Auto" : "";
              }
              // sync to ref
              if (isReadonly && displayVoy) fref.current.voy = displayVoy;
            }

            return (
              <div style={ss.fg}>
                <label style={ss.lbl}>Voyage No {autoLabel && <span style={{ color:C.green, marginLeft:6, fontWeight:600, textTransform:"none" }}>{autoLabel}</span>}</label>
                {isReadonly ? (
                  <div style={{ ...ss.inp, color: displayVoy ? C.text : C.muted, cursor:"not-allowed", opacity:0.85, display:"flex", alignItems:"center" }}>
                    {displayVoy || "— Pilih kapal terlebih dahulu —"}
                  </div>
                ) : (
                  <input style={ss.inp}
                    placeholder=""
                    defaultValue={displayVoy}
                    key={"voy-" + ship + "-" + type}
                    onChange={e => { fref.current.voy = e.target.value; }}
                  />
                )}
              </div>
            );
          })()}
          {(() => {
            const isAlwaysEditablePD = ["departure","shift_anchor"].includes(type);
            const pd = isAlwaysEditablePD ? {port:"",dest:""} : getActivePortDest(ship, activeVoy, allReports||[], type);

            let isPortReadonly = !isAlwaysEditablePD;
            let isDestReadonly = !isAlwaysEditablePD;
            let displayPort = isAlwaysEditablePD ? (fref.current.port || "") : (pd.port || "");
            let displayDest = isAlwaysEditablePD ? (fref.current.destination || "") : (pd.dest || "");

            if (!isEdit) {
              if (isAlwaysEditablePD) {
                isPortReadonly = false;
                isDestReadonly = false;
              } else {
                if (displayPort) fref.current.port = displayPort;
                if (displayDest) fref.current.destination = displayDest;
              }
            }

            return (
              <>
                <div style={ss.fg}>
                  <label style={ss.lbl}>Port {isPortReadonly && displayPort && <span style={{ color:C.green, marginLeft:6, fontWeight:600, textTransform:"none" }}>★ Auto</span>}</label>
                  {isPortReadonly ? (
                    <div style={{ ...ss.inp, color: displayPort ? C.text : C.muted, cursor:"not-allowed", opacity:0.85, display:"flex", alignItems:"center" }}>
                      {displayPort || "—"}
                    </div>
                  ) : (
                    <input style={ss.inp} placeholder="Surabaya" defaultValue={displayPort} key={"port-" + ship + "-" + type} onChange={e => { fref.current.port = e.target.value; }} />
                  )}
                </div>
                <div style={ss.fg}>
                  <label style={ss.lbl}>Destination {isDestReadonly && displayDest && <span style={{ color:C.green, marginLeft:6, fontWeight:600, textTransform:"none" }}>★ Auto</span>}</label>
                  {isDestReadonly ? (
                    <div style={{ ...ss.inp, color: displayDest ? C.text : C.muted, cursor:"not-allowed", opacity:0.85, display:"flex", alignItems:"center" }}>
                      {displayDest || "—"}
                    </div>
                  ) : (
                    <input style={ss.inp} placeholder="Surabaya" defaultValue={displayDest} key={"dest-" + ship + "-" + type} onChange={e => { fref.current.destination = e.target.value; }} />
                  )}
                </div>
              </>
            );
          })()}
        </div>
        <div className="voyage-row2" style={ss.row2}>
          <div style={ss.fg}>
            <label style={ss.lbl}>Tanggal & Waktu</label>
            <input style={ss.inp} type="datetime-local"
              value={tsValue}
              onChange={e => {
                setTsValue(e.target.value);
                // Store as ISO string for Supabase (preserve the exact time as entered)
                fref.current.ts = localInputToISO(e.target.value);
              }}/>
          </div>
          {F("Master","master",null,null,"Capt. ...")}
        </div>
        <div style={ss.fg}>
          <label style={ss.lbl}>Tipe Laporan</label>
          <div style={{ display:"flex", flexWrap:"wrap", marginTop:7 }}>
            {RT.map(r => (
              <button key={r.id} style={{...ss.btnSm(type===r.id), opacity:isEdit&&type!==r.id?0.4:1, cursor:isEdit?"not-allowed":"pointer"}}
                onClick={()=>{ if(!isEdit) setType(r.id); }}>{r.short}</button>
            ))}
          </div>
          {isEdit && <div style={{fontSize:10, color:C.muted, marginTop:4}}>Tipe laporan tidak dapat diubah saat edit</div>}
        </div>
      </div>

      {/* Body card */}
      <div style={ss.card()}>
        <div style={{ fontSize:13, fontWeight:700, color:C.accent, marginBottom:14 }}>
          {RT.find(r=>r.id===type)?.label}
        </div>

        {/* Event times */}
        {evtKeys.length > 0 && (
          <>
            <div style={ss.secHd}>🕐 Event Times</div>
            <div className="voyage-row2" style={ss.row2}>
              {evtKeys.map(k => (
                <div key={k} style={ss.fg}>
                  <label style={ss.lbl}>{k}</label>
                  <input style={ss.inp} type="datetime-local"
                    key={`evt-${evKey(k)}-${isEdit ? editReport.id : 'new'}`}
                    defaultValue={fref.current[evKey(k)]}
                    onChange={e=>{fref.current[evKey(k)]=e.target.value;}}/>
                </div>
              ))}
            </div>
          </>
        )}

        {type === "departure" && (
          <>
            <div className="voyage-row3" style={ss.row3}>
              {F("Dist To Go (NM)","dist_go")}
              {F("ETA Destination","eta_dest",null,"datetime-local",null)}
              {F("Tug Used","tug")}
            </div>
            {F("Manouver Dist (NM)","manouvr_dist")}
          </>
        )}
        {type === "dep_anchor" && (
          <div className="voyage-row2" style={ss.row2}>
            {F("Dist To Go (NM)","dist_go")}
            {F("ETA Destination","eta_dest",null,"datetime-local",null)}
          </div>
        )}

        {["arr_berth","arr_anchor"].includes(type) && (
          <>
            <div className="voyage-row3" style={ss.row3}>
              {F("Total Dist Run (NM)","ttl_dist")}
              {F("Total Steaming Time","steam")}
              {F("Avg Speed (Knot)","avg_spd")}
            </div>
            {F("Manouver Dist (NM)","manouvr_dist")}
            {type === "arr_berth" && F("Tug Used","tug")}
          </>
        )}

        {type === "shelter_arr" && (
          <>
            <div className="voyage-row2" style={ss.row2}>
              {F("Latitude","lat",null,null,"05°30'S")}
              {F("Longitude","lon",null,null,"112°15'E")}
            </div>
            <div className="voyage-row3" style={ss.row3}>
              {F("Total Dist Run (NM)","ttl_dist")}
              {F("Total Steaming Time","steam")}
              {F("Avg Speed (Knot)","avg_spd")}
            </div>
            <hr style={ss.divider}/>
            <div className="voyage-row3" style={ss.row3}>
              {F("Weather","wx",["Fine","Cloudy","Rain","Fog","Storm"])}
              {F("Wind Dir","wdir",["N","NE","E","SE","S","SW","W","NW"])}
              {F("Wind Bf","wbf")}
            </div>
            {F("Sea State","sea",["Calm","Slight","Moderate","Rough","Very Rough"])}
          </>
        )}

        {type === "shelter_dep" && (
          <>
            <div className="voyage-row2" style={ss.row2}>
              {F("Latitude","lat",null,null,"05°30'S")}
              {F("Longitude","lon",null,null,"112°15'E")}
            </div>
            <div className="voyage-row2" style={ss.row2}>
              {F("Dist To Go (NM)","dist_go")}
              {F("ETA Destination","eta_dest",null,"datetime-local",null)}
            </div>
            <hr style={ss.divider}/>
            <div className="voyage-row3" style={ss.row3}>
              {F("Weather","wx",["Fine","Cloudy","Rain","Fog","Storm"])}
              {F("Wind Dir","wdir",["N","NE","E","SE","S","SW","W","NW"])}
              {F("Wind Bf","wbf")}
            </div>
            {F("Sea State","sea",["Calm Sea","Slight Sea","Moderate Sea","Rough Sea","Very Rough Sea"])}
          </>
        )}

        {["shift_anchor","shift_berth"].includes(type) && F("Tug Used","tug")}
        {type === "shift_berth" && F("Manouver Dist (NM)","manouvr_dist")}

        {["shift_bb","shift_aa","sea_trial"].includes(type) && (
          <>
            <div className="voyage-row3" style={ss.row3}>
              {F("Total Dist Run (NM)","ttl_dist")}
              {F("Total Steaming Time","steam")}
              {F("Avg Speed (Knot)","avg_spd")}
            </div>
            {["shift_bb","shift_aa"].includes(type) && F("Manouver Dist (NM)","manouvr_dist")}
          </>
        )}

        {type === "noon" && (
          <>
            <div className="voyage-row2" style={ss.row2}>{F("Latitude","lat",null,null,"05°30'S")}{F("Longitude","lon",null,null,"112°15'E")}</div>
            {F("Posisi","posisi",null,null,"Laut Jawa / Berthing Surabaya / Rede Surabaya")}
            <div className="voyage-row3" style={ss.row3}>{F("Avg Speed (kts)","spd")}{F("Total Avg Speed (kts)","ttl_avg_spd")}{F("Course (°)","crs")}{F("ETA","eta_dest",null,"datetime-local",null)}</div>
            <div className="voyage-row2" style={ss.row3}>{F("Dist Run (NM) - noon->noon","drun")}{F("Total Dist Run (NM)","ttl_dist")}{F("Dist Remain (NM)","drem")}</div>
            <hr style={ss.divider}/>
            <div className="voyage-row3" style={ss.row3}>{F("Weather","wx",["Fine","Cloudy","Rain","Fog","Storm"])}{F("Wind Dir","wdir",["N","NE","E","SE","S","SW","W","NW"])}{F("Wind Bf","wbf")}</div>
            {F("Sea State","sea",["Calm sea ","Slight sea","Moderate sea","Rough sea","Very Rough sea"])}
          </>
        )}

        {type === "downtime" && (
          <>
            <div className="voyage-row2" style={ss.row2}>
            <div style={ss.fg}>
            <label style={ss.lbl}>Waktu Mulai</label>
            <input style={ss.inp} type="datetime-local" value={dtT0}
             onChange={e => {
             setDtT0(e.target.value);
             fref.current.t0 = localInputToISO(e.target.value);
             setDtDur(fmtH(diffH(fref.current.t0, fref.current.t1)));
             }}/>
             </div>
             <div style={ss.fg}>
             <label style={ss.lbl}>Waktu Selesai</label>
             <input style={ss.inp} type="datetime-local" value={dtT1}
              onChange={e => {
              setDtT1(e.target.value);
              fref.current.t1 = localInputToISO(e.target.value);
              setDtDur(fmtH(diffH(fref.current.t0, fref.current.t1)));
              }}/>
            </div>
</div>
            <div style={ss.fg}>
              <label style={ss.lbl}>Durasi Downtime</label>
              <div style={{ fontSize:15, fontWeight:700, color:C.red, padding:"4px 0" }}>{dtDur}</div>
            </div>
            {F("Kategori","cat",DTCATS)}
            {F("Deskripsi","desc")}
            {F("Action Taken","action")}
          </>
        )}

        {showCargo && (
          <>
            <hr style={ss.divider}/>
            <CargoSection fref={fref}/>
          </>
        )}

        <hr style={ss.divider}/>
        {/* Untuk Downtime: tampilkan ROB + FAW only */}
        {type === "downtime" ? (
        <>
        <TankSectionROB fref={fref}/>
        <hr style={ss.divider}/>
        <TankSectionFAWOnly fref={fref}/>
        </>
        // untuk noon hanya ROB, selain itu menggunakan tanksection
          ) : type === "noon" ? (
        <TankSectionROB fref={fref}/>
          ) : (
        <TankSection fref={fref} type={type}/>
          )}
        <hr style={ss.divider}/>

        <div style={ss.fg}>
          <label style={ss.lbl}>Remarks</label>
          <textarea style={{ ...ss.inp, minHeight:56, resize:"vertical" }}
            key={`rmk-${isEdit ? editReport.id : 'new'}`}
            defaultValue={fref.current.rmk}
            onChange={e=>{fref.current.rmk=e.target.value;}}/>
        </div>
        {voyError && (
          <div style={{ background:C.red+"18", border:`1px solid ${C.red}50`, borderRadius:9, padding:"10px 14px", marginBottom:12, fontSize:12, color:C.red }}>
            ⚠️ {voyError}
          </div>
        )}
        {!isEdit && type==="dep_anchor" && ship && shipIsUnderway && (
          <div style={{ background:C.red+"18", border:`1px solid ${C.red}50`, borderRadius:9, padding:"10px 14px", marginBottom:12, fontSize:12, color:C.red }}>
            ⚠️ MV {ship} masih dalam Voyage <strong>{activeVoy}</strong>. Selesaikan voyage ini terlebih dahulu.
          </div>
        )}
        <div style={{ display:"flex", gap:10 }}>
          <button style={{ ...ss.btn, opacity:(saving || (!isEdit && type==="dep_anchor" && ship && shipIsUnderway)) ? 0.4 : 1 }}
            onClick={handleSave} disabled={saving}>{saving ? "💾 Menyimpan..." : (isEdit ? "💾 Update & Preview WA" : "💾 Simpan & Preview WA")}</button>
          <button style={ss.btnG} onClick={onCancel}>Batal</button>
        </div>
      </div>
    </div>
  );
}

// Helper: Get event value from report (events are spread to root after loading from DB)
function getEventVal(report, key) {
  if (!report) return null;
  // Events are spread to root level when reports are loaded (see loadReports)
  // So ev_FWE is directly on report.ev_FWE, not report.events.ev_FWE
  return report[key] || null;
}

// Helper: Get ship current status for dashboard
// Returns { status: "UNDERWAY" | "IN PORT", sailingH: number | null, inPortH: number | null, activeVoy: voyage | null, anchH: number, berthH: number }
function getShipCurrentStatus(ship, voys) {
  // Find voyages for this ship
  const shipVoys = voys.filter(v => v.ship === ship);
  shipVoys.sort((a,b) => new Date(a.dep?.ts || a.list[0]?.ts || 0) - new Date(b.dep?.ts || b.list[0]?.ts || 0));

  // Find voyage that is currently underway (has BOSV, no EOSV)
  const underwayVoy = shipVoys.find(v => v.bosv && !v.eosv);
  if (underwayVoy) {
    return {
      status: "UNDERWAY",
      sailingH: diffH(underwayVoy.bosv, new Date().toISOString()),
      inPortH: null,
      anchH: 0,
      berthH: 0,
      activeVoy: underwayVoy,
    };
  }

  // No underway voyage - find the last completed voyage (has EOSV)
  // This means ship is IN PORT (waiting for next departure)
  const completedVoys = shipVoys.filter(v => v.eosv);
  if (completedVoys.length > 0) {
    // Sort by EOSV date, get the most recent
    completedVoys.sort((a, b) => new Date(b.eosv) - new Date(a.eosv));
    const lastVoy = completedVoys[0];

    // Calculate anchorage and berthing time separately
    // Anchorage: SBE/EOSV (arr_anchor ONLY, NOT shelter) → FWE (shift_berth)
    // Berthing: FWE (shift_berth) → EOSV or current time
    let anchH = 0;
    let berthH = 0;

    const now = new Date().toISOString();

    // Find arrival anchorage report (arr_anchor ONLY, not shelter_arr)
    const arrAnchReport = (lastVoy.list || []).find(r => r.type === "arr_anchor");
    const arrBerthReport = (lastVoy.list || []).find(r => r.type === "arr_berth");
    const shiftBerthReport = (lastVoy.list || []).find(r => r.type === "shift_berth");
    const fweArrBerth = arrBerthReport ? (getEventVal(arrBerthReport, evKey("FWE")) || null) : null;
    // Get FWE from shift_berth (events are spread to root after loading)
    const fweShift = shiftBerthReport ? (getEventVal(shiftBerthReport, evKey("FWE")) || null) : null;

    if (lastVoy && lastVoy.ship === "Mavendra Mas" && lastVoy.no === "57") {
    }

    if (arrBerthReport && fweArrBerth) {
      // Berth arrival: FWE (arr_berth) → current time
      berthH = diffH(fweArrBerth, now);

    } else if (shiftBerthReport && fweShift) {
      // Berth shift: FWE (shift_berth) → current time
      berthH = diffH(fweShift, now);

    } else if (arrBerthReport && !fweArrBerth) {
      // arr_berth exists but FWE not filled yet - treat as in-port berthing start from report time
      berthH = diffH(arrBerthReport.ts, now);

    } else if (arrAnchReport && shiftBerthReport && fweShift) {
      // Anchorage: SBE/EOSV (arr_anchor) → FWE (shift_berth)
      const sbeEosv = getEventVal(arrAnchReport, evKey("SBE/EOSV")) || arrAnchReport.ts;
      anchH = diffH(sbeEosv, fweShift);
      // Berthing: FWE (shift_berth) → current time
      berthH = diffH(fweShift, now);

    } else if (arrAnchReport && !shiftBerthReport) {
      // Still at anchor (arr_anchor exists but no shift_berth yet)
      const sbeEosv = getEventVal(arrAnchReport, evKey("SBE/EOSV")) || arrAnchReport.ts;
      anchH = diffH(sbeEosv, now);

    } else if (arrAnchReport && shiftBerthReport && !fweShift) {
      // shift_berth exists but FWE not filled yet - still at anchor
      const sbeEosv = getEventVal(arrAnchReport, evKey("SBE/EOSV")) || arrAnchReport.ts;
      anchH = diffH(sbeEosv, now);

    } else if (shiftBerthReport && fweShift) {
      // Direct shift without arr_anchor (e.g., shift_bb) - berthing only
      const endTime = lastVoy.eosv || now;
      berthH = diffH(fweShift, endTime);

    } else {
    }

    return {
      status: "IN PORT",
      sailingH: null,
      inPortH: anchH + berthH,
      anchH: anchH,
      berthH: berthH,
      activeVoy: lastVoy
    };
  }

  // No voyages at all - show as IN PORT (default state)
  return { status: "IN PORT", sailingH: null, inPortH: 0, anchH: 0, berthH: 0, activeVoy: null };
}

// --- DASHBOARD ----------------------------------------------------------------
function Dashboard({ reports, onNew, user, runningHours, consMe }) {
  const voys = computeVoyages(reports);

  // Get status for each ship
  const shipStatuses = SHIPS.map(ship => ({
    ship,
    ...getShipCurrentStatus(ship, voys)
  }));

  const underwayCount = shipStatuses.filter(s => s.status === "UNDERWAY").length;
  const inPortCount = shipStatuses.filter(s => s.status === "IN PORT").length;

  // Helper: Get latest noon report ETA for a ship's active voyage
  const getLatestNoonETA = (ship, voy) => {
    if (!ship || !voy) return null;
    const shipNoons = reports
      .filter(r => r.ship === ship && r.voy === voy && r.type === "noon" && r.eta_dest)
      .sort((a, b) => new Date(b.ts) - new Date(a.ts));
    return shipNoons[0]?.eta_dest || null;
  };
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:700, marginBottom:2 }}>Voyage Dashboard</div>
          <div style={{ fontSize:11, color:C.muted }}>PT Mentari Mas Multimoda — 8 Vessels</div>
        </div>
        <button style={ss.btn} onClick={onNew}>+ Buat Laporan</button>
      </div>

      {/* All Ships Status Grid */}
      <div style={{ marginBottom:22 }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.accent, marginBottom:10, display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:C.accent, display:"inline-block" }}/>
          STATUS KAPAL
        </div>
        <div className="voyage-card-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8 }}>
          {shipStatuses.map(({ ship, status, sailingH, inPortH, activeVoy, anchH, berthH }) => {
            const statusColor = status === "UNDERWAY" ? C.green : C.horizon;
            const timeDisplay = status === "UNDERWAY" ? fmtH(sailingH || 0) : fmtH(inPortH || 0);
            const timeLabel = status === "UNDERWAY" ? "Sailing" : "In Port";
            // Port: UNDERWAY from departure, IN PORT from arrival
            const portDisplay = status === "UNDERWAY" ? activeVoy?.dep?.port : activeVoy?.arr?.port;
            // Destination for UNDERWAY
            const destDisplay = status === "UNDERWAY" ? activeVoy?.dep?.dest : null;
            // ETA from latest noon report (updates daily), fallback to departure ETA
            const noonETA = status === "UNDERWAY" ? getLatestNoonETA(ship, activeVoy?.no) : null;
            const etaDisplay = noonETA || (status === "UNDERWAY" ? activeVoy?.dep?.eta_dest : null);

            return (
              <div key={ship} style={{ ...ss.card(`${statusColor}40`), borderTop:`2px solid ${statusColor}`, marginBottom:0, padding:"10px 12px", textAlign:"left" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <div style={{ fontWeight:700, fontSize:12, textAlign:"left" }}>{ship}</div>
                  <span style={ss.tag(statusColor)}>{status}</span>
                </div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:4, textAlign:"left" }}>Voyage {activeVoy?.no || "—"}</div>
                <div style={{ fontSize:11, marginBottom:2, textAlign:"left" }}><span style={{color:C.muted}}>Port: </span>{portDisplay || "—"}</div>
                {status === "UNDERWAY" ? (
                  <>
                    {destDisplay && <div style={{ fontSize:11, marginBottom:2, textAlign:"left" }}><span style={{color:C.muted}}>Dest: </span>{destDisplay}</div>}
                    {etaDisplay && <div style={{ fontSize:11, marginBottom:2, textAlign:"left" }}><span style={{color:C.muted}}>ETA: </span>{fmtDT(etaDisplay)}</div>}
                    <div style={{ fontSize:11, textAlign:"left" }}><span style={{color:C.muted}}>{timeLabel}: </span><strong style={{color:statusColor}}>{timeDisplay}</strong></div>
                  </>
                ) : (
                  <>
                    {anchH > 0 && <div style={{ fontSize:11, marginBottom:2, textAlign:"left" }}><span style={{color:C.muted}}>Anch: </span><strong style={{color:C.amber}}>{fmtH(anchH)}</strong></div>}
                    {berthH > 0 && <div style={{ fontSize:11, marginBottom:2, textAlign:"left" }}><span style={{color:C.muted}}>Berth: </span><strong style={{color:C.green}}>{fmtH(berthH)}</strong></div>}
                    <div style={{ fontSize:11, textAlign:"left" }}><span style={{color:C.muted}}>In Port: </span><strong style={{color:statusColor}}>{fmtH(inPortH)}</strong></div>
                  </>
                )}
                {activeVoy?.dtH > 0 && (
                  <div style={{ fontSize:11, marginTop:2, textAlign:"left" }}><span style={{color:C.muted}}>Downtime: </span><strong style={{color:C.red}}>{fmtH(activeVoy.dtH)}</strong></div>
                )}
              </div>
            );
          })}
        </div>
      </div>


      <VoyageSummary reports={reports} voys={voys} user={user} runningHours={runningHours} consMe={consMe}/>
    </div>
  );
}

// === VOYAGE SUMMARY WITH FILTERS ================================================
function VoyageSummary({ reports, voys, user, runningHours, consMe }) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const [fShip, setFShip] = useState("");
  const [fYear, setFYear] = useState(String(currentYear)); // Default tahun ini
  const [fMonth, setFMonth] = useState(String(currentMonth)); // Default bulan ini


  const computed = (({ fShip, fYear, fMonth, voys, reports }) => {
    const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    const years = Array.from(new Set(reports.map(r => new Date(r.ts).getFullYear()))).sort((a,b)=>b-a);
    const shipFiltered = voys.filter(v => !fShip || v.ship === fShip);
    let totalSailH = 0, totalDtH = 0, totalInPortH = 0, totalAnchorH = 0, matchedVoyageCount = 0;
    let sailConsMFO = 0, sailConsMDO = 0, portConsMFO = 0, portConsMDO = 0;

    const shipVoyMap = {};
    voys.filter(v => !fShip || v.ship === fShip).forEach(v => {
      if (!shipVoyMap[v.ship]) shipVoyMap[v.ship] = [];
      shipVoyMap[v.ship].push(v);
    });
    Object.values(shipVoyMap).forEach(arr2 =>
      arr2.sort((a,b) => new Date(a.dep?.ts||0) - new Date(b.dep?.ts||0))
    );

    const addSegs = (t0, t1, bucket) => {
      if (!t0 || !t1) return false;
      const segs = splitByMonth(t0, t1); let added = false;
      segs.forEach(seg => {
        const yearOk  = !fYear  || seg.year === Number(fYear);
        const monthOk = !fMonth || seg.month === Number(fMonth);
        if (yearOk && monthOk) { bucket.push(seg.hours); added = true; }
      });
      return added;
    };

    const sailBucket=[], dtBucket=[], portBucket=[], ancBucket=[];

    shipFiltered.forEach(v => {
      let voyMatched = false;
      if (addSegs(v.bosv, v.eosv, sailBucket)) voyMatched = true;
      (v.dts || []).forEach(dt => { if (addSegs(dt.t0, dt.t1, dtBucket)) voyMatched = true; });
      const shelterArrs = (v.list||[]).filter(r=>r.type==="shelter_arr");
      const shelterDeps = (v.list||[]).filter(r=>r.type==="shelter_dep");
      shelterArrs.forEach(sa => {
        const sd = shelterDeps[0];
        const t0 = sa[evKey("SBE/EOSV")] || sa.ts;
        const t1 = sd ? (sd[evKey("BOSV")] || sd.ts) : null;
        if (addSegs(t0, t1, dtBucket)) voyMatched = true;
      });
      if (v.inPortT0) {
        const shipVoys = shipVoyMap[v.ship] || [];
        const myIdx = shipVoys.findIndex(x => x.no === v.no);
        const nextVoy = shipVoys[myIdx + 1];
        const t1 = nextVoy?.bosv || null;
        if (addSegs(v.inPortT0, t1, portBucket)) voyMatched = true;
      }
      (v.anchorIntervals || []).forEach(ai => { if (addSegs(ai.t0, ai.t1, ancBucket)) voyMatched = true; });
      if (!fYear && !fMonth && (v.sailH || v.dtH || v.inPortT0)) voyMatched = true;
      if (voyMatched) matchedVoyageCount++;

      // Fuel: Cons Sailing — split proportionally by month if BOSV/EOSV available,
      // otherwise fallback to whole-value assigned to departure month (no data loss)
      if (v.sailConsMFO != null || v.sailConsMDO != null) {
        if (v.bosv && v.eosv && diffH(v.bosv, v.eosv) > 0) {
          const totalSailHrs = diffH(v.bosv, v.eosv);
          const segs = splitByMonth(v.bosv, v.eosv);
          segs.forEach(seg => {
            const yearOk  = !fYear  || seg.year === Number(fYear);
            const monthOk = !fMonth || seg.month === Number(fMonth);
            if (yearOk && monthOk) {
              const proportion = seg.hours / totalSailHrs;
              if (v.sailConsMFO != null) sailConsMFO += v.sailConsMFO * proportion;
              if (v.sailConsMDO != null) sailConsMDO += v.sailConsMDO * proportion;
            }
          });
        } else {
          // Fallback: no BOSV/EOSV — assign whole value to departure's month
          const fallbackDate = v.dep?.ts || v.list[0]?.ts;
          const yearOk  = !fYear  || (fallbackDate && new Date(fallbackDate).getFullYear() === Number(fYear));
          const monthOk = !fMonth || (fallbackDate && new Date(fallbackDate).getMonth() === Number(fMonth));
          if ((!fYear && !fMonth) || (yearOk && monthOk)) {
            if (v.sailConsMFO != null) sailConsMFO += v.sailConsMFO;
            if (v.sailConsMDO != null) sailConsMDO += v.sailConsMDO;
          }
        }
      }

      // Fuel: Cons In Port — kept as whole-voyage allocation (based on departure month)
      const fuelRefDate = v.bosv || v.dep?.ts || v.list[0]?.ts;
      const fuelOk = (() => {
        if (!fYear && !fMonth) return true;
        if (!fuelRefDate) return false;
        const d = new Date(fuelRefDate);
        return (!fYear || d.getFullYear()===Number(fYear)) && (!fMonth || d.getMonth()===Number(fMonth));
      })();
      if (fuelOk) {
        if (v.fuelArrSBE && (v.fuelArrSBE.mfo != null || v.fuelArrSBE.mdo != null)) {
          const allShipVoys = voys.filter(x=>x.ship===v.ship)
            .sort((a,b)=>new Date(a.dep?.ts||a.list[0]?.ts||0)-new Date(b.dep?.ts||b.list[0]?.ts||0));
          const mi = allShipVoys.findIndex(x=>x.no===v.no);
          const nv = allShipVoys[mi+1];
          const nFAW = nv?.fuelDepFWE;
          if (nFAW) {
            if (v.fuelArrSBE.mfo!=null && nFAW.mfo!=null)
              portConsMFO += Math.max(0,(v.fuelArrSBE.mfo+(nv.receivedMFO||0))-nFAW.mfo);
            if (v.fuelArrSBE.mdo!=null && nFAW.mdo!=null)
              portConsMDO += Math.max(0,(v.fuelArrSBE.mdo+(nv.receivedMDO||0))-nFAW.mdo);
          }
        }
      }
    });

    return {
      MONTHS, years, shipFiltered,
      totalSailH: sailBucket.reduce((s,h)=>s+h,0),
      totalDtH:   dtBucket.reduce((s,h)=>s+h,0),
      totalInPortH: portBucket.reduce((s,h)=>s+h,0),
      totalAnchorH: ancBucket.reduce((s,h)=>s+h,0),
      matchedVoyageCount,
      sailConsMFO, sailConsMDO, portConsMFO, portConsMDO,
      closingBalance: portBucket.reduce((s,h)=>s+h,0),
    };
  })({ fShip, fYear, fMonth, voys, reports });

  const { MONTHS, years, shipFiltered, totalSailH, totalDtH, totalInPortH, totalAnchorH,
          matchedVoyageCount, sailConsMFO, sailConsMDO, portConsMFO, portConsMDO,
          closingBalance } = computed;
  const totalSailDays = totalSailH / 24;

  const curLabel = fMonth !== "" ? MONTHS[fMonth] : MONTHS[new Date().getMonth()];
  const prevLabel = fMonth !== "" ? MONTHS[(Number(fMonth)+11)%12] : MONTHS[(new Date().getMonth()+11)%12];
  const daysInSelectedMonth = (() => {
    const y = fYear ? Number(fYear) : new Date().getFullYear();
    const m = fMonth !== "" ? Number(fMonth) : new Date().getMonth();
    return new Date(y, m + 1, 0).getDate();
  })();

  const DowntimeDaysByShip = {};
  [...new Set(voys.map(v => v.ship))].forEach(ship => {
    const shipVoys = (voys || []).filter(v => v.ship === ship);
    let matchedH = 0;
    shipVoys.forEach(v => {
      (v.dts || []).forEach(dt => {
        if (!dt.t0 || !dt.t1) return;
        const segs = splitByMonth(dt.t0, dt.t1);
        segs.forEach(seg => {
          const yearOk = !fYear || seg.year === Number(fYear);
          const monthOk = !fMonth || seg.month === Number(fMonth);
          if (yearOk && monthOk) matchedH += seg.hours;
        });
      });
    });
    DowntimeDaysByShip[ship] = matchedH / 24;
  });

  // Per-ship Anchorage (hari): arr_anchor SBE/EOSV → shift_berth FWE
  const AnchorageDaysByShip = {};
  [...new Set(voys.map(v => v.ship))].forEach(ship => {
    const shipVoys = (voys || []).filter(v => v.ship === ship);
    let anchH = 0;
    shipVoys.forEach(v => {
      const arrAnc = (v.list||[]).find(r => r.type === "arr_anchor");
      if (!arrAnc) return;
      const t0 = arrAnc[evKey("SBE/EOSV")] || arrAnc.ts;
      if (!t0) return;
      const shiftBerth = (v.list||[]).find(r => r.type === "shift_berth");
      const t1 = (shiftBerth && (shiftBerth[evKey("FWE")] || shiftBerth.ts)) || new Date().toISOString();
      const segs = splitByMonth(t0, t1);
      segs.forEach(seg => {
        const yearOk = !fYear || seg.year === Number(fYear);
        const monthOk = !fMonth || seg.month === Number(fMonth);
        if (yearOk && monthOk) anchH += seg.hours;
      });
    });
    AnchorageDaysByShip[ship] = anchH / 24;
  });

  // Per-ship Berthing (hours): shift_berth FWE (or arr_berth FWE) → BOSV of NEXT voyage
  const BerthingHoursByShip = {};
  [...new Set(voys.map(v => v.ship))].forEach(ship => {
    const shipVoys = voys.filter(v => v.ship === ship);
    shipVoys.sort((a,b) => new Date(a.dep?.ts||a.list[0]?.ts||0)-new Date(b.dep?.ts||b.list[0]?.ts||0));
    shipVoys.forEach((v, idx) => {
      const shiftBerth = (v.list||[]).find(r => r.type === "shift_berth");
      const arrBerth   = (v.list||[]).find(r => r.type === "arr_berth");
      const berthReport = shiftBerth || arrBerth;
      if (!berthReport) return;
      const t0 = berthReport[evKey("FWE")] || berthReport.ts;
      if (!t0) return;
      const nextV = shipVoys[idx+1];
      const t1 = nextV?.bosv || new Date().toISOString();
      const segs = splitByMonth(t0, t1);
      segs.forEach(seg => {
        const yearOk = !fYear || seg.year === Number(fYear);
        const monthOk = !fMonth || seg.month === Number(fMonth);
        if (yearOk && monthOk) {
          BerthingHoursByShip[ship] = (BerthingHoursByShip[ship] || 0) + seg.hours;
        }
      });
    });
  });

  // Per-ship At Port (hari) = Berthing (hari) - (RH_ME / 24) - [ DaysInMonth - TotalDowntime (hari) - Berthing (hari) - Anchorage (hari) ]
  // Returns null if RH_ME is not filled (same behavior as Management Report)
  const AtPortDaysByShip = {};
  SHIPS.forEach(ship => {
    const berthingH = BerthingHoursByShip[ship] || 0;
    const anchorageD = AnchorageDaysByShip[ship] || 0;
    const downtimeD  = DowntimeDaysByShip[ship] || 0;
    const berthingD = berthingH / 24;
    const rhKey = `${ship}|${fYear || new Date().getFullYear()}|${fMonth !== "" ? fMonth : new Date().getMonth()}`;
    const rhMeVal = runningHours?.[rhKey]?.me;
    // At Port = Berthing - (RH_ME/24) - SisaHari
    // SisaHari = DaysInMonth - Downtime - Berthing - Anchorage
    if (rhMeVal === undefined || rhMeVal === null || rhMeVal === "") {
      AtPortDaysByShip[ship] = null; // RH not filled → show empty (same as Management Report)
    } else {
      const rhMe = parseFloat(rhMeVal) || 0;
      const atPortD = berthingD - (rhMe / 24) - (daysInSelectedMonth - downtimeD - berthingD - anchorageD);
      AtPortDaysByShip[ship] = atPortD;
    }
  });

  // Sailing (Hari) = Total Hari - At Port (Hari) - Anchorage (Hari) - Downtime (Hari)
  const SailingDaysByShip = {};
  SHIPS.forEach(ship => {
    const totalD = daysInSelectedMonth;
    const atPortD = AtPortDaysByShip[ship];
    const anchD = AnchorageDaysByShip[ship] || 0;
    const dtD = DowntimeDaysByShip[ship] || 0;
    // Only calculate if At Port has a value (RH ME was filled)
    if (atPortD !== null) {
      SailingDaysByShip[ship] = Math.max(0, totalD - atPortD - anchD - dtD);
    } else {
      SailingDaysByShip[ship] = null;
    }
  });

  // Sailing days for prev month (for AE at Sea prev calculation)
  // Scaled proportionally from current sailing days by month length
  const PrevSailingDaysByShip = {};
  SHIPS.forEach(ship => {
    const tYear = fYear ? Number(fYear) : new Date().getFullYear();
    const tMonth = fMonth !== "" ? Number(fMonth) : new Date().getMonth();
    const prevMonth = tMonth - 1 < 0 ? 11 : tMonth - 1;
    const prevYear = tMonth - 1 < 0 ? tYear - 1 : tYear;
    const prevDaysInMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    if (SailingDaysByShip[ship] !== null && daysInSelectedMonth > 0) {
      PrevSailingDaysByShip[ship] = Math.max(0, prevDaysInMonth * SailingDaysByShip[ship] / daysInSelectedMonth);
    } else {
      PrevSailingDaysByShip[ship] = null;
    }
  });

  // Per-ship Total Distance (NM) - same formula as Management Report
  // Sum of ttl_dist from arr_berth + arr_anchor reports, filtered by selected month/year
  const TotalDistanceByShip = {};
  SHIPS.forEach(ship => {
    const shipEntries = reports
      .filter(r => ["arr_berth","arr_anchor"].includes(r.type) && r.ship === ship && r.ttl_dist)
      .filter(r => {
        const d = new Date(r.ts);
        const yearOk = !fYear || d.getFullYear() === Number(fYear);
        const monthOk = !fMonth || d.getMonth() === Number(fMonth);
        return yearOk && monthOk;
      });
    TotalDistanceByShip[ship] = shipEntries.reduce((sum, r) => sum + (parseFloat(r.ttl_dist) || 0), 0);
  });


  // Per-ship Cons ME (MT/day) from RH Cons ME menu
  const ConsMeByShip = {};
  SHIPS.forEach(ship => {
    const tYear = fYear ? Number(fYear) : new Date().getFullYear();
    const tMonth = fMonth !== "" ? Number(fMonth) : new Date().getMonth();
    const prevMonth = tMonth - 1 < 0 ? 11 : tMonth - 1;
    const prevYear = tMonth - 1 < 0 ? tYear - 1 : tYear;
    const prevKey = `${ship}|${prevYear}|${prevMonth}`;
    const val = consMe?.[prevKey]?.cons_me;
    ConsMeByShip[ship] = val != null && val !== "" ? parseFloat(val) : null;
  });

  // Per-ship Cons ME current month for Avg/Mile calculation
  const ConsMeCurByShip = {};
  SHIPS.forEach(ship => {
    const tYear = fYear ? Number(fYear) : new Date().getFullYear();
    const tMonth = fMonth !== "" ? Number(fMonth) : new Date().getMonth();
    const curKey = `${ship}|${tYear}|${tMonth}`;
    const val = consMe?.[curKey]?.cons_me;
    ConsMeCurByShip[ship] = val != null && val !== "" ? parseFloat(val) : null;

  });
  // Per-ship Cons AE from consMe state for AE at Port calculation
  const ConsMeAePrevByShip = {};
  const ConsMeAeCurByShip = {};
  SHIPS.forEach(ship => {
    const tYear = fYear ? Number(fYear) : new Date().getFullYear();
    const tMonth = fMonth !== "" ? Number(fMonth) : new Date().getMonth();
    const prevMonth = tMonth - 1 < 0 ? 11 : tMonth - 1;
    const prevYear = tMonth - 1 < 0 ? tYear - 1 : tYear;
    const prevKey = `${ship}|${prevYear}|${prevMonth}`;
    const curKey = `${ship}|${tYear}|${tMonth}`;
    const prevVal = consMe?.[prevKey]?.cons_ae;
    const curVal = consMe?.[curKey]?.cons_ae;
    ConsMeAePrevByShip[ship] = prevVal != null && prevVal !== "" ? parseFloat(prevVal) : null;
    ConsMeAeCurByShip[ship] = curVal != null && curVal !== "" ? parseFloat(curVal) : null;
  });

  // Per-ship Cons AE from consMe state for AE at Port calculation
  // Helper functions for AVG Speed (same as Management Report)
  const getFirstArrivalBeforeNoon = (ship, voy, year, month, day) => {
    const candidates = reports.filter(r =>
      ["arr_berth","arr_anchor"].includes(r.type) &&
      r.ship === ship && r.voy === voy &&
      (() => { const d = new Date(r.ts); return d.getFullYear()===year && d.getMonth()===month && d.getDate()===day; })()
    );
    const beforeNoon = candidates.filter(r => { const d = new Date(r.ts); return d.getHours() < 12; });
    if (beforeNoon.length === 0) return null;
    beforeNoon.sort((a,b) => new Date(a.ts) - new Date(b.ts));
    return beforeNoon[0];
  };

  const getFirstNoonOnDate = (ship, voy, year, month, day) => {
    const candidates = reports.filter(r =>
      r.type === "noon" && r.ship === ship && r.voy === voy &&
      (() => { const d = new Date(r.ts); return d.getFullYear()===year && d.getMonth()===month && d.getDate()===day; })()
    );
    if (candidates.length === 0) return null;
    candidates.sort((a,b) => new Date(a.ts) - new Date(b.ts));
    return candidates[0];
  };

  // Calculate AVG Speed per ship for current month
  const AvgSpeedByShip = {};
  SHIPS.forEach(ship => {
    let sum = 0, count = 0;
    const tYear = fYear ? Number(fYear) : new Date().getFullYear();
    const tMonth = fMonth !== "" ? Number(fMonth) : new Date().getMonth();
    const nextMonth = tMonth + 1;
    const nextYear = nextMonth > 11 ? tYear + 1 : tYear;
    const nextMonthIdx = nextMonth > 11 ? 0 : nextMonth;
    const shipVoys = voys.filter(v => v.ship === ship);

    // Target Parameter ME/Day
  const TargetParamByShip = {};
  SHIPS.forEach(ship => {
  const me = FUEL_PARAMS[ship]?.me;
  TargetParamByShip[ship] = me ? (me * 24).toFixed(2) : "";
});

    // 1. Arrival reports in this month
    reports
      .filter(r => ["arr_berth","arr_anchor"].includes(r.type))
      .filter(r => r.ship === ship)
      .filter(r => { const d = new Date(r.ts); return d.getFullYear() === tYear && d.getMonth() === tMonth; })
      .forEach(r => {
        const spd = parseFloat(r.avg_spd || r.spd);
        if (!isNaN(spd) && spd > 0) { sum += spd; count++; }
      });

    // 2. Active voyages (departed but no arrival) - use latest noon report regardless of month
    shipVoys.forEach(v => {
      // Skip if already has arrival in this month
      const hasArrivalInMonth = reports.some(r =>
        ["arr_berth","arr_anchor"].includes(r.type) &&
        r.ship === ship && r.voy === v.no &&
        (() => { const d = new Date(r.ts); return d.getFullYear()===tYear && d.getMonth()===tMonth; })()
      );
      if (hasArrivalInMonth) return;

      // Skip if voyage has no departure at all
      const hasDeparture = reports.some(r =>
        ["departure","dep_anchor","shift_anchor"].includes(r.type) &&
        r.ship === ship && r.voy === v.no
      );
      if (!hasDeparture) return;

      // Get the latest noon report for this voyage (regardless of month)
      const noonReports = reports
        .filter(r => r.type === "noon" && r.ship === ship && r.voy === v.no)
        .filter(r => {
          const spd = parseFloat(r.avg_spd || r.spd);
          return !isNaN(spd) && spd > 0;
        })
        .sort((a, b) => new Date(b.ts) - new Date(a.ts));

      if (noonReports.length > 0) {
        const spd = parseFloat(noonReports[0].avg_spd || noonReports[0].spd);
        if (!isNaN(spd) && spd > 0) { sum += spd; count++; }
      }
    });

    AvgSpeedByShip[ship] = count > 0 ? (sum / count).toFixed(2) : null;
  });

  // Calculate AVG Speed per ship for PREVIOUS month
  const AvgSpeedPrevByShip = {};
  SHIPS.forEach(ship => {
    let sum = 0, count = 0;
    const tYear = fYear ? Number(fYear) : new Date().getFullYear();
    const tMonth = fMonth !== "" ? Number(fMonth) : new Date().getMonth();
    const prevMonth = tMonth - 1;
    const prevYear = prevMonth < 0 ? tYear - 1 : tYear;
    const prevMonthIdx = prevMonth < 0 ? 11 : prevMonth;
    const shipVoys = voys.filter(v => v.ship === ship);

    // 1. Arrival reports in previous month
    reports
      .filter(r => ["arr_berth","arr_anchor"].includes(r.type))
      .filter(r => r.ship === ship)
      .filter(r => { const d = new Date(r.ts); return d.getFullYear() === prevYear && d.getMonth() === prevMonthIdx; })
      .forEach(r => {
        const spd = parseFloat(r.avg_spd || r.spd);
        if (!isNaN(spd) && spd > 0) { sum += spd; count++; }
      });

    // 2. Voyages still sailing in previous month - use speed from this month 1st
    shipVoys.forEach(v => {
      const hasArrivalInPrevMonth = reports.some(r =>
        ["arr_berth","arr_anchor"].includes(r.type) &&
        r.ship === ship && r.voy === v.no &&
        (() => { const d = new Date(r.ts); return d.getFullYear()===prevYear && d.getMonth()===prevMonthIdx; })()
      );
      if (hasArrivalInPrevMonth) return;

      const hasNoonInPrevMonth = reports.some(r =>
        r.type === "noon" && r.ship === ship && r.voy === v.no &&
        (() => { const d = new Date(r.ts); return d.getFullYear()===prevYear && d.getMonth()===prevMonthIdx; })()
      );
      if (!hasNoonInPrevMonth) return;

      // Try Arrival on 1st of this month, before 12:00
      const arrBeforeNoon = getFirstArrivalBeforeNoon(ship, v.no, tYear, tMonth, 1);
      if (arrBeforeNoon) {
        const spd = parseFloat(arrBeforeNoon.avg_spd || arrBeforeNoon.spd);
        if (!isNaN(spd) && spd > 0) { sum += spd; count++; }
        return;
      }

      // Fallback: Noon Report on 1st of this month
      const noonOn1st = getFirstNoonOnDate(ship, v.no, tYear, tMonth, 1);
      if (noonOn1st) {
        const spd = parseFloat(noonOn1st.avg_spd || noonOn1st.spd);
        if (!isNaN(spd) && spd > 0) { sum += spd; count++; }
      }
    });

    AvgSpeedPrevByShip[ship] = count > 0 ? (sum / count).toFixed(2) : null;
  });

  const resetFilters = () => { 
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    setFYear(String(currentYear)); 
    setFMonth(String(currentMonth)); 
  };
  const activeCount = [fYear, fMonth].filter(x=>x!=="").length;
   // ============================================================
// FUNGSI DOWNLOAD EXCEL
// ============================================================
const handleDownloadExcel = async () => {
  const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const tYear = Number(fYear) || new Date().getFullYear();
  const tMonth = fMonth !== "" ? Number(fMonth) : new Date().getMonth();
  const prevMonth = tMonth - 1 < 0 ? 11 : tMonth - 1;
  const curLabel = MONTHS_ID[tMonth];
  const prevLabel = MONTHS_ID[prevMonth];

  // SHEET 1: VESSEL ACTIVITY
  const activityHeaders = [
    "No", "Nama Kapal",
    "Sailing (Hari)", "Anchorage (Hari)", "At Port (Hari)", "Downtime (Hari)", "Total (Hari)", "Laut (NM)",
    `ME ${prevLabel}`, `AE at Sea ${prevLabel}`, `AE at Port ${prevLabel}`,
    `ME ${curLabel}`, `AE at Sea ${curLabel}`, `AE at Port ${curLabel}`,
    `Avg/Miles ${curLabel}`, `Avg/Hari ${curLabel}`, "Target Parameter ME/Day", "Realisasi Pemakaian ME/Day",`AVG Speed ${prevLabel}`, `AVG Speed ${curLabel}`
  ];
  
  const activityData = [activityHeaders];
  // RUMUS TABE VESSEL ACTIVITY
  SHIPS.forEach((ship, idx) => {
    activityData.push([
      idx + 1,
      ship,
      SailingDaysByShip[ship] !== null ? SailingDaysByShip[ship].toFixed(2) : "",
      (AnchorageDaysByShip[ship] || 0).toFixed(2),
      AtPortDaysByShip[ship] !== null ? AtPortDaysByShip[ship].toFixed(2) : "",
      (DowntimeDaysByShip[ship] || 0).toFixed(2),
      daysInSelectedMonth,
      (TotalDistanceByShip[ship] || 0).toFixed(1),
      "",
      "",
      "",
      "",
      "",
      "",  // 6 kolom BBM (kosong)
      "",
      "",
      (FUEL_PARAMS[ship]?.me ? (FUEL_PARAMS[ship].me * 24).toFixed(2) : ""),
      "",          // 4 kolom Performance (kosong)
      AvgSpeedPrevByShip[ship] || "",
      AvgSpeedByShip[ship] || ""
    ]);
  });
  
  const sailVals = Object.values(SailingDaysByShip).filter(v => v !== null);
  const atPortVals = Object.values(AtPortDaysByShip).filter(v => v !== null);
  activityData.push([
    "TOTAL", "",
    sailVals.length > 0 ? sailVals.reduce((s,v)=>s+v,0).toFixed(2) : "",
    Object.values(AnchorageDaysByShip).reduce((s,h)=>s+h,0).toFixed(2),
    atPortVals.length > 0 ? atPortVals.reduce((s,v)=>s+v,0).toFixed(2) : "",
    Object.values(DowntimeDaysByShip).reduce((s,h)=>s+h,0).toFixed(2),
    daysInSelectedMonth,
    Object.values(TotalDistanceByShip).reduce((s,h)=>s+h,0).toFixed(1),
    "", "", "", "", "", "",  // 6 BBM kosong
    "", "", "", "",          // 4 Performance kosong
    "", ""                   // AVG Speed total kosong
  ]);

  // SHEET 2: ANCHORAGE TIME
  const anchHeaders = ["Nama Kapal", "Bulan", "Tahun", "Anchorage (EOSV Arrival)", "Berthing (FWE)", "Anchorage Time (hari)"];
  const anchData = [anchHeaders];
  const anchEntries = getAnchorageTimeEntries(reports);
  anchEntries.forEach(e => {
    const segs = splitByMonth(e.t0, e.t1);
    segs.forEach(seg => {
      const yearOk = !fYear || seg.year === Number(fYear);
      const monthOk = !fMonth || seg.month === Number(fMonth);
      if (yearOk && monthOk) {
        anchData.push([e.ship, MONTHS_ID[seg.month], seg.year, fmtDateForCSV(seg.start), fmtDateForCSV(seg.end), (seg.hours/24).toFixed(2)]);
      }
    });
  });

  // SHEET 3: BERTHING TIME
  const berthHeaders = ["Nama Kapal", "Bulan", "Tahun", "Berthing (FWE)", "Departure (BOSV)", "Berthing Time (hari)"];
  const berthData = [berthHeaders];
  const berthEntries = getBerthingTimeEntries(reports);
  berthEntries.forEach(e => {
    const segs = splitByMonth(e.t0, e.t1);
    segs.forEach(seg => {
      const yearOk = !fYear || seg.year === Number(fYear);
      const monthOk = !fMonth || seg.month === Number(fMonth);
      if (yearOk && monthOk) {
        berthData.push([e.ship, MONTHS_ID[seg.month], seg.year, fmtDateForCSV(seg.start), fmtDateForCSV(seg.end), (seg.hours/24).toFixed(2)]);
      }
    });
  });

  // SHEET 4: DOWNTIME REPORT
  const dtHeaders = ["Nama Kapal", "Start Downtime", "Finish Downtime", "Duration (days)", "Reason", "Category"];
  const dtData = [dtHeaders];
  const dtEntries = getAllDowntimeEntries(reports);
  dtEntries.forEach(e => {
    const segs = splitByMonth(e.t0, e.t1);
    segs.forEach(seg => {
      const yearOk = !fYear || seg.year === Number(fYear);
      const monthOk = !fMonth || seg.month === Number(fMonth);
      if (yearOk && monthOk) {
        dtData.push([e.ship, fmtDateForCSV(seg.start), fmtDateForCSV(seg.end), (seg.hours/24).toFixed(2), e.reason || "", e.category || ""]);
      }
    });
  });

  // DOWNLOAD

  // SHEET 5: RINCIAN TOTAL DISTANCE
  const distDetailHeaders = ["Nama Kapal", "Voy", "Tanggal", "Jenis Laporan", "Distance (NM)"];
  const distDetailData = [distDetailHeaders];
  const distEntries = getTotalDistanceEntries(reports);
  distEntries.forEach(e => {
    const d = new Date(e.ts);
    const yearOk = !fYear || d.getFullYear() === Number(fYear);
    const monthOk = !fMonth || d.getMonth() === Number(fMonth);
    if (yearOk && monthOk) {
      distDetailData.push([e.ship, e.voy, fmtDateForCSV(e.ts), e.type === "arr_berth" ? "Arrival Berthing" : "Arrival Anchorage", e.dist.toFixed(1)]);
    }
  });
  const sheets = [
    { name: "Vessel Activity", data: activityData, widths: [5, 20, 14, 14, 14, 14, 10, 12, 12, 14, 14, 12, 14, 14, 14, 12, 12, 12, 12, 12] },
    { name: "Anchorage Time", data: anchData, widths: [18, 12, 8, 22, 22, 16] },
    { name: "Berthing Time", data: berthData, widths: [18, 12, 8, 22, 22, 16] },
    { name: "Downtime Report", data: dtData, widths: [18, 20, 20, 14, 30, 18] },
    { name: "Rincian Total Distance", data: distDetailData, widths: [18, 10, 20, 22, 16] },
  ];
  
  await downloadMultiSheetExcel(sheets, `MMM_Report_${tYear}_${curLabel}.xlsx`);
};

  return (
    <div>
      <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Vessel Report</div>
      <div style={{ display:"flex", gap:10, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <select style={{ ...ss.sel, width:"auto", minWidth:120 }} value={fYear} onChange={e=>setFYear(e.target.value)}>
          <option value="">Semua Tahun</option>
          {years.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
        <select style={{ ...ss.sel, width:"auto", minWidth:150 }} value={fMonth} onChange={e=>setFMonth(e.target.value)}>
          <option value="">Semua Bulan</option>
          {MONTHS.map((m,idx)=><option key={m} value={idx}>{m}</option>)}
        </select>
        {activeCount > 0 ? (
          <button style={ss.btnG} onClick={resetFilters}>✕ Reset Filter ({activeCount})</button>
        ) : null}
        <button 
         style={{ ...ss.btn, background:"linear-gradient(135deg,#25D366,#128C7E)", padding:"6px 16px", marginLeft:"auto" }}
        onClick={handleDownloadExcel}>
        ⬇️ Download Excel
        </button>
        </div>




      <div style={{ borderRadius:12, border:`1px solid ${C.border}`, overflow:"auto", marginBottom:12 }}>
        <table style={{ borderCollapse:"collapse", width:"100%", tableLayout:"auto", minWidth:1800, fontSize:11 }}>
          <thead>
            <tr>
              <th colSpan={20} style={{ background:`${C.muted}18`, color:C.muted, fontSize:12, fontWeight:800, letterSpacing:"0.04em", border:`1px solid ${C.border}` }}>
                {fYear ? fYear : new Date().getFullYear()}
              </th>
            </tr>
            <tr>
              <th colSpan={20} style={{ background:`${C.muted}18`, color:C.muted, fontSize:12, fontWeight:800, letterSpacing:"0.04em", border:`1px solid ${C.border}` }}>
                {curLabel}
              </th>
            </tr>
            <tr>
              <th rowSpan={2} style={{ border:`1px solid ${C.border}`, ...ss.th, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", padding:"8px 10px", textAlign:"center" }}>No</th>
              <th rowSpan={2} style={{ border:`1px solid ${C.border}`, ...ss.th, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", padding:"8px 10px", textAlign:"center" }}>Nama Kapal</th>
              <th colSpan={6} style={{ border:`1px solid ${C.border}`, ...ss.th, fontSize:10, letterSpacing:"0.06em", padding:"8px 10px", textAlign:"center" }}>Activity</th>
              <th colSpan={10} style={{ border:`1px solid ${C.border}`, ...ss.th, fontSize:10, letterSpacing:"0.06em", padding:"8px 10px", textAlign:"center" }}>Konsumsi BBM (Litre)</th>
              <th colSpan={2} style={{ border:`1px solid ${C.border}`, ...ss.th, fontSize:10, letterSpacing:"0.06em", padding:"8px 10px", textAlign:"center" }}>Performance</th>
            </tr>
            <tr>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>Sailing (Hari)</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>Anchorage (Hari)</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>At Port (Hari)</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>Downtime (Hari)</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>Total (Hari)</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>Mile Laut (NM)</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>ME ({prevLabel})</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>AE at Sea ({prevLabel})</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>AE at Port ({prevLabel})</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>ME ({curLabel})</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>AE at Sea ({curLabel})</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>AE at Port ({curLabel})</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>Avg/Miles {curLabel}</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>Avg/Hari {curLabel}</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>Target Parameter ME/Day</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>Realisasi Pemakaian ME/Day</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>AVG Speed {prevLabel}</th>
              <th style={{ border:"1px solid rgba(40,110,170,0.5)", ...ss.th, padding:"7px 9px", textTransform:"uppercase", letterSpacing:"0.05em", fontSize:9, textAlign:"center" }}>AVG Speed {curLabel}</th>
            </tr>
          </thead>
          <tbody>
            {SHIPS.map((ship, idx) => (
              <tr key={ship}>
                <td style={{ ...ss.td(idx%2), fontWeight:600, whiteSpace:"nowrap", textAlign:"center", border:"1px solid rgba(40,110,170,0.5)" }}>{idx+1}</td>
                <td style={{ ...ss.td(idx%2), fontWeight:600, whiteSpace:"nowrap", minWidth:130, textAlign:"left", border:"1px solid rgba(40,110,170,0.5)" }}>{ship}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{(SailingDaysByShip[ship] !== null ? SailingDaysByShip[ship].toFixed(2) : "—")}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{(AnchorageDaysByShip[ship] || 0).toFixed(2)}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{(AtPortDaysByShip[ship] !== null ? AtPortDaysByShip[ship].toFixed(2) : "—")}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{(DowntimeDaysByShip[ship] || 0).toFixed(2)}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{daysInSelectedMonth}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{(TotalDistanceByShip[ship] || 0).toFixed(1)}</td>
                
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{ConsMeByShip[ship] != null ? ConsMeByShip[ship].toFixed(2) : "—"}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{PrevSailingDaysByShip[ship] !== null && FUEL_PARAMS[ship]?.ae ? (PrevSailingDaysByShip[ship] * FUEL_PARAMS[ship].ae).toFixed(2) : "—"}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{ConsMeAePrevByShip[ship] != null && PrevSailingDaysByShip[ship] !== null && FUEL_PARAMS[ship]?.ae ? (ConsMeAePrevByShip[ship] - (PrevSailingDaysByShip[ship] * FUEL_PARAMS[ship].ae)).toFixed(2) : "—"}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{ConsMeCurByShip[ship] != null ? ConsMeCurByShip[ship].toFixed(2) : "—"}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{SailingDaysByShip[ship] !== null && FUEL_PARAMS[ship]?.ae ? (SailingDaysByShip[ship] * FUEL_PARAMS[ship].ae).toFixed(2) : "—"}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{ConsMeAeCurByShip[ship] != null && SailingDaysByShip[ship] !== null && FUEL_PARAMS[ship]?.ae ? (ConsMeAeCurByShip[ship] - (SailingDaysByShip[ship] * FUEL_PARAMS[ship].ae)).toFixed(2) : "—"}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{ConsMeCurByShip[ship] != null && TotalDistanceByShip[ship] ? (ConsMeCurByShip[ship] / TotalDistanceByShip[ship]).toFixed(4) : "—"}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{ConsMeCurByShip[ship] != null && SailingDaysByShip[ship] !== null ? (ConsMeCurByShip[ship] / SailingDaysByShip[ship]).toFixed(4) : "—"}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{(FUEL_PARAMS[ship]?.me ? (FUEL_PARAMS[ship].me * 24).toFixed(2) : "—")}</td>
                
               
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{"—"}</td>
                
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{AvgSpeedPrevByShip[ship] || "—"}</td>
                <td style={{ ...ss.td(idx%2), border:"1px solid rgba(45,120,185,0.28)", textAlign:"center" }}>{AvgSpeedByShip[ship] || "—"}</td> 
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background:`${C.muted}18`, fontWeight:800, letterSpacing:"0.06em", fontSize:10, color:C.muted }}>
              <td style={{ textAlign:"center", border:`1px solid ${C.border}`, padding:"9px 11px", background:"rgba(255,255,255,0.015)" }}>TOTAL</td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}></td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}>{(() => { const vals = Object.values(SailingDaysByShip).filter(v => v !== null); return vals.length > 0 ? vals.reduce((s,v)=>s+v,0).toFixed(2) : "—"; })()}</td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}>{Object.values(AnchorageDaysByShip).reduce((s,h)=>s+h,0).toFixed(2)}</td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}>{(() => { const vals = Object.values(AtPortDaysByShip).filter(v => v !== null); return vals.length > 0 ? vals.reduce((s,v)=>s+v,0).toFixed(2) : "—"; })()}</td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}>{Object.values(DowntimeDaysByShip).reduce((s,h)=>s+h,0).toFixed(2)}</td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}>{daysInSelectedMonth}</td>
                <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}>{Object.values(TotalDistanceByShip).reduce((s,h)=>s+h,0).toFixed(1)}</td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}></td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}></td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}></td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}></td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}></td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}></td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}></td>
              <td style={{ padding:"9px 11px", border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.015)", textAlign:"center" }}></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div style={{ fontSize:10, color:C.muted, marginTop:8 }}>
        * Default: {new Date().getFullYear()} / {MONTHS[new Date().getMonth()]}. Kolom At Port & Sailing membutuhkan data Running Hours ME per kapal. Kolom Jarak Laut = Total Distance. AVG Speed menggunakan data dari Arrival Report.
      </div>
      
    </div>
  );
}

function ReportLog({ reports, onView, user }) {
  const [fShip, setFShip] = useState("");
  const [fYear, setFYear] = useState("");
  const [fType, setFType] = useState("");

  const years = Array.from(new Set(reports.map(r => new Date(r.ts).getFullYear()))).sort((a,b)=>b-a);

  const sorted = [...reports]
    .filter(r => !fShip || r.ship === fShip)
    .filter(r => !fYear || new Date(r.ts).getFullYear() === Number(fYear))
    .filter(r => !fType || r.type === fType)
    .sort((a,b) => new Date(b.ts)-new Date(a.ts));

  const resetFilters = () => { setFShip(""); setFYear(""); setFType(""); };
  const activeCount = [fShip, fYear, fType].filter(Boolean).length;

  return (
    <div>
      <div style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>Semua Laporan</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>Riwayat seluruh laporan kapal</div>

      <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        {!user?.ship && (
          <select style={{ ...ss.sel, width:"auto", minWidth:160 }} value={fShip} onChange={e=>setFShip(e.target.value)}>
            <option value="">Semua Kapal</option>
            {SHIPS.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <select style={{ ...ss.sel, width:"auto", minWidth:120 }} value={fYear} onChange={e=>setFYear(e.target.value)}>
          <option value="">Semua Tahun</option>
          {years.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
        <select style={{ ...ss.sel, width:"auto", minWidth:180 }} value={fType} onChange={e=>setFType(e.target.value)}>
          <option value="">Semua Jenis Laporan</option>
          {RT.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        {activeCount > 0 ? (
          <button style={ss.btnG} onClick={resetFilters}>✕ Reset Filter ({activeCount})</button>
        ) : null}
        <div style={{ fontSize:11, color:C.muted, marginLeft:"auto" }}>{sorted.length} laporan</div>
      </div>

      <div style={{ borderRadius:12, border:`1px solid ${C.border}`, overflow:"auto" }}>
        <table className="voyage-main-table" style={{ ...ss.tbl, minWidth:560 }}>
          <thead><tr>{["Waktu","Kapal","Voyage","Tipe","Port","Master",""].map(h=><th key={h} style={ss.th}>{h}</th>)}</tr></thead>
          <tbody>
            {sorted.length===0 && <tr><td colSpan={7} style={{ ...ss.td(false), textAlign:"center", color:C.muted, padding:28 }}>Tidak ada laporan</td></tr>}
            {sorted.map((r,i) => {
              const rt = RT.find(t=>t.id===r.type);
              return (
                <tr key={r.id}>
                  <td style={ss.td(i%2)}>{fmtDT(r.ts)}</td>
                  <td style={{ ...ss.td(i%2), fontWeight:600 }}>MV {r.ship}</td>
                  <td style={{ ...ss.td(i%2), color:C.accent }}>{r.voy}</td>
                  <td style={ss.td(i%2)}>{rt?.label||r.type}</td>
                  <td style={ss.td(i%2)}>{r.port||"-"}</td>
                  <td style={ss.td(i%2)}>{r.master||"-"}</td>
                  <td style={ss.td(i%2)}><button style={ss.btnSm(true)} onClick={()=>onView(r)}>Lihat</button></td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background:`${C.muted}18`, fontWeight:800, letterSpacing:"0.06em", fontSize:10, color:C.muted }}>
              <td style={{ textAlign:"center", border:`1px solid ${C.border}`, padding:"7px 9px" }}>TOTAL</td>
              <td style={{ border:`1px solid ${C.border}`, padding:"7px 9px" }}></td>
              <td style={ss.td(1)}></td>
              <td style={ss.td(1)}></td>
              <td style={ss.td(1)}></td>
              <td style={ss.td(1)}></td>
              <td style={ss.td(1)}></td>
              <td style={ss.td(1)}></td>
              <td style={ss.td(1)}></td>
              <td style={ss.td(1)}></td>
              <td style={ss.td(1)}></td>
              <td style={ss.td(1)}></td>
              <td style={ss.td(1)}></td>
              <td style={ss.td(1)}></td>
              <td style={ss.td(1)}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// --- MODAL --------------------------------------------------------------------
function Modal({ report, onClose, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  if (!report) return null;
  const rt  = RT.find(t => t.id === report.type);
  const msg = buildWA(report);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.9)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div style={{ ...ss.card(), width:"100%", maxWidth:520, maxHeight:"85vh", overflowY:"auto", marginBottom:0 }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, color:"whitesmoke"}}>
          <div><div style={{ fontSize:14, fontWeight:700 }}>{rt?.label}</div><div style={{ fontSize:10, color:"whitesmoke" }}>MV {report.ship} — {report.voy}</div></div>
          <button style={{ ...ss.btnG, color:C.red, borderColor:C.red+"50" }} onClick={onClose}>✕ Tutup</button>
        </div>
        <div style={{ fontSize:11, fontWeight:700, color:"#25D366", marginBottom:8 }}>📱 Preview Dan Format WhatsApp</div>
        <div style={ss.wa}>{msg}</div>

        {!confirming ? (
          <div style={{ marginTop:12, display:"flex", gap:10, flexWrap:"wrap" }}>
            <button style={{ ...ss.btn, background:"linear-gradient(135deg,#25D366,#128C7E)" }}
              onClick={() => window.open("https://wa.me/?text="+encodeURIComponent(msg),"_blank")}>
              📤 Kirim ke Grup WA
            </button>
            <button style={ss.btn} onClick={onEdit}>✏️ Edit Laporan</button>
            <button style={{ ...ss.btnG, color:C.red, borderColor:C.red+"50" }} onClick={() => setConfirming(true)}>
              🗑️ Hapus Laporan
            </button>
          </div>
        ) : (
          <div style={{ marginTop:12, padding:12, background:C.red+"15", border:`1px solid ${C.red}40`, borderRadius:10 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.red, marginBottom:8 }}>⚠️ Yakin hapus laporan ini?</div>
            <div style={{ fontSize:11, color:C.muted, marginBottom:10 }}>Tindakan ini tidak dapat dibatalkan.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ ...ss.btn, background:C.red }} onClick={() => onDelete(report.id)}>Ya, Hapus</button>
              <button style={ss.btnG} onClick={() => setConfirming(false)}>Batal</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- MANAGEMENT REPORT ==========================================================
// Anchorage time: arr_anchor SBE/EOSV -> shift_berth FWE (same voyage)
function getAnchorageTimeEntries(reports) {
  const voys = computeVoyages(reports);
  const entries = [];
  voys.forEach(v => {
    const arrAnc = (v.list||[]).find(r => r.type === "arr_anchor");
    if (!arrAnc) return;
    const t0 = arrAnc[evKey("SBE/EOSV")] || arrAnc.ts;
    if (!t0) return;

    const shiftBerth = (v.list||[]).find(r => r.type === "shift_berth");
    // If shift_berth with FWE exists, anchorage has ended at that point.
    // Otherwise the vessel is STILL at anchorage — use "now" as the open end,
    // so month-by-month splitting still counts the ongoing duration correctly.
    const t1 = (shiftBerth && (shiftBerth[evKey("FWE")] || shiftBerth.ts)) || new Date().toISOString();

    entries.push({ ship: v.ship, voy: v.no, t0, t1 });
  });
  return entries;
}

// Berthing time: shift_berth FWE (or arr_berth FWE) -> BOSV of NEXT voyage (same ship)
function getBerthingTimeEntries(reports) {
  const voys = computeVoyages(reports);
  const entries = [];
  const byShip = {};
  voys.forEach(v => { if (!byShip[v.ship]) byShip[v.ship]=[]; byShip[v.ship].push(v); });
  Object.values(byShip).forEach(shipVoys => {
    shipVoys.sort((a,b)=>new Date(a.dep?.ts||a.list[0]?.ts||0)-new Date(b.dep?.ts||b.list[0]?.ts||0));
    shipVoys.forEach((v, idx) => {
      const shiftBerth = (v.list||[]).find(r => r.type === "shift_berth");
      const arrBerth   = (v.list||[]).find(r => r.type === "arr_berth");
      const berthReport = shiftBerth || arrBerth;
      if (!berthReport) return;
      const t0 = berthReport[evKey("FWE")] || berthReport.ts;
      if (!t0) return;

      const nextV = shipVoys[idx+1];
      // If the next voyage's BOSV exists, berthing ended there.
      // Otherwise the vessel is STILL at berth (next voyage hasn't departed
      // yet, or doesn't exist) — use "now" as the open end so ongoing
      // berthing time still counts correctly when split by month.
      const t1 = nextV?.bosv || new Date().toISOString();

      entries.push({ ship: v.ship, voy: v.no, t0, t1 });
    });
  });
  return entries;
}

// Total distance: sum of ttl_dist from arr_berth + arr_anchor reports
function getTotalDistanceEntries(reports) {
  return reports
    .filter(r => ["arr_berth","arr_anchor"].includes(r.type) && r.ttl_dist)
    .map(r => ({ ship: r.ship, voy: r.voy, ts: r.ts, dist: parseFloat(r.ttl_dist) || 0, type: r.type }));
}

function getAllDowntimeEntries(reports) {
  const entries = [];
  const voys = computeVoyages(reports);

  reports.filter(r => r.type === "downtime" && r.t0 && r.t1).forEach(r => {
    entries.push({
      ship: r.ship,
      t0: r.t0,
      t1: r.t1,
      durationH: diffH(r.t0, r.t1),
      reason: r.desc || r.cat,
      category: r.cat || "-",
    });
  });

  voys.forEach(v => {
    const shelterArrs = (v.list || []).filter(r => r.type === "shelter_arr");
    const shelterDeps = (v.list || []).filter(r => r.type === "shelter_dep");
    shelterArrs.forEach(sa => {
      const sd = shelterDeps[0];
      const t0 = sa[evKey("SBE/EOSV")] || sa.ts;
      const t1 = sd ? (sd[evKey("BOSV")] || sd.ts) : null;
      if (t0 && t1) {
        entries.push({
          ship: v.ship,
          t0, t1,
          durationH: diffH(t0, t1),
          reason: "Shelter — Weather Stop",
          category: "Weather Delay",
        });
      }
    });
  });

  return entries.sort((a,b) => new Date(b.t0) - new Date(a.t0));
}

function downloadDowntimeCSV(rows, filename) {
  const DELIM = ";";
  const header = ["Vessel","Start Downtime","Finish Downtime","Duration (days)","Reason Downtime","Category"];
  const csvRows = [header.join(DELIM)];
  rows.forEach(r => {
    const line = [
      r.ship,
      fmtDateForCSV(r.t0),   // changed from fmtDT
      fmtDateForCSV(r.t1),   // changed from fmtDT
      (r.durationH/24).toFixed(2),
      `"${(r.reason||"").replace(/"/g,'""')}"`,
      r.category,
    ].join(DELIM);
    csvRows.push(line);
  });
  downloadCSVRaw(csvRows.join("\n"), filename);
}

// Generic CSV downloader: headers is an array of column names, rows is an
// array of objects, rowMapper converts each row object into an array of
// cell values matching the headers order.
function downloadCSV(headers, rows, rowMapper, filename) {
  // Use semicolon as the delimiter — Excel on Indonesian/European locale
  // systems expects ";" as the CSV separator (since "," is the decimal
  // separator there), otherwise it renders the whole file as one column.
  const DELIM = ";";
  const csvRows = [headers.join(DELIM)];
  rows.forEach(r => {
    const cells = rowMapper(r).map(v => {
      const s = String(v ?? "");
      return /["\n;]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
    });
    csvRows.push(cells.join(DELIM));
  });
  downloadCSVRaw(csvRows.join("\n"), filename);
}

function downloadCSVRaw(csvContent, filename) {
  // "sep=;" tells Excel Desktop to use semicolon as the delimiter.
  // BOM (\uFEFF) ensures UTF-8 encoding is detected correctly on Windows.
  const BOM = "\uFEFF";
  const SEP = "sep=;\n";
  const blob = new Blob([BOM + SEP + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function RunningHoursInput({ rhKey, current, onSave }) {
  const meRef = useRef(null);
  const aeRef = useRef(null);

  // Reset input display when switching ship/year/month (rhKey changes)
  useEffect(() => {
    if (meRef.current) meRef.current.value = current.me || "";
    if (aeRef.current) aeRef.current.value = current.ae || "";
  }, [rhKey]);

  return (
    <div>
      <div className="voyage-row2" style={ss.row2}>
        <div style={ss.fg}>
          <label style={ss.lbl}>Running Hours ME</label>
          <input ref={meRef} style={ss.inp} type="text" placeholder="0" defaultValue={current.me}/>
        </div>
        <div style={ss.fg}>
          <label style={ss.lbl}>Running Hours AE</label>
          <input ref={aeRef} style={ss.inp} type="text" placeholder="0" defaultValue={current.ae}/>
        </div>
      </div>
      <button style={ss.btn} onClick={() => onSave(meRef.current.value, aeRef.current.value)}>
        💾 Simpan Running Hours
      </button>
    </div>
  );
}

// --- RH & CONSUMPTION PAGE -----------------------------------------------------
function RHConsPage({ runningHours, setRunningHours, user, consMe, setConsMe }) {
  const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const [rhShip, setRhShip] = useState(user?.ship || SHIPS[0]);
  const [rhYear, setRhYear] = useState(new Date().getFullYear());
  const [rhMonth, setRhMonth] = useState(new Date().getMonth());
  const [rhSaved, setRhSaved] = useState(false);
  const [rhSearch, setRhSearch] = useState("");
  const [rhSearchYear, setRhSearchYear] = useState("");
  const [rhSearchMonth, setRhSearchMonth] = useState("");
  const [editingRh, setEditingRh] = useState(null);
  const editMeRef = useRef(null);
  const editAeRef = useRef(null);
  const [showRhForm, setShowRhForm] = useState(false);

  // Cons ME state
  const [consMeShip, setConsMeShip] = useState(user?.ship || SHIPS[0]);
  const [consMeYear, setConsMeYear] = useState(new Date().getFullYear());
  const [consMeMonth, setConsMeMonth] = useState(new Date().getMonth());
  const [consMeSaved, setConsMeSaved] = useState(false);
  const [consMeSearch, setConsMeSearch] = useState("");
  const [consMeSearchYear, setConsMeSearchYear] = useState("");
  const [consMeSearchMonth, setConsMeSearchMonth] = useState("");
  const [editingConsMe, setEditingConsMe] = useState(null);
  const editConsMeRef = useRef(null);
  const editConsAeRef = useRef(null);
  const [showConsMeForm, setShowConsMeForm] = useState(false);

  // Load cons_me data on mount
  useEffect(() => {
    loadConsMe();
  }, []);

  const loadConsMe = async () => {
    try {
      console.log("Loading cons_me data...");
      const { data, error } = await supabase.from('cons_me').select('*');
      console.log("cons_me query result:", { data, error });
      if (error) throw error;
      const map = {};
      (data || []).forEach(row => {
        map[`${row.ship}|${row.year}|${row.month}`] = { cons_me: row.cons_me ?? "", cons_ae: row.cons_ae ?? "" };
      });
      console.log("cons_me map built:", map);
      setConsMe(map);
    } catch (err) { console.error("Error loading cons_me:", err); }
  };

  const handleUpdateRh = async (key) => {
    const me = editMeRef.current?.value;
    const ae = editAeRef.current?.value;
    const [ship, year, month] = key.split("|");
    try {
      const { error } = await supabase.from('running_hours').upsert(
        { ship, year: Number(year), month: Number(month), me_hours: me === "" ? null : Number(me), ae_hours: ae === "" ? null : Number(ae) },
        { onConflict: 'ship,year,month' }
      );
      if (error) throw error;
      setRunningHours(prev => ({ ...prev, [key]: { me, ae } }));
      setEditingRh(null);
    } catch (err) { alert("Gagal update: " + err.message); }
  };

  const handleDeleteRh = async (key) => {
    const [ship, year, month] = key.split("|");
    try {
      const { error } = await supabase.from('running_hours').delete()
        .eq('ship', ship).eq('year', Number(year)).eq('month', Number(month));
      if (error) throw error;
      setRunningHours(prev => { const next = {...prev}; delete next[key]; return next; });
    } catch (err) { alert("Gagal hapus: " + err.message); }
  };

  // Cons ME handlers
  const handleSaveConsMe = async (consMeVal, consAeVal) => {
    const key = `${consMeShip}|${consMeYear}|${consMeMonth}`;
    try {
      // Check if exists first
      const { data: existing, error: selectError } = await supabase
        .from('cons_me')
        .select('id')
        .eq('ship', consMeShip)
        .eq('year', consMeYear)
        .eq('month', consMeMonth)
        .maybeSingle();

      if (selectError) {
        console.error("Error finding cons_me:", selectError);
        alert("Error: " + selectError.message);
        return;
      }

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('cons_me')
          .update({ cons_me: consMeVal === "" ? null : Number(consMeVal), cons_ae: consAeVal === "" ? null : Number(consAeVal) })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('cons_me')
          .insert({ ship: consMeShip, year: consMeYear, month: consMeMonth, cons_me: consMeVal === "" ? null : Number(consMeVal), cons_ae: consAeVal === "" ? null : Number(consAeVal) });
        if (error) throw error;
      }
      setConsMe(prev => ({ ...prev, [key]: { cons_me: consMeVal, cons_ae: consAeVal } }));
      setConsMeSaved(true);
      setTimeout(() => setConsMeSaved(false), 2000);
    } catch (err) { alert("Gagal menyimpan: " + err.message); }
  };

  const handleUpdateConsMe = async (key) => {
    const val = editConsMeRef.current?.value;
    const aeVal = editConsAeRef.current?.value;
    const [ship, year, month] = key.split("|");
    try {
      const { data: existing, error: selectError } = await supabase
        .from('cons_me')
        .select('id')
        .eq('ship', ship)
        .eq('year', Number(year))
        .eq('month', Number(month))
        .maybeSingle();

      if (selectError) {
        console.error("Error finding cons_me:", selectError);
        alert("Error: " + selectError.message);
        return;
      }

      if (existing) {
        const { error } = await supabase
          .from('cons_me')
          .update({ cons_me: val === "" ? null : Number(val), cons_ae: aeVal === "" ? null : Number(aeVal) })
          .eq('id', existing.id);
        if (error) throw error;
      }
      setConsMe(prev => ({ ...prev, [key]: { cons_me: val, cons_ae: aeVal } }));
      setEditingConsMe(null);
    } catch (err) { alert("Gagal update: " + err.message); }
  };

  const handleDeleteConsMe = async (key) => {
    const [ship, year, month] = key.split("|");
    if (!window.confirm(`Hapus data Cons ME untuk ${ship} ${MONTHS[Number(month)]} ${year}?`)) return;
    try {
      console.log("Deleting cons_me:", { ship, year: Number(year), month: Number(month) });

      // Use maybeSingle() - returns null if no rows, fails if multiple rows
      const { data: existing, error: selectError } = await supabase
        .from('cons_me')
        .select('id, ship, year, month')
        .eq('ship', ship)
        .eq('year', Number(year))
        .eq('month', Number(month))
        .maybeSingle();

      console.log("Query result:", { existing, selectError });

      if (selectError) {
        console.error("Error finding cons_me:", selectError);
        alert("Error: " + selectError.message);
        return;
      }

      if (!existing) {
        console.log("No record found in DB, reloading...");
        await loadConsMe();
        return;
      }

      console.log("Deleting record with id:", existing.id);
      const { error: deleteError } = await supabase
        .from('cons_me')
        .delete()
        .eq('id', existing.id);

      console.log("Delete result:", { deleteError });

      if (deleteError) throw deleteError;

      // Reload from database to ensure UI matches database
      await loadConsMe();
    } catch (err) {
      console.error("Error deleting cons_me:", err);
      alert("Gagal hapus: " + err.message);
    }
  };

  return (
    <div>
      <div style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>RH & Cons ME</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>Running Hours & Konsumsi BBM per Kapal</div>

      {/* Data Table RH */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.accent }}>⏱️ Data Running Hours</div>
          <button style={{ ...ss.btn, padding:"6px 14px" }} onClick={() => { setShowRhForm(!showRhForm); setShowConsMeForm(false); }}>
            {showRhForm ? "✕ Tutup" : "+ Add RH"}
          </button>
        </div>

        {/* Input Form RH - collapsible */}
        {showRhForm && (
          <div style={ss.card()}>
            <div className="voyage-row3" style={ss.row3}>
              <div style={ss.fg}>
                <label style={ss.lbl}>Kapal</label>
                {user?.ship ? (
                  <div style={{ ...ss.sel, display:"flex", alignItems:"center", color:C.text, cursor:"default" }}>
                    🔒 {user.ship}
                  </div>
                ) : (
                  <select style={ss.sel} value={rhShip} onChange={e=>setRhShip(e.target.value)}>
                    {SHIPS.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
              <div style={ss.fg}>
                <label style={ss.lbl}>Tahun</label>
                <select style={ss.sel} value={rhYear} onChange={e=>setRhYear(Number(e.target.value))}>
                  {Array.from({length:6},(_,i)=>new Date().getFullYear()-3+i).map(y=><option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div style={ss.fg}>
                <label style={ss.lbl}>Bulan</label>
                <select style={ss.sel} value={rhMonth} onChange={e=>setRhMonth(Number(e.target.value))}>
                  {MONTHS.map((m,idx)=><option key={m} value={idx}>{m}</option>)}
                </select>
              </div>
            </div>
            <RunningHoursInput
              rhKey={`${rhShip}|${rhYear}|${rhMonth}`}
              current={runningHours[`${rhShip}|${rhYear}|${rhMonth}`] || { me:"", ae:"" }}
              onSave={async (me, ae) => {
                const rhKey = `${rhShip}|${rhYear}|${rhMonth}`;
                try {
                  const { error } = await supabase.from('running_hours').upsert(
                    { ship: rhShip, year: rhYear, month: rhMonth, me_hours: me === "" ? null : Number(me), ae_hours: ae === "" ? null : Number(ae) },
                    { onConflict: 'ship,year,month' }
                  );
                  if (error) throw error;
                  setRunningHours(prev => ({ ...prev, [rhKey]: { me, ae } }));
                  setRhSaved(true);
                  setTimeout(()=>setRhSaved(false), 2000);
                } catch (err) {
                  alert("Gagal menyimpan: " + err.message);
                }
              }}
            />
            {rhSaved && (
              <div style={{ fontSize:11, color:C.green, marginTop:8, fontWeight:600 }}>✓ Tersimpan</div>
            )}
          </div>
        )}

        {/* RH Table Section - always visible */}
        <div style={{ marginTop:16 }}>
          <div style={{ display:"flex", gap:10, marginBottom:10, flexWrap:"wrap" }}>
            <select style={{ ...ss.sel, width:"auto", minWidth:160 }} value={rhSearch} onChange={e=>setRhSearch(e.target.value)}>
              <option value="">Semua Kapal</option>
              {SHIPS.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <select style={{ ...ss.sel, width:"auto", minWidth:100 }} value={rhSearchYear} onChange={e=>setRhSearchYear(e.target.value)}>
              <option value="">Semua Tahun</option>
              {Array.from(new Set(Object.keys(runningHours).map(k=>k.split("|")[1]))).sort((a,b)=>b-a).map(y=><option key={y} value={y}>{y}</option>)}
            </select>
            <select style={{ ...ss.sel, width:"auto", minWidth:120 }} value={rhSearchMonth} onChange={e=>setRhSearchMonth(e.target.value)}>
              <option value="">Semua Bulan</option>
              {MONTHS.map((m,idx)=><option key={idx} value={idx}>{m}</option>)}
            </select>
            {(rhSearch || rhSearchYear || rhSearchMonth) && (
              <button style={ss.btnG} onClick={()=>{setRhSearch("");setRhSearchYear("");setRhSearchMonth("");}}>✕ Reset</button>
            )}
          </div>

          <div style={{ borderRadius:12, border:`1px solid ${C.border}`, overflow:"auto" }}>
            <table className="voyage-main-table" style={{ ...ss.tbl, minWidth:520 }}>
              <thead>
                <tr>{["Kapal","Tahun","Bulan","RH ME","RH AE","Aksi"].map(h=><th key={h} style={ss.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {(() => {
                  const filteredEntries = Object.entries(runningHours)
                    .filter(([k,v]) => v.me || v.ae)
                    .filter(([k,v]) => {
                      const [ship, year, month] = k.split("|");
                      if (user?.ship && ship !== user.ship) return false;
                      const matchShip = !rhSearch || ship.toLowerCase().includes(rhSearch.toLowerCase());
                      const matchYear = !rhSearchYear || year === rhSearchYear;
                      const matchMonth = !rhSearchMonth || month === String(rhSearchMonth);
                      return matchShip && matchYear && matchMonth;
                    })
                    .sort((a,b) => b[0].localeCompare(a[0]));

                  const displayEntries = filteredEntries.slice(0, 10);

                  if (filteredEntries.length === 0) {
                    return <tr><td colSpan={6} style={{ ...ss.td(false), textAlign:"center", color:C.muted, padding:24 }}>Tidak ada data Running Hours</td></tr>;
                  }

                  return displayEntries.map(([k,v],i) => {
                    const [ship, year, month] = k.split("|");
                    const isEditing = editingRh === k;
                    return (
                      <tr key={k}>
                        <td style={{ ...ss.td(i%2), fontWeight:600 }}>MV {ship}</td>
                        <td style={ss.td(i%2)}>{year}</td>
                        <td style={ss.td(i%2)}>{MONTHS[Number(month)]}</td>
                        {isEditing ? (
                          <>
                            <td style={ss.td(i%2)}>
                              <input style={{ ...ss.inp, padding:"4px 8px", width:80 }} type="text" defaultValue={v.me} ref={editMeRef}/>
                            </td>
                            <td style={ss.td(i%2)}>
                              <input style={{ ...ss.inp, padding:"4px 8px", width:80 }} type="text" defaultValue={v.ae} ref={editAeRef}/>
                            </td>
                            <td style={ss.td(i%2)}>
                              <button style={{ ...ss.btnSm(true), padding:"4px 8px" }} onClick={()=>handleUpdateRh(k)}>✓</button>
                              <button style={{ ...ss.btnSm(false), padding:"4px 8px", marginLeft:4 }} onClick={()=>setEditingRh(null)}>✕</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ ...ss.td(i%2), color:C.accent, fontWeight:600 }}>{v.me || "—"} jam</td>
                            <td style={{ ...ss.td(i%2), color:C.amber, fontWeight:600 }}>{v.ae || "—"} jam</td>
                            <td style={ss.td(i%2)}>
                              <button style={{ ...ss.btnSm(true), padding:"4px 8px" }} onClick={()=>{setEditingRh(k);editMeRef.current.value=v.me||"";editAeRef.current.value=v.ae||"";}}>✏️</button>
                              <button style={{ ...ss.btnG, padding:"4px 8px", marginLeft:4, color:C.red }} onClick={()=>handleDeleteRh(k)}>🗑️</button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
          {(() => {
            const totalFiltered = Object.entries(runningHours)
              .filter(([k,v]) => v.me || v.ae)
              .filter(([k,v]) => {
                const [ship, year, month] = k.split("|");
                const matchShip = !rhSearch || ship.toLowerCase().includes(rhSearch.toLowerCase());
                const matchYear = !rhSearchYear || year === rhSearchYear;
                const matchMonth = !rhSearchMonth || month === String(rhSearchMonth);
                return matchShip && matchYear && matchMonth;
              }).length;
            return totalFiltered > 10 ? (
              <div style={{ fontSize:10, color:C.muted, marginTop:6, textAlign:"center" }}>
                Menampilkan 10 dari {totalFiltered} data
              </div>
            ) : null;
          })()}
        </div>
      </div>

      {/* Data Table Cons ME */}
      <div style={{ marginTop:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.accent }}>⛽ Data Cons ME & AE</div>
          <button style={{ ...ss.btn, padding:"6px 14px" }} onClick={() => { setShowConsMeForm(!showConsMeForm); setShowRhForm(false); }}>
            {showConsMeForm ? "✕ Tutup" : "+ Add Cons ME & AE"}
          </button>
        </div>

        {/* Input Form Cons ME - collapsible */}
        {showConsMeForm && (
          <div style={ss.card()}>
            <div className="voyage-row3" style={ss.row3}>
              <div style={ss.fg}>
                <label style={ss.lbl}>Kapal</label>
                {user?.ship ? (
                  <div style={{ ...ss.sel, display:"flex", alignItems:"center", color:C.text, cursor:"default" }}>
                    🔒 {user.ship}
                  </div>
                ) : (
                  <select style={ss.sel} value={consMeShip} onChange={e=>setConsMeShip(e.target.value)}>
                    {SHIPS.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
              <div style={ss.fg}>
                <label style={ss.lbl}>Tahun</label>
                <select style={ss.sel} value={consMeYear} onChange={e=>setConsMeYear(Number(e.target.value))}>
                  {Array.from({length:6},(_,i)=>new Date().getFullYear()-3+i).map(y=><option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div style={ss.fg}>
                <label style={ss.lbl}>Bulan</label>
                <select style={ss.sel} value={consMeMonth} onChange={e=>setConsMeMonth(Number(e.target.value))}>
                  {MONTHS.map((m,idx)=><option key={m} value={idx}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="voyage-row2" style={ss.row2}>
              <div style={ss.fg}>
                <label style={ss.lbl}>Cons ME (KL)</label>
                <input
                  style={ss.inp}
                  type="text"
                  placeholder="0"
                  defaultValue={consMe[`${consMeShip}|${consMeYear}|${consMeMonth}`]?.cons_me || ""}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      const meVal = e.target.value;
                      const aeInput = e.target.parentElement.parentElement.querySelector('input.cons-ae-input');
                      handleSaveConsMe(meVal, aeInput?.value || "");
                    }
                  }}
                />
              </div>
              <div style={ss.fg}>
                <label style={ss.lbl}>Cons AE (KL)</label>
                <input
                  style={ss.inp}
                  className="cons-ae-input"
                  type="text"
                  placeholder="0"
                  defaultValue={consMe[`${consMeShip}|${consMeYear}|${consMeMonth}`]?.cons_ae || ""}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      const aeVal = e.target.value;
                      const meInput = e.target.parentElement.parentElement.querySelector('input');
                      handleSaveConsMe(meInput?.value || "", aeVal);
                    }
                  }}
                />
              </div>
              <div style={ss.fg}>
                <label style={ss.lbl}>&nbsp;</label>
                <button style={ss.btn} onClick={e => {
                  const inputs = e.target.parentElement.parentElement.querySelectorAll('input');
                  const meVal = inputs[0]?.value || "";
                  const aeVal = inputs[1]?.value || "";
                  handleSaveConsMe(meVal, aeVal);
                }}>
                  💾 Simpan
                </button>
              </div>
            </div>
            {consMeSaved && (
              <div style={{ fontSize:11, color:C.green, marginTop:8, fontWeight:600 }}>✓ Tersimpan</div>
            )}
          </div>
        )}

        {(
          <div style={{ marginTop:16 }}>
            <div style={{ display:"flex", gap:10, marginBottom:10, flexWrap:"wrap" }}>
              <select style={{ ...ss.sel, width:"auto", minWidth:160 }} value={consMeSearch} onChange={e=>setConsMeSearch(e.target.value)}>
                <option value="">Semua Kapal</option>
                {SHIPS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <select style={{ ...ss.sel, width:"auto", minWidth:100 }} value={consMeSearchYear} onChange={e=>setConsMeSearchYear(e.target.value)}>
                <option value="">Semua Tahun</option>
                {Array.from(new Set(Object.keys(consMe).map(k=>k.split("|")[1]))).sort((a,b)=>b-a).map(y=><option key={y} value={y}>{y}</option>)}
              </select>
              <select style={{ ...ss.sel, width:"auto", minWidth:120 }} value={consMeSearchMonth} onChange={e=>setConsMeSearchMonth(e.target.value)}>
                <option value="">Semua Bulan</option>
                {MONTHS.map((m,idx)=><option key={idx} value={idx}>{m}</option>)}
              </select>
              {(consMeSearch || consMeSearchYear || consMeSearchMonth) && (
                <button style={ss.btnG} onClick={()=>{setConsMeSearch("");setConsMeSearchYear("");setConsMeSearchMonth("");}}>✕ Reset</button>
              )}
            </div>

            <div style={{ borderRadius:12, border:`1px solid ${C.border}`, overflow:"auto" }}>
              <table className="voyage-main-table" style={{ ...ss.tbl, minWidth:400 }}>
                <thead>
                  <tr>{["Kapal","Tahun","Bulan","Cons ME (KL)","Cons AE (KL)","Aksi"].map(h=><th key={h} style={ss.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {(() => {
                    const filteredEntries = Object.entries(consMe)
                      .filter(([k,v]) => v.cons_me || v.cons_ae)
                      .filter(([k,v]) => {
                        const [ship, year, month] = k.split("|");
                        if (user?.ship && ship !== user.ship) return false;
                        const matchShip = !consMeSearch || ship.toLowerCase().includes(consMeSearch.toLowerCase());
                        const matchYear = !consMeSearchYear || year === consMeSearchYear;
                        const matchMonth = !consMeSearchMonth || month === String(consMeSearchMonth);
                        return matchShip && matchYear && matchMonth;
                      })
                      .sort((a,b) => b[0].localeCompare(a[0]));

                    const displayEntries = filteredEntries.slice(0, 10);

                    if (filteredEntries.length === 0) {
                      return <tr><td colSpan={6} style={{ ...ss.td(false), textAlign:"center", color:C.muted, padding:24 }}>Tidak ada data Cons ME</td></tr>;
                    }

                    return displayEntries.map(([k,v],i) => {
                      const [ship, year, month] = k.split("|");
                      const isEditing = editingConsMe === k;
                      return (
                        <tr key={k}>
                          <td style={{ ...ss.td(i%2), fontWeight:600 }}>MV {ship}</td>
                          <td style={ss.td(i%2)}>{year}</td>
                          <td style={ss.td(i%2)}>{MONTHS[Number(month)]}</td>
                          {isEditing ? (
                            <>
                              <td style={ss.td(i%2)}>
                                <input style={{ ...ss.inp, padding:"4px 8px", width:80 }} type="text" defaultValue={v.cons_me} ref={editConsMeRef}/>
                              </td>
                              <td style={ss.td(i%2)}>
                                <input style={{ ...ss.inp, padding:"4px 8px", width:80 }} type="text" defaultValue={v.cons_ae} ref={editConsAeRef}/>
                              </td>
                              <td style={ss.td(i%2)}>
                                <button style={{ ...ss.btnSm(true), padding:"4px 8px" }} onClick={()=>handleUpdateConsMe(k)}>✓</button>
                                <button style={{ ...ss.btnSm(false), padding:"4px 8px", marginLeft:4 }} onClick={()=>setEditingConsMe(null)}>✕</button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ ...ss.td(i%2), color:C.accent, fontWeight:600 }}>{v.cons_me || "—"} KL</td>
                              <td style={{ ...ss.td(i%2), color:C.accent, fontWeight:600 }}>{v.cons_ae || "—"} KL</td>
                              <td style={ss.td(i%2)}>
                                <button style={{ ...ss.btnSm(true), padding:"4px 8px" }} onClick={()=>{setEditingConsMe(k);editConsMeRef.current.value=v.cons_me||"";editConsAeRef.current.value=v.cons_ae||"";}}>✏️</button>
                                <button style={{ ...ss.btnG, padding:"4px 8px", marginLeft:4, color:C.red }} onClick={()=>handleDeleteConsMe(k)}>🗑️</button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
            {(() => {
              const totalFiltered = Object.entries(consMe)
                .filter(([k,v]) => v.cons_me || v.cons_ae)
                .filter(([k,v]) => {
                  const [ship, year, month] = k.split("|");
                  const matchShip = !consMeSearch || ship.toLowerCase().includes(consMeSearch.toLowerCase());
                  const matchYear = !consMeSearchYear || year === consMeSearchYear;
                  const matchMonth = !consMeSearchMonth || month === String(consMeSearchMonth);
                  return matchShip && matchYear && matchMonth;
                }).length;
              return totalFiltered > 10 ? (
                <div style={{ fontSize:10, color:C.muted, marginTop:6, textAlign:"center" }}>
                  Menampilkan 10 dari {totalFiltered} data
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* Fuel consumption parameter per ship */}
      <div style={{ marginTop:24 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>⛽ Parameter Konsumsi BBM per Kapal (L/hour)</div>
        <div style={{ borderRadius:12, border:`1px solid ${C.border}`, overflow:"auto" }}>
          <table className="voyage-main-table" style={{ ...ss.tbl, minWidth:380 }}>
            <thead>
              <tr>{["Kapal","ME (L/hour)","AE (L/hour)"].map(h=><th key={h} style={ss.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {SHIPS.map((s,i) => (
                <tr key={s}>
                  <td style={{ ...ss.td(i%2), fontWeight:600 }}>{s}</td>
                  <td style={{ ...ss.td(i%2), color:C.accent, fontWeight:600 }}>{FUEL_PARAMS[s]?.me ?? "—"}</td>
                  <td style={{ ...ss.td(i%2), color:C.amber, fontWeight:600 }}>{FUEL_PARAMS[s]?.ae ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ManagementReport({ reports, runningHours, user }) {
  const [fShip, setFShip] = useState("");
  const [fYear, setFYear] = useState("");
  const [fMonth, setFMonth] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showAnchorageDetail, setShowAnchorageDetail] = useState(false);
  const [showBerthingDetail, setShowBerthingDetail] = useState(false);
  const [showAvgSpeedDetail, setShowAvgSpeedDetail] = useState(false);
  const [showDistanceDetail, setShowDistanceDetail] = useState(false);

  const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const years = Array.from(new Set(reports.map(r => new Date(r.ts).getFullYear()))).sort((a,b)=>b-a);

  const allEntries = getAllDowntimeEntries(reports);
  const filteredEntries = allEntries.filter(e => !fShip || e.ship === fShip);

  let totalDtH = 0;
  const matchedEntries = [];

  filteredEntries.forEach(e => {
    const segs = splitByMonth(e.t0, e.t1);
    let matchedHours = 0;
    segs.forEach(seg => {
      const yearOk  = !fYear  || seg.year === Number(fYear);
      const monthOk = !fMonth || seg.month === Number(fMonth);
      if (yearOk && monthOk) matchedHours += seg.hours;
    });
    if (matchedHours > 0 || (!fYear && !fMonth)) {
      totalDtH += (!fYear && !fMonth) ? e.durationH : matchedHours;
      matchedEntries.push(e);
    }
  });

  const curLabel = fMonth !== "" ? MONTHS[fMonth] : "June";
  const prevLabel = fMonth !== "" ? MONTHS[(Number(fMonth)+11)%12] : "Mei";
  const resetFilters = () => { setFShip(""); setFYear(""); setFMonth(""); };
  const activeCount = [fShip, fYear, fMonth].filter(x=>x!=="").length;

  const handleExport = () => {
    const filenameParts = ["downtime-report"];
    if (fShip) filenameParts.push(fShip.replace(/\s+/g,"_"));
    if (fYear) filenameParts.push(fYear);
    if (fMonth) filenameParts.push(MONTHS[Number(fMonth)]);
    downloadDowntimeCSV(matchedEntries, filenameParts.join("_") + ".csv");
  };

  // --- Anchorage Time (arr_anchor SBE/EOSV -> shift_berth FWE) ---
  const anchorageEntries = getAnchorageTimeEntries(reports).filter(e => !fShip || e.ship === fShip);
  let totalAnchorageH = 0;
  const anchorageDetailRows = [];
  anchorageEntries.forEach(e => {
    const segs = splitByMonth(e.t0, e.t1);
    segs.forEach(seg => {
      const yearOk  = !fYear  || seg.year === Number(fYear);
      const monthOk = !fMonth || seg.month === Number(fMonth);
      if (yearOk && monthOk) {
        totalAnchorageH += seg.hours;
        anchorageDetailRows.push({
          ship: e.ship, voy: e.voy,
          t0: seg.start, t1: seg.end,
          hours: seg.hours,
        });
      }
    });
  });

  // --- Berthing Time (shift_berth/arr_berth FWE -> next voyage BOSV, same ship) ---
  const berthingEntries = getBerthingTimeEntries(reports).filter(e => !fShip || e.ship === fShip);
  let totalBerthingH = 0;
  
  const berthingDetailRows = [];
  berthingEntries.forEach(e => {
    const segs = splitByMonth(e.t0, e.t1);
    segs.forEach(seg => {
      const yearOk  = !fYear  || seg.year === Number(fYear);
      const monthOk = !fMonth || seg.month === Number(fMonth);
      if (yearOk && monthOk) {
        totalBerthingH += seg.hours;
        berthingDetailRows.push({
          ship: e.ship, voy: e.voy,
          t0: seg.start, t1: seg.end,
          hours: seg.hours,
        });
      }
    });
  });

  // --- Total Distance ---
  // For each Arrival report (arr_berth/arr_anchor):
  //   - Find the voyage's DEPARTURE month.
  //   - If departure month == arrival month: full ttl_dist counts for that month.
  //   - If departure month != arrival month (voyage crosses month boundary):
  //       * Find the Noon Report on the LAST DAY of the departure's month (the "crossing" noon).
  //       * estCrossDist = noon.drun + (noon.spd * 12)
  //       * Distance attributed to DEPARTURE month = estCrossDist
  //       * Distance attributed to ARRIVAL month   = ttl_dist - estCrossDist
  //   (This naturally extends to voyages crossing more than 2 months by attributing
  //    the full remainder to the arrival month — incremental cross-month splits are not
  //    expected in normal operations but the 2-month case is handled exactly as specified.)
  //
  // For voyages that are NOT yet arrived (still underway) and we're viewing a specific
  // month/year: if that voyage's LAST Noon Report in the viewed month falls on the
  // month's last day (i.e. it's still sailing into next month), estimate the distance
  // for THIS month using drun + (spd*12) from that noon report (only if no arrival
  // report exists yet for this voyage).

  let totalDistance = 0;
  const distanceEntries = getTotalDistanceEntries(reports).filter(e => !fShip || e.ship === fShip);
  const distanceDetailRows = distanceEntries.filter(e => {
    const d = new Date(e.ts);
    const yearOk  = !fYear  || d.getFullYear() === Number(fYear);
    const monthOk = !fMonth || d.getMonth() === Number(fMonth);
    return yearOk && monthOk;
  });
  const voysForDist = computeVoyages(reports).filter(v => !fShip || v.ship === fShip);

  const getNoonOnLastDayOfMonth = (ship, voy, year, month) => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    const candidates = reports.filter(r =>
      r.type === "noon" && r.ship === ship && r.voy === voy &&
      (() => { const d = new Date(r.ts); return d.getFullYear()===year && d.getMonth()===month && d.getDate()===lastDay; })()
    );
    if (candidates.length === 0) return null;
    candidates.sort((a,b) => new Date(b.ts) - new Date(a.ts));
    return candidates[0];
  };

  distanceEntries.forEach(e => {
    const voyObj = voysForDist.find(v => v.ship === e.ship && v.no === e.voy);
    const depTs = voyObj?.dep?.ts;
    const arrDate = new Date(e.ts);
    const arrYear = arrDate.getFullYear(), arrMonth = arrDate.getMonth();

    if (!depTs) {
      // No departure info — attribute fully to arrival month
      const yearOk  = !fYear  || arrYear === Number(fYear);
      const monthOk = !fMonth || arrMonth === Number(fMonth);
      if (yearOk && monthOk) totalDistance += e.dist;
      return;
    }

    const depDate = new Date(depTs);
    const depYear = depDate.getFullYear(), depMonth = depDate.getMonth();

    if (depYear === arrYear && depMonth === arrMonth) {
      // Same month — simple case
      const yearOk  = !fYear  || arrYear === Number(fYear);
      const monthOk = !fMonth || arrMonth === Number(fMonth);
      if (yearOk && monthOk) totalDistance += e.dist;
    } else {
      // Crosses month boundary — find noon report on last day of departure month
      const crossingNoon = getNoonOnLastDayOfMonth(e.ship, e.voy, depYear, depMonth);
      const estCrossDist = crossingNoon
        ? (parseFloat(crossingNoon.drun) || 0) + (parseFloat(crossingNoon.spd) || 0) * 12
        : 0;

      // Departure month gets estCrossDist
      const depYearOk  = !fYear  || depYear === Number(fYear);
      const depMonthOk = !fMonth || depMonth === Number(fMonth);
      if (depYearOk && depMonthOk) totalDistance += estCrossDist;

      // Arrival month gets remainder
      const arrYearOk  = !fYear  || arrYear === Number(fYear);
      const arrMonthOk = !fMonth || arrMonth === Number(fMonth);
      if (arrYearOk && arrMonthOk) totalDistance += Math.max(0, e.dist - estCrossDist);
    }
  });

  // Underway voyages (no arrival yet) crossing into next month: estimate this month's portion
  if (fYear && fMonth !== "") {
    const targetYear  = Number(fYear);
    const targetMonth = Number(fMonth);

    voysForDist.forEach(v => {
      const alreadyHasArrival = distanceEntries.some(e => e.ship === v.ship && e.voy === v.no);
      if (alreadyHasArrival) return;

      const noon = getNoonOnLastDayOfMonth(v.ship, v.no, targetYear, targetMonth);
      if (!noon) return;

      const estDist = (parseFloat(noon.drun) || 0) + (parseFloat(noon.spd) || 0) * 12;
      totalDistance += estDist;
    });
  }

  // --- Average Speed ---
  // With filter Year+Month:
  //   For month N:
  //   1. All Arrival reports (arr_berth/arr_anchor) whose ts falls in month N → count directly
  //   2. Voyages still sailing, crossing into month N+1 (no arrival in month N):
  //      a. Check if there's an Arrival on the 1st of month N+1 BEFORE 12:00 → use that arrival's avg_spd
  //      b. If arrival on 1st at/after 12:00, or no arrival on 1st → use Noon Report on 1st of month N+1
  // Without filter:
  //   Show all Arrival reports + Noon reports that can be used for speed calculation
  //
  // Detail table shows: ship, date, report type label, speed (so user knows which source was used)
  let avgSpeedSum = 0;
  let avgSpeedCount = 0;
  let avgSpeedRows = [];

  // Helper: get first Arrival on a specific date before noon (12:00)
  const getFirstArrivalBeforeNoon = (ship, voy, year, month, day) => {
    const candidates = reports.filter(r =>
      ["arr_berth","arr_anchor"].includes(r.type) &&
      r.ship === ship && r.voy === voy &&
      (() => {
        const d = new Date(r.ts);
        return d.getFullYear()===year && d.getMonth()===month && d.getDate()===day;
      })()
    );
    const beforeNoon = candidates.filter(r => {
      const d = new Date(r.ts);
      return d.getHours() < 12;
    });
    if (beforeNoon.length === 0) return null;
    beforeNoon.sort((a,b) => new Date(a.ts) - new Date(b.ts));
    return beforeNoon[0];
  };

  // Helper: get first Noon Report on a specific date
  const getFirstNoonOnDate = (ship, voy, year, month, day) => {
    const candidates = reports.filter(r =>
      r.type === "noon" && r.ship === ship && r.voy === voy &&
      (() => {
        const d = new Date(r.ts);
        return d.getFullYear()===year && d.getMonth()===month && d.getDate()===day;
      })()
    );
    if (candidates.length === 0) return null;
    candidates.sort((a,b) => new Date(a.ts) - new Date(b.ts));
    return candidates[0];
  };

  if (fYear && fMonth !== "") {
    // WITH YEAR+MONTH FILTER
    const tYear  = Number(fYear);
    const tMonth = Number(fMonth);
    const nextMonth = tMonth + 1;
    const nextYear  = nextMonth > 11 ? tYear + 1 : tYear;
    const nextMonthIdx = nextMonth > 11 ? 0 : nextMonth;
    const nextMonthName = MONTHS[nextMonthIdx];

    // 1. Arrival reports whose ts falls in this month
    reports
      .filter(r => ["arr_berth","arr_anchor"].includes(r.type))
      .filter(r => !fShip || r.ship === fShip)
      .filter(r => {
        const d = new Date(r.ts);
        return d.getFullYear() === tYear && d.getMonth() === tMonth;
      })
      .forEach(r => {
        const spd = parseFloat(r.avg_spd || r.spd);
        if (!isNaN(spd) && spd > 0) {
          avgSpeedSum += spd; avgSpeedCount++;
          const rt = RT.find(t => t.id === r.type);
          avgSpeedRows.push({ ship: r.ship, ts: r.ts, spd, label: rt?.short || r.type });
        }
      });

    // 2. For each voyage that sailed (has at least a noon report in this month),
    //    if no arrival in this month, use speed from June 1st
    voysForDist.forEach(v => {
      if (fShip && v.ship !== fShip) return;

      // Check if there's an Arrival in the CURRENT month (tMonth)
      const hasArrivalInMonth = reports.some(r =>
        ["arr_berth","arr_anchor"].includes(r.type) &&
        r.ship === v.ship && r.voy === v.no &&
        (() => { const d = new Date(r.ts); return d.getFullYear()===tYear && d.getMonth()===tMonth; })()
      );
      if (hasArrivalInMonth) return; // already counted above

      // Check if voyage has any noon reports at all (indicating it was sailing)
      const hasNoonInMonth = reports.some(r =>
        r.type === "noon" && r.ship === v.ship && r.voy === v.no &&
        (() => { const d = new Date(r.ts); return d.getFullYear()===tYear && d.getMonth()===tMonth; })()
      );
      if (!hasNoonInMonth) return; // voyage wasn't sailing this month

      // Try Arrival on 1st of next month, before 12:00
      const arrBeforeNoon = getFirstArrivalBeforeNoon(v.ship, v.no, nextYear, nextMonthIdx, 1);

      if (arrBeforeNoon) {
        const spd = parseFloat(arrBeforeNoon.avg_spd || arrBeforeNoon.spd);
        if (!isNaN(spd) && spd > 0) {
          avgSpeedSum += spd; avgSpeedCount++;
          const rt = RT.find(t => t.id === arrBeforeNoon.type);
          avgSpeedRows.push({ ship: arrBeforeNoon.ship, ts: arrBeforeNoon.ts, spd, label: rt?.short || arrBeforeNoon.type + " (1 " + nextMonthName + ")" });
        }
        return;
      }

      // Fallback: Noon Report on 1st of next month
      const noonOn1st = getFirstNoonOnDate(v.ship, v.no, nextYear, nextMonthIdx, 1);
      if (noonOn1st) {
        const spd = parseFloat(noonOn1st.avg_spd || noonOn1st.spd);
        if (!isNaN(spd) && spd > 0) {
          avgSpeedSum += spd; avgSpeedCount++;
          avgSpeedRows.push({ ship: noonOn1st.ship, ts: noonOn1st.ts, spd, label: "Noon (1 " + nextMonthName + ") [No Arr.1]" });
        }
      }
    });

    // 3. Get ALL Noon Reports on 1st of next month
    //    (includes voyages that departed in THIS month but reported noon on next month)
    const allNoonOnJune1 = reports.filter(r =>
      r.type === "noon" &&
      (fShip ? r.ship === fShip : true) &&
      (() => {
        const d = new Date(r.ts);
        return d.getFullYear() === nextYear && d.getMonth() === nextMonthIdx && d.getDate() === 1;
      })()
    );

    allNoonOnJune1.forEach(noon => {
      // Check if already added
      const alreadyAdded = avgSpeedRows.some(row => row.ts === noon.ts && row.ship === noon.ship);
      if (alreadyAdded) return;

      // Check if voyage has departure in THIS month (May)
      const voyDepartureInMay = reports.some(r =>
        ["departure","dep_anchor","shift_anchor"].includes(r.type) &&
        r.ship === noon.ship && r.voy === noon.voy &&
        (() => {
          const d = new Date(r.ts);
          return d.getFullYear() === tYear && d.getMonth() === tMonth;
        })()
      );

      // Skip if no departure in May OR has arrival in May
      const hasArrivalInMay = reports.some(r =>
        ["arr_berth","arr_anchor"].includes(r.type) &&
        r.ship === noon.ship && r.voy === noon.voy &&
        (() => { const d = new Date(r.ts); return d.getFullYear()===tYear && d.getMonth()===tMonth; })()
      );

      if (!voyDepartureInMay || hasArrivalInMay) return;

      const spd = parseFloat(noon.avg_spd || noon.spd);
      if (!isNaN(spd) && spd > 0) {
        avgSpeedSum += spd; avgSpeedCount++;
        avgSpeedRows.push({ ship: noon.ship, ts: noon.ts, spd, label: "Noon (1 " + nextMonthName + ") [Dep " + MONTHS[tMonth] + "]" });
      }
    });
  } else {
    // WITHOUT YEAR+MONTH FILTER - show all valid speed sources
    // All Arrival reports with avg_spd
    reports
      .filter(r => ["arr_berth","arr_anchor"].includes(r.type))
      .filter(r => !fShip || r.ship === fShip)
      .filter(r => {
        const spd = parseFloat(r.avg_spd || r.spd);
        return !isNaN(spd) && spd > 0;
      })
      .forEach(r => {
        const spd = parseFloat(r.avg_spd || r.spd);
        avgSpeedSum += spd; avgSpeedCount++;
        const rt = RT.find(t => t.id === r.type);
        avgSpeedRows.push({ ship: r.ship, ts: r.ts, spd, label: rt?.short || r.type });
      });

    // All Noon reports with avg_spd (for voyages without arrival)
    voysForDist.forEach(v => {
      const hasArrival = reports.some(r =>
        ["arr_berth","arr_anchor"].includes(r.type) && r.ship === v.ship && r.voy === v.no
      );
      if (hasArrival) return; // skip if voyage has arrival (already counted)

      // Get the last Noon report for this voyage
      const noonReports = reports
        .filter(r => r.type === "noon" && r.ship === v.ship && r.voy === v.no)
        .filter(r => {
          const spd = parseFloat(r.avg_spd || r.spd);
          return !isNaN(spd) && spd > 0;
        })
        .sort((a,b) => new Date(b.ts) - new Date(a.ts));

      if (noonReports.length > 0) {
        const lastNoon = noonReports[0];
        const spd = parseFloat(lastNoon.avg_spd || lastNoon.spd);
        avgSpeedSum += spd; avgSpeedCount++;
        avgSpeedRows.push({ ship: lastNoon.ship, ts: lastNoon.ts, spd, label: "Noon (Last) [No Arr.]" });
      }
    });
  }
  const avgSpeedResult = avgSpeedCount > 0 ? (avgSpeedSum / avgSpeedCount).toFixed(2) : null;

  // --- At Port ---
  // At Port (days) = Berthing Time (days) - (RH ME / 24)
  //                  - [ Days in Month - Total Downtime (days) - Berthing Time (days) - Anchorage Time (days) ]
  // Only computable when a specific Year + Month filter is selected (needs "days in month"
  // and a specific Running Hours entry), and requires a single ship to be selected
  // (Running Hours is recorded per-ship).
  // For ship-restricted accounts, the ship filter dropdown is hidden (there's
  // only ever one possible ship), so fShip stays "" and would never satisfy
  // this condition — fall back to user.ship in that case.
  const effectiveShip = fShip || user?.ship || "";
  let atPortDays = null;
  if (fYear && fMonth !== "" && effectiveShip) {
    const daysInMonth = new Date(Number(fYear), Number(fMonth) + 1, 0).getDate();
    const berthingDays   = totalBerthingH / 24;
    const anchorageDays  = totalAnchorageH / 24;
    const downtimeDays   = totalDtH / 24;
    const rhKey = `${effectiveShip}|${fYear}|${fMonth}`;
    const rhMeVal = runningHours[rhKey]?.me;
    // If RH ME is not filled, show empty (same behavior as Vessel Activity)
    if (rhMeVal !== undefined && rhMeVal !== null && rhMeVal !== "") {
      const rhMe = parseFloat(rhMeVal) || 0;
      atPortDays = berthingDays - ((rhMe / 24) - (daysInMonth - downtimeDays - berthingDays - anchorageDays));
    }
  }

  return (
    <div>
      <div style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>Management Report</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>Ringkasan downtime seluruh kapal</div>

      <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        {!user?.ship && (
          <select style={{ ...ss.sel, width:"auto", minWidth:160 }} value={fShip} onChange={e=>setFShip(e.target.value)}>
            <option value="">Semua Kapal</option>
            {SHIPS.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <select style={{ ...ss.sel, width:"auto", minWidth:120 }} value={fYear} onChange={e=>setFYear(e.target.value)}>
          <option value="">Semua Tahun</option>
          {years.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
        <select style={{ ...ss.sel, width:"auto", minWidth:140 }} value={fMonth} onChange={e=>setFMonth(e.target.value)}>
          <option value="">Semua Bulan</option>
          {MONTHS.map((m,idx)=><option key={m} value={idx}>{m}</option>)}
        </select>
        {activeCount > 0 ? (
          <button style={ss.btnG} onClick={resetFilters}>✕ Reset Filter ({activeCount})</button>
        ) : null}
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <button
          style={{ ...ss.btn, background:C.accent, color:"#fff", fontSize:9, padding:"5px 14px", fontWeight:700, letterSpacing:"0.04em" }}
          onClick={() => {
            const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
            const tYear = fYear ? Number(fYear) : new Date().getFullYear();
            const tMonth = fMonth !== "" ? Number(fMonth) : new Date().getMonth();
            const prevMonth = tMonth - 1 < 0 ? 11 : tMonth - 1;
            const curLabel = MONTHS_ID[tMonth];
            const prevLabel = MONTHS_ID[prevMonth];

            const s1 = { name:"Vessel Activity", data:[
              ["No","Nama Kapal","Sailing (Hari)","Anchorage (Hari)","At Port (Hari)","Downtime (Hari)","Total (Hari)","Laut (NM)","ME "+prevLabel,"AE at Sea "+prevLabel,"AE at Port "+prevLabel,"ME "+curLabel,"AE at Sea "+curLabel,"AE at Port "+curLabel,"Avg/Miles "+curLabel,"Avg/Hari "+curLabel,"Target Parameter ME/Day","Realisasi Pemakaian ME/Day","AVG Speed "+prevLabel,"AVG Speed "+curLabel],
              ...SHIPS.map((ship, idx) => [
                idx+1, ship,
                SailingDaysByShip[ship] !== null ? SailingDaysByShip[ship].toFixed(2) : "",
                (AnchorageDaysByShip[ship] || 0).toFixed(2),
                AtPortDaysByShip[ship] !== null ? AtPortDaysByShip[ship].toFixed(2) : "",
                (DowntimeDaysByShip[ship] || 0).toFixed(2),
                daysInSelectedMonth,
                (TotalDistanceByShip[ship] || 0).toFixed(1),
                "", "", "", "", "", "",  // 6 kolom ME/AE (prev & cur)
                "", "", "", "", // 4 kolom tambahan (Avg/Miles, Avg/Hari, Target, Realisasi)
                AvgSpeedPrevByShip[ship] || "",
                AvgSpeedByShip[ship] || ""
              ]),
              [
                "TOTAL","",
                (() => { const v=Object.values(SailingDaysByShip).filter(x=>x!==null); return v.length?v.reduce((s,x)=>s+x,0).toFixed(2):""; })(),
                Object.values(AnchorageDaysByShip).reduce((s,x)=>s+x,0).toFixed(2),
                (() => { const v=Object.values(AtPortDaysByShip).filter(x=>x!==null); return v.length?v.reduce((s,x)=>s+x,0).toFixed(2):""; })(),
                Object.values(DowntimeDaysByShip).reduce((s,x)=>s+x,0).toFixed(2),
                daysInSelectedMonth,
                Object.values(TotalDistanceByShip).reduce((s,x)=>s+x,0).toFixed(1),
                "", "", "", "", "", "",  // 6 kosong
                "", "", "", "", // 4 kosong
                "", "" // AVG Speed kosong untuk total
              ]
            ], widths:[5,20,14,14,14,14,10,12,12,14,14,12,14,14,12,12,14,14,14,14] };

            const s2 = { name:"Anchorage Time", data:[
              ["Nama Kapal","Bulan","Tahun","Anchorage (EOSV Arrival)","Berthing (FWE)","Anchorage Time (hari)"],
              ...(getAnchorageTimeEntries(reports)||[]).flatMap(e => splitByMonth(e.t0, e.t1).map(seg => (!fYear||seg.year===Number(fYear)) && (!fMonth||seg.month===Number(fMonth)) ? [e.ship, MONTHS_ID[seg.month]||"", seg.year, fmtDateForCSV(seg.start), fmtDateForCSV(seg.end), (seg.hours/24).toFixed(2)] : null).filter(Boolean))
            ], widths:[18,12,8,22,22,16] };

            const s3 = { name:"Downtime Report", data:[
              ["Nama Kapal","Start Downtime","Finish Downtime","Duration (days)","Reason","Category"],
              ...(getAllDowntimeEntries(reports)||[]).flatMap(e => splitByMonth(e.t0, e.t1).map(seg => (!fYear||seg.year===Number(fYear)) && (!fMonth||seg.month===Number(fMonth)) ? [e.ship, fmtDateForCSV(seg.start), fmtDateForCSV(seg.end), (seg.hours/24).toFixed(2), e.reason||"", e.category||""] : null).filter(Boolean))
            ], widths:[18,20,20,14,30,18] };

            const s4 = { name:"Berthing Time", data:[
              ["Nama Kapal","Bulan","Tahun","Berthing (FWE)","Departure (BOSV)","Berthing Time (hari)"],
              ...(getBerthingTimeEntries(reports)||[]).flatMap(e => splitByMonth(e.t0, e.t1).map(seg => (!fYear||seg.year===Number(fYear)) && (!fMonth||seg.month===Number(fMonth)) ? [e.ship, MONTHS_ID[seg.month]||"", seg.year, fmtDateForCSV(seg.start), fmtDateForCSV(seg.end), (seg.hours/24).toFixed(2)] : null).filter(Boolean))
            ], widths:[18,12,8,22,22,16] };

            downloadMultiSheetExcel([s1,s2,s3,s4], `management-report_${tYear}_${(fMonth!==""?MONTHS_ID[Number(fMonth)]:"All").replace(/\s+/g,"-")}.xlsx`);
          }}
        >EXPORT XLSX</button>
      </div>

      <div
        style={{ background:C.bg3, border:`1px solid ${C.red}40`, borderTop:`3px solid ${C.red}`, borderRadius:12, padding:"20px 22px", cursor:"pointer", marginBottom:16 }}
        onClick={() => setShowDetail(!showDetail)}
      >
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:32, fontWeight:700, color:C.red, marginBottom:4 }}>{(totalDtH/24).toFixed(2)} hari</div>
            <div style={{ fontSize:11, color:C.muted }}>Total Downtime (incl. Shelter) — {matchedEntries.length} entries</div>
          </div>
          <div style={{ fontSize:11, color:C.muted }}>{showDetail ? "▲ Sembunyikan" : "▼ Lihat Detail"}</div>
        </div>
      </div>

      {showDetail && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.accent }}>Detail Downtime</div>
            <button style={{ ...ss.btn, fontSize:11, padding:"6px 14px" }} onClick={handleExport}>
              ⬇️ Download CSV
            </button>
          </div>
          <div style={{ borderRadius:12, border:`1px solid ${C.border}`, overflow:"auto" }}>
            <table className="voyage-main-table" style={{ ...ss.tbl, minWidth:640 }}>
              <thead>
                <tr>
                  {["Vessel","Start Downtime","Finish Downtime","Duration (days)","Reason","Category"].map(h=>
                    <th key={h} style={ss.th}>{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {matchedEntries.length === 0 && (
                  <tr><td colSpan={6} style={{ ...ss.td(false), textAlign:"center", color:C.muted, padding:24 }}>Tidak ada downtime pada periode ini</td></tr>
                )}
                {matchedEntries.map((e,i) => (
                  <tr key={i}>
                    <td style={{ ...ss.td(i%2), fontWeight:600 }}>MV {e.ship}</td>
                    <td style={ss.td(i%2)}>{fmtDT(e.t0)}</td>
                    <td style={ss.td(i%2)}>{fmtDT(e.t1)}</td>
                    <td style={{ ...ss.td(i%2), color:C.red, fontWeight:600 }}>{(e.durationH/24).toFixed(2)} hari</td>
                    <td style={ss.td(i%2)}>{e.reason}</td>
                    <td style={{ ...ss.td(i%2), color:C.muted, fontSize:10 }}>{e.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="voyage-stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:20, marginBottom:16 }}>
        <div
          style={{ background:C.bg3, border:`1px solid ${C.amber}30`, borderTop:`3px solid ${C.amber}`, borderRadius:12, padding:"16px 18px", cursor:"pointer" }}
          onClick={() => setShowAnchorageDetail(s => !s)}
        >
          <div style={{ fontSize:22, fontWeight:700, color:C.amber, marginBottom:4 }}>{(totalAnchorageH/24).toFixed(2)} hari</div>
          <div style={{ fontSize:10, color:C.muted }}>Anchorage Time</div>
          <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>Arr.Anc SBE/EOSV → Shift Berth FWE {showAnchorageDetail ? "▲" : "▼"}</div>
        </div>
        <div
          style={{ background:C.bg3, border:`1px solid ${C.horizon}30`, borderTop:`3px solid ${C.horizon}`, borderRadius:12, padding:"16px 18px", cursor:"pointer" }}
          onClick={() => setShowBerthingDetail(s => !s)}
        >
          <div style={{ fontSize:22, fontWeight:700, color:C.horizon, marginBottom:4 }}>{(totalBerthingH/24).toFixed(2)} hari</div>
          <div style={{ fontSize:10, color:C.muted }}>Berthing Time</div>
          <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>Berth FWE → Next Voyage BOSV {showBerthingDetail ? "▲" : "▼"}</div>
        </div>
        <div
          style={{ background:C.bg3, border:`1px solid ${C.green}30`, borderTop:`3px solid ${C.green}`, borderRadius:12, padding:"16px 18px", cursor:"pointer" }}
          onClick={() => setShowDistanceDetail(s => !s)}
        >
          <div style={{ fontSize:22, fontWeight:700, color:C.green, marginBottom:4 }}>{totalDistance.toFixed(1)} NM</div>
          <div style={{ fontSize:10, color:C.muted }}>Total Distance</div>
          <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>Sum Total Dist Run (Arr Berth/Anc) {showDistanceDetail ? "▲" : "▼"}</div>
        </div>
        <div style={{ background:C.bg3, border:`1px solid ${C.sea}30`, borderTop:`3px solid ${C.sea}`, borderRadius:12, padding:"16px 18px" }}>
          <div style={{ fontSize:22, fontWeight:700, color:C.sea, marginBottom:4 }}>{atPortDays != null ? atPortDays.toFixed(2)+" hari" : "—"}</div>
          <div style={{ fontSize:10, color:C.muted }}>At Port</div>
          <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>
            {atPortDays != null ? "Berth − RH ME/24 − sisa hari" : "Pilih Kapal, Tahun & Bulan"}
          </div>
        </div>
        <div
          style={{ background:C.bg3, border:`1px solid ${C.green}30`, borderTop:`3px solid ${C.green}`, borderRadius:12, padding:"16px 18px", cursor:"pointer" }}
          onClick={() => setShowAvgSpeedDetail(s => !s)}
        >
          <div style={{ fontSize:22, fontWeight:700, color:C.green, marginBottom:4 }}>
            {avgSpeedResult ? avgSpeedResult+" kts" : "—"}
          </div>
          <div style={{ fontSize:10, color:C.muted }}>Average Speed {showAvgSpeedDetail ? "▲" : "▼"}</div>
        </div>
      </div>

      {showAvgSpeedDetail && (
        <div style={{ ...ss.card(), marginBottom:16, overflowX:"auto" }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>📋 Rincian Average Speed</div>
          {avgSpeedRows.length === 0 ? (
            <div style={{ fontSize:11, color:C.muted, padding:"8px 0" }}>Tidak ada data untuk filter ini.</div>
          ) : (
            <table className="voyage-main-table" style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                  <th style={ss.th}>Nama Kapal</th>
                  <th style={ss.th}>Tanggal</th>
                  <th style={ss.th}>Jenis Laporan</th>
                  <th style={ss.th}>Speed (kts)</th>
                </tr>
              </thead>
              <tbody>
                {avgSpeedRows.map((row, i) => (
                  <tr key={i}>
                    <td style={ss.td(i%2)}>{row.ship}</td>
                    <td style={ss.td(i%2)}>{fmtDT(row.ts)}</td>
                    <td style={ss.td(i%2)}>{row.label}</td>
                    <td style={{ ...ss.td(i%2), fontWeight:600, color:C.green }}>{row.spd.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showAnchorageDetail && (
        <div style={{ ...ss.card(), marginBottom:16, overflowX:"auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontSize:13, fontWeight:700 }}>📋 Rincian Anchorage Time</div>
            {anchorageDetailRows.length > 0 && (
              <button
                style={{ ...ss.btnG, fontSize:11, padding:"5px 12px" }}
                onClick={() => {
                  const parts = ["anchorage-time"];
                  if (fShip) parts.push(fShip.replace(/\s+/g,"_"));
                  if (fYear) parts.push(fYear);
                  if (fMonth) parts.push(MONTHS[Number(fMonth)]);
                  downloadCSV(
                    ["Nama Kapal","Bulan","Tahun","Anchorage (EOSV Arrival)","Berthing (FWE Shifting to berth)","Anchorage Time (hari)"],
                    anchorageDetailRows,
                    row => {
                      const d = new Date(row.t0);
                      return [row.ship, MONTHS[d.getMonth()], d.getFullYear(), fmtDateForCSV(row.t0), fmtDateForCSV(row.t1), (row.hours/24).toFixed(2)];
                    },
                    parts.join("_") + ".csv"
                  );
                }}
              >⬇️ Download CSV</button>
            )}
          </div>
          {anchorageDetailRows.length === 0 ? (
            <div style={{ fontSize:11, color:C.muted, padding:"8px 0" }}>Tidak ada data untuk filter ini.</div>
          ) : (
            <table className="voyage-main-table" style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                  <th style={ss.th}>Nama Kapal</th>
                  <th style={ss.th}>Bulan</th>
                  <th style={ss.th}>Tahun</th>
                  <th style={ss.th}>Anchorage<br/>(EOSV Arrival)</th>
                  <th style={ss.th}>Berthing<br/>(FWE Shifting to berth)</th>
                  <th style={ss.th}>Anchorage Time<br/>(hari)</th>
                </tr>
              </thead>
              <tbody>
                {anchorageDetailRows.map((row, i) => {
                  const d = new Date(row.t0);
                  return (
                    <tr key={i}>
                      <td style={ss.td(i%2)}>{row.ship}</td>
                      <td style={ss.td(i%2)}>{MONTHS[d.getMonth()]}</td>
                      <td style={ss.td(i%2)}>{d.getFullYear()}</td>
                      <td style={ss.td(i%2)}>{fmtDT(row.t0)}</td>
                      <td style={ss.td(i%2)}>{fmtDT(row.t1)}</td>
                      <td style={{ ...ss.td(i%2), fontWeight:600, color:C.amber }}>{(row.hours/24).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showBerthingDetail && (
        <div style={{ ...ss.card(), marginBottom:16, overflowX:"auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontSize:13, fontWeight:700 }}>📋 Rincian Berthing Time</div>
            {berthingDetailRows.length > 0 && (
              <button
                style={{ ...ss.btnG, fontSize:11, padding:"5px 12px" }}
                onClick={() => {
                  const parts = ["berthing-time"];
                  if (fShip) parts.push(fShip.replace(/\s+/g,"_"));
                  if (fYear) parts.push(fYear);
                  if (fMonth) parts.push(MONTHS[Number(fMonth)]);
                  downloadCSV(
                    ["Nama Kapal","Bulan","Tahun","Berthing (FWE shift to berth/arr berth)","Departure (BOSV departure next voyage)","Berthing Time (hari)"],
                    berthingDetailRows,
                    row => {
                      const d = new Date(row.t0);
                      return [row.ship, MONTHS[d.getMonth()], d.getFullYear(), fmtDateForCSV(row.t0), fmtDateForCSV(row.t1), (row.hours/24).toFixed(2)];
                    },
                    parts.join("_") + ".csv"
                  );
                }}
              >⬇️ Download CSV</button>
            )}
          </div>
          {berthingDetailRows.length === 0 ? (
            <div style={{ fontSize:11, color:C.muted, padding:"8px 0" }}>Tidak ada data untuk filter ini.</div>
          ) : (
            <table className="voyage-main-table" style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                  <th style={ss.th}>Nama Kapal</th>
                  <th style={ss.th}>Bulan</th>
                  <th style={ss.th}>Tahun</th>
                  <th style={ss.th}>Berthing<br/>(FWE shift to berth/arr berth)</th>
                  <th style={ss.th}>Departure<br/>(BOSV departure next voyage)</th>
                  <th style={ss.th}>Berthing Time<br/>(hari)</th>
                </tr>
              </thead>
              <tbody>
                {berthingDetailRows.map((row, i) => {
                  const d = new Date(row.t0);
                  return (
                    <tr key={i}>
                      <td style={ss.td(i%2)}>{row.ship}</td>
                      <td style={ss.td(i%2)}>{MONTHS[d.getMonth()]}</td>
                      <td style={ss.td(i%2)}>{d.getFullYear()}</td>
                      <td style={ss.td(i%2)}>{fmtDT(row.t0)}</td>
                      <td style={ss.td(i%2)}>{fmtDT(row.t1)}</td>
                      <td style={{ ...ss.td(i%2), fontWeight:600, color:C.horizon }}>{(row.hours/24).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
      

      {showDistanceDetail && (
        <div style={{ ...ss.card(), marginBottom:16, overflowX:"auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontSize:13, fontWeight:700 }}>📏 Rincian Jarak Tempuh (Total Distance)</div>
            {distanceDetailRows.length > 0 && (
              <button
                style={{ ...ss.btnG, fontSize:11, padding:"5px 12px" }}
                onClick={() => {
                  const parts = ["distance"];
                  if (fShip) parts.push(fShip.replace(/\s+/g,"_"));
                  if (fYear) parts.push(fYear);
                  if (fMonth) parts.push(MONTHS[Number(fMonth)]);
                  downloadCSV(
                    ["Nama Kapal","Voy","Tanggal","Jenis Laporan","Distance (NM)"],
                    distanceDetailRows,
                    row => {
                      const d = new Date(row.ts);
                      return [row.ship, row.voy, fmtDT(row.ts), row.type === "arr_berth" ? "Arrival Berthing" : "Arrival Anchorage", row.dist.toFixed(1)];
                    },
                    parts.join("_") + ".csv"
                  );
                }}
              >⬇️ Download CSV</button>
            )}
          </div>
          {distanceDetailRows.length === 0 ? (
            <div style={{ fontSize:11, color:C.muted, padding:"8px 0" }}>Tidak ada data untuk filter ini.</div>
          ) : (
            <table className="voyage-main-table" style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                  <th style={ss.th}>Nama Kapal</th>
                  <th style={ss.th}>Voy</th>
                  <th style={ss.th}>Tanggal</th>
                  <th style={ss.th}>Jenis Laporan</th>
                  <th style={ss.th}>Distance (NM)</th>
                </tr>
              </thead>
              <tbody>
                {distanceDetailRows.map((row, i) => {
                  return (
                    <tr key={i}>
                      <td style={ss.td(i%2)}>{row.ship}</td>
                      <td style={ss.td(i%2)}>{row.voy}</td>
                      <td style={ss.td(i%2)}>{fmtDT(row.ts)}</td>
                      <td style={ss.td(i%2)}>{row.type === "arr_berth" ? "Arrival Berthing" : "Arrival Anchorage"}</td>
                      <td style={{ ...ss.td(i%2), fontWeight:600, color:C.horizon }}>{row.dist.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// --- APP ----------------------------------------------------------------------
export default function App() {
  const isMobile = useIsMobile();
  // GlobalStyles renders unconditionally so CSS variables are defined
  // even on the Login screen (which returns early, before the main app shell).
  const [user,     setUser]     = useState(null);
  const [page,     setPage]     = useState("dashboard");
  const [reports,  setReports]  = useState([]);
  const [viewing,  setViewing]  = useState(null);
  const [editing,  setEditing]  = useState(null);
  const [runningHours, setRunningHours] = useState({}); // key: "ship|year|month" -> {me, ae}
  const [consMe, setConsMe] = useState({}); // key: "ship|year|month" -> {cons_me}
  const [theme, setTheme] = useState("light");

  // Check Supabase session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        const isShipAccount = profile?.role === 'kapal';
        setUser({
          id: session.user.id, email: session.user.email,
          name: profile?.full_name || session.user.email.split('@')[0],
          role: profile?.role || 'master',
          // "kapal" accounts store the ship name directly in full_name
          ship: isShipAccount ? (profile?.full_name || null) : null,
        });
      }
    };
    checkSession();
  }, []);

  // Load reports when user is authenticated
  useEffect(() => {
    if (user) { loadReports(); loadRunningHours(); loadConsMe(); }
  }, [user]);

  // Ship-restricted accounts (profile.ship set) only ever see their own
  // ship's data — this single filter point feeds every page (Dashboard,
  // Buat Laporan, Semua Laporan, Ringkasan Voyage, Management Report) so
  // there's no separate place where the restriction could be missed.
  const visibleReports = (user && user.ship) ? reports.filter(r => r.ship === user.ship) : reports;

  const loadRunningHours = async () => {
    try {
      const { data, error } = await supabase.from('running_hours').select('*');
      if (error) throw error;
      const map = {};
      (data || []).forEach(row => {
        map[`${row.ship}|${row.year}|${row.month}`] = { me: row.me_hours ?? "", ae: row.ae_hours ?? "" };
      });
      setRunningHours(map);
    } catch (err) { console.error("Error loading running hours:", err); }
  };

  const loadConsMe = async () => {
    try {
      const { data, error } = await supabase.from('cons_me').select('*');
      if (error) throw error;
      const map = {};
      (data || []).forEach(row => {
        map[`${row.ship}|${row.year}|${row.month}`] = { cons_me: row.cons_me ?? "", cons_ae: row.cons_ae ?? "" };
      });
      setConsMe(map);
    } catch (err) { console.error("Error loading cons_me:", err); }
  };

  const loadReports = async () => {
    try {
      const { data, error } = await supabase.from('reports').select('*').order('ts', { ascending: false });
      if (error) throw error;
      // Parse cargo_rows, events, tanks from JSON strings and flatten them
      // back into the same flat tk_<tank>_<phase> / bk_<tank> / rob_<tank>
      // keys the rest of the app (TankSection, buildWA, fuel calculations,
      // etc.) expects directly on the report object.
      const transformed = (data || []).map(r => {
        const events = r.events ? JSON.parse(r.events) : {};
        const tanks = r.tanks ? JSON.parse(r.tanks) : {};
        const flatTanks = {};
        Object.entries(tanks).forEach(([key, val]) => {
          if (key.startsWith("tk_") && val && typeof val === "object") {
            // val is { ohn: "...", sbe: "...", fwe: "..." } -> tk_<tank>_ohn etc
            Object.entries(val).forEach(([phaseKey, phaseVal]) => {
              flatTanks[`${key}_${phaseKey}`] = phaseVal;
            });
          } else {
            // bk_<tank> and rob_<tank> are already flat scalar values
            flatTanks[key] = val;
          }
        });
        return {
          ...r,
          cargoRows: r.cargo_rows ? JSON.parse(r.cargo_rows) : [],
          ...events,    // spread events into root (ev_BOSV, ev_POB, etc)
          ...flatTanks, // spread tanks into root (tk_mfo_fwe, bk_mfo, rob_mfo, etc)
        };
      });
      setReports(transformed);
    } catch (err) { console.error("Error loading reports:", err); }
  };

  useEffect(() => {
    // Login screen always renders in the original dark theme;
    // theme switching only takes effect after the user logs in.
    document.documentElement.setAttribute("data-theme", user ? theme : "dark");
  }, [theme, user]);

  if (!user) return (<><GlobalStyles/><Login onLogin={setUser}/></>);

  const nav = [
    { id:"dashboard", l:"Dashboard",     i:"📊" },
    { id:"new",       l:"Buat Laporan",  i:"📝" },
    { id:"log",       l:"Semua Laporan", i:"📋" },
    { id:"rh",        l:"RH & Cons ME",  i:"⛽" },
    { id:"mgmt",      l:"Management Report", i:"📈" },
  ];

  const addReport = async (r) => { await loadReports(); setPage("dashboard"); };
  const updateReport = async (r) => { await loadReports(); setPage("log"); };
  const startEdit = r => { setViewing(null); setEditing(r); setPage("edit"); };
  const deleteReport = async (id) => {
    try {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (error) throw error;
      setReports(p => p.filter(x => x.id !== id));
      setViewing(null);
    } catch (err) { alert("Gagal: " + err.message); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div style={ss.app}>
      <GlobalStyles/>
      <header style={ss.hdr}>
        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                    <img src="/mmm-logo.png" alt="MMM" style={{ width:34, height:24 }} onError={(e)=>{e.target.style.display='none'}}/>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.accent }}>Voyage Report Portal</div>
            <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", display: isMobile ? "none" : "block" }}>PT Mentari Mas Multimoda</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:11, color:C.muted, background:C.bg3, border:`1px solid ${C.border}`, padding:"4px 11px", borderRadius:20 }}>
            {user.role==="master"?"👨‍✈️":"🏢"}{!isMobile && ` ${user.name}`}
          </span>
          <button
            style={{ ...ss.btnG, fontSize:11, padding:"6px 10px" }}
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Mode Siang" : "Mode Malam"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button style={{ ...ss.btnG, fontSize:11 }} onClick={handleLogout}>Keluar</button>
        </div>
      </header>
      <div style={ss.layout}>
        {!isMobile && (
          <nav style={ss.nav}>
            <div style={{ fontSize:9, fontWeight:700, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", padding:"4px 12px 8px" }}>Menu</div>
            {nav.map(n => (
              <button key={n.id} style={ss.navItem(page===n.id)} onClick={() => setPage(n.id)}>
                <span>{n.i}</span><span>{n.l}</span>
              </button>
            ))}
          </nav>
        )}
        <main style={{ ...ss.main, paddingBottom: isMobile ? 80 : 22 }}>
          {page==="dashboard" && <Dashboard reports={visibleReports} onNew={() => setPage("new")} user={user} runningHours={runningHours} consMe={consMe}/>}
          {page==="new"       && <ReportForm onSave={addReport} onCancel={() => setPage("dashboard")} allReports={visibleReports} user={user}/>}
          {page==="edit"      && <ReportForm editReport={editing} onUpdate={updateReport} onCancel={() => { setEditing(null); setPage("log"); }} allReports={visibleReports} user={user}/>}
          {page==="log"       && <ReportLog reports={visibleReports} onView={setViewing} user={user}/>}
          {page==="rh"        && <RHConsPage runningHours={runningHours} setRunningHours={setRunningHours} user={user} consMe={consMe} setConsMe={setConsMe}/>}
          {page==="mgmt"      && <ManagementReport reports={visibleReports} runningHours={runningHours} user={user}/>}
        </main>
      </div>
      {viewing && <Modal report={viewing} onClose={() => setViewing(null)} onEdit={() => startEdit(viewing)} onDelete={deleteReport}/>}
      {isMobile && (
        <nav style={ss.bottomNav}>
          {nav.map(n => (
            <button key={n.id} style={ss.bottomNavItem(page===n.id)} onClick={() => setPage(n.id)}>
              <span style={{ fontSize:18 }}>{n.i}</span>
              <span style={{ fontSize:10 }}>{n.l}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
