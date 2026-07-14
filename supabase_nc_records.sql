-- =========================================================
-- NC Database table for Voyage Portal / MMM Ops Hub
-- Run this in Supabase Dashboard → SQL Editor → Run
-- Project: same as Voyage Portal
-- =========================================================

-- 1) Table
create table if not exists public.nc_records (
  no            bigint primary key,          -- No. NC (unique key for upsert)
  vessel        text not null,
  description   text not null default '',
  audit_type    text not null default '',
  cluster1      text not null default '',
  cluster2      text not null default '',
  category      text not null default '',
  sub_category  text not null default '',
  risk          text not null default 'Normal',
  issued_date   date,
  audit_year    text not null default '',
  audit_round   text not null default '',
  due_date      date,
  closed_date   date,
  status        text not null default 'OPEN',  -- OPEN | CLOSED
  remark        text not null default '',
  captain       text not null default '',
  auditor       text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Helpful indexes
create index if not exists nc_records_vessel_idx on public.nc_records (vessel);
create index if not exists nc_records_status_idx on public.nc_records (status);
create index if not exists nc_records_issued_date_idx on public.nc_records (issued_date);

-- updated_at trigger
create or replace function public.set_nc_records_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_nc_records_updated_at on public.nc_records;
create trigger trg_nc_records_updated_at
before update on public.nc_records
for each row execute function public.set_nc_records_updated_at();

-- 2) RLS
alter table public.nc_records enable row level security;

-- Read:
-- - role 'kapal' → only own vessel (profiles.full_name = vessel)
-- - other authenticated roles → all rows
drop policy if exists "nc_records_select" on public.nc_records;
create policy "nc_records_select"
on public.nc_records
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and (
        coalesce(p.role, '') <> 'kapal'
        or p.full_name = nc_records.vessel
      )
  )
);

-- Insert / Update / Delete: non-kapal authenticated only (office)
drop policy if exists "nc_records_insert" on public.nc_records;
create policy "nc_records_insert"
on public.nc_records
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and coalesce(p.role, '') <> 'kapal'
  )
);

drop policy if exists "nc_records_update" on public.nc_records;
create policy "nc_records_update"
on public.nc_records
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and coalesce(p.role, '') <> 'kapal'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and coalesce(p.role, '') <> 'kapal'
  )
);

drop policy if exists "nc_records_delete" on public.nc_records;
create policy "nc_records_delete"
on public.nc_records
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and coalesce(p.role, '') <> 'kapal'
  )
);

-- 3) Optional: allow authenticated upsert via PostgREST
-- (already covered by insert/update policies)

comment on table public.nc_records is 'Non-conformity database for MMM Ops Hub / Voyage Portal';
