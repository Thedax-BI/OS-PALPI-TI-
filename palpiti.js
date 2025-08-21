// ======= CONFIG (GViz) =======
// const CONFIG = {
//   SHEET_ID: "1BN8qI5_QnTPbpBxd4yT-Ng6qmDChLFhXohHFnY4R5vE",
//   SHEET_NAME: "Respostas ao formulário 1",
//   CRESTS: {
//     "São Paulo":
//       "https://commons.wikimedia.org/wiki/Special:FilePath/Brasao%20do%20Sao%20Paulo%20Futebol%20Clube.svg",
//     "Sport Club Internacional":
//       "https://commons.wikimedia.org/wiki/Special:FilePath/Escudo%20do%20Sport%20Club%20Internacional.svg",
//     Internacional:
//       "https://commons.wikimedia.org/wiki/Special:FilePath/Escudo%20do%20Sport%20Club%20Internacional.svg",
//     Corinthians:
//       "https://commons.wikimedia.org/wiki/Special:FilePath/SC%20Corinthians.svg",
//     "Sport Club Corinthians Paulista":
//       "https://commons.wikimedia.org/wiki/Special:FilePath/SC%20Corinthians.svg",
//     Fortaleza:
//       "https://commons.wikimedia.org/wiki/Special:FilePath/FortalezaEsporteClube.svg",
//     "Fortaleza EC":
//       "https://commons.wikimedia.org/wiki/Special:FilePath/FortalezaEsporteClube.svg",
//     Santos:
//       "https://commons.wikimedia.org/wiki/Special:FilePath/Santos%20logo.svg",
//     "EC Juventude":
//       "https://commons.wikimedia.org/wiki/Special:FilePath/EC%20Juventude.svg",
//     Juventude:
//       "https://commons.wikimedia.org/wiki/Special:FilePath/EC%20Juventude.svg",
//     "Athletico Paranaense":
//       "https://commons.wikimedia.org/wiki/Special:FilePath/Athletico%20Paranaense%20%28Logo%202019%29.svg",
//     "Athletico-PR":
//       "https://commons.wikimedia.org/wiki/Special:FilePath/Athletico%20Paranaense%20%28Logo%202019%29.svg",
//     Palmeiras:
//       "https://commons.wikimedia.org/wiki/Special:FilePath/Palmeiras%20logo.svg",
//     "Sociedade Esportiva Palmeiras":
//       "https://commons.wikimedia.org/wiki/Special:FilePath/Palmeiras%20logo.svg",
//   },
// };
const CONFIG = {
  SHEET_ID: "1BN8qI5_QnTPbpBxd4yT-Ng6qmDChLFhXohHFnY4R5vE",
  SHEET_NAME: "Respostas ao formulário 1",
  CRESTS: {
    "São Paulo": "https://commons.wikimedia.org/wiki/Special:FilePath/Brasao%20do%20Sao%20Paulo%20Futebol%20Clube.svg",
    Santos: "https://commons.wikimedia.org/wiki/Special:FilePath/Santos%20logo.svg",
    Palmeiras: "https://commons.wikimedia.org/wiki/Special:FilePath/Palmeiras%20logo.svg",
    Corinthians: "https://logodownload.org/wp-content/uploads/2016/11/Corinthians-logo-escudo.png",
    Juventude: "https://commons.wikimedia.org/wiki/Special:FilePath/EC%20Juventude.svg",
    Internacional: "https://commons.wikimedia.org/wiki/Special:FilePath/Escudo%20do%20Sport%20Club%20Internacional.svg",
    Cruzeiro: "https://commons.wikimedia.org/wiki/Special:FilePath/Cruzeiro%20Esporte%20Clube%20%28logo%29.svg",
    Flamengo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Flamengo-RJ_%28BRA%29.png/640px-Flamengo-RJ_%28BRA%29.png",
    Botafogo: "https://commons.wikimedia.org/wiki/Special:FilePath/Botafogo_de_Futebol_e_Regatas_logo.svg",
    Bahia: "https://commons.wikimedia.org/wiki/Special:FilePath/Esporte%20Clube%20Bahia%20logo.svg",
    Mirassol: "https://commons.wikimedia.org/wiki/Special:FilePath/Mirassol_Futebol_Clube_logo.svg",
    Bragantino: "https://commons.wikimedia.org/wiki/Special:FilePath/Red_Bull_Bragantino_logo.svg",
    Fluminense: "https://commons.wikimedia.org/wiki/Special:FilePath/Fluminense_FC_escudo.svg",
    "Atlético Mineiro": "https://commons.wikimedia.org/wiki/Special:FilePath/Clube%20Atl%C3%A9tico%20Mineiro%20logo.svg",
    "Ceará SC": "https://commons.wikimedia.org/wiki/Special:FilePath/Cear%C3%A1_Sporting_Club_logo.svg",
    Grêmio: "https://commons.wikimedia.org/wiki/Special:FilePath/Gremio_Logo.svg",
    "EC Vitória": "https://upload.wikimedia.org/wikipedia/pt/3/34/Esporte_Clube_Vit%C3%B3ria_logo.png",
    "Vasco da Gama": "https://commons.wikimedia.org/wiki/Special:FilePath/Club_de_Regatas_Vasco_da_Gama_logo.svg",
    Fortaleza: "https://commons.wikimedia.org/wiki/Special:FilePath/FortalezaEsporteClube.svg",
    "Sport Recife": "https://commons.wikimedia.org/wiki/Special:FilePath/Sport_Club_Recife.svg",
    "Athletico Paranaense": "https://commons.wikimedia.org/wiki/Special:FilePath/Athletico%20Paranaense%20%28Logo%202019%29.svg",
    CSA: "https://commons.wikimedia.org/wiki/Special:FilePath/CSA_logo.svg",
    CRB: "https://commons.wikimedia.org/wiki/Special:FilePath/Clube_de_Regatas_Brasil_logo.svg",
    Peñarol: "https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_del_Club_Atl%C3%A9tico_Pe%C3%B1arol.svg",
    "Athético Nacional": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Atl%C3%A9tico_Nacional.png",
    "Vélez Sársfield": "https://upload.wikimedia.org/wikipedia/commons/2/21/Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg",
    Estudiantes: "https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_del_Club_Estudiantes_de_La_Plata.svg",
    "Cerro Porteño": "https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_del_Club_Cerro_Porte%C3%B1o.svg",
    "River Plate": "https://cdn-img.zerozero.pt/img/logos/equipas/2218_imgbank_1686734459.png",
    "Universitário": "https://upload.wikimedia.org/wikipedia/commons/6/67/Logo_oficial_de_Universitario.png",
    Libertad: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Club_Libertad.png/250px-Club_Libertad.png",
    "LDU Quito": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Liga_de_Quito_deportiva.png",
    "Racing ARG": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Escudo_de_Racing_Club_%282014%29.svg/1200px-Escudo_de_Racing_Club_%282014%29.svg.png"
  },
};

