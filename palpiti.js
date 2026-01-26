// =====================================================
// OS PALPI-TI — Dashboard (Web App + JSONP)
// Mantém seu HTML/CSS antigo (IDs: tblRank, tblDetalhe, cards, kpi, filtros)
// =====================================================

const CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwaCT1JaglH0MAVtbr9VErA6PW8gQ-1_nQx6re9gzNnDSXSO9GLk8qc1O_w9mb1_B11WQ/exec",
  SECRET: "ODam2CcITWgs6UH1eWgqIczul0JktfMjOif5kiOFi5t5rD457BXepCtdQTOda5F8",

  // Labels bonitos
  COMP_LABEL: {
    paulistao: "Paulistão",
    brasileirao: "Brasileirão",
    libertadores: "Libertadores",
    copa_do_brasil: "Copa do Brasil",
    sulamericana: "Sul-Americana",
  },

  

  PRIZES: ["R$ 300,00", "R$ 150,00", "R$ 50,00"],
};

// ---------- DOM ----------
const $ = (s) => document.querySelector(s);
const elRankBody = $("#tblRank tbody");
const elDetBody = $("#tblDetalhe tbody");
const elCards = $("#cards");
const elKpi = $("#kpi");
const errEl = $("#err");

const fPalpiteiro = $("#fPalpiteiro");
const fLiga = $("#fLiga");
const fData = $("#fData");
const fBusca = $("#fBusca");

const btnReset = $("#btnReset");
const btnExpandir = $("#btnExpandir");
const btnRecolher = $("#btnRecolher");

// ---------- Utils ----------
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

function pad2(n) { return (n < 10 ? "0" : "") + n; }
function formatDateBR(yyyyMMdd) {
  // input esperado: YYYY-MM-DD
  yyyyMMdd = String(yyyyMMdd).slice(0,10);
  if (!yyyyMMdd) return "";
  const [Y, M, D] = yyyyMMdd.split("-");
  return `${D}/${M}/${Y}`;
}

function outcome(gm, gv) {
  if (gm > gv) return 1;
  if (gm < gv) return -1;
  return 0;
}

function gameKey(r) {
  return `${r.dataJogo}|${r.competicao}|${r.mandante}|${r.visitante}`;
}

function badge(cls, text) {
  return `<span class="badge ${cls}">${escapeHtml(text)}</span>`;
}

// Crest map vindo da aba times
let CRESTS = new Map(); // key: `${campeonato}|${time}` -> logo url

function crestHTML(teamName, campeonato, cls) {
  const key = `${campeonato}|${teamName}`;
  const url = CRESTS.get(key);
  if (url) {
    return `<div class="crest"><img src="${escapeHtml(url)}" alt="escudo ${escapeHtml(teamName)}"
      onerror="this.closest('.crest').classList.add('fallback','${cls}'); this.remove();"></div>`;
  }
  const initials = (teamName || "")
    .split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 3).join("").toUpperCase();
  return `<div class="crest fallback ${cls}">${escapeHtml(initials)}</div>`;
}

// ---------- JSONP loader ----------
function jsonp(url) {
  return new Promise((resolve, reject) => {
    const cb = "cb_" + Math.random().toString(16).slice(2);
    const t = setTimeout(() => {
      cleanup();
      reject(new Error("timeout"));
    }, 15000);

    function cleanup() {
      clearTimeout(t);
      delete window[cb];
      script.remove();
    }

    window[cb] = (data) => {
      cleanup();
      resolve(data);
    };

    const script = document.createElement("script");
    script.src = `${url}&callback=${encodeURIComponent(cb)}`;
    script.onerror = () => {
      cleanup();
      reject(new Error("load_error"));
    };
    document.head.appendChild(script);
  });
}

async function fetchRows() {
  const url = `${CONFIG.SCRIPT_URL}?action=list&secret=${encodeURIComponent(CONFIG.SECRET)}`;
  const data = await jsonp(url);
  if (!data?.ok) throw new Error(data?.error || "list_error");
  console.log("Dados brutos:", data.rows);
  return Array.isArray(data.rows) ? data.rows : [];
}

async function fetchTeams() {
  const url = `${CONFIG.SCRIPT_URL}?action=teams&secret=${encodeURIComponent(CONFIG.SECRET)}`;
  const data = await jsonp(url);
  if (!data?.ok) return [];
  return Array.isArray(data.teams) ? data.teams : [];
}

