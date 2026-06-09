# SPEC Fase 1 - Dados e Apps Script

## Objetivo

Preparar a base de dados e o Apps Script para suportar as demais fases sem quebrar o formulario e o dashboard atuais.

Esta fase cria o contrato de dados para:

- ids unicos em lancamentos;
- exclusao logica;
- competicoes cadastraveis com codigo automatico;
- times ativos/inativos;
- sugestoes de jogos;
- acoes administrativas protegidas por senha unica.

## Dependencias

- PRD: `PRD_MELHORIAS_PALPITES_QA.md`.
- Planilha Google `respostas`.
- Aba atual `respostas`.
- Aba atual `times`.
- Apps Script Web App atual.
- Front-end atual em `index.html`, `dashboard.html`, `palpiti.js` e `palpiti.css`.

## Decisoes de Produto Aplicadas

- A senha administrativa sera unica e compartilhada.
- A senha nunca sera gravada em arquivo versionado.
- Lancamentos serao removidos apenas por exclusao logica.
- Codigo de competicao sera gerado automaticamente a partir do nome.
- Google Sheets continua sendo o banco de dados.

## Arquivos a Criar

### `apps-script/Code.gs`

Arquivo recomendado para versionar o Apps Script no repositorio.

Conteudo esperado:

- constantes de configuracao;
- handlers `doGet(e)` e `doPost(e)`;
- funcoes de leitura da planilha;
- funcoes de migracao leve de cabecalhos;
- endpoints publicos usados pelo dashboard/formulario;
- endpoints administrativos.

Observacao: se o codigo atual do Apps Script nao estiver disponivel localmente, a primeira tarefa da implementacao deve ser copiar a versao atual para este arquivo antes de alterar comportamento.

### `apps-script/appsscript.json`

Manifesto recomendado do Apps Script.

Conteudo esperado:

- timezone `America/Sao_Paulo`;
- runtime V8;
- scopes minimos para leitura/escrita na planilha.

## Arquivos a Modificar

### Google Sheets - aba `respostas`

Cabecalhos atuais:

```text
createdAt, nome, dataJogo, competicao, mandante, golsMandante, visitante, golsVisitante, tipoLancamento
```

Cabecalhos finais esperados, preservando os atuais e adicionando campos no fim:

```text
createdAt, nome, dataJogo, competicao, mandante, golsMandante, visitante, golsVisitante, tipoLancamento, id, status, deletedAt, deletedBy, deleteReason
```

Regras:

- `id`: identificador unico estavel do lancamento.
- `status`: `ativo` ou `excluido`.
- `deletedAt`: data/hora da exclusao logica, em `America/Sao_Paulo`.
- `deletedBy`: identificador simples de quem excluiu, inicialmente `admin`.
- `deleteReason`: motivo opcional informado no admin.

Compatibilidade:

- registros antigos sem `id` devem receber `id` em migracao leve;
- registros antigos sem `status` devem ser tratados como `ativo`;
- os campos atuais nao devem ser renomeados.

### Google Sheets - aba `times`

Cabecalhos atuais:

```text
time, campeonato, logo
```

Cabecalhos finais esperados:

```text
time, campeonato, logo, ativo, createdAt, updatedAt
```

Regras:

- `campeonato` continua guardando o codigo da competicao.
- `ativo` vazio deve ser tratado como ativo para compatibilidade.
- `logo` pode ficar vazio; o front-end deve usar fallback.

### Google Sheets - nova aba `competicoes`

Cabecalhos:

```text
competicao, nome, ativa, ordem, createdAt, updatedAt
```

Regras:

- `competicao`: codigo automatico gerado a partir de `nome`.
- `nome`: nome exibido no formulario e dashboard.
- `ativa`: `TRUE` ou `FALSE`.
- `ordem`: numero usado para ordenar selects.
- competicoes ja hardcoded no codigo atual devem ser migradas para esta aba.

## Contrato de Endpoints

Todos os endpoints devem manter `ok: true` em sucesso e `ok: false` com `error` em falha.

### `GET action=list`