// =============================

// JSONP hook do GViz (sem CORS)
window.google = {
  visualization: {
    Query: {
      setResponse: function (resp) {
        handleGViz(resp);
      },
    },
  },
};

// const statusEl = document.getElementById("status");
const errEl = document.getElementById("err");
const $ = (s) => document.querySelector(s);

// ---- Date helpers ----
function toJSDate(v) {
  if (v instanceof Date) return v;
  if (typeof v === "string") {
    const m = v.match(
      /^Date\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})(?:,\s*(\d{1,2}),\s*(\d{1,2}),\s*(\d{1,2}))?\)$/
    );
    if (m) {
      const Y = +m[1],
        M = +m[2],
        D = +m[3],
        h = +(m[4] || 0),
        mi = +(m[5] || 0),
        s = +(m[6] || 0);
      return new Date(Y, M, D, h, mi, s); // GViz já fornece M 0-based
    }
    const d = new Date(v);
    if (!isNaN(d)) return d;
  }
  return null;
}
function pad2(n) {
  return (n < 10 ? "0" : "") + n;
}
function formatDateBR(d) {
  return (
    pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1) + "/" + d.getFullYear()
  );
}
function dateKey(d) {
  return (
    d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate())
  );
}

function gvizUrl() {
  const base = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq`;
  // console.log(base);
  const params = new URLSearchParams({
    tqx: "out:json",
    sheet: CONFIG.SHEET_NAME,
  });
  return base + "?" + params.toString();
}

function loadGViz() {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = gvizUrl();
    s.async = true;
    s.onerror = () =>
      reject(new Error("Falha de rede ou permissão no Google Sheets (GViz)."));
    window._gvizDone = (rows) => resolve(rows);
    document.head.appendChild(s);
  });
}

function parseGVizTable(json) {
  const cols = json.table?.cols?.map((c) => c.label || c.id || "") || [];
  const rows = (json.table?.rows || []).map((r) => {
    const obj = {};
    (r.c || []).forEach((c, i) => {
      obj[cols[i] || "col" + (i + 1)] = c?.v ?? c?.f ?? "";
    });
    return obj;
  });
  return rows;
}

function handleGViz(resp) {
  try {
    const rows = parseGVizTable(resp);
    window._gvizDone && window._gvizDone(rows);
  } catch (e) {
    console.error(e);
    showError(
      "Não consegui interpretar a resposta do GViz. Confirme o nome da aba no CONFIG.SHEET_NAME."
    );
  }
}

function showError(msg) {
  // statusEl.textContent = "erro";
  errEl.style.display = "block";
  errEl.innerHTML = `<b>Não consegui ler a planilha.</b><br>${msg}<br><br><b>Checklist rápido:</b><br>
  1) Em <i>Compartilhar</i>, marque <b>Qualquer pessoa com o link – Leitor</b>.<br>
  2) Se necessário, use <i>Arquivo → Publicar na Web</i> (aba “${CONFIG.SHEET_NAME}”).`;
}

// Utils
function crestHTML(teamName, cls) {
  const url = CONFIG.CRESTS[teamName] || null;
  if (url)
    return `<div class="crest"><img src="${url}" alt="escudo ${teamName}" onerror="this.closest('.crest').classList.add('fallback','${cls}'); this.remove();"></div>`;
  const initials = (teamName || "")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 3)
    .join("")
    .toUpperCase();
  return `<div class="crest fallback ${cls}">${initials}</div>`;
}
function sticker(name) {
  const E = [
    "🤙",
    "🔥",
    "🚀",
    "🧠",
    "🦊",
    "🐯",
    "🦾",
    "🎯",
    "🪄",
    "💎",
    "🧩",
    "⚡",
    "🏆",
    "🎲",
    "🎮",
    "🥇",
    "🥷",
    "🧭",
  ];
  let h = 0;
  for (let i = 0; i < (name || "").length; i++)
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return E[h % E.length];
}
function outcome(h, a) {
  if (h == null || a == null || isNaN(h) || isNaN(a)) return null;
  if (h > a) return "H";
  if (h < a) return "A";
  return "D";
}
// function score(p1, p2, g1, g2) {
//   if (g1 == null || g2 == null || isNaN(g1) || isNaN(g2))
//     return { status: "Pendente (0 pt provisório)", pts: 0 };
//   if (p1 === g1 && p2 === g2) return { status: "Placar exato", pts: 3 };
//   const ocp = outcome(p1, p2),
//     ocr = outcome(g1, g2);
//   if (ocp === ocr)
//     return Math.abs(p1 - p2) === Math.abs(g1 - g2)
//       ? { status: "Resultado", pts: 1 }
//       : { status: "Margem", pts: 0 };
//   return { status: "Errou", pts: 0 };
// }

function score(p1, p2, g1, g2) {
  if (g1 == null || g2 == null || isNaN(g1) || isNaN(g2))
    return { status: "Pendente (0 pt provisório)", pts: 0 };

  // Placar exato
  if (p1 === g1 && p2 === g2)
    return { status: "Placar exato", pts: 3 };

  // Acertou vencedor (independente da margem)
  const ocp = outcome(p1, p2),
        ocr = outcome(g1, g2);
  if (ocp === ocr)
    return { status: "Vencedor", pts: 1 };

  // Errou
  return { status: "Errou", pts: 0 };
}


function buildData(rows) {
    const cols = Object.keys(rows[0] || {});
    const patTeamCol = /^Selecione o Time A \[(.+)\]$/i;
    const teamCols = cols.filter((c) => patTeamCol.test(c));
    const cTS = cols.find((c) => /carimbo.+hora/i.test(c)) || cols[0];
    const cLiga =
        cols.find((c) => /campeonato|liga|torneio|competi/i.test(c)) ||
        "Campeonato";
    const cData = cols.find((c) => c === "Data do Jogo");
    const cPalp =
        cols.find((c) => /palpiteiro|participante|respondente/i.test(c)) ||
        "Palpiteiro";
    const cTipo = cols.find((c) => /lan[cç]amento|tipo/i.test(c));

    // const isResultado = (r) => {
    // const valPalp = String(r[cPalp] || "").trim().toLowerCase();
    // const valTipo = cTipo
    //     ? String(r[cTipo] || "").trim().toLowerCase()
    //     : "";

    // console.log("Linha analisada:", r);
    // console.log("cPalp:", cPalp, "| valor:", r[cPalp], "->", valPalp);
    // console.log("cTipo:", cTipo, "| valor:", cTipo ? r[cTipo] : null, "->", valTipo);

    // return valPalp === "resultado" || valTipo === "resultado da partida";
    // };

// const isResultado = (r) => {
//   const valPalp = String(r[cPalp] || "").trim().toLowerCase();
//   const valTipo = cTipo
//     ? String(r[cTipo] || "").trim().toLowerCase()
//     : "";

//   // Colunas que são times
//   const filled = teamCols
//     .map((c) => [c, toNum(r[c])])
//     .filter(([, v]) => !isNaN(v));

//   console.log("---- Analisando linha ----");
//   console.log("Linha bruta:", r);
//   console.log("cPalp:", cPalp, "| valor:", r[cPalp], "->", valPalp);
//   console.log("cTipo:", cTipo, "| valor:", cTipo ? r[cTipo] : null, "->", valTipo);
//   console.log("teamCols detectadas:", teamCols);
//   console.log("filled (coluna, valor numérico):", filled);
//   console.log("isResultado?", valPalp === "resultado" || valTipo === "resultado");

//   return valPalp === "resultado" || valTipo === "resultado";
// };


const isResultado = (r) => {
    const valPalp = String(r[cPalp] || "")
      .trim()
      .toLowerCase();
    

    const valTipo = cTipo
      ? String(r[cTipo] || "")
          .trim()
          .toLowerCase()
      : "";
    return valPalp == "resultado" || valTipo == "resultado";
};

  const toNum = (v) =>
    v === "" || v == null ? NaN : Number(String(v).replace(",", ".").trim());
  const tsOf = (r) => {
    const d = toJSDate(r[cTS]) || new Date(r[cTS]);
    return isNaN(d) ? 0 : d.getTime();
  };

// Resultados – último por jogo
const resPairs = [];
rows.filter(isResultado).forEach((r) => {
  const filled = teamCols
    .map((c) => [c, toNum(r[c])])
    .filter(([, v]) => !isNaN(v));
// console.log("Linha de resultado:", r);
  // Se não tiver pelo menos 2 gols válidos, descarta
  if (filled.length < 0) return;

  // Pega somente os dois primeiros encontrados, ignorando extras
  const [[c1, g1], [c2, g2]] = filled;

  const t1 = c1.match(patTeamCol)[1],
        t2 = c2.match(patTeamCol)[1];
  const dj = toJSDate(r[cData]);
  const DataKey = dj ? dateKey(dj) : String(r[cData]);
  const DataDisp = dj ? formatDateBR(dj) : String(r[cData]);


  resPairs.push({
    Campeonato: r[cLiga],
    Data: DataDisp,
    DataKey: DataKey,
    team1_col: c1,
    team1: t1,
    g1: g1,
    team2_col: c2,
    team2: t2,
    g2: g2,
    _ts: tsOf(r),
  });

  // console.log("Resultado capturado:", resPairs);
});

  
  const resMap = new Map();
  resPairs.forEach((m) => {
    const k = `${m.Campeonato}|${m.DataKey}|${m.team1_col}|${m.team2_col}`;
    const old = resMap.get(k);
    if (!old || m._ts > old._ts) resMap.set(k, m);
  });
  const results = Array.from(resMap.values());

  // Palpites – último por palpiteiro+jogo
  const palpsRaw = [];
  rows
    .filter((r) => !isResultado(r))
    .forEach((r) => {
      const filled = teamCols
        .map((c) => [c, toNum(r[c])])
        .filter(([, v]) => !isNaN(v));
      if (filled.length !== 2) return;
      const [[c1, p1], [c2, p2]] = filled;
      const t1 = c1.match(patTeamCol)[1],
        t2 = c2.match(patTeamCol)[1];
      const dj2 = toJSDate(r[cData]);
      const DataKey2 = dj2 ? dateKey(dj2) : String(r[cData]);
      const DataDisp2 = dj2 ? formatDateBR(dj2) : String(r[cData]);
      palpsRaw.push({
        Palpiteiro: r[cPalp],
        Campeonato: r[cLiga],
        Data: DataDisp2,
        DataKey: DataKey2,
        team1_col: c1,
        team1: t1,
        p1: p1,
        team2_col: c2,
        team2: t2,
        p2: p2,
        _ts: tsOf(r),
      });
    });

    
  const palpMap = new Map();
  palpsRaw.forEach((p) => {
    const k = `${p.Palpiteiro}|${p.Campeonato}|${p.DataKey}|${p.team1_col}|${p.team2_col}`;
    const old = palpMap.get(k);
    if (!old || p._ts > old._ts) palpMap.set(k, p);
  });
  const palps = Array.from(palpMap.values());

  // Union de jogos
  const mkey = (m) =>
    `${m.Campeonato}|${m.DataKey}|${m.team1_col}|${m.team2_col}`;
  const matchMap = new Map();
  results.forEach((r) => matchMap.set(mkey(r), r));
  palps.forEach((p) => {
    if (!matchMap.has(mkey(p))) matchMap.set(mkey(p), p);
  });
  const matches = Array.from(matchMap.values());

  // Detalhes com pontuação
  const details = [];
  matches.forEach((m) => {
    const g = results.find((x) => mkey(x) === mkey(m));
    const g1 = g ? g.g1 : null,
      g2 = g ? g.g2 : null;
    palps
      .filter((p) => mkey(p) === mkey(m))
      .forEach((p) => {
        const sc = score(p.p1, p.p2, g1, g2);
        details.push({
          Data: m.Data,
          Campeonato: m.Campeonato,
          Jogo: `${m.team1} x ${m.team2}`,
          team1: m.team1,
          team2: m.team2,
          Palpiteiro: p.Palpiteiro,
          p1: p.p1,
          p2: p.p2,
          g1: g1 != null ? g1 : null,
          g2: g2 != null ? g2 : null,
          Status: sc.status,
          Pontos: sc.pts,
        });
      });
  });

  // Ranking
  const byP = new Map();
  details.forEach((r) => {
    const it = byP.get(r.Palpiteiro) || {
      Palpiteiro: r.Palpiteiro,
      Pts: 0,
      Exatos: 0,
      Vencedor: 0,
      Provisorios: 0,
      Erros: 0,
      Total: 0,
    };
    it.Pts += r.Pontos;
    it.Total++;
    if (r.Status === "Placar exato") it.Exatos++;
    else if (r.Status === "Vencedor") it.Vencedor++;
    else if (r.Status.startsWith("Pendente")) it.Provisorios++;
    else if (r.Status === "Errou") it.Erros++;
    byP.set(r.Palpiteiro, it);
  });
  const rank = Array.from(byP.values())
    .map((x) =>
      Object.assign(x, {
        Aproveitamento_:
          Math.round(
            ((x.Exatos + x.Vencedor) / Math.max(1, x.Total)) * 1000
          ) / 10,
      })
    )
    .sort(
      (a, b) =>
        b.Pts - a.Pts ||
        b.Exatos - a.Exatos ||
        b.Vencedor - a.Vencedor ||
        b.Aproveitamento_ - a.Aproveitamento_
    );

  return { details, rank };
}

function badge(status, pts) {
  let cls = "pend";
  if (status === "Placar exato") cls = "ok";
  else if (status === "Vencedor") cls = "primary";
  else if (status === "Errou") cls = "bad";
  return `<span class="badge ${cls}">${status} • ${pts} pts</span>`;
}
function renderKPI(rows) {
  const tot = rows.length,
    ex = rows.filter((r) => r.Status === "Placar exato").length,
    v = rows.filter((r) => r.Status === "Vencedor").length,
    pr = rows.filter((r) => r.Status.startsWith("Pendente")).length,
    er = rows.filter((r) => r.Status === "Errou").length;
  document.getElementById("kpi").innerHTML = `
    <div class="k k1"><span class="muted">Palpites</span><b>${tot}</b></div>
    <div class="k k2"><span class="muted">Exatos</span><b>${ex}</b></div>
    <div class="k k3"><span class="muted">Vencedor</span><b>${v}</b></div>
    <div class="k k4"><span class="muted">Erros</span><b>${er}</b></div>
    <button class="btn ghost" id="btnReload">Recarregar</button>`;
}
function renderUI(data) {
  const details = data.details.slice();
  const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean).sort();
  const palps = uniq(details.map((x) => x.Palpiteiro));
  const ligas = uniq(details.map((x) => x.Campeonato));
  const datas = uniq(details.map((x) => x.Data));
  const pf = document.getElementById("fPalpiteiro");
  palps.forEach((x) =>
    pf.insertAdjacentHTML("beforeend", `<option>${x}</option>`)
  );
  const lf = document.getElementById("fLiga");
  ligas.forEach((x) =>
    lf.insertAdjacentHTML("beforeend", `<option>${x}</option>`)
  );
  const df = document.getElementById("fData");
  datas.forEach((x) =>
    df.insertAdjacentHTML("beforeend", `<option>${x}</option>`)
  );

  const usp = new URLSearchParams(location.search);
  if (usp.get("p")) pf.value = usp.get("p");
  if (usp.get("l")) lf.value = usp.get("l");
  if (usp.get("d")) df.value = usp.get("d");
  if (usp.get("q")) document.getElementById("fBusca").value = usp.get("q");

  function applyFilters(rows) {
    const p = pf.value,
      l = lf.value,
      d = df.value,
      q = (document.getElementById("fBusca").value || "").trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!p || r.Palpiteiro === p) &&
        (!l || r.Campeonato === l) &&
        (!d || r.Data === d) &&
        (!q || `${r.team1} ${r.team2} ${r.Jogo}`.toLowerCase().includes(q))
    );
  }
  function crestHTML(teamName, cls) {
    const url = CONFIG.CRESTS[teamName] || null;
    if (url)
      return `<div class="crest"><img src="${url}" alt="escudo ${teamName}" onerror="this.closest('.crest').classList.add('fallback','${cls}'); this.remove();"></div>`;
    const initials = (teamName || "")
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 3)
      .join("")
      .toUpperCase();
    return `<div class="crest fallback ${cls}">${initials}</div>`;
  }
  function sticker(name) {
    const E = [
      "🤙",
      "🔥",
      "🚀",
      "🧠",
      "🦊",
      "🐯",
      "🦾",
      "🎯",
      "🪄",
      "💎",
      "🧩",
      "⚡",
      "🏆",
      "🎲",
      "🎮",
      "🥇",
      "🥷",
      "🧭",
    ];
    let h = 0;
    for (let i = 0; i < (name || "").length; i++)
      h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return E[h % E.length];
  }

  // Render agrupado por jogo
  function renderDetail() {
    const tbody = document.querySelector("#tblDetalhe tbody");
    const rows = applyFilters(details);

    // Agrupar por jogo
    const groups = new Map();
    rows.forEach((r) => {
      const key = r.Data + "|" + r.Campeonato + "|" + r.Jogo;
      if (!groups.has(key)) {
        groups.set(key, {
          meta: {
            Data: r.Data,
            Campeonato: r.Campeonato,
            team1: r.team1,
            team2: r.team2,
            Jogo: r.Jogo,
          },
          items: [],
        });
      }
      groups.get(key).items.push(r);
    });

    // Construir blocos
    let html = "";
    groups.forEach((g) => {
      html += `<div class="gameBlock">
        <div class="gameHead">${g.meta.Data} • ${g.meta.Campeonato}</div>
        <div class="gameTitle">
          <span class="caret">▸</span>
          <div class="time_a">
            ${crestHTML(g.meta.team1, "t1")}
            <div class='times_style'>${g.meta.team1} </div>
            <span class="scoreInline">
              ${(() => {
                const rr = g.items.find((it) => it.g1 != null && it.g2 != null);
                return rr ? rr.g1 : "—";
              })()}
            </span>
          </div>
          
          <div class="muted" style="margin:0 6px">X</div>
          <div class="time_b">
            <span class="scoreInline" style="margin-right: 10%;">
              ${(() => {
                const rr = g.items.find((it) => it.g1 != null && it.g2 != null);
                return rr ? rr.g2 : "—";
              })()}
            </span>
            ${crestHTML(g.meta.team2, "t2")}
            <div class='times_style'>${g.meta.team2} </div>
            
          </div>
          <div class="resTitle">
            ${(() => {
              const rr = g.items.find((it) => it.g1 != null && it.g2 != null);
              return rr ? "" : '<span class="badge pend">Pendente</span>';
            })()}
          </div>
        </div>
        <div class="gameBody">
          <table class="subtbl"><colgroup><col class="c-palp"><col class="c-palpite"><col class="c-pontos"></colgroup>
            <thead><tr><th>Palpiteiro</th><th>Palpite</th><th>Pontuação</th></tr></thead>
            <tbody>
              ${g.items
                .map((r) => {
                  return `<tr>
                  <td style="width:20%">${sticker(r.Palpiteiro)} ${r.Palpiteiro}</td>
                  <td style="width:10%">${r.p1} x ${r.p2}</td>
                  <td>${badge(r.Status, r.Pontos)}</td>
                </tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>`;
    });

    tbody.innerHTML = `<tr><td colspan="7">${html}</td></tr>`;
    document.querySelectorAll(".gameBlock .gameTitle").forEach((tt) => {
      tt.addEventListener("click", () => {
        const blk = tt.closest(".gameBlock");
        blk.classList.toggle("collapsed");
      });
    });
    const bx = document.getElementById("btnExpandir");
    if (bx)
      bx.onclick = () =>
        document
          .querySelectorAll(".gameBlock")
          .forEach((b) => b.classList.remove("collapsed"));
    const br = document.getElementById("btnRecolher");
    if (br)
      br.onclick = () =>
        document
          .querySelectorAll(".gameBlock")
          .forEach((b) => b.classList.add("collapsed"));
    renderKPI(rows);
  }

  function renderRank() {
    const r = data.rank;
    premiacao = ['R$ 180,00', 'R$ 90,00', 'R$ 30,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00'];
    document.querySelector("#tblRank tbody").innerHTML = r
      .map(
        (x, i) => `
      <tr>
        <td style="text-align: left !important;">${sticker(x.Palpiteiro)} ${x.Palpiteiro}</td>
        <td style="text-align: center;"><b>${x.Pts}</b></td>
        <td style="text-align: center;">${x.Exatos}</td>
        <td style="text-align: center;">${x.Vencedor}</td>
        <td style="text-align: center;">${x.Erros}</td>
        <td style="text-align: center;">${x.Aproveitamento_}%</td>
        <td style="text-align: center;">${premiacao[i]}</td>
      </tr>`
      )
      .join("");
    new DataTable('#tblRank', {
      paging: false,
      searching: false,
      info: false,
      ordering: true,
      lengthChange: false,
      order: [[1, 'desc']]
    });
  }

  // function renderCards() {
  //   const uniq = new Map();
  //   details.forEach((r) => {
  //     const key = r.Data + "|" + r.Campeonato + "|" + r.Jogo;
  //     if (!uniq.has(key)) uniq.set(key, r);
  //   });
  //   const rows = Array.from(uniq.values());
  //   document.getElementById("cards").innerHTML = rows.map((r) => {
  //       const res = r.g1 == null || r.g2 == null
  //           ? '<span class="badge pend">Pendente</span>'
  //           : `<span class="score">${r.g1} x ${r.g2}</span>`;
  //       return `<div class="cardMatch">
  //       <div class="matchHead"><div class="muted small">${r.Data} • ${
  //         r.Campeonato
  //       }</div><div>${res}</div></div>
  //       <div class="teams">${crestHTML(r.team1, "t1")} <div>${
  //         r.team1
  //       }</div><div class="muted" style="margin:0 8px">x</div>${crestHTML(
  //         r.team2,
  //         "t2"
  //       )} <div>${r.team2}</div></div>
  //     </div>`;
  //     })
  //     .join("");
  // }

