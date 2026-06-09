const FORM_CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwaCT1JaglH0MAVtbr9VErA6PW8gQ-1_nQx6re9gzNnDSXSO9GLk8qc1O_w9mb1_B11WQ/exec",
  SECRET: "ODam2CcITWgs6UH1eWgqIczul0JktfMjOif5kiOFi5t5rD457BXepCtdQTOda5F8",
};

const DEFAULT_COMPETITIONS = [
  { competicao: "paulistao", nome: "Paulistão", ordem: 10 },
  { competicao: "brasileirao", nome: "Brasileirão", ordem: 20 },
  { competicao: "libertadores", nome: "Libertadores", ordem: 30 },
  { competicao: "copa_do_brasil", nome: "Copa do Brasil", ordem: 40 },
  { competicao: "sulamericana", nome: "Sul-Americana", ordem: 50 },
  { competicao: "supercoparei", nome: "Super Copa Rei", ordem: 60 },
];

const DEFAULT_TEAMS_BY_COMPETITION = {
  paulistao: [
    "Corinthians", "Palmeiras", "São Paulo", "Santos", "Bragantino", "Guarani",
    "Ponte Preta", "Novorizontino", "Mirassol", "Portuguesa", "Botafogo-SP",
    "São Bernardo", "Primavera", "Capivariano", "Velo Clube", "Noroeste",
  ],
  brasileirao: [
    "Atlético-MG", "Athletico-PR", "Bahia", "Botafogo", "Bragantino",
    "Chapecoense", "Coritiba", "Corinthians", "Cruzeiro", "Flamengo",
    "Fluminense", "Remo", "Grêmio", "Internacional", "Mirassol", "Palmeiras",
    "São Paulo", "Santos", "Vasco", "Vitória",
  ],
  libertadores: [
    "2 de Mayo", "Alianza Lima", "Always Ready", "Argentinos Juniors", "Bahia",
    "Barcelona de Guayaquil", "Boca Juniors", "Bolívar", "Botafogo", "Carabobo",
    "Cerro Porteño", "Coquimbo Unido", "Corinthians", "Cruzeiro", "Cusco",
    "Deportes La Guaira", "Deportes Tolima", "Deportivo Independiente Medellín",
    "Deportivo Táchira", "Estudiantes de La Plata", "Flamengo", "Fluminense",
    "Guaraní", "Huachipato", "Independiente del Valle", "Independiente Rivadavia",
    "Independiente Santa Fé", "Junior Barranquilla", "Juventud", "Lanús", "LDU",
    "Libertad", "Liverpool", "Mirassol", "Nacional", "Nacional Potosí",
    "O'Higgins", "Palmeiras", "Peñarol", "Platense", "Rosario Central",
    "Sporting Cristal", "The Strongest", "Universidad Católica (CHI)",
    "Universidad Católica (EQU)", "Universidad Central de Venezuela", "Universitario",
  ],
  copa_do_brasil: [
    "Athletic-MG", "Athletico-PR", "Atlético-GO", "Atlético-MG", "Bahia",
    "Barra-SC", "Botafogo", "Ceará", "Chapecoense", "Confiança-SE", "Corinthians",
    "Coritiba", "CRB", "Cruzeiro", "Flamengo", "Fluminense", "Fortaleza",
    "Goiás", "Grêmio", "Internacional", "Jacuipense", "Juventude", "Mirassol",
    "Operário-PR", "Palmeiras", "Paysandu", "RB Bragantino", "Remo", "Santos",
    "São Paulo", "Vasco", "Vitória",
  ],
  sulamericana: [
    "Alianza Atlético", "América de Cali", "Atlético-MG", "Audax Italiano",
    "Barracas Central", "Blooming", "Boston River", "Botafogo", "Carabobo",
    "Caracas", "Cienciano", "Deportivo Cuenca", "Deportivo Riestra", "Grêmio",
    "Independiente Petrolero", "Juventud", "Macará", "Millonarios",
    "Montevideo City Torque", "O'Higgins", "Olimpia", "Palestino", "Puerto Cabello",
    "Racing", "Red Bull Bragantino", "Recoleta", "River Plate", "San Lorenzo",
    "Santos", "São Paulo", "Tigre", "Vasco",
  ],
  supercoparei: ["Corinthians", "Flamengo"],
};