Uso atual: dashboard.

Comportamento esperado:

- manter formato atual `rows`;
- retornar apenas registros ativos por padrao;
- aceitar `includeDeleted=true` somente quando validado para admin;
- preencher `id` e `status` quando existirem.

Resposta:

```json
{
  "ok": true,
  "rows": []
}
```

### `GET action=teams`

Uso atual: dashboard e formulario futuro.

Comportamento esperado:

- retornar times ativos por padrao;
- manter campos `time`, `campeonato`, `logo`;
- incluir `ativo` quando existir.

Resposta:

```json
{
  "ok": true,
  "teams": []
}
```

### `GET action=competitions`

Novo endpoint.

Comportamento esperado:

- retornar competicoes ativas por padrao;
- ordenar por `ordem`, depois `nome`;
- se a aba `competicoes` ainda nao existir, cria-la e popular dados iniciais conhecidos.

Resposta:

```json
{
  "ok": true,
  "competitions": [
    {
      "competicao": "brasileirao",
      "nome": "Brasileirao",
      "ativa": true,
      "ordem": 10
    }
  ]
}
```

### `GET action=gameSuggestions`

Novo endpoint.

Parametros:

- `fromDate`: opcional, padrao hoje em `America/Sao_Paulo`.
- `limit`: opcional, padrao 20.
- `includeWithResult`: opcional, padrao `false`.

Comportamento esperado:

- considerar apenas registros ativos;
- agrupar por `dataJogo`, `competicao`, `mandante`, `visitante`;
- retornar jogos de hoje em diante;
- por padrao, omitir jogos que ja possuem resultado;
- ordenar por data ascendente;
- incluir contagem de palpites.

Resposta:

```json
{
  "ok": true,
  "games": [
    {
      "key": "2026-06-10|brasileirao|Corinthians|Palmeiras",
      "dataJogo": "2026-06-10",
      "competicao": "brasileirao",
      "competicaoNome": "Brasileirao",
      "mandante": "Corinthians",
      "visitante": "Palmeiras",
      "palpites": 3,
      "hasResultado": false
    }
  ]
}
```

### `POST` sem `action`

Uso atual: formulario de lancamento.

Comportamento esperado:

- manter compatibilidade com o envio atual;
- continuar aceitando os campos existentes;
- gerar `id` automaticamente;
- gravar `status=ativo`;
- preencher `createdAt` quando nao vier do front-end.

### `GET/POST action=adminLogin`

Novo endpoint administrativo.

Comportamento esperado:

- validar senha unica contra `PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD")`;
- retornar um token temporario quando a senha for valida;
- armazenar o token em `CacheService` com expiracao curta.

Resposta:

```json
{
  "ok": true,
  "token": "token-temporario",
  "expiresInSeconds": 1800
}
```

Nota tecnica:

- Como o front-end sera estatico e o Apps Script tem limitacoes de CORS, a implementacao pode usar JSONP para respostas legiveis.
- Se JSONP for usado no login, a senha passara pela URL naquele request. Isso deve ser registrado como risco operacional, mas a senha continua fora do codigo versionado.

### `GET action=adminEntries`

Novo endpoint administrativo.

Parametros:

- `token`;
- filtros opcionais: `tipoLancamento`, `nome`, `dataInicio`, `dataFim`, `competicao`, `status`, `q`.

Comportamento esperado:

- validar token;
- retornar lancamentos ativos e excluidos conforme filtro;
- ordenar por `createdAt` decrescente;
- limitar volume inicial, por exemplo 200 registros.

### `POST action=adminDeleteEntry`

Novo endpoint administrativo.

Parametros:

- `token`;
- `id`;
- `reason`.

Comportamento esperado:

- validar token;
- localizar lancamento por `id`;
- setar `status=excluido`;
- preencher `deletedAt`, `deletedBy=admin`, `deleteReason`;
- nao remover linha fisicamente.

### `POST action=adminUpsertTeam`

Novo endpoint administrativo.

Parametros:

- `token`;
- `time`;
- `campeonato`;
- `logo`;
- `ativo`.

