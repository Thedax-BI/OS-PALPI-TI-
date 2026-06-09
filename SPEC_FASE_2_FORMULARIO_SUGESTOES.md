# SPEC Fase 2 - Formulario e Sugestoes de Jogos

## Objetivo

Melhorar a pagina inicial de lancamento para permitir selecionar jogos ja lancados por outros usuarios e preencher automaticamente data, competicao, mandante e visitante.

Esta fase tambem remove a dependencia principal da lista hardcoded de times em `index.html`, passando a carregar competicoes e times da planilha via Apps Script.

## Dependencias

- Fase 1 concluida.
- Endpoint `action=competitions`.
- Endpoint `action=teams`.
- Endpoint `action=gameSuggestions`.
- POST atual preservado para lancamento de palpites/resultados.

## Arquivos a Criar

### `formulario.js`

Novo arquivo para concentrar a logica do formulario.

Conteudo esperado:

- configuracao do Apps Script;
- utilitarios de DOM;
- carregamento de competicoes;
- carregamento de times;
- carregamento de sugestoes de jogos;
- selecao de jogo sugerido;
- validacao do formulario;
- envio do lancamento;
- estados de carregamento/erro/sucesso.

## Arquivos a Modificar

### `index.html`

Mudancas:

- remover JavaScript inline ou reduzir para inicializacao minima;
- incluir `<script src="formulario.js"></script>`;
- adicionar area de sugestoes de jogos;
- adicionar campo de busca/filtro nas sugestoes, se couber no layout;
- manter formulario manual;
- trocar lista hardcoded de competicoes por select preenchido dinamicamente;
- manter link para `dashboard.html`;
- preparar ponto de montagem para o seletor de tema da Fase 4, sem depender dele.

Estrutura sugerida:

```html
<section class="suggestionsPanel">
  <div class="sectionHeader">
    <h2>Jogos sugeridos</h2>
    <button id="btnReloadSuggestions">Atualizar</button>
  </div>
  <input id="suggestionSearch" />
  <div id="suggestionsList"></div>
</section>
```

### `palpiti.css`

Mudancas:

- adicionar estilos para a nova area de sugestoes;
- adicionar estilos reutilizaveis para formularios, cards de jogo e estados vazios;
- manter compatibilidade com dashboard.

## Modelo de Estado do Front-end

```js
state = {
  competitions: [],
  teams: [],
  suggestions: [],
  selectedGameKey: "",
  isSubmitting: false
}
```

## Detalhamento por Funcao

### `initFormPage()`

Responsabilidade:

- mapear elementos DOM;
- carregar competicoes, times e sugestoes;
- registrar eventos;
- executar validacao inicial.

Pseudocodigo:

```text
buscar elementos do formulario
registrar eventos de change/input/click
await carregar competicoes
await carregar times
await carregar sugestoes
renderizar sugestoes
validar formulario
```

### `fetchCompetitions()`

Responsabilidade:

- chamar `action=competitions`;
- popular select de competicoes;
- usar nome exibido vindo da planilha.

### `fetchTeams()`

Responsabilidade:

- chamar `action=teams`;
- guardar times em memoria;
- permitir filtro por competicao.

### `fetchGameSuggestions()`

Responsabilidade:

- chamar `action=gameSuggestions`;
- guardar jogos em memoria;
- renderizar somente os jogos que batem com busca/filtros locais.

### `renderSuggestions()`

Responsabilidade:

- exibir cards de jogos sugeridos;
- mostrar data, competicao, mandante, visitante e quantidade de palpites;
- mostrar estado vazio quando nao houver jogos.

Card esperado:

```text
10/06/2026
Brasileirao
Corinthians x Palmeiras
3 palpites
[Selecionar jogo]
```

### `selectSuggestedGame(game)`

Responsabilidade:

- preencher `dataJogo`;
- preencher `competicao`;
- carregar times da competicao;
- preencher `mandante` e `visitante`;
- limpar placares;
- focar no primeiro campo de gols;
- atualizar mensagem de contexto.

Pseudocodigo:

```text
dataJogo.value = game.dataJogo
competicao.value = game.competicao
preencherTimes(game.competicao)
mandante.value = game.mandante
visitante.value = game.visitante
golsMandante.value = ""
golsVisitante.value = ""
selectedGameKey = game.key
validarFormulario()
```

### `fillTeamsForCompetition(competicao)`

Responsabilidade:

- filtrar `state.teams` por `campeonato === competicao`;
- popular selects `mandante` e `visitante`;
- desabilitar selects se nao houver times;
- preservar valor quando possivel.

### `validateForm()`

Responsabilidade:

- manter validacoes atuais;
- impedir times iguais;
- exigir placares inteiros e nao negativos;
- exigir tipo de lancamento;
- desabilitar botao de envio enquanto invalido.

### `submitEntry(event)`

Responsabilidade:

- manter contrato atual de envio;
- enviar via `POST` para Apps Script;
- preservar campos atuais;
- mostrar estado de envio;
- apos envio, recarregar sugestoes para refletir contagem atualizada.

Campos enviados:

```text
secret, nome, dataJogo, competicao, mandante, golsMandante, visitante, golsVisitante, tipoLancamento, createdAt
```

## Regras de UX

- O usuario deve conseguir lancar jogo manualmente mesmo sem selecionar sugestao.
- Selecionar jogo nao deve travar campos; o usuario pode corrigir antes de enviar.
- Sugestoes devem aparecer antes do formulario em mobile ou em coluna lateral no desktop.
- Se o Apps Script falhar, o formulario manual deve continuar utilizavel quando possivel.
- O texto de sucesso nao deve afirmar confirmacao definitiva se o `fetch no-cors` nao permitir ler a resposta.

## Sequencia de Implementacao

1. Criar `formulario.js`.
2. Mover logica atual inline de `index.html` para `formulario.js`.
3. Substituir competicoes hardcoded por `fetchCompetitions()`.
4. Substituir times hardcoded por `fetchTeams()`.
5. Adicionar area de sugestoes em `index.html`.
6. Implementar `fetchGameSuggestions()` e `renderSuggestions()`.
7. Implementar `selectSuggestedGame()`.
8. Revisar validacao do formulario.
9. Ajustar estilos em `palpiti.css`.
10. Testar envio manual e envio por sugestao.
11. Atualizar `ORDEM_IMPLEMENTACAO_MELHORIAS.md` marcando Fase 2 como concluida.

## Criterios de Aceite

- Competicoes aparecem no select vindo da planilha.
- Times aparecem conforme competicao selecionada.
- Sugestoes de jogos futuros/pendentes aparecem no formulario.
- Botao `Selecionar jogo` preenche data, competicao, mandante e visitante.
- Usuario pode editar os campos apos selecionar uma sugestao.
- Mandante e visitante iguais continuam bloqueados.
- Envio manual continua funcionando.
- Envio de jogo selecionado cria registro compativel com dashboard.
- Layout funciona em mobile e desktop sem sobreposicao.

## Riscos

- Se `action=gameSuggestions` ficar lento, a pagina inicial pode parecer travada.
- Times sem logo nao devem quebrar o card.
- Competicoes antigas podem ter codigos diferentes dos usados hoje no dashboard.
- Como o envio atual usa `no-cors`, a confirmacao de sucesso continua limitada.
