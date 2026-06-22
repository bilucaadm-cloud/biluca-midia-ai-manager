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

## 4. Primeira ordem de desenvolvimento

1. Cadastro de artistas.
2. Cadastro de lancamentos.
3. Calendario de conteudo.
4. Upload/cadastro de documentos RAG.
5. Geracao de embeddings.
6. Chat do agente com memoria.

## Observacao

As chaves secretas nunca devem ir para o GitHub ou para o frontend. A `SUPABASE_SECRET_KEY` e a `OPENAI_API_KEY` ficam apenas em ambiente de servidor.
