# Deploy na Netlify

## Configuracao do projeto

O projeto ja esta preparado para Netlify com:

- `netlify.toml`
- build command: `npm run build`
- publish directory: `.next`
- plugin: `@netlify/plugin-nextjs`

## Variaveis de ambiente obrigatorias

Configure no painel da Netlify em:

Site configuration > Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=
OPENAI_API_KEY=
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4.1-mini
```

## Passo a passo recomendado

1. Subir este projeto para um repositorio GitHub.
2. Entrar em Netlify.
3. Clicar em "Add new site".
4. Escolher "Import an existing project".
5. Conectar GitHub.
6. Selecionar o repositorio.
7. Confirmar:
   - build command: `npm run build`
   - publish directory: `.next`
8. Adicionar as variaveis de ambiente.
9. Clicar em "Deploy".

## Importante

Nao coloque `.env.local` no GitHub. As chaves de producao devem ficar somente nas variaveis de ambiente da Netlify.

Antes de producao publica, gere novas chaves secretas para Supabase e OpenAI, porque as chaves atuais foram usadas no ambiente local durante desenvolvimento.
