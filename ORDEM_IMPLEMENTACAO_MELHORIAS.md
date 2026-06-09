# Ordem de Implementacao - Melhorias OS PALPI-TI

## Objetivo do Arquivo

Este e o arquivo de controle que deve orientar a implementacao das melhorias aprovadas no PRD.

Ele deve ser atualizado sempre que uma fase:

- for iniciada;
- tiver arquivos implementados;
- for testada;
- for enviada para `qa`;
- for aprovada para PR em `main`;
- for concluida.

## Fonte de Verdade

Implementar seguindo esta ordem:

1. `PRD_MELHORIAS_PALPITES_QA.md`
2. `SPEC_FASE_1_DADOS_APPS_SCRIPT.md`
3. `SPEC_FASE_2_FORMULARIO_SUGESTOES.md`
4. `SPEC_FASE_3_ADMIN.md`
5. `SPEC_FASE_4_TEMA_QA_PAGES.md`

Se houver conflito entre arquivos, a ordem de prioridade e:

1. decisao mais recente do usuario;
2. este arquivo de ordem;
3. SPEC da fase;
4. PRD.

## Status Geral

```text
Status atual: implementacao local concluida; aguardando deploy do Apps Script e envio/validacao em qa
Branch unica de implementacao: codex/melhorias-palpites
Branch permanente de QA: qa
Branch de producao: main
```

## Tabela de Fases

| Ordem | Fase | SPEC | Status | Branch usada | Depende de |
| --- | --- | --- | --- | --- | --- |
| 1 | Dados e Apps Script | `SPEC_FASE_1_DADOS_APPS_SCRIPT.md` | Implementada localmente | `codex/melhorias-palpites` | PRD aprovado |
| 2 | Formulario e sugestoes | `SPEC_FASE_2_FORMULARIO_SUGESTOES.md` | Implementada localmente | `codex/melhorias-palpites` | Fase 1 implementada |
| 3 | Area administrativa | `SPEC_FASE_3_ADMIN.md` | Implementada localmente | `codex/melhorias-palpites` | Fase 1 implementada |
| 4 | Tema e QA Pages | `SPEC_FASE_4_TEMA_QA_PAGES.md` | Implementada localmente | `codex/melhorias-palpites` | Fases 1, 2 e 3 implementadas |

## Regras de Atualizacao

Ao iniciar uma fase:

- alterar `Status` da fase para `Em implementacao`;
- registrar a branch usada;
- registrar data de inicio;
- nao alterar fases futuras para `Concluida` antecipadamente.

Ao terminar uma fase:

- alterar `Status` para `Concluida`;
- registrar arquivos alterados;
- registrar testes executados;
- registrar se foi mergeada em `qa`;
- registrar observacoes ou pendencias.

Ao encontrar bloqueio:

- alterar `Status` para `Bloqueada`;
- registrar o motivo;
- registrar o que falta decidir ou configurar.

## Checklist de Implementacao

### Fase 1 - Dados e Apps Script

Status: Implementada localmente

Branch usada:

```text
codex/melhorias-palpites
```

Checklist:

- [x] Versionar Apps Script em `apps-script/`.
- [x] Criar/atualizar manifesto do Apps Script.
- [x] Adicionar cabecalhos novos na aba `respostas` via migracao idempotente.
- [x] Criar/migrar ids em lancamentos antigos via migracao idempotente.
- [x] Adicionar exclusao logica.
- [x] Criar aba `competicoes` via migracao idempotente.
- [x] Ajustar aba `times` via migracao idempotente.
- [x] Criar endpoint `competitions`.
- [x] Criar endpoint `gameSuggestions`.
- [x] Criar autenticacao administrativa.
- [x] Criar endpoints administrativos.
- [x] Validar compatibilidade do dashboard atual.
- [ ] Enviar para `qa`.
- [x] Registrar resultado dos testes.

Atualizacao da fase:

```text
Inicio: 2026-06-09
Fim: 2026-06-09 (local)
Branch: codex/melhorias-palpites
Commit: feat(melhorias): implementa fluxo de palpites e admin
Merge em qa: pendente
Testes: node --check em scripts front-end; sintaxe de Code.gs via Node stdin; dashboard local em desktop/mobile
Pendencias: implantar apps-script/Code.gs no projeto Apps Script e configurar Script Property ADMIN_PASSWORD
```

