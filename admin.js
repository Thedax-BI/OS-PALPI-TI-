const ADMIN_CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwaCT1JaglH0MAVtbr9VErA6PW8gQ-1_nQx6re9gzNnDSXSO9GLk8qc1O_w9mb1_B11WQ/exec",
  TOKEN_KEY: "ospalpiti.admin.token",
};

const adminState = {
  token: "",
  competitions: [],
  teams: [],
  entries: [],
};

const $ = (id) => document.getElementById(id);

const adminEls = {
  loginPanel: $("loginPanel"),
  adminPanel: $("adminPanel"),
  loginForm: $("loginForm"),
  adminPassword: $("adminPassword"),
  btnLogin: $("btnLogin"),
  btnLogout: $("btnLogout"),
  loginMessage: $("loginMessage"),
  adminMessage: $("adminMessage"),
  adminStatus: $("adminStatus"),
  entryFilters: $("entryFilters"),
  entryStatus: $("entryStatus"),
  entryType: $("entryType"),
  entryCompetition: $("entryCompetition"),
  entryName: $("entryName"),
  entryStart: $("entryStart"),
  entryEnd: $("entryEnd"),
  entrySearch: $("entrySearch"),
  btnReloadEntries: $("btnReloadEntries"),
  btnClearEntryFilters: $("btnClearEntryFilters"),
  entriesBody: $("entriesBody"),
  teamForm: $("teamForm"),
  teamName: $("teamName"),
  teamCompetition: $("teamCompetition"),
  teamLogo: $("teamLogo"),
  teamActive: $("teamActive"),
  btnClearTeam: $("btnClearTeam"),
  teamsBody: $("teamsBody"),
  competitionForm: $("competitionForm"),
  competitionCode: $("competitionCode"),
  competitionName: $("competitionName"),
  competitionOrder: $("competitionOrder"),
  competitionActive: $("competitionActive"),
  btnClearCompetition: $("btnClearCompetition"),
  competitionsBody: $("competitionsBody"),
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

function adminJsonp(action, params = {}) {
  return new Promise((resolve, reject) => {
    const callback = "admin_cb_" + Math.random().toString(16).slice(2);
    const query = new URLSearchParams({ action, ...params, callback });
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
      if (data?.ok === false && data.error === "unauthorized" && action !== "adminLogin") {
        expireSession();
      }
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("load_error"));
    };
    script.src = `${ADMIN_CONFIG.SCRIPT_URL}?${query.toString()}`;
    document.head.appendChild(script);
  });
}

function setLoginMessage(text, type = "") {
  adminEls.loginMessage.textContent = text;
  adminEls.loginMessage.className = `msg ${type}`.trim();
  adminEls.loginMessage.style.display = text ? "block" : "none";
}

function setAdminMessage(text, type = "") {
  adminEls.adminMessage.textContent = text;
  adminEls.adminMessage.className = `msg ${type}`.trim();
  adminEls.adminMessage.style.display = text ? "block" : "none";
}

function setAuthenticated(isAuthenticated) {
  adminEls.loginPanel.classList.toggle("is-hidden", isAuthenticated);
  adminEls.adminPanel.classList.toggle("is-hidden", !isAuthenticated);
  adminEls.adminStatus.textContent = isAuthenticated ? "Sessão ativa" : "";
}

function persistToken(token) {
  adminState.token = token || "";
  if (token) sessionStorage.setItem(ADMIN_CONFIG.TOKEN_KEY, token);
  else sessionStorage.removeItem(ADMIN_CONFIG.TOKEN_KEY);
}

function expireSession() {
  persistToken("");
  setAuthenticated(false);
  setLoginMessage("Sessão expirada. Entre novamente.", "err");
}

function competitionName(code) {
  return adminState.competitions.find((item) => item.competicao === code)?.nome || code;
}