Comportamento esperado:

- validar token;
- criar ou atualizar time por chave `campeonato + time`;
- preencher `createdAt` na criacao;
- preencher `updatedAt` em toda alteracao.

### `POST action=adminUpsertCompetition`

Novo endpoint administrativo.

Parametros:

- `token`;
- `nome`;
- `ativa`;
- `ordem`.

Comportamento esperado:

- validar token;
- gerar codigo automatico a partir de `nome`;
- criar ou atualizar competicao por codigo;
- evitar duplicidade de codigo;
- preencher `createdAt` e `updatedAt`.

## Detalhamento por Funcao

### `ensureSheetsAndHeaders()`

Responsabilidade:

- garantir existencia das abas `respostas`, `times` e `competicoes`;
- adicionar cabecalhos ausentes no fim das abas;
- nao apagar nem reordenar colunas existentes.

Pseudocodigo:

```text
para cada aba esperada:
  se aba nao existe:
    criar aba
    escrever cabecalhos completos
  senao:
    ler primeira linha
    para cada cabecalho esperado:
      se nao existe:
        adicionar no fim
```

### `migrateResponseIds()`

Responsabilidade:

- preencher `id` e `status` em registros antigos.

Pseudocodigo:

```text
ler linhas da aba respostas
para cada linha:
  se id vazio:
    gerar id unico
  se status vazio:
    status = ativo
salvar somente celulas alteradas
```

### `generateCompetitionCode(nome)`

Responsabilidade:

- transformar nome em codigo estavel.

Regra sugerida:

- converter para minusculo;
- remover acentos;
- substituir caracteres nao alfanumericos por `_`;
- remover separadores duplicados;
- remover separador no inicio/fim.

Exemplos:

```text
Brasileirao Serie A -> brasileirao_serie_a
Copa do Brasil -> copa_do_brasil
Sul-Americana -> sul_americana
```

### `assertAdminToken(token)`

Responsabilidade:

- validar token temporario no `CacheService`;
- falhar com `unauthorized` quando invalido ou expirado.

### `getActiveRows()`

Responsabilidade:

- retornar apenas lancamentos com `status` diferente de `excluido`;
- tratar status vazio como `ativo`.

## Sequencia de Implementacao

1. Criar `apps-script/Code.gs` com a versao atual do Apps Script.
2. Criar `apps-script/appsscript.json`.
3. Implementar `ensureSheetsAndHeaders()`.
4. Implementar migracao de `id` e `status`.
5. Ajustar append atual para gerar `id` e `status=ativo`.
6. Ajustar `action=list` para ignorar excluidos por padrao.
7. Ajustar `action=teams` para aceitar campo `ativo`.
8. Criar `action=competitions`.
9. Criar `action=gameSuggestions`.
10. Criar autenticacao administrativa.
11. Criar endpoints administrativos.
12. Testar endpoint atual do dashboard para garantir compatibilidade.
13. Atualizar `ORDEM_IMPLEMENTACAO_MELHORIAS.md` marcando Fase 1 como concluida.

## Criterios de Aceite

- Dashboard atual continua carregando dados.
- Formulario atual continua enviando lancamentos.
- Registros novos recebem `id` e `status=ativo`.
- Registros antigos podem ser migrados sem perda de dados.
- `action=list` nao retorna excluidos por padrao.
- `action=teams` retorna dados compativeis com o dashboard atual.
- `action=competitions` retorna competicoes ativas.
- `action=gameSuggestions` retorna jogos futuros/pendentes agrupados.
- Senha administrativa nao aparece em nenhum arquivo versionado.
- Exclusao administrativa altera status para `excluido`, sem apagar linha.

## Riscos

- O Apps Script atual nao esta versionado no repositorio.
- JSONP/Apps Script tem limitacoes de seguranca e CORS.
- Migracao de cabecalhos deve ser idempotente.
- Registros duplicados de times/competicoes podem exigir limpeza manual.
- Se a senha administrativa for compartilhada demais, qualquer pessoa com senha pode excluir logicamente lancamentos.
