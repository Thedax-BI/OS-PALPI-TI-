# OS PALPI-TI (GitHub Pages)

Visualização responsiva de palpites × resultados, lendo **CSV público do Google Sheets**.

## Como publicar no GitHub Pages

1. Crie um repositório público no seu GitHub (ex.: `os-palpi-ti`).
2. Envie **este arquivo** `index.html` para a raiz do repositório (você pode arrastar e soltar pela interface web).
3. (Opcional) Inclua este `README.md` também.
4. Vá em **Settings → Pages** e em **Build and deployment** selecione:
   - **Source**: *Deploy from a branch*
   - **Branch**: `main` (ou `master`), **/ (root)**
   - **Save**
5. Aguarde ~1–2 minutos. O site ficará disponível em:
   `https://<seu-usuario>.github.io/<seu-repositorio>/`

> Dica: para alterar o link do CSV ou escudos, edite o bloco `CONFIG` dentro do `index.html`.

## CSV público configurado

O HTML já aponta para o CSV publicado (Google Sheets → Arquivo → Publicar na Web):
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vTn-RzJIruNHBrurvld5L3zclXN9lWWAPVa90un0PeoJSV7V-1XIq1pRoL_-Mq7PZLS4jWvO4VvF7FC/pub?gid=1746213473&single=true&output=csv
```

## Regras de pontuação
- Vencedor = **3**
- Placar exato = **6**
- Vencedor + mesma margem = **1**
- Jogo pendente = **1** (provisório)
- Erro = **0**

## Observações
- Se alterar o nome dos times na planilha, atualize o mapa de escudos no `CONFIG.CRESTS` do `index.html`.
- Caso o CSV mude de URL (nova publicação), troque o `CONFIG.CSV_URL`.
