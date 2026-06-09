# SPEC Fase 3 - Area Administrativa

## Objetivo

Criar uma area administrativa simples, protegida por senha unica, para corrigir dados sem editar manualmente a planilha.

A area deve permitir:

- listar lancamentos;
- excluir logicamente lancamentos errados;
- cadastrar e editar times;
- cadastrar e editar competicoes;
- ativar/desativar times e competicoes.

## Dependencias

- Fase 1 concluida.
- Endpoints administrativos funcionando.
- Campos `id`, `status`, `deletedAt`, `deletedBy`, `deleteReason` disponiveis na aba `respostas`.
- Aba `competicoes` disponivel.
- Aba `times` com campos de status disponiveis.

## Arquivos a Criar

### `admin.html`

Tela administrativa estatica.

Conteudo esperado:

- formulario de senha;
- area autenticada;
- abas ou secoes para `Lancamentos`, `Times` e `Competicoes`;
- filtros;
- tabelas simples;
- formularios de cadastro/edicao;
- mensagens de erro/sucesso.

### `admin.js`

Logica da area administrativa.

Conteudo esperado:

- login administrativo;
- armazenamento temporario do token em memoria ou `sessionStorage`;
- carregamento de lancamentos;
- exclusao logica;
- carregamento e gravacao de times;
- carregamento e gravacao de competicoes;
- validacoes client-side basicas.

## Arquivos a Modificar

### `dashboard.html`

Mudancas:

- adicionar link discreto para `admin.html`;
- manter dashboard como foco principal.

### `index.html`

Mudancas:

- adicionar link discreto para `admin.html`, se aprovado visualmente;
- manter fluxo comum sem expor acoes administrativas.

### `palpiti.css`

Mudancas:

- adicionar estilos para telas administrativas;
- reutilizar componentes de botoes, campos, tabelas e mensagens;
- manter layout responsivo.

## Fluxo de Autenticacao

1. Admin abre `admin.html`.
2. Digita a senha unica.
3. `admin.js` chama `action=adminLogin`.
4. Apps Script valida senha em `PropertiesService`.
5. Apps Script retorna token temporario.
6. `admin.js` usa o token nas demais chamadas administrativas.

Regras:

- Senha nao deve ser hardcoded.
- Token deve expirar.
- Ao expirar, a tela deve pedir login novamente.
- `sessionStorage` pode ser usado para manter token durante a aba aberta.

## Detalhamento por Secao

### Login

Elementos:

- campo senha;
- botao entrar;
- mensagem de erro.

Comportamento:

- botao desabilitado com senha vazia;
- erro claro em senha invalida;
- apos login, esconder bloco de senha e mostrar admin.

### Lancamentos

Filtros:

- status: `ativo`, `excluido`, todos;
- tipo: `palpite`, `resultado`, todos;
- palpiteiro;
- competicao;
- data inicial/final;
- busca por time.

Tabela:

```text
Data | Competicao | Jogo | Tipo | Nome | Placar | Status | Acoes
```

Acao principal:

- `Excluir logicamente`.

Confirmacao:

- abrir modal ou bloco de confirmacao;
- pedir motivo opcional;
- confirmar antes de enviar.

Pseudocodigo:

```text
ao clicar excluir:
  guardar id selecionado
  abrir confirmacao
ao confirmar:
  chamar adminDeleteEntry(token, id, reason)
  recarregar lancamentos
  verificar que status virou excluido
```

### Times

Formulario:

```text
Nome do time
Competicao
URL do logo
Ativo
```

Tabela:

```text
Time | Competicao | Logo | Ativo | Acoes
```

Regras:

- time e competicao sao obrigatorios;
- logo e opcional;
- URL invalida nao deve impedir cadastro, mas deve avisar o usuario;
- edicao deve reaproveitar o mesmo formulario.

### Competicoes

Formulario:

```text
Nome exibido
Ordem
Ativa
```

Regras:

- usuario informa somente o nome;
- codigo e gerado automaticamente no Apps Script;
- mostrar preview do codigo apenas como informativo, se implementado no front-end;
- permitir desativar competicao sem apagar historico.

Tabela:

```text
Codigo | Nome | Ordem | Ativa | Acoes
```

## Funcoes em `admin.js`

### `initAdminPage()`

Responsabilidade:

- mapear DOM;
- registrar eventos;
- restaurar token de `sessionStorage`, se existir;
- carregar dados quando autenticado.

### `loginAdmin(password)`

Responsabilidade:

- chamar endpoint de login;
- armazenar token temporario;
- carregar dados iniciais.

### `loadEntries(filters)`

Responsabilidade:

- chamar `action=adminEntries`;
- renderizar tabela;
- aplicar estado de loading.

### `deleteEntry(id, reason)`

Responsabilidade:

- chamar `action=adminDeleteEntry`;
- recarregar lista;
- exibir confirmacao visual apenas apos verificar status atualizado.

### `loadTeams()`

Responsabilidade:

- carregar times, incluindo inativos quando admin;
- renderizar tabela e selects.

### `saveTeam(formData)`

Responsabilidade:

- validar campos;
- chamar `action=adminUpsertTeam`;
- recarregar times.

### `loadCompetitions()`

Responsabilidade:

- carregar competicoes, incluindo inativas quando admin;
- renderizar tabela.

### `saveCompetition(formData)`

Responsabilidade:

- validar nome;
- chamar `action=adminUpsertCompetition`;
- recarregar competicoes.

## Sequencia de Implementacao

1. Criar `admin.html`.
2. Criar `admin.js`.
3. Implementar login administrativo.
4. Implementar listagem de lancamentos.
5. Implementar exclusao logica com confirmacao.
6. Implementar listagem e edicao de times.
7. Implementar listagem e edicao de competicoes.
8. Adicionar links para admin em `dashboard.html` e/ou `index.html`.
9. Ajustar estilos em `palpiti.css`.
10. Testar senha invalida, token expirado e exclusao logica.
11. Atualizar `ORDEM_IMPLEMENTACAO_MELHORIAS.md` marcando Fase 3 como concluida.

## Criterios de Aceite

- Usuario sem senha nao ve dados administrativos.
- Senha valida libera a area admin.
- Token expirado exige novo login.
- Admin consegue filtrar lancamentos.
- Admin consegue excluir logicamente um lancamento.
- Lancamento excluido some do dashboard e das sugestoes.
- Admin consegue cadastrar/editar time.
- Time cadastrado aparece no formulario e dashboard.
- Admin consegue cadastrar/editar competicao.
- Competicao cadastrada aparece no formulario.
- Nenhuma senha fica versionada.

## Riscos

- JSONP e tokens em URL tem limitacoes de seguranca.
- Exclusao logica depende de `id` confiavel em registros antigos.
- Um erro no filtro de status pode esconder dados que ainda existem.
- Links de logo podem falhar por CORS, hotlink ou permissao.
