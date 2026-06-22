create extension if not exists vector with schema extensions;
create extension if not exists supabase_vault with schema vault;

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  artistic_name text not null,
  legal_name text,
  city text,
  state text,
  genre text,
  audience text,
  tone_of_voice text,
  goals text,
  instagram_url text,
  tiktok_url text,
  youtube_url text,
  spotify_url text,
  status text not null default 'lead',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  title text not null,
  release_type text not null default 'single',
  target_date date,
  status text not null default 'draft',
  audio_status text not null default 'pending',
  cover_status text not null default 'pending',
  technical_sheet_status text not null default 'pending',
  isrc text,
  upc text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references public.artists(id) on delete cascade,
  release_id uuid references public.releases(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo',
  priority text not null default 'normal',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_calendar_items (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  release_id uuid references public.releases(id) on delete set null,
  scheduled_for date not null,
  channel text not null,
  format text not null,
  theme text not null,
  caption text,
  script text,
  cta text,
  objective text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rag_documents (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references public.artists(id) on delete cascade,
  title text not null,
  category text not null,
  source_type text not null default 'manual',
  body text not null,
  visibility text not null default 'workspace',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rag_document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.rag_documents(id) on delete cascade,
  artist_id uuid references public.artists(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

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

create index if not exists artists_status_idx on public.artists(status);
create index if not exists releases_artist_id_idx on public.releases(artist_id);
create index if not exists tasks_artist_id_idx on public.tasks(artist_id);
create index if not exists content_calendar_artist_id_idx on public.content_calendar_items(artist_id);
create index if not exists rag_documents_artist_id_idx on public.rag_documents(artist_id);
create index if not exists rag_document_chunks_document_id_idx on public.rag_document_chunks(document_id);
create index if not exists social_accounts_artist_id_idx on public.social_accounts(artist_id);
create index if not exists social_accounts_platform_idx on public.social_accounts(platform);
create index if not exists social_account_actions_account_id_idx on public.social_account_actions(social_account_id);
create index if not exists social_account_actions_status_idx on public.social_account_actions(status);
create index if not exists planned_posts_artist_id_idx on public.planned_posts(artist_id);
create index if not exists planned_posts_status_idx on public.planned_posts(status);
create index if not exists planned_posts_design_status_idx on public.planned_posts(design_status);
create index if not exists rag_document_chunks_embedding_idx
  on public.rag_document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create or replace function public.match_rag_chunks(
  query_embedding vector(1536),
  match_count int default 8,
  filter_artist_id uuid default null
)
returns table (
  id uuid,
  document_id uuid,
  artist_id uuid,
  content text,
  similarity float
)
language sql
stable
as $$
  select
    rag_document_chunks.id,
    rag_document_chunks.document_id,
    rag_document_chunks.artist_id,
    rag_document_chunks.content,
    1 - (rag_document_chunks.embedding <=> query_embedding) as similarity
  from public.rag_document_chunks
  where rag_document_chunks.embedding is not null
    and (filter_artist_id is null or rag_document_chunks.artist_id = filter_artist_id)
  order by rag_document_chunks.embedding <=> query_embedding
  limit match_count;
$$;
