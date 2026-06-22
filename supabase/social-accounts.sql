create extension if not exists supabase_vault with schema vault;

create table if not exists public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  platform text not null,
  account_label text not null,
  username text,
  login_email text,
  status text not null default 'not_connected',
  scopes text[] not null default '{}',
  access_token_secret_id uuid,
  refresh_token_secret_id uuid,
  credential_secret_id uuid,
  expires_at timestamptz,
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_account_actions (
  id uuid primary key default gen_random_uuid(),
  social_account_id uuid not null references public.social_accounts(id) on delete cascade,
  artist_id uuid not null references public.artists(id) on delete cascade,
  action_type text not null,
  status text not null default 'pending',
  requested_by text,
  approved_by text,
  payload jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  executed_at timestamptz
);

create index if not exists social_accounts_artist_id_idx on public.social_accounts(artist_id);
create index if not exists social_accounts_platform_idx on public.social_accounts(platform);
create index if not exists social_account_actions_account_id_idx on public.social_account_actions(social_account_id);
create index if not exists social_account_actions_status_idx on public.social_account_actions(status);
