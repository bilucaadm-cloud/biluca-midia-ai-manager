# Arquitetura RAG

## Objetivo

Permitir que o agente responda com base em documentos e dados reais da operacao, evitando respostas genericas.

## Tipos de Conhecimento

### Conhecimento Global

Documentos que valem para todos os artistas:

- processos da empresa;
- modelos de calendario;
- modelos de release;
- politicas comerciais;
- checklists de lancamento;
- scripts de atendimento;
- guias de campanha;
- guias de Instagram, TikTok e YouTube.

### Conhecimento por Artista

Documentos e dados especificos:

- biografia;
- genero;
- publico-alvo;
- tom de voz;
- metas;
- campanhas;
- lancamentos;
- documentos;
- historico de atendimento;
- metricas.

### Conhecimento Transacional

Dados atualizados com frequencia:

- tarefas;
- datas;
- status;
- mensagens;
- pendencias;
- contratos;
- links finais;
- relatorios.

## Fluxo do RAG

1. Usuario envia uma pergunta ou tarefa.
2. Sistema identifica a intencao.
3. Sistema busca documentos relevantes por embeddings.
4. Sistema busca dados estruturados no banco.
5. Sistema monta contexto para o modelo.
6. Modelo responde com base nas fontes.
7. Sistema registra resposta, fontes usadas e proximas tarefas.

## Estrutura Recomendada

Banco relacional:

- users;
- artists;
- releases;
- campaigns;
- content_calendar_items;
- tasks;
- conversations;
- messages;
- documents;
- document_chunks.

Busca vetorial:

- usar pgvector no Supabase/PostgreSQL;
- cada chunk deve ter embedding, metadados e referencia ao documento original.

Metadados recomendados:

- document_id;
- artist_id;
- category;
- source_type;
- created_by;
- created_at;
- version;
- visibility.

## Categorias de Documentos

- company_process;
- artist_profile;
- release_checklist;
- social_media_guide;
- whatsapp_script;
- campaign_template;
- playlist_pitch;
- contract_info;
- report;
- faq.

## Politicas de Resposta

O agente deve informar quando:

- a base nao tem dados suficientes;
- os dados parecem desatualizados;
- existe conflito entre documentos;
- a tarefa depende de integracao externa;
- uma acao precisa de confirmacao humana.

## Exemplo de Prompt com Contexto

```text
Usuario: Crie um calendario de 15 dias para o lancamento do artista X.

Contexto recuperado:
- Perfil do artista X
- Checklist de lancamento
- Guia de Instagram
- Historico da campanha anterior

Instrucao:
Use apenas dados confirmados. Se a data de lancamento nao existir, pergunte antes de montar o cronograma definitivo.
```

## Primeira Versao Simples

Para o MVP, o RAG pode funcionar com:

- upload ou cadastro manual de documentos;
- quebra de texto em chunks;
- embeddings com OpenAI;
- armazenamento em Supabase com pgvector;
- consulta por similaridade;
- resposta usando o prompt mestre.

## Automacoes Futuras

- atualizar base quando artista envia documentos pelo WhatsApp;
- gerar tarefas automaticamente a partir de conversas;
- criar briefing de campanha ao cadastrar lancamento;
- alertar atrasos em lancamentos;
- gerar relatorio semanal.