// ---------- Normalization ----------
function normalizeRows(rows) {
  return (rows || [])
    .map(r => ({
      createdAt: String(r.createdAt || ""),
      nome: String(r.nome || "").trim(),
      dataJogo: String(r.dataJogo || "").trim(),        // YYYY-MM-DD
      competicao: String(r.competicao || "").trim(),
      mandante: String(r.mandante || "").trim(),
      visitante: String(r.visitante || "").trim(),
      golsMandante: Number(r.golsMandante),
      golsVisitante: Number(r.golsVisitante),
      tipoLancamento: String(r.tipoLancamento || "").trim(), // palpite|resultado
    }))
    .filter(r => r.dataJogo && r.competicao && r.mandante && r.visitante)
    .filter(r => r.tipoLancamento === "palpite" || r.tipoLancamento === "resultado");
}

function buildGames(rows) {
  const map = new Map();

  for (const r of rows) {
    const key = gameKey(r);
    if (!map.has(key)) {
      map.set(key, {
        key,
        dataJogo: r.dataJogo,
        competicao: r.competicao,
        mandante: r.mandante,
        visitante: r.visitante,
        resultados: [],
        palpites: [],
      });
    }
    const g = map.get(key);
    if (r.tipoLancamento === "resultado") g.resultados.push(r);
    else g.palpites.push(r);
  }

  const games = [];
  for (const g of map.values()) {
    g.resultados.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    g.resultado = g.resultados[0] || null;
    games.push(g);
  }

  // mais recente -> mais antigo
  games.sort((a, b) => String(b.dataJogo).localeCompare(String(a.dataJogo)));
  return games;
}

// ---------- Filters ----------
function applyFilters(games) {
  const u = fPalpiteiro.value || "";
  const c = fLiga.value || "";
  const d = fData.value || "";
  const q = (fBusca.value || "").trim().toLowerCase();

  return games
    .filter(g => !c || g.competicao === c)
    .filter(g => !d || g.dataJogo === d)
    .map(g => {
      if (!u) return g;
      return { ...g, palpites: g.palpites.filter(p => p.nome === u) };
    })
    .filter(g => {
      if (!q) return true;
      const hay = `${g.mandante} ${g.visitante} ${CONFIG.COMP_LABEL[g.competicao] || g.competicao} ${g.dataJogo}`.toLowerCase();
      return hay.includes(q);
    });
}

// ---------- Scoring ----------
function scorePick(p, r) {
  const exato = (p.golsMandante === r.golsMandante && p.golsVisitante === r.golsVisitante);
  if (exato) return { pontos: 3, exato: 1, vencedor: 0, erro: 0, badge: ["ok", "Exato • 3"] };

  const oP = outcome(p.golsMandante, p.golsVisitante);
  const oR = outcome(r.golsMandante, r.golsVisitante);

  if (oP === oR) return { pontos: 1, exato: 0, vencedor: 1, erro: 0, badge: ["warn", "Vencedor/Empate • 1"] };

  return { pontos: 0, exato: 0, vencedor: 0, erro: 1, badge: ["bad", "Erro • 0"] };
}

function buildRanking(games) {
  const withResult = games.filter(g => !!g.resultado);

  const byUser = new Map();
  let kPalpites = 0, kExatos = 0, kVencedor = 0, kErros = 0;

  for (const g of withResult) {
    const r = g.resultado;
    for (const p of g.palpites) {
      if (!p.nome) continue;
      kPalpites++;
      const s = scorePick(p, r);
      kExatos += s.exato;
      kVencedor += s.vencedor;
      kErros += s.erro;

      if (!byUser.has(p.nome)) {
        byUser.set(p.nome, { nome: p.nome, pts: 0, exa: 0, ven: 0, err: 0, total: 0, apr: 0, prm: "R$ 0,00" });
      }
      const u = byUser.get(p.nome);
      u.pts += s.pontos;
      u.exa += s.exato;
      u.ven += s.vencedor;
      u.err += s.erro;
      u.total += 1;
    }
  }

  const rank = Array.from(byUser.values()).map(u => {
    u.apr = u.total ? (((u.exa + u.ven) / u.total) * 100) : 0;
    return u;
  });

  rank.sort((a, b) =>
    (b.pts - a.pts) ||
    (b.exa - a.exa) ||
    (b.ven - a.ven) ||
    a.nome.localeCompare(b.nome)
  );

  // premiação top 3
  rank.forEach((r, i) => {
    r.prm = CONFIG.PRIZES[i] || "R$ 0,00";
  });

  return { rank, kpis: { palpites: kPalpites, exatos: kExatos, vencedor: kVencedor, erros: kErros } };
}

