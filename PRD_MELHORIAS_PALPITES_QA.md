# PRD - Melhorias OS PALPI-TI

## Status

Rascunho atualizado com decisoes de produto informadas antes da implementacao.

## Objetivo

Melhorar o fluxo de lancamento de palpites/resultados, reduzir erros de cadastro e preparar um fluxo de QA antes de qualquer mudanca chegar na `main`.

O projeto deve continuar simples, usando a planilha Google como banco de dados, mas com uma experiencia mais guiada:

- o usuario ve jogos ja lancados por outras pessoas e pode selecionar um jogo existente;
- campeonato, mandante e visitante sao preenchidos automaticamente ao selecionar o jogo;
- o visual passa a ter tema claro e escuro;
- uma area administrativa com senha permite corrigir lancamentos errados e manter times/competicoes.

## Decisoes Fechadas

- A area administrativa usara senha unica compartilhada.
- Lancamentos removidos serao tratados apenas com exclusao logica.
- A visualizacao de QA deve ser feita por um GitHub Pages separado.
- O codigo das competicoes sera gerado automaticamente a partir do nome.

## Contexto Atual

Arquitetura atual do repositorio:

- `index.html`: formulario de lancamento, com CSS e JavaScript inline.
- `dashboard.html`: tela do dashboard.
- `palpiti.css`: estilos do dashboard.
- `palpiti.js`: carregamento via Apps Script, normalizacao, ranking, cards de jogos e filtros.
- Google Sheets `respostas`: armazena palpites e resultados.
- Google Sheets `times`: armazena times, campeonatos e links de logos.
- Google Apps Script Web App: camada de leitura/escrita entre front-end e planilha.

Pontos importantes encontrados:

- O formulario ainda usa lista hardcoded de times por competicao.
- O dashboard ja busca logos da aba `times`.
- O dashboard agrupa jogos por `dataJogo`, `competicao`, `mandante` e `visitante`.
- A mesma aba `respostas` guarda `palpite` e `resultado`.
- O `SECRET` existe no front-end, entao ele nao deve ser tratado como senha administrativa real.

## Escopo

### Dentro do Escopo

1. Sugestoes de jogos no formulario
   - Exibir jogos futuros ou pendentes ja cadastrados na planilha.
   - Agrupar sugestoes por data, competicao e confronto.
   - Mostrar dados uteis para escolha: data, competicao, mandante, visitante, logos quando existirem e quantidade de palpites.
   - Botao `Selecionar jogo` para preencher `dataJogo`, `competicao`, `mandante` e `visitante`.
   - Manter campos de gols, nome e tipo de lancamento editaveis.

2. Formulario conectado aos cadastros
   - Remover dependencia principal das listas hardcoded de times.
   - Carregar competicoes e times pela planilha, via Apps Script.
   - Atualizar os selects de times conforme a competicao selecionada.
   - Impedir mandante e visitante iguais.

3. Tema claro e escuro
   - Criar tokens CSS para cores, bordas, superficies, texto e estados.
   - Disponibilizar alternancia entre tema claro e escuro no formulario e no dashboard.
   - Persistir a preferencia em `localStorage`.
   - Respeitar `prefers-color-scheme` como valor inicial.

4. Area administrativa com senha
   - Criar uma tela administrativa simples.
   - Autenticacao por senha unica compartilhada, validada no Apps Script, sem gravar senha no HTML/JS.
   - Listar lancamentos recentes com filtros por tipo, usuario, data, competicao e jogo.
   - Permitir excluir logicamente palpites e resultados lancados incorretamente.
   - Permitir cadastrar/editar times com nome, competicao e link de logo.
   - Permitir cadastrar/editar competicoes com codigo gerado automaticamente a partir do nome.

5. Planilha como banco de dados
   - Manter Google Sheets como fonte de dados.
   - Evoluir abas existentes sem quebrar o dashboard atual.
   - Preferir adicionar colunas no fim das abas para preservar compatibilidade.

6. Fluxo QA
   - Manter `main` como producao.
   - Usar `qa` como branch permanente de homologacao.
   - Trabalhar cada melhoria em branch temporaria.
   - Enviar a branch temporaria para `qa` antes da PR para `main`.
   - Publicar a branch `qa` em um GitHub Pages separado para visualizacao antes da `main`.

### Fora do Escopo