function renderCards() {
  const uniq = new Map();
  details.forEach((r) => {
    const key = r.Data + "|" + r.Campeonato + "|" + r.Jogo;
    if (!uniq.has(key)) uniq.set(key, r);
  });
  const rows = Array.from(uniq.values())
    .filter(r => r.g1 == null || r.g2 == null); // só pendentes

  document.getElementById("cards").innerHTML = rows.map((r) => {
    const res = r.g1 == null || r.g2 == null
      ? '<span class="badge pend">Pendente</span>'
      : `<span class="score">${r.g1} x ${r.g2}</span>`;
    return `<div class="cardMatch">
      <div class="matchHead">
        <div class="muted small">${r.Data} • ${r.Campeonato}</div>
        <div>${res}</div>
      </div>
      <div class="teams">
        ${crestHTML(r.team1, "t1")} <div>${r.team1}</div>
        <div class="muted" style="margin:0 8px">x</div>
        ${crestHTML(r.team2, "t2")} <div>${r.team2}</div>
      </div>
    </div>`;
  }).join("");
}


  document.getElementById("btnReset").addEventListener("click", () => {
    pf.value = "";
    lf.value = "";
    df.value = "";
    document.getElementById("fBusca").value = "";
    renderDetail();
    document.querySelectorAll(".gameBlock").forEach((b) => b.classList.add("collapsed"));
  });

  ["fPalpiteiro", "fLiga", "fData", "fBusca"].forEach((id) =>
    document.getElementById(id).addEventListener("input", renderDetail)
  );

  renderRank();
  renderDetail();
  renderCards();
  const _btnReload = document.getElementById("btnReload");
  if (_btnReload) _btnReload.addEventListener("click", () => location.reload());
  document.querySelectorAll(".gameBlock").forEach((b) => b.classList.add("collapsed"));
}


async function bootstrap() {
  try {
    // statusEl.textContent = "carregando…";
    const rows = await loadGViz();
    const data = buildData(rows);
    // console.log(rows);
    renderUI(data);
    // statusEl.textContent = `ok • ${rows.length} respostas`;
    errEl.style.display = "none";
  } catch (e) {
    showError(e.message || "Falha ao carregar.");
    console.error(e);
  }
}

bootstrap();