const state = {
  competitions: [],
  teams: [],
  suggestions: [],
  selectedGameKey: "",
  isSubmitting: false,
  usedFallbackData: false,
};

const $id = (id) => document.getElementById(id);

const els = {
  form: $id("form"),
  nome: $id("nome"),
  dataJogo: $id("dataJogo"),
  competicao: $id("competicao"),
  mandante: $id("mandante"),
  visitante: $id("visitante"),
  golsMandante: $id("golsMandante"),
  golsVisitante: $id("golsVisitante"),
  btnEnviar: $id("btnEnviar"),
  btnRefresh: $id("btnRefresh"),
  btnReloadSuggestions: $id("btnReloadSuggestions"),
  hint: $id("hint"),
  msg: $id("msg"),
  preview: $id("preview"),
  suggestionSearch: $id("suggestionSearch"),
  suggestionsStatus: $id("suggestionsStatus"),
  suggestionsList: $id("suggestionsList"),
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function jsonp(action, params = {}) {
  return new Promise((resolve, reject) => {
    const callback = "form_cb_" + Math.random().toString(16).slice(2);
    const query = new URLSearchParams({
      action,
      secret: FORM_CONFIG.SECRET,
      ...params,
      callback,
    });
    const script = document.createElement("script");
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("timeout"));
    }, 15000);

    function cleanup() {
      window.clearTimeout(timer);
      delete window[callback];
      script.remove();
    }

    window[callback] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("load_error"));
    };
    script.src = `${FORM_CONFIG.SCRIPT_URL}?${query.toString()}`;
    document.head.appendChild(script);
  });
}

function todaySaoPaulo() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function nowSaoPauloBR() {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date());
}

function formatDateBR(value) {
  const date = String(value || "").slice(0, 10);
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function competitionName(code) {
  return state.competitions.find((item) => item.competicao === code)?.nome || code;
}

function teamsFallbackArray() {
  return Object.entries(DEFAULT_TEAMS_BY_COMPETITION).flatMap(([campeonato, teams]) =>
    teams.map((time) => ({ time, campeonato, logo: "", ativo: true }))
  );
}

async function fetchCompetitions() {
  try {
    const data = await jsonp("competitions");
    if (!data?.ok || !Array.isArray(data.competitions)) throw new Error(data?.error || "competitions_error");
    state.competitions = data.competitions;
  } catch (error) {
    state.usedFallbackData = true;
    state.competitions = DEFAULT_COMPETITIONS;
  }
  renderCompetitions();
}

async function fetchTeams() {
  try {
    const data = await jsonp("teams");
    if (!data?.ok || !Array.isArray(data.teams)) throw new Error(data?.error || "teams_error");
    state.teams = data.teams;
  } catch (error) {
    state.usedFallbackData = true;
    state.teams = teamsFallbackArray();
  }
}

async function fetchGameSuggestions() {
  els.suggestionsStatus.textContent = "Carregando sugestões...";
  els.btnReloadSuggestions.disabled = true;

  try {
    const data = await jsonp("gameSuggestions", {
      fromDate: todaySaoPaulo(),
      limit: "20",
    });
    if (!data?.ok || !Array.isArray(data.games)) throw new Error(data?.error || "suggestions_error");
    state.suggestions = data.games;
  } catch (error) {
    state.suggestions = [];
    els.suggestionsStatus.textContent = "Sugestões indisponíveis. O lançamento manual continua funcionando.";
  } finally {
    els.btnReloadSuggestions.disabled = false;
    renderSuggestions();
  }
}

function renderCompetitions() {
  const current = els.competicao.value;
  const options = state.competitions
    .slice()
    .sort((a, b) => (Number(a.ordem || 999) - Number(b.ordem || 999)) || a.nome.localeCompare(b.nome))
    .map((item) => `<option value="${escapeHtml(item.competicao)}">${escapeHtml(item.nome)}</option>`)
    .join("");

  els.competicao.innerHTML = `<option value="" selected disabled>Selecione...</option>${options}`;
  if (current && state.competitions.some((item) => item.competicao === current)) {
    els.competicao.value = current;
  }
}

function resetTeamSelect(select) {
  select.innerHTML = `<option value="" selected disabled>Selecione o time...</option>`;
  select.value = "";
}

function fillTeamsForCompetition(competicao, selectedHome = "", selectedAway = "") {
  const teams = state.teams
    .filter((team) => team.campeonato === competicao && team.time)
    .sort((a, b) => a.time.localeCompare(b.time));

  resetTeamSelect(els.mandante);
  resetTeamSelect(els.visitante);

  teams.forEach((team) => {
    const home = document.createElement("option");
    home.value = team.time;
    home.textContent = team.time;
    els.mandante.appendChild(home);

    const away = document.createElement("option");
    away.value = team.time;
    away.textContent = team.time;
    els.visitante.appendChild(away);
  });

  els.mandante.disabled = teams.length === 0;
  els.visitante.disabled = teams.length === 0;

  if (selectedHome && teams.some((team) => team.time === selectedHome)) els.mandante.value = selectedHome;
  if (selectedAway && teams.some((team) => team.time === selectedAway)) els.visitante.value = selectedAway;

  els.hint.textContent = teams.length
    ? `Times carregados: ${teams.length}.`
    : "Sem times cadastrados para essa competição.";

  validateForm();
}

function intOrNull(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || !Number.isInteger(number)) return null;
  return number;
}

