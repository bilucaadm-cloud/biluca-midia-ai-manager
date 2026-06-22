# PROJECT_SPEC: Biluca Midia AI Manager

## Visao Geral

O Biluca Midia AI Manager e uma plataforma SaaS com inteligencia artificial para automatizar parte da operacao de uma agencia de marketing musical, gestao artistica e lancamentos digitais.

O sistema deve funcionar como uma equipe digital composta por:

- social media;
- copywriter;
- designer;
- gestor de trafego;
- analista de dados;
- gestor de lancamentos;
- atendimento ao cliente;
- produtor executivo;
- consultor de carreira musical.

O publico-alvo inicial sao artistas independentes, produtores musicais, pequenas gravadoras, escritorios artisticos e agencias.

## Objetivo do Produto

Criar um agente com RAG capaz de responder, planejar, sugerir e executar tarefas com base em documentos internos, dados do artista e historico de interacoes.

O agente deve reduzir trabalho operacional, organizar informacoes e gerar acoes praticas para crescimento artistico.

## Persona do Agente

O agente deve agir como um gestor musical profissional, especialista em marketing digital, lancamentos musicais e crescimento de artistas independentes.

Ele deve:

- responder de forma objetiva e profissional;
- fazer perguntas quando faltarem dados essenciais;
- usar linguagem simples para artistas iniciantes;
- usar linguagem estrategica para gestores, gravadoras e agencias;
- recomendar acoes praticas;
- priorizar crescimento organico antes de midia paga;
- buscar ROI positivo em campanhas;
- nunca inventar dados de plataformas, contratos, royalties ou resultados;
- indicar quando uma resposta depende de integracao externa.

## Modulos do Produto

### 1. Cadastro de Artistas

Dados principais:

- nome artistico;
- nome civil ou responsavel;
- cidade e estado;
- genero musical;
- publico-alvo;
- links sociais;
- links de streaming;
- biografia curta;
- biografia completa;
- identidade visual;
- objetivos de carreira;
- status do contrato;
- documentos pendentes.

### 2. Gestao de Instagram

O agente deve:

- criar calendario mensal de conteudo;
- criar legendas;
- criar ideias de posts;
- criar roteiros de reels;
- sugerir hashtags;
- adaptar conteudo para stories;
- sugerir horarios de postagem;
- responder comentarios e mensagens com tom aprovado;
- gerar relatorios de desempenho quando houver metricas.

Entradas esperadas:

- artista;
- genero;
- cidade;
- publico;
- lancamento atual;
- objetivo da campanha;
- tom de voz;
- referencias.

Saidas esperadas:

- calendario de postagens;
- legenda pronta;
- roteiro de video;
- briefing de arte;
- sugestao de CTA;
- relatorio de proximas acoes.

### 3. Gestao de TikTok

O agente deve:

- identificar oportunidades de conteudo;
- adaptar ideias de Instagram para TikTok;
- criar roteiros curtos;
- sugerir formatos de tendencia;
- orientar gravacao simples;
- criar chamadas para uso de audio da musica.

### 4. Gestao de YouTube

O agente deve:

- criar titulos;
- criar descricoes;
- sugerir thumbnails;
- gerar tags;
- criar capitulos;
- otimizar SEO;
- adaptar releases para descricao de clipes e visualizers.

### 5. Lancamentos Digitais

O sistema deve organizar:

- nome do lancamento;
- tipo: single, EP, album, remix, live session;
- data de lancamento;
- prazo de entrega;
- capa;
- audio master;
- compositores;
- produtores;
- ISRC;
- UPC;
- ficha tecnica;
- distribuidora;
- links finais;
- status do lancamento.

Integracoes futuras:

- ONErpm;
- TuneCore;
- Ditto;
- CD Baby;
- Symphonic;
- Meta;
- Spotify for Artists;
- YouTube Studio.

### 6. Marketing Musical

O agente deve:

- criar plano de campanha;
- definir objetivo;
- sugerir publico-alvo;
- sugerir verba;
- criar criativos;
- criar copies;
- organizar cronograma;
- acompanhar indicadores;
- gerar relatorio executivo.

### 7. Playlists e Relacionamento

O agente deve:

- organizar lista de curadores;
- registrar contatos;
- criar mensagem de pitch;
- acompanhar status;
- sugerir follow-up;
- manter historico.

### 8. WhatsApp

O agente deve atender artistas e leads.

Funcoes:

- onboarding de artistas;
- coleta de documentos;
- status de lancamentos;
- envio de links;
- respostas frequentes;
- cobranca de pendencias;
- abertura de chamados.

O agente deve confirmar informacoes sensiveis antes de registrar ou alterar dados.

### 9. CRM

Pipeline:

- lead;
- primeiro contato;
- proposta enviada;
- contrato;
- ativo;
- pausado;
- cancelado.

Entidades:

- artistas;
- responsaveis;
- gravadoras;
- produtores;
- contratos;
- campanhas;
- lancamentos;
- tarefas.

### 10. Dashboard

Indicadores iniciais:

- artistas ativos;
- proximos lancamentos;
- tarefas pendentes;
- posts planejados;
- campanhas ativas;
- documentos pendentes;
- receita estimada;
- crescimento de seguidores, quando integrado.

## MVP 1

O MVP 1 deve incluir:

- login e autenticacao;
- cadastro de artistas;
- cadastro de lancamentos;
- calendario de conteudo;
- gerador de legendas e roteiros com IA;
- painel de tarefas;
- dashboard simples;
- base RAG inicial;
- estrutura preparada para WhatsApp e Instagram.

## Stack Recomendada

Frontend:

- Next.js;
- React;
- Tailwind CSS.

Backend:

- Node.js;
- NestJS ou API routes do Next.js no MVP;
- Prisma.

Banco:

- PostgreSQL;
- Supabase no inicio.

IA:

- OpenAI;
- embeddings;
- busca vetorial;
- RAG.

Automacoes:

- n8n;
- filas com BullMQ e Redis em versoes futuras.

Arquivos:

- Supabase Storage ou S3.

Autenticacao:

- Supabase Auth no MVP ou JWT proprio.

## Principios de Produto

- primeiro organizar dados, depois automatizar;
- toda resposta da IA deve ser rastreavel pela base de conhecimento quando possivel;
- a IA deve pedir dados faltantes em vez de criar suposicoes fortes;
- automacoes devem ter logs;
- acoes externas como publicar, enviar mensagens e alterar contratos devem exigir confirmacao no inicio do produto.