### Fase 2 - Formulario e Sugestoes

Status: Implementada localmente

Branch usada:

```text
codex/melhorias-palpites
```

Checklist:

- [x] Criar `formulario.js`.
- [x] Mover logica inline de `index.html`.
- [x] Carregar competicoes da planilha.
- [x] Carregar times da planilha.
- [x] Adicionar area de sugestoes.
- [x] Implementar botao `Selecionar jogo`.
- [x] Manter lancamento manual funcionando.
- [x] Ajustar validacoes.
- [x] Ajustar estilos.
- [x] Testar mobile e desktop.
- [ ] Enviar para `qa`.
- [x] Registrar resultado dos testes.

Atualizacao da fase:

```text
Inicio: 2026-06-09
Fim: 2026-06-09 (local)
Branch: codex/melhorias-palpites
Commit: feat(melhorias): implementa fluxo de palpites e admin
Merge em qa: pendente
Testes: formulario local em desktop/mobile; fallback de competicoes/times; selecao de competicao carrega times
Pendencias: publicar Apps Script novo para habilitar sugestoes reais vindas do endpoint gameSuggestions
```

### Fase 3 - Area Administrativa

Status: Implementada localmente

Branch usada:

```text
codex/melhorias-palpites
```

Checklist:

- [x] Criar `admin.html`.
- [x] Criar `admin.js`.
- [x] Implementar login por senha unica.
- [x] Listar lancamentos.
- [x] Filtrar lancamentos.
- [x] Excluir logicamente lancamentos.
- [x] Cadastrar/editar times.
- [x] Cadastrar/editar competicoes.
- [x] Adicionar link para admin.
- [ ] Testar senha invalida e token expirado.
- [ ] Testar exclusao refletindo no dashboard.
- [ ] Enviar para `qa`.
- [x] Registrar resultado dos testes.

Atualizacao da fase:

```text
Inicio: 2026-06-09
Fim: 2026-06-09 (local)
Branch: codex/melhorias-palpites
Commit: feat(melhorias): implementa fluxo de palpites e admin
Merge em qa: pendente
Testes: admin local em desktop/mobile; tela de login e navegacao renderizam sem overflow
Pendencias: depende do deploy do Apps Script e da configuracao ADMIN_PASSWORD para testar login, token e exclusao real
```

### Fase 4 - Tema e QA Pages

Status: Implementada localmente

Branch usada:

```text
codex/melhorias-palpites
```

Checklist:

- [x] Criar `theme.js`.
- [x] Refatorar tokens em `palpiti.css`.
- [x] Adicionar tema no formulario.
- [x] Adicionar tema no dashboard.
- [x] Adicionar tema no admin.
- [x] Validar contraste em claro e escuro.
- [x] Validar responsividade.
- [x] Criar workflow de GitHub Pages para `qa`.
- [ ] Publicar QA.
- [ ] Registrar URL de QA.
- [ ] Validar QA antes da PR para `main`.

Atualizacao da fase:

```text
Inicio: 2026-06-09
Fim: 2026-06-09 (local)
Branch: codex/melhorias-palpites
Commit: feat(melhorias): implementa fluxo de palpites e admin
Merge em qa: pendente
URL de QA: pendente
Testes: formulario, dashboard e admin abertos localmente; mobile 390px sem overflow; alternancia de tema altera data-theme
Pendencias: enviar branch para qa e aguardar publicacao do workflow de Pages
```

## Fluxo Git Obrigatorio

Decisao do usuario em 2026-06-09: usar apenas uma branch de implementacao e depois enviar para `qa`.

Fluxo aplicado:

1. Sair de `main` atualizada.
2. Criar branch unica `codex/melhorias-palpites`.
3. Implementar as quatro fases na mesma branch.
4. Testar localmente.
5. Commitar em portugues no formato Conventional Commits.
6. Fazer push da branch.
7. Fazer merge da branch em `qa`.
8. Testar `qa`.
9. Criar PR para `main` somente depois da validacao.

## Historico de Atualizacoes

| Data | Alteracao | Autor |
| --- | --- | --- |
| 2026-06-09 | Criacao do arquivo de ordem com todas as fases pendentes | Codex |
| 2026-06-09 | Implementacao local das quatro fases em branch unica | Codex |