function setMessage(text, type = "") {
  els.msg.textContent = text;
  els.msg.className = `msg ${type}`.trim();
  els.msg.style.display = text ? "block" : "none";
}

function validateForm() {
  if (state.isSubmitting) {
    els.btnEnviar.disabled = true;
    return false;
  }

  const tipo = els.form.tipoLancamento?.value || "";
  const gm = intOrNull(els.golsMandante.value);
  const gv = intOrNull(els.golsVisitante.value);
  let error = "";

  const ok = Boolean(
    els.nome.value &&
    els.dataJogo.value &&
    els.competicao.value &&
    els.mandante.value &&
    els.visitante.value &&
    tipo &&
    gm !== null &&
    gv !== null &&
    gm >= 0 &&
    gv >= 0
  );

  if (els.mandante.value && els.visitante.value && els.mandante.value === els.visitante.value) {
    error = "Mandante e visitante não podem ser o mesmo time.";
  } else if ((gm !== null && gm < 0) || (gv !== null && gv < 0)) {
    error = "Gols não podem ser negativos.";
  }

  els.btnEnviar.disabled = !ok || Boolean(error);
  if (error) setMessage(error, "err");
  else if (els.msg.classList.contains("err")) setMessage("");

  return ok && !error;
}

function renderSuggestions() {
  const query = els.suggestionSearch.value.trim().toLowerCase();
  const games = state.suggestions.filter((game) => {
    if (!query) return true;
    const hay = [
      game.dataJogo,
      game.competicaoNome || competitionName(game.competicao),
      game.mandante,
      game.visitante,
    ].join(" ").toLowerCase();
    return hay.includes(query);
  });

  if (!state.suggestions.length) {
    els.suggestionsList.innerHTML = "";
    if (!els.suggestionsStatus.textContent) {
      els.suggestionsStatus.textContent = "Nenhum jogo sugerido encontrado.";
    }
    return;
  }

  if (!games.length) {
    els.suggestionsStatus.textContent = "Nenhuma sugestão encontrada para a busca.";
    els.suggestionsList.innerHTML = "";
    return;
  }

  els.suggestionsStatus.textContent = "";
  els.suggestionsList.innerHTML = games.map((game) => {
    const selected = state.selectedGameKey === game.key ? " selected" : "";
    return `
      <article class="suggestionCard${selected}">
        <div class="suggestionMeta">
          <span>${escapeHtml(formatDateBR(game.dataJogo))}</span>
          <span>${escapeHtml(game.competicaoNome || competitionName(game.competicao))}</span>
        </div>
        <div class="suggestionMatch">
          <b>${escapeHtml(game.mandante)}</b>
          <span>x</span>
          <b>${escapeHtml(game.visitante)}</b>
        </div>
        <div class="suggestionFooter">
          <span>${Number(game.palpites || 0)} palpite${Number(game.palpites || 0) === 1 ? "" : "s"}</span>
          <button class="btn compact" type="button" data-game-key="${escapeHtml(game.key)}">Selecionar jogo</button>
        </div>
      </article>
    `;
  }).join("");
}

