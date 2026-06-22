create table if not exists public.design_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_name text,
  description text not null,
  content_type text,
  platform text,
  requested_by_name text,
  requested_by_email text,
  requested_by_role text,
  approved_by_name text,
  approved_by_email text,
  approved_by_role text,
  approved_at timestamptz,
  asset_url text,
  asset_path text,
  file_name text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.design_requests add column if not exists requested_by_name text;
alter table public.design_requests add column if not exists requested_by_email text;
alter table public.design_requests add column if not exists requested_by_role text;
alter table public.design_requests add column if not exists approved_by_name text;
alter table public.design_requests add column if not exists approved_by_email text;
alter table public.design_requests add column if not exists approved_by_role text;
alter table public.design_requests add column if not exists approved_at timestamptz;
alter table public.design_requests add column if not exists asset_path text;

create index if not exists design_requests_status_idx
  on public.design_requests(status);

create index if not exists design_requests_created_at_idx
  on public.design_requests(created_at desc);
