# MVP Backlog

## Sprint 1: Base do Projeto

- Criar aplicacao web.
- Configurar banco de dados.
- Configurar autenticacao.
- Criar layout principal.
- Criar painel administrativo.

## Sprint 2: CRM de Artistas

- Cadastrar artista.
- Editar artista.
- Listar artistas.
- Visualizar perfil do artista.
- Registrar links sociais.
- Registrar genero, cidade, publico e objetivos.

## Sprint 3: Lancamentos

- Cadastrar lancamento.
- Definir tipo: single, EP ou album.
- Registrar data alvo.
- Registrar status da capa, audio, ficha tecnica e distribuicao.
- Criar checklist automatico.

## Sprint 4: Conteudo e IA

- Criar calendario de conteudo.
- Gerar legenda com IA.
- Gerar roteiro de reels.
- Gerar briefing de arte.
- Salvar conteudos aprovados.

## Sprint 5: RAG

- Criar cadastro de documentos.
- Criar chunks de documentos.
- Gerar embeddings.
- Buscar contexto por similaridade.
- Responder usando prompt mestre e documentos recuperados.

## Sprint 5.5: Instagram Social Media Agent

- Criar banco de posts planejados.
- Criar status: rascunho, aguardando aprovacao, aprovado, publicado.
- Gerar legenda, roteiro, CTA e hashtags.
- Criar briefing de arte para designer.
- Salvar link/caminho da arte aprovada.
- Criar status de design: briefing pronto, em design, recebido, aprovado.
- Criar respostas sugeridas para comentarios.
- Criar fila de publicacao com aprovacao humana.
- Preparar integracao futura com Meta API.

## Sprint 6: WhatsApp Preparado

- Criar scripts de atendimento.
- Criar tela de conversas.
- Registrar mensagens manualmente no MVP.
- Preparar integracao futura com WhatsApp Business API.

## Sprint 7: Dashboard

- Exibir artistas ativos.
- Exibir proximos lancamentos.
- Exibir tarefas pendentes.
- Exibir conteudos planejados.
- Exibir documentos pendentes.

## Sprint 8: Refinamento

- Ajustar permissoes.
- Melhorar UX.
- Criar logs de acoes.
- Criar exportacao de relatorios.
- Preparar deploy.

## Prompt para Codex Implementar o MVP 1

```text
Leia PROJECT_SPEC.md, RAG_AGENT_PROMPT.md, RAG_ARCHITECTURE.md e MVP_BACKLOG.md.

Construa o MVP 1 do Biluca Midia AI Manager usando Next.js, React, Tailwind CSS, Prisma e PostgreSQL/Supabase.

Priorize:
- autenticacao;
- cadastro de artistas;
- cadastro de lancamentos;
- calendario de conteudo;
- gerador de legendas e roteiros com IA;
- base RAG inicial com documentos, chunks e embeddings;
- dashboard simples.

Mantenha o codigo organizado, com telas funcionais e pronto para evoluir.
```