function selectSuggestedGame(game) {
  state.selectedGameKey = game.key;
  els.dataJogo.value = String(game.dataJogo || "").slice(0, 10);
  els.competicao.value = game.competicao;
  fillTeamsForCompetition(game.competicao, game.mandante, game.visitante);
  els.golsMandante.value = "";
  els.golsVisitante.value = "";
  els.hint.textContent = "Jogo selecionado. Informe o placar e o tipo de lançamento.";
  setMessage("");
  renderSuggestions();
  validateForm();
  els.golsMandante.focus();
}

async function submitEntry(event) {
  event.preventDefault();
  if (!validateForm()) return;

  state.isSubmitting = true;
  els.btnEnviar.disabled = true;
  setMessage("Enviando lançamento...", "");

  const payload = {
    nome: els.nome.value,
    dataJogo: els.dataJogo.value,
    competicao: els.competicao.value,
    mandante: els.mandante.value,
    visitante: els.visitante.value,
    golsMandante: Number(els.golsMandante.value),
    golsVisitante: Number(els.golsVisitante.value),
    tipoLancamento: els.form.tipoLancamento.value,
    createdAt: nowSaoPauloBR(),
  };

  const body = new URLSearchParams({
    secret: FORM_CONFIG.SECRET,
    nome: payload.nome,
    dataJogo: payload.dataJogo,
    competicao: payload.competicao,
    mandante: payload.mandante,
    golsMandante: String(payload.golsMandante),
    visitante: payload.visitante,
    golsVisitante: String(payload.golsVisitante),
    tipoLancamento: payload.tipoLancamento,
    createdAt: payload.createdAt,
  });

  try {
    await fetch(FORM_CONFIG.SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
    });

    setMessage("Envio solicitado. Recarregue o dashboard para conferir o registro.", "ok");
    els.preview.textContent = JSON.stringify(payload, null, 2);
    els.preview.style.display = "block";
    els.golsMandante.value = "";
    els.golsVisitante.value = "";
    await fetchGameSuggestions();
  } catch (error) {
    setMessage("Falha ao enviar. Verifique a conexão e tente novamente.", "err");
  } finally {
    state.isSubmitting = false;
    validateForm();
  }
}

async function initFormPage() {
  els.dataJogo.value = todaySaoPaulo();

  els.form.addEventListener("submit", submitEntry);
  els.form.addEventListener("change", validateForm);
  els.form.addEventListener("input", validateForm);

  els.competicao.addEventListener("change", () => {
    state.selectedGameKey = "";
    fillTeamsForCompetition(els.competicao.value);
    renderSuggestions();
  });

  els.btnRefresh.addEventListener("click", () => {
    els.form.reset();
    els.dataJogo.value = todaySaoPaulo();
    state.selectedGameKey = "";
    resetTeamSelect(els.mandante);
    resetTeamSelect(els.visitante);
    els.mandante.disabled = true;
    els.visitante.disabled = true;
    els.preview.style.display = "none";
    setMessage("");
    renderCompetitions();
    renderSuggestions();
    validateForm();
  });

  els.btnReloadSuggestions.addEventListener("click", fetchGameSuggestions);
  els.suggestionSearch.addEventListener("input", renderSuggestions);
  els.suggestionsList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-game-key]");
    if (!button) return;
    const game = state.suggestions.find((item) => item.key === button.dataset.gameKey);
    if (game) selectSuggestedGame(game);
  });

  els.dataJogo.addEventListener("focus", () => els.dataJogo.showPicker?.());
  els.dataJogo.addEventListener("click", () => els.dataJogo.showPicker?.());

  await fetchCompetitions();
  await fetchTeams();
  if (els.competicao.value) fillTeamsForCompetition(els.competicao.value);

  if (state.usedFallbackData) {
    els.hint.textContent = "Usando lista local até os novos endpoints do Apps Script serem publicados.";
  }

  await fetchGameSuggestions();
  validateForm();
}

document.addEventListener("DOMContentLoaded", initFormPage);
