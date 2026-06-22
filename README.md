# Biluca Midia AI Manager

Sistema web para um agente RAG focado em gestao musical, lancamentos, social media, WhatsApp e operacao de artistas.

## Stack escolhida

- Next.js para o painel web.
- Supabase para banco, auth, storage e RAG com pgvector.
- OpenAI para geracao de conteudo e embeddings.
- Netlify para hospedagem do app.

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Configuracao

1. Crie um projeto no Supabase.
2. Copie `.env.example` para `.env.local`.
3. Preencha as variaveis do Supabase e da OpenAI.
4. Rode o SQL em `supabase/schema.sql` no SQL Editor do Supabase.

## Modulos iniciais

- cadastro de artistas;
- cadastro de lancamentos;
- calendario de conteudo;
- tarefas;
- documentos para RAG;
- chunks com embeddings;
- interface do agente.

## Documentacao do produto

- `PROJECT_SPEC.md`
- `RAG_AGENT_PROMPT.md`
- `RAG_ARCHITECTURE.md`
- `MVP_BACKLOG.md`
