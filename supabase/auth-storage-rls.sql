create table if not exists public.app_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'operator',
  created_at timestamptz not null default now()
);

alter table public.app_members enable row level security;
alter table public.artists enable row level security;
alter table public.releases enable row level security;
alter table public.tasks enable row level security;
alter table public.content_calendar_items enable row level security;
alter table public.rag_documents enable row level security;
alter table public.rag_document_chunks enable row level security;
alter table public.social_accounts enable row level security;
alter table public.social_account_actions enable row level security;
alter table public.planned_posts enable row level security;

create policy "Members can read own membership"
on public.app_members
for select
to authenticated
using (user_id = auth.uid());

create policy "Members can read artists"
on public.artists
for select
to authenticated
using (exists (select 1 from public.app_members where user_id = auth.uid()));

create policy "Members can write artists"
on public.artists
for all
to authenticated
using (exists (select 1 from public.app_members where user_id = auth.uid()))
with check (exists (select 1 from public.app_members where user_id = auth.uid()));

create policy "Members can manage releases"
on public.releases
for all
to authenticated
using (exists (select 1 from public.app_members where user_id = auth.uid()))
with check (exists (select 1 from public.app_members where user_id = auth.uid()));

create policy "Members can manage tasks"
on public.tasks
for all
to authenticated
using (exists (select 1 from public.app_members where user_id = auth.uid()))
with check (exists (select 1 from public.app_members where user_id = auth.uid()));

create policy "Members can manage calendar"
on public.content_calendar_items
for all
to authenticated
using (exists (select 1 from public.app_members where user_id = auth.uid()))
with check (exists (select 1 from public.app_members where user_id = auth.uid()));

create policy "Members can manage RAG documents"
on public.rag_documents
for all
to authenticated
using (exists (select 1 from public.app_members where user_id = auth.uid()))
with check (exists (select 1 from public.app_members where user_id = auth.uid()));

create policy "Members can manage RAG chunks"
on public.rag_document_chunks
for all
to authenticated
using (exists (select 1 from public.app_members where user_id = auth.uid()))
with check (exists (select 1 from public.app_members where user_id = auth.uid()));

create policy "Members can manage social accounts"
on public.social_accounts
for all
to authenticated
using (exists (select 1 from public.app_members where user_id = auth.uid()))
with check (exists (select 1 from public.app_members where user_id = auth.uid()));

create policy "Members can manage social actions"
on public.social_account_actions
for all
to authenticated
using (exists (select 1 from public.app_members where user_id = auth.uid()))
with check (exists (select 1 from public.app_members where user_id = auth.uid()));

create policy "Members can manage planned posts"
on public.planned_posts
for all
to authenticated
using (exists (select 1 from public.app_members where user_id = auth.uid()))
with check (exists (select 1 from public.app_members where user_id = auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-artworks',
  'post-artworks',
  false,
  52428800,
  array['image/png', 'image/jpeg', 'image/webp', 'video/mp4']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Members can read post artwork files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'post-artworks'
  and exists (select 1 from public.app_members where user_id = auth.uid())
);

create policy "Members can upload post artwork files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'post-artworks'
  and exists (select 1 from public.app_members where user_id = auth.uid())
);

create policy "Members can update post artwork files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'post-artworks'
  and exists (select 1 from public.app_members where user_id = auth.uid())
)
with check (
  bucket_id = 'post-artworks'
  and exists (select 1 from public.app_members where user_id = auth.uid())
);

create policy "Members can delete post artwork files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'post-artworks'
  and exists (select 1 from public.app_members where user_id = auth.uid())
);

-- After creating your first Supabase Auth user, run this with your email:
-- insert into public.app_members (user_id, email, role)
-- select id, email, 'owner'
-- from auth.users
-- where email = 'seu-email@exemplo.com'
-- on conflict (user_id) do update set role = excluded.role, email = excluded.email;