function formatDateBR(value) {
  const date = String(value || "").slice(0, 10);
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

async function loginAdmin(password) {
  setLoginMessage("Validando acesso...");
  adminEls.btnLogin.disabled = true;

  try {
    const data = await adminJsonp("adminLogin", { password });
    if (!data?.ok || !data.token) {
      const message = data?.error === "admin_password_not_configured"
        ? "Senha administrativa não configurada no Apps Script."
        : "Senha inválida.";
      setLoginMessage(message, "err");
      return;
    }

    persistToken(data.token);
    setAuthenticated(true);
    setLoginMessage("");
    await loadAdminData();
  } catch (error) {
    setLoginMessage("Não foi possível validar o acesso.", "err");
  } finally {
    adminEls.btnLogin.disabled = !adminEls.adminPassword.value;
  }
}

async function loadAdminData() {
  setAdminMessage("Carregando dados...");
  await loadCompetitions();
  await Promise.all([loadTeams(), loadEntries()]);
  setAdminMessage("");
}

async function loadCompetitions() {
  const data = await adminJsonp("competitions", {
    token: adminState.token,
    includeInactive: "true",
  });

  if (!data?.ok) {
    setAdminMessage("Falha ao carregar competições.", "err");
    return;
  }

  adminState.competitions = Array.isArray(data.competitions) ? data.competitions : [];
  renderCompetitionOptions();
  renderCompetitions();
}

async function loadTeams() {
  const data = await adminJsonp("teams", {
    token: adminState.token,
    includeInactive: "true",
  });

  if (!data?.ok) {
    setAdminMessage("Falha ao carregar times.", "err");
    return;
  }

  adminState.teams = Array.isArray(data.teams) ? data.teams : [];
  renderTeams();
}

function entryFilterParams() {
  return {
    token: adminState.token,
    status: adminEls.entryStatus.value,
    tipoLancamento: adminEls.entryType.value,
    competicao: adminEls.entryCompetition.value,
    nome: adminEls.entryName.value,
    dataInicio: adminEls.entryStart.value,
    dataFim: adminEls.entryEnd.value,
    q: adminEls.entrySearch.value,
  };
}

async function loadEntries() {
  adminEls.entriesBody.innerHTML = `<tr><td colspan="9" class="muted">Carregando...</td></tr>`;
  const data = await adminJsonp("adminEntries", entryFilterParams());

  if (!data?.ok) {
    adminEls.entriesBody.innerHTML = `<tr><td colspan="9" class="muted">Falha ao carregar lançamentos.</td></tr>`;
    return;
  }

  adminState.entries = Array.isArray(data.rows) ? data.rows : [];
  renderEntries();
}

function renderCompetitionOptions() {
  const options = adminState.competitions
    .slice()
    .sort((a, b) => (Number(a.ordem || 999) - Number(b.ordem || 999)) || a.nome.localeCompare(b.nome))
    .map((item) => `<option value="${escapeHtml(item.competicao)}">${escapeHtml(item.nome)}</option>`)
    .join("");

  adminEls.entryCompetition.innerHTML = `<option value="">Competições</option>${options}`;
  adminEls.teamCompetition.innerHTML = `<option value="" selected disabled>Selecione...</option>${options}`;
}

function renderEntries() {
  if (!adminState.entries.length) {
    adminEls.entriesBody.innerHTML = `<tr><td colspan="9" class="muted">Nenhum lançamento encontrado.</td></tr>`;
    return;
  }

  adminEls.entriesBody.innerHTML = adminState.entries.map((row) => {
    const disabled = row.status === "excluido" ? "disabled" : "";
    return `
      <tr>
        <td>${escapeHtml(formatDateBR(row.dataJogo))}</td>
        <td>${escapeHtml(row.createdAt || "-")}</td>
        <td>${escapeHtml(competitionName(row.competicao))}</td>
        <td>${escapeHtml(row.mandante)} x ${escapeHtml(row.visitante)}</td>
        <td>${escapeHtml(row.tipoLancamento)}</td>
        <td>${escapeHtml(row.nome)}</td>
        <td>${escapeHtml(row.golsMandante)} x ${escapeHtml(row.golsVisitante)}</td>
        <td><span class="badge ${row.status === "excluido" ? "bad" : "ok"}">${escapeHtml(row.status)}</span></td>
        <td>
          <button class="btn ghost compact danger" type="button" data-delete-entry="${escapeHtml(row.id)}" ${disabled}>Excluir</button>
        </td>
      </tr>
    `;
  }).join("");
}

function renderTeams() {
  if (!adminState.teams.length) {
    adminEls.teamsBody.innerHTML = `<tr><td colspan="5" class="muted">Nenhum time encontrado.</td></tr>`;
    return;
  }

  adminEls.teamsBody.innerHTML = adminState.teams.map((team, index) => `
    <tr>
      <td>${escapeHtml(team.time)}</td>
      <td>${escapeHtml(competitionName(team.campeonato))}</td>
      <td>${team.logo ? `<a href="${escapeHtml(team.logo)}" target="_blank" rel="noreferrer">Logo</a>` : `<span class="muted">Sem logo</span>`}</td>
      <td><span class="badge ${team.ativo ? "ok" : "bad"}">${team.ativo ? "ativo" : "inativo"}</span></td>
      <td><button class="btn ghost compact" type="button" data-edit-team="${index}">Editar</button></td>
    </tr>
  `).join("");
}

function renderCompetitions() {
  if (!adminState.competitions.length) {
    adminEls.competitionsBody.innerHTML = `<tr><td colspan="5" class="muted">Nenhuma competição encontrada.</td></tr>`;
    return;
  }

  adminEls.competitionsBody.innerHTML = adminState.competitions.map((item, index) => `
    <tr>
      <td>${escapeHtml(item.competicao)}</td>
      <td>${escapeHtml(item.nome)}</td>
      <td>${escapeHtml(item.ordem)}</td>
      <td><span class="badge ${item.ativa ? "ok" : "bad"}">${item.ativa ? "ativa" : "inativa"}</span></td>
      <td><button class="btn ghost compact" type="button" data-edit-competition="${index}">Editar</button></td>
    </tr>
  `).join("");
}

async function deleteEntry(id) {
  const entry = adminState.entries.find((row) => row.id === id);
  if (!entry) return;

  const confirmed = window.confirm(`Excluir logicamente o lançamento de ${entry.nome}?`);
  if (!confirmed) return;

  const reason = window.prompt("Motivo da exclusão (opcional):", "") ?? "";
  const data = await adminJsonp("adminDeleteEntry", {
    token: adminState.token,
    id,
    reason,
  });

  if (!data?.ok) {
    setAdminMessage("Falha ao excluir lançamento.", "err");
    return;
  }

  setAdminMessage("Lançamento excluído logicamente.", "ok");
  await loadEntries();
}

async function saveTeam(event) {
  event.preventDefault();
  const data = await adminJsonp("adminUpsertTeam", {
    token: adminState.token,
    time: adminEls.teamName.value,
    campeonato: adminEls.teamCompetition.value,
    logo: adminEls.teamLogo.value,
    ativo: adminEls.teamActive.checked ? "true" : "false",
  });

  if (!data?.ok) {
    setAdminMessage("Falha ao salvar time.", "err");
    return;
  }

  clearTeamForm();
  setAdminMessage("Time salvo.", "ok");
  await loadTeams();
}

async function saveCompetition(event) {
  event.preventDefault();
  const params = {
    token: adminState.token,
    nome: adminEls.competitionName.value,
    ordem: adminEls.competitionOrder.value,
    ativa: adminEls.competitionActive.checked ? "true" : "false",
  };
  if (adminEls.competitionCode.value) params.competicao = adminEls.competitionCode.value;

  const data = await adminJsonp("adminUpsertCompetition", params);
  if (!data?.ok) {
    setAdminMessage("Falha ao salvar competição.", "err");
    return;
  }

  clearCompetitionForm();
  setAdminMessage("Competição salva.", "ok");
  await loadCompetitions();
  await loadEntries();
}

function clearTeamForm() {
  adminEls.teamForm.reset();
  adminEls.teamActive.checked = true;
}

function clearCompetitionForm() {
  adminEls.competitionForm.reset();
  adminEls.competitionCode.value = "";
  adminEls.competitionOrder.value = "999";
  adminEls.competitionActive.checked = true;
}

function editTeam(index) {
  const team = adminState.teams[index];
  if (!team) return;
  adminEls.teamName.value = team.time || "";
  adminEls.teamCompetition.value = team.campeonato || "";
  adminEls.teamLogo.value = team.logo || "";
  adminEls.teamActive.checked = Boolean(team.ativo);
  adminEls.teamName.focus();
}

function editCompetition(index) {
  const competition = adminState.competitions[index];
  if (!competition) return;
  adminEls.competitionCode.value = competition.competicao || "";
  adminEls.competitionName.value = competition.nome || "";
  adminEls.competitionOrder.value = competition.ordem || "999";
  adminEls.competitionActive.checked = Boolean(competition.ativa);
  adminEls.competitionName.focus();
}

function bindEvents() {
  adminEls.adminPassword.addEventListener("input", () => {
    adminEls.btnLogin.disabled = !adminEls.adminPassword.value;
  });

  adminEls.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginAdmin(adminEls.adminPassword.value);
  });

  adminEls.btnLogout.addEventListener("click", () => {
    persistToken("");
    setAuthenticated(false);
    setLoginMessage("");
  });

  adminEls.btnReloadEntries.addEventListener("click", loadEntries);
  adminEls.btnClearEntryFilters.addEventListener("click", () => {
    adminEls.entryFilters.reset();
    adminEls.entryStatus.value = "ativo";
    loadEntries();
  });
  adminEls.entryFilters.addEventListener("change", loadEntries);
  adminEls.entrySearch.addEventListener("input", () => window.clearTimeout(adminState.searchTimer));
  adminEls.entrySearch.addEventListener("input", () => {
    adminState.searchTimer = window.setTimeout(loadEntries, 250);
  });
  adminEls.entryName.addEventListener("input", () => window.clearTimeout(adminState.nameTimer));
  adminEls.entryName.addEventListener("input", () => {
    adminState.nameTimer = window.setTimeout(loadEntries, 250);
  });

  adminEls.entriesBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-entry]");
    if (button) deleteEntry(button.dataset.deleteEntry);
  });

  adminEls.teamForm.addEventListener("submit", saveTeam);
  adminEls.btnClearTeam.addEventListener("click", clearTeamForm);
  adminEls.teamsBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-edit-team]");
    if (button) editTeam(Number(button.dataset.editTeam));
  });

  adminEls.competitionForm.addEventListener("submit", saveCompetition);
  adminEls.btnClearCompetition.addEventListener("click", clearCompetitionForm);
  adminEls.competitionsBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-edit-competition]");
    if (button) editCompetition(Number(button.dataset.editCompetition));
  });
}

async function initAdminPage() {
  bindEvents();
  const token = sessionStorage.getItem(ADMIN_CONFIG.TOKEN_KEY);
  if (!token) {
    setAuthenticated(false);
    return;
  }

  persistToken(token);
  setAuthenticated(true);
  await loadAdminData();
}

document.addEventListener("DOMContentLoaded", initAdminPage);