// ---------- Render ----------
function renderFilterOptions(allGames, allRows) {
  // Palpiteiros
  const users = Array.from(new Set(allRows.map(r => r.nome).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  fPalpiteiro.innerHTML = `<option value="">Palpiteiros</option>` + users.map(u => `<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`).join("");

  // Campeonatos
  const comps = Array.from(new Set(allGames.map(g => g.competicao))).sort((a, b) => a.localeCompare(b));
  fLiga.innerHTML = `<option value="">Campeonatos</option>` + comps.map(c => {
    const lbl = CONFIG.COMP_LABEL[c] || c;
    return `<option value="${escapeHtml(c)}">${escapeHtml(lbl)}</option>`;
  }).join("");

  // Datas (do dataset)
  const dates = Array.from(new Set(allGames.map(g => g.dataJogo))).sort((a, b) => b.localeCompare(a));
  fData.innerHTML = `<option value="">Datas</option>` + dates.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(formatDateBR(d))}</option>`).join("");
}

function renderKpis(kpis) {
  elKpi.innerHTML = `
    <div class="k" style="grid-area:k1"><span class="muted small">Palpites</span><b>${kpis.palpites}</b></div>
    <div class="k" style="grid-area:k2"><span class="muted small">Exatos</span><b>${kpis.exatos}</b></div>
    <div class="k" style="grid-area:k3"><span class="muted small">Vencedor</span><b>${kpis.vencedor}</b></div>
    <div class="k" style="grid-area:k4"><span class="muted small">Erros</span><b>${kpis.erros}</b></div>
    <button class="btn ghost" id="btnReload" style="grid-area:btnReload">Recarregar</button>
  `;
  $("#btnReload").addEventListener("click", () => init(true));
}

function renderRanking(rank) {
  elRankBody.innerHTML = rank.map((r, i) => `
    <tr>
      <td style="text-align:left">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="opacity:.9">${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎮"}</span>
          <b>${escapeHtml(r.nome)}</b>
        </div>
      </td>
      <td><b>${r.pts}</b></td>
      <td>${r.exa}</td>
      <td>${r.ven}</td>
      <td>${r.err}</td>
      <td>${r.apr.toFixed(1)}%</td>
      <td>${escapeHtml(r.prm)}</td>
    </tr>
  `).join("") || `<tr><td colspan="7" class="muted">Sem dados.</td></tr>`;
}

function renderPendentes(games) {
  const pend = games
    .filter(g => !g.resultado && g.palpites.length > 0)
    .sort((a, b) => String(b.dataJogo).localeCompare(String(a.dataJogo)));

  elCards.innerHTML = pend.map(g => {
    const compLbl = CONFIG.COMP_LABEL[g.competicao] || g.competicao;
    console.log(g)
    return `
      <div class="cardMatch">
        <div class="matchHead">
          <div class="muted small">${escapeHtml(formatDateBR(g.dataJogo))} • ${escapeHtml(compLbl)}</div>
          ${badge("pend", "Pendente")}
        </div>
        <div class="teams">
          <div class="crestBox">
            ${crestHTML(g.mandante, g.competicao, "t1")}
            <b class="times_style">${escapeHtml(g.mandante)}</b>
          </div>
          <span class="muted" style="font-weight:900">x</span>
          <div class="crestBox">
            ${crestHTML(g.visitante, g.competicao, "t2")}
            <b class="times_style">${escapeHtml(g.visitante)}</b>
          </div>
        </div>
        <div class="muted small" style="margin-top:6px">${g.palpites.length} palpite(s) lançado(s)</div>
      </div>
    `;
  }).join("") || `<div class="muted small">Nenhum jogo pendente para os filtros atuais.</div>`;
}

function renderDetalhe(games) {
  const finalizados = games
    .filter(g => !!g.resultado)
    .sort((a, b) => String(b.dataJogo).localeCompare(String(a.dataJogo)));

  const blocks = finalizados.map(g => {
    const compLbl = CONFIG.COMP_LABEL[g.competicao] || g.competicao;
    const r = g.resultado;
    const placar = `${r.golsMandante} x ${r.golsVisitante}`;

    const picks = (g.palpites || []).slice().sort((a, b) => a.nome.localeCompare(b.nome));
    const rows = picks.map(p => {
      const s = scorePick(p, r);
      return `
        <tr>
          <td style="width:110px" class="muted small">${escapeHtml(p.nome)}</td>
          <td style="width:160px">
            <span class="muted small">${escapeHtml(p.golsMandante)} x ${escapeHtml(p.golsVisitante)}</span>
          </td>
          <td>${badge(s.badge[0], s.badge[1])}</td>
        </tr>
      `;
    }).join("") || `<tr><td colspan="3" class="muted small">Sem palpites (para o filtro atual).</td></tr>`;

    return `
      <tr>
        <td colspan="6">
          <div class="gameBlock collapsed">
            <div class="gameHead">${escapeHtml(formatDateBR(g.dataJogo))} • ${escapeHtml(compLbl)}</div>

            <div class="gameTitle" onclick="this.closest('.gameBlock').classList.toggle('collapsed')">
              <span class="caret">▾</span>

              <div class="crestBox">
                ${crestHTML(g.mandante, g.competicao, "t1")}
                <span>${escapeHtml(g.mandante)}</span>
              </div>

              <div class="score" style="min-width:90px;text-align:center">${escapeHtml(placar)}</div>

              <div class="crestBox">
                ${crestHTML(g.visitante, g.competicao, "t2")}
                <span>${escapeHtml(g.visitante)}</span>
              </div>

              <div style="margin-left:auto">${badge("primary", "Resultado")}</div>
            </div>

            <div class="gameBody">
              <table class="subtbl">
                <thead>
                  <tr>
                    <th class="muted small" style="text-align:left;">Palpiteiro</th>
                    <th class="muted small" style="text-align:left;">Palpite</th>
                    <th class="muted small" style="text-align:left;">Status/Pontos</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  elDetBody.innerHTML = blocks || `<tr><td colspan="6" class="muted">Nenhum jogo com resultado para os filtros atuais.</td></tr>`;
}

// ---------- Errors ----------
function showError(msg) {
  errEl.style.display = "block";
  errEl.innerHTML = `<b>Erro:</b> ${escapeHtml(msg)}`;
}

// ---------- Expand / Collapse ----------
function expandAll(expand) {
  document.querySelectorAll(".gameBlock").forEach(b => {
    if (expand) b.classList.remove("collapsed");
    else b.classList.add("collapsed");
  });
}

// ---------- Init ----------
let ALL_ROWS = [];
let ALL_GAMES = [];

async function init(forceReload = false) {
  try {
    errEl.style.display = "none";
    errEl.innerHTML = "";

    // 1) carrega times (logos)
    const teams = await fetchTeams().catch(() => []);
    CRESTS = new Map();
    for (const t of teams) {
      const time = String(t.time || "").trim();
      const camp = String(t.campeonato || "").trim();
      const logo = String(t.logo || "").trim();
      if (time && camp && logo) CRESTS.set(`${camp}|${time}`, logo);
    }

    // 2) carrega lançamentos
    const raw = await fetchRows();
    ALL_ROWS = normalizeRows(raw);
    ALL_GAMES = buildGames(ALL_ROWS);

    // 3) popula filtros
    const prevU = fPalpiteiro.value;
    const prevC = fLiga.value;
    const prevD = fData.value;
    renderFilterOptions(ALL_GAMES, ALL_ROWS);
    if (prevU) fPalpiteiro.value = prevU;
    if (prevC) fLiga.value = prevC;
    if (prevD) fData.value = prevD;

    // 4) render com filtros
    renderAll();
  } catch (e) {
    console.error(e);
    showError("Não consegui carregar os dados do Web App. Confirme SECRET, Deploy (New version) e permissões.");
  }
}

function renderAll() {
  const filtered = applyFilters(ALL_GAMES);
  const { rank, kpis } = buildRanking(filtered);

  renderKpis(kpis);
  renderRanking(rank);
  renderDetalhe(filtered);
  renderPendentes(filtered);
}

// ---------- Events ----------
btnReset.addEventListener("click", () => {
  fPalpiteiro.value = "";
  fLiga.value = "";
  fData.value = "";
  fBusca.value = "";
  renderAll();
});

btnExpandir.addEventListener("click", () => expandAll(true));
btnRecolher.addEventListener("click", () => expandAll(false));

[fPalpiteiro, fLiga, fData].forEach(el => el.addEventListener("change", renderAll));
fBusca.addEventListener("input", renderAll);

// Start
init();
