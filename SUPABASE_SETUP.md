# Supabase Setup

## 1. Criar projeto

Crie um projeto no Supabase e copie:

- Project URL;
- anon public key;
- service role key.

## 2. Configurar ambiente local

Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=
OPENAI_API_KEY=
```

## 3. Criar tabelas

No painel do Supabase, abra SQL Editor e rode o arquivo:

```text
supabase/schema.sql
```

Depois de criar seu primeiro usuario em Authentication, rode tambem:

```text
supabase/auth-storage-rls.sql
supabase/design-requests.sql
```

Para liberar seu proprio usuario como dono do painel, ajuste o email no final do
arquivo ou rode:

```sql
insert into public.app_members (user_id, email, role)
select id, email, 'owner'
from auth.users
where email = 'seu-email@exemplo.com'
on conflict (user_id) do update set role = excluded.role, email = excluded.email;
```

## 4. Primeira ordem de desenvolvimento

1. Cadastro de artistas.
2. Cadastro de lancamentos.
3. Calendario de conteudo.
4. Login seguro com Supabase Auth.
5. Storage para artes dos posts.
6. Demandas de design com upload real no bucket `post-artworks`.
7. Upload/cadastro de documentos RAG.
8. Geracao de embeddings.
9. Chat do agente com memoria.

## Observacao

As chaves secretas nunca devem ir para o GitHub ou para o frontend. A `SUPABASE_SECRET_KEY` e a `OPENAI_API_KEY` ficam apenas em ambiente de servidor.
