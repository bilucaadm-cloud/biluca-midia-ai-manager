# Cofre de Conexoes Sociais

## Decisao de seguranca

O sistema nao deve armazenar senhas brutas de Instagram, TikTok, YouTube ou qualquer outra rede social.

O fluxo correto e:

1. O artista conecta a conta pelo login oficial da plataforma.
2. A plataforma devolve um token OAuth com permissoes especificas.
3. O sistema salva apenas metadados visiveis, como plataforma, usuario, email de login e status.
4. Tokens e credenciais sensiveis ficam criptografados no Supabase Vault.
5. Toda acao do agente gera log e, no MVP, exige aprovacao humana.

## Por que nao guardar senha?

- Senha bruta aumenta risco juridico e operacional.
- Muitas plataformas bloqueiam automacao por login/senha.
- OAuth permite revogar acesso sem trocar senha.
- OAuth limita permissoes por escopo.
- O sistema consegue agir na conta correta sem conhecer a senha.

## Tabelas

### social_accounts

Guarda a conexao de cada artista com cada rede social:

- artista;
- plataforma;
- usuario;
- email de login;
- status;
- escopos permitidos;
- ids dos segredos no Vault;
- data de expiracao;
- data de conexao.

### social_account_actions

Registra cada acao que o agente pretende executar:

- publicar post;
- responder comentario;
- buscar metricas;
- enviar mensagem;
- agendar conteudo;
- renovar token;
- reautenticar conta.

## Status recomendados

- `not_connected`: ainda nao conectada.
- `connected`: pronta para uso.
- `needs_reauth`: token expirado ou permissao perdida.
- `disabled`: conexao desligada manualmente.

## Plataformas planejadas

- Instagram;
- Facebook;
- Threads;
- TikTok;
- YouTube;
- WhatsApp;
- Spotify.

## Regras do agente

- Nunca pedir senha diretamente no chat.
- Nunca exibir tokens na interface.
- Nunca publicar sem autorizacao do responsavel no MVP.
- Sempre registrar quem aprovou a acao.
- Se a conta estiver `needs_reauth`, pedir reconexao.
- Se a plataforma negar permissao, informar o motivo e parar a acao.

## Implementacao por fases

### Fase 1

- Criar tabelas de conexoes e logs.
- Interface para listar contas conectadas por artista.
- Status manual: conectado, pendente ou precisa reconectar.

### Fase 2

- OAuth com Meta/Instagram.
- Salvar tokens no Supabase Vault.
- Criar fila de publicacao aprovada.

### Fase 3

- Comentarios e respostas.
- Insights e relatorios.
- Automacoes com limites por artista.

### Fase 4

- TikTok, YouTube, WhatsApp e outras redes.