- Substituir Google Sheets por banco relacional.
- Criar login por usuario individual.
- Criar painel completo de auditoria.
- Criar app mobile nativo.
- Alterar a regra de pontuacao atual.
- Automatizar ingestao de tabela oficial de jogos por API externa.

## Arquivos Afetados

### `index.html`

Justificativa: e a tela principal de lancamento.

Mudancas esperadas:

- Adicionar area de sugestoes de jogos acima ou ao lado do formulario.
- Adicionar botao `Selecionar jogo` em cada sugestao.
- Remover ou reduzir listas hardcoded de times.
- Carregar competicoes, times e jogos sugeridos pelo Apps Script.
- Adicionar alternancia de tema.
- Separar JavaScript inline em arquivo proprio, se a implementacao ficar grande.

### `dashboard.html`

Justificativa: precisa manter identidade visual e expor acesso controlado ao fluxo administrativo.

Mudancas esperadas:

- Adicionar alternancia de tema.
- Ajustar navegacao para formulario e area admin.
- Garantir que registros excluidos/cancelados nao aparecam no ranking nem nos cards.

### `palpiti.css`

Justificativa: concentra o visual do dashboard e deve virar base compartilhada.

Mudancas esperadas:

- Criar variaveis de tema claro/escuro.
- Reduzir dependencia de cores fixas.
- Ajustar componentes para funcionar nos dois temas.
- Melhorar layout responsivo dos cards, tabelas, filtros e formularios.

### `palpiti.js`

Justificativa: concentra a leitura dos dados, agrupamento de jogos e ranking.

Mudancas esperadas:

- Ignorar registros excluidos/cancelados.
- Reaproveitar agrupamento de jogos para sugestoes, se criado helper compartilhado.
- Ler competicoes/times vindos da planilha quando necessario.
- Manter compatibilidade com os dados existentes.

### `admin.html` (novo)

Justificativa: area administrativa separada reduz risco de expor acoes destrutivas no fluxo comum.

Conteudo esperado:

- Formulario de senha.
- Lista de lancamentos com filtros.
- Acoes de excluir/cancelar lancamento.
- Cadastro/edicao de time.
- Cadastro/edicao de competicao.

### `admin.js` (novo)

Justificativa: manter regras administrativas separadas do formulario e do dashboard.

Conteudo esperado:

- Login administrativo via Apps Script.
- Chamada de endpoints administrativos.
- Renderizacao da lista de lancamentos.
- Envio de criacao/edicao de times e competicoes.
- Tratamento de erro e estados de carregamento.

### `formulario.js` ou `index.js` (novo, recomendado)

Justificativa: o `index.html` ja tem JavaScript suficiente para justificar separacao.

Conteudo esperado:

- Carregamento de competicoes e times.
- Carregamento de sugestoes de jogos.
- Selecao de jogo sugerido.
- Validacao do formulario.
- Envio do lancamento.
- Aplicacao do tema.

### `theme.js` (novo, opcional)

Justificativa: evitar duplicar logica de tema em tres telas.

Conteudo esperado:

- Detectar tema inicial.
- Aplicar `data-theme` no documento.
- Persistir preferencia em `localStorage`.
- Atualizar estado do botao de tema.

### Google Apps Script Web App

Justificativa: toda escrita/leitura passa por ele.

Mudancas esperadas:

- Adicionar endpoint para listar jogos sugeridos.
- Adicionar endpoint para listar competicoes.
- Evoluir endpoint de times para considerar registros ativos.
- Adicionar acoes administrativas protegidas por senha.
- Validar senha administrativa no backend, usando `PropertiesService`, nunca no front-end.
- Adicionar suporte a exclusao logica de lancamentos.

Recomendacao: versionar o codigo do Apps Script no repositorio em uma pasta como `apps-script/`, para que mudancas de backend tambem passem por branch, QA e PR.

### Google Sheets

Justificativa: segue como banco de dados.

Mudancas esperadas:

- Aba `respostas`: adicionar identificador unico e campos de exclusao logica.
- Aba `times`: manter `time`, `campeonato`, `logo` e adicionar status ativo se necessario.
- Nova aba `competicoes`: guardar codigo gerado automaticamente, nome exibido, status e ordem.

## Mudancas Necessarias

### Sugestoes de Jogos

O formulario deve carregar uma lista de jogos ja existentes na planilha. Um jogo existente e identificado por:

```text
dataJogo + competicao + mandante + visitante
```

Regra sugerida:

- exibir jogos de hoje em diante;
- incluir jogos sem resultado cadastrado;
- ordenar primeiro pelos jogos mais proximos;
- mostrar, no maximo, os proximos 10 a 20 jogos;
- permitir busca por time ou competicao.

Ao clicar em `Selecionar jogo`:

- `dataJogo` recebe a data do jogo;
- `competicao` recebe a competicao;
- `mandante` e `visitante` sao preenchidos;
- os selects de times ficam coerentes com a competicao;
- gols e tipo de lancamento continuam sob controle do usuario.

### Cadastro de Times e Competicoes

Competicoes nao devem depender de valores hardcoded no HTML/JS. A planilha deve ter uma fonte para nomes exibidos.

O codigo da competicao deve ser gerado automaticamente a partir do nome informado no cadastro administrativo. Exemplo: `Brasileirao Serie A` deve gerar um codigo estavel como `brasileirao-serie-a` ou `brasileirao_serie_a`, conforme padrao definido na implementacao.

Modelo recomendado para `competicoes`:

```text
competicao, nome, ativa, ordem
```

Exemplo:

```text
brasileirao, Brasileirão, TRUE, 10
```

Modelo atual de `times` pode ser mantido:

```text
time, campeonato, logo
```

Campos opcionais recomendados no fim:

```text
ativo, createdAt, updatedAt
```

### Exclusao de Lancamentos

Decisao: usar somente exclusao logica em vez de apagar a linha fisicamente.

Motivo:

- evita perda acidental de historico;
- permite auditar quem removeu e quando;
- reduz risco de corromper referencias por numero de linha.

Campos recomendados na aba `respostas`:

```text
id, status, deletedAt, deletedBy, deleteReason
```

Para compatibilidade, esses campos devem ser adicionados no fim da aba. Registros antigos podem receber `id` por migracao simples no Apps Script.

O dashboard e as sugestoes devem ignorar registros com:

```text
status = excluido
```

### Area Administrativa

Fluxo esperado:

1. Usuario abre `admin.html`.
2. Digita a senha administrativa unica compartilhada.
3. Front-end envia a senha para o Apps Script via HTTPS.
4. Apps Script valida contra valor armazenado em `PropertiesService`.
5. Se valido, executa a acao administrativa solicitada.

A senha nao deve ficar em:

- `admin.html`;
- `admin.js`;
- `palpiti.js`;
- qualquer arquivo versionado.

Acoes administrativas minimas:

- listar lancamentos;
- excluir logicamente lancamento por `id`;
- cadastrar time;
- editar time;
- cadastrar competicao;
- editar competicao;
- ativar/desativar time ou competicao.

### Tema Claro/Escuro

O tema deve ser baseado em CSS custom properties.

Estrutura recomendada:

```css
:root,
[data-theme="dark"] {
  --bg: ...;
  --surface: ...;
  --text: ...;
}

[data-theme="light"] {
  --bg: ...;
  --surface: ...;
  --text: ...;
}
```

Requisitos visuais:

- contraste legivel nos dois temas;
- estados de erro/sucesso/pendente visiveis;
- cards e tabelas sem texto sobreposto no mobile;
- formulario e dashboard com identidade visual consistente;
- botoes de acao claros, especialmente `Enviar`, `Selecionar jogo` e acoes administrativas.

### Fluxo QA

Branch `qa` deve ser permanente e usada somente para homologacao.

Fluxo recomendado para cada melhoria:

1. Criar branch temporaria a partir da `main`.
2. Implementar e testar localmente.
3. Fazer commit semantico.
4. Fazer push da branch temporaria.
5. Fazer merge da branch temporaria em `qa`.
6. Validar a versao de QA.
7. Criar PR da branch temporaria para `main` somente depois da validacao.
8. Depois do merge em `main`, criar tag SemVer e remover a branch temporaria.

Observacao: apenas criar uma branch `qa` no GitHub nao cria uma URL de preview automaticamente. A decisao e criar um GitHub Pages separado para publicar a branch `qa` como ambiente de homologacao.

## Padroes a Seguir

- Manter HTML, CSS e JavaScript vanilla, sem build step, a menos que seja aprovado depois.
- Manter Google Sheets como banco.
- Usar o Apps Script como unica camada de escrita.
- Manter nomes de campos atuais para compatibilidade:

