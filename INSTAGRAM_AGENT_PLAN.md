# Instagram Social Media Agent

## Objetivo

Criar um agente focado em artistas e generos musicais do Brasil que execute grande parte da rotina de social media no Instagram.

## O que o agente deve fazer

### MVP

- cadastrar artista, publico, genero, tom de voz e objetivos;
- criar calendario de conteudo;
- gerar legendas;
- gerar roteiros de Reels;
- gerar ideias de Stories;
- sugerir hashtags e CTAs;
- criar respostas sugeridas para comentarios;
- criar mensagens de atendimento;
- organizar status de aprovacao;
- registrar tarefas e pendencias.

### Integracao Meta API

- publicar fotos, videos e Reels em contas profissionais;
- responder comentarios em midias do artista;
- identificar mencoes ao perfil;
- coletar metricas e insights;
- gerar relatorios semanais;
- responder DMs quando permitido pela API e pelas regras de permissao.

## Regras de seguranca

- No inicio, toda publicacao precisa de aprovacao humana.
- Comentarios ofensivos, sensiveis ou juridicos devem virar tarefa de revisao.
- O agente nao deve prometer streams, seguidores ou playlist garantida.
- O agente deve seguir o tom de voz do artista.
- Acoes com API devem gerar log.

## Ordem de implementacao

1. Conteudos sugeridos pelo agente.
2. Calendario editorial.
3. Aprovacao de posts.
4. Banco de posts aprovados.
5. Conexao com Meta for Developers.
6. Publicacao em modo aprovado.
7. Comentarios e respostas.
8. Insights e relatorios.
9. Automacao com limites e revisao.

## Observacao

O Instagram exige contas profissionais e permissoes da Meta para publicar, responder comentarios, acessar insights e usar mensageria. Por isso, o agente deve primeiro funcionar como copiloto operacional e depois ganhar automacoes oficiais.
