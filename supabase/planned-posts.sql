create table if not exists public.planned_posts (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  release_id uuid references public.releases(id) on delete set null,
  social_account_id uuid references public.social_accounts(id) on delete set null,
  channel text not null default 'instagram',
  format text not null,
  title text not null,
  caption text,
  script text,
  cta text,
  hashtags text[] not null default '{}',
  design_brief text,
  design_status text not null default 'not_requested',
  artwork_url text,
  scheduled_for timestamptz,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists planned_posts_artist_id_idx on public.planned_posts(artist_id);
create index if not exists planned_posts_status_idx on public.planned_posts(status);
create index if not exists planned_posts_design_status_idx on public.planned_posts(design_status);