```text
createdAt, nome, dataJogo, competicao, mandante, golsMandante, visitante, golsVisitante, tipoLancamento
```

- Adicionar novos campos no fim das abas.
- Usar `America/Sao_Paulo` para datas e filtros de jogos.
- Manter commits em portugues brasileiro no formato Conventional Commits.
- Nao trabalhar direto em `main`.
- Nao trabalhar direto em `qa`, exceto para merge de homologacao.

## Dependencias

### Externas

- Google Sheets.
- Google Apps Script Web App.
- Google Drive/conta Google com acesso a planilha.
- DataTables CDN no dashboard.
- Links publicos de imagens dos escudos.

### Internas

- Estrutura atual de dados da aba `respostas`.
- Estrutura atual de dados da aba `times`.
- Regras de pontuacao em `palpiti.js`.
- Agrupamento por `dataJogo`, `competicao`, `mandante`, `visitante`.

## Criterios de Aceite

### Sugestoes de Jogos

- Ao abrir o formulario, aparecem jogos futuros/pendentes ja lancados por outros usuarios.
- Ao clicar em `Selecionar jogo`, data, competicao, mandante e visitante sao preenchidos corretamente.
- O usuario ainda consegue lancar um jogo manualmente caso ele nao esteja na lista.
- Mandante e visitante iguais continuam bloqueados.
- O formulario envia o registro para a planilha com os mesmos campos atuais.

### Cadastros

- Um admin consegue cadastrar uma nova competicao.
- Um admin consegue cadastrar um time vinculado a uma competicao.
- Um time cadastrado aparece no formulario sem alterar codigo.
- Um logo cadastrado aparece no dashboard quando o link for valido.
- Logo invalido usa fallback visual sem quebrar a tela.

### Exclusao/Correcao

- Um admin consegue localizar um lancamento errado.
- Um admin consegue excluir logicamente o lancamento.
- Lancamento excluido nao aparece no dashboard, ranking, cards pendentes ou sugestoes.
- A exclusao registra data e motivo, quando informado.
- Usuario sem senha nao consegue executar acao administrativa.

### Tema

- Usuario consegue alternar entre claro e escuro no formulario.
- Usuario consegue alternar entre claro e escuro no dashboard.
- Preferencia permanece apos recarregar a pagina.
- Layout continua legivel no mobile e desktop.

### QA

- Branch `qa` existe no remoto.
- Mudancas conseguem ser testadas em um GitHub Pages separado publicado a partir de `qa` antes da PR para `main`.
- `main` continua recebendo apenas mudancas aprovadas.

## Riscos e Pontos de Atencao

- O Apps Script atual nao esta versionado no repositorio, o que dificulta revisar backend em PR.
- O `SECRET` no front-end nao e segredo real; qualquer usuario pode ver no navegador.
- Apagar linhas fisicamente da planilha pode causar perda de historico. Preferir exclusao logica.
- Registros antigos nao possuem `id`; sera necessaria migracao ou fallback temporario por linha.
- Links de imagens podem quebrar por permissao, hotlink ou URL invalida.
- O GitHub Pages de QA precisa ser configurado com cuidado para nao misturar publicacao de `main` e `qa`.

## Perguntas Respondidas

1. A area administrativa usara senha unica compartilhada.
2. A exclusao sera logica, mantendo historico.
3. A visualizacao de QA sera feita por GitHub Pages separado.
4. O cadastro de competicoes gerara o codigo automaticamente a partir do nome.

## Proposta de Implementacao em Fases

### Fase 1 - Base de Dados e Apps Script

- Adicionar `id` e status nos lancamentos.
- Criar/listar competicoes com codigo automatico.
- Melhorar listagem de times.
- Criar endpoint de sugestoes de jogos.
- Criar acoes administrativas protegidas.

### Fase 2 - Formulario

- Carregar competicoes/times da planilha.
- Exibir sugestoes de jogos.
- Preencher formulario ao selecionar jogo.
- Melhorar validacoes e estados visuais.

### Fase 3 - Admin

- Criar `admin.html`.
- Listar, filtrar e excluir/cancelar lancamentos.
- Cadastrar/editar times.
- Cadastrar/editar competicoes.

### Fase 4 - Visual e QA

- Implementar tema claro/escuro.
- Ajustar dashboard e formulario para identidade consistente.
- Validar responsividade.
- Configurar GitHub Pages de QA.
- Publicar em `qa` e testar antes da PR para `main`.
