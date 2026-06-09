# SPEC Fase 4 - Tema Claro/Escuro e GitHub Pages de QA

## Objetivo

Finalizar a experiencia visual com suporte a tema claro e escuro e configurar um ambiente de QA publicado via GitHub Pages separado da `main`.

Esta fase tambem valida responsividade e navegacao entre formulario, dashboard e admin.

## Dependencias

- Fase 1 concluida.
- Fase 2 concluida.
- Fase 3 concluida.
- Branch `qa` existente no remoto.
- Permissao no GitHub para configurar Pages/Actions.

## Arquivos a Criar

### `theme.js`

Modulo compartilhado de tema.

Conteudo esperado:

- detectar preferencia inicial;
- aplicar `data-theme` no `document.documentElement`;
- persistir tema em `localStorage`;
- alternar tema por botao;
- atualizar `aria-label`/texto auxiliar do controle.

### `.github/workflows/deploy-qa-pages.yml`

Workflow para publicar a branch `qa` no GitHub Pages de QA.

Conteudo esperado:

- disparar em push para `qa`;
- publicar arquivos estaticos do repositorio;
- nao publicar secrets;
- ignorar arquivos de documentacao se a decisao visual for publicar apenas app.

Observacao:

- GitHub Pages por repositorio normalmente publica um unico site por configuracao.
- Se ja existir Pages de producao para `main`, o QA separado deve usar repositorio separado, ambiente separado ou outra solucao de hosting.
- Se nao existir Pages de producao, o Pages deste repositorio pode ser dedicado a QA.

## Arquivos a Modificar

### `index.html`

Mudancas:

- incluir `theme.js`;
- adicionar botao de alternancia de tema;
- remover estilos inline remanescentes que dificultem o tema;
- usar classes e variaveis de `palpiti.css`.

### `dashboard.html`

Mudancas:

- incluir `theme.js`;
- adicionar botao de alternancia de tema;
- ajustar cabecalho/navegacao;
- garantir compatibilidade com DataTables.

### `admin.html`

Mudancas:

- incluir `theme.js`;
- adicionar botao de alternancia de tema;
- usar os mesmos tokens visuais.

### `palpiti.css`

Mudancas:

- criar tokens para tema escuro e claro;
- substituir cores fixas por variaveis;
- revisar contraste;
- revisar cards, tabelas, filtros, formularios, badges e botoes;
- reduzir visual excessivamente monocromatico;
- garantir layouts sem sobreposicao em mobile.

## Contrato de Tema

### Chave de persistencia

```text
ospalpiti.theme
```

Valores aceitos:

```text
dark
light
```

### Aplicacao no DOM

```html
<html data-theme="dark">
```

ou

```html
<html data-theme="light">
```

### Ordem de preferencia

1. Valor salvo em `localStorage`.
2. `prefers-color-scheme`.
3. `dark` como fallback.

## Tokens CSS Minimos

```css
:root,
[data-theme="dark"] {
  --bg: #0b1020;
  --surface: #0f172a;
  --surface-2: #111827;
  --text: #e5e7eb;
  --muted: #94a3b8;
  --line: #1f3a5f;
  --accent: #3b82f6;
  --ok: #22c55e;
  --warn: #f59e0b;
  --bad: #ef4444;
}

[data-theme="light"] {
  --bg: #f5f7fb;
  --surface: #ffffff;
  --surface-2: #eef2f7;
  --text: #172033;
  --muted: #60708a;
  --line: #c8d3e2;
  --accent: #2563eb;
  --ok: #15803d;
  --warn: #b45309;
  --bad: #dc2626;
}
```

Os valores finais podem ser ajustados durante implementacao, desde que mantenham contraste e nao criem tema dominado por uma unica cor.

## Detalhamento por Funcao em `theme.js`

### `getStoredTheme()`

Responsabilidade:

- ler `localStorage`;
- retornar apenas `dark` ou `light`.

### `getPreferredTheme()`

Responsabilidade:

- usar tema salvo se existir;
- caso contrario, usar `window.matchMedia("(prefers-color-scheme: light)")`;
- fallback `dark`.

### `applyTheme(theme)`

Responsabilidade:

- setar `document.documentElement.dataset.theme`;
- atualizar metatag `color-scheme`, se necessario;
- disparar evento customizado opcional `themechange`.

### `toggleTheme()`

Responsabilidade:

- alternar tema atual;
- persistir preferencia;
- reaplicar tema.

### `bindThemeToggle(selector)`

Responsabilidade:

- ligar o botao de tema da pagina atual;
- atualizar label e estado acessivel.

## GitHub Pages de QA

### Branch de origem

```text
qa
```

### Workflow esperado

Pseudocodigo:

```text
on push em qa:
  checkout codigo
  preparar artefato estatico
  publicar no GitHub Pages
```

### Arquivos publicados

Minimo:

```text
index.html
dashboard.html
admin.html
palpiti.css
palpiti.js
formulario.js
admin.js
theme.js
```

Arquivos de documentacao podem ficar fora do artefato publicado se o workflow copiar apenas os arquivos do app.

## Sequencia de Implementacao

1. Criar `theme.js`.
2. Refatorar `palpiti.css` para tokens de tema.
3. Ajustar `index.html` para usar CSS compartilhado e botao de tema.
4. Ajustar `dashboard.html` para botao de tema e navegacao.
5. Ajustar `admin.html` para botao de tema.
6. Testar formulario em claro/escuro.
7. Testar dashboard em claro/escuro.
8. Testar admin em claro/escuro.
9. Criar workflow de GitHub Pages de QA.
10. Fazer merge da branch de implementacao em `qa`.
11. Validar URL de QA.
12. Atualizar `ORDEM_IMPLEMENTACAO_MELHORIAS.md` marcando Fase 4 como concluida.

## Criterios de Aceite

- Tema claro e escuro funcionam em formulario, dashboard e admin.
- Preferencia permanece apos recarregar.
- Primeira visita respeita `prefers-color-scheme`.
- Textos, inputs, tabelas, badges e botoes tem contraste adequado.
- Layout nao tem texto sobreposto em mobile.
- GitHub Pages publica a branch `qa`.
- Existe URL de QA para validar antes da PR para `main`.
- `main` nao e alterada diretamente para testar QA.

## Riscos

- GitHub Pages pode exigir configuracao manual no repositorio.
- Se ja houver Pages de producao, um unico Pages por repositorio pode conflitar com a ideia de QA separado.
- DataTables pode aplicar estilos proprios que precisam de overrides nos dois temas.
- Refatorar cores fixas pode causar regressao visual se nao for testado em todas as telas.
