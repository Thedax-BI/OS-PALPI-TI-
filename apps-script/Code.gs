const SPREADSHEET_ID = "1gO6uRMyG6DXOGtZX-652TZfgc9q_4XvqzwP936Sc4ac";
const SHEET_NAME = "respostas";
const TEAMS_SHEET_NAME = "times";
const COMPETITIONS_SHEET_NAME = "competicoes";
const TIMEZONE = "America/Sao_Paulo";

const SECRET = "ODam2CcITWgs6UH1eWgqIczul0JktfMjOif5kiOFi5t5rD457BXepCtdQTOda5F8";
const ADMIN_PASSWORD_PROPERTY = "ADMIN_PASSWORD";
const ADMIN_TOKEN_PREFIX = "admin_token_";
const ADMIN_TOKEN_SECONDS = 1800;

const RESPONSE_HEADERS = [
  "createdAt",
  "nome",
  "dataJogo",
  "competicao",
  "mandante",
  "golsMandante",
  "visitante",
  "golsVisitante",
  "tipoLancamento",
  "id",
  "status",
  "deletedAt",
  "deletedBy",
  "deleteReason",
];

const TEAM_HEADERS = ["time", "campeonato", "logo", "ativo", "createdAt", "updatedAt"];
const COMPETITION_HEADERS = ["competicao", "nome", "ativa", "ordem", "createdAt", "updatedAt"];

const DEFAULT_COMPETITIONS = [
  { competicao: "paulistao", nome: "Paulistao", ativa: true, ordem: 10 },
  { competicao: "brasileirao", nome: "Brasileirao", ativa: true, ordem: 20 },
  { competicao: "libertadores", nome: "Libertadores", ativa: true, ordem: 30 },
  { competicao: "copa_do_brasil", nome: "Copa do Brasil", ativa: true, ordem: 40 },
  { competicao: "sulamericana", nome: "Sul-Americana", ativa: true, ordem: 50 },
  { competicao: "supercoparei", nome: "Super Copa Rei", ativa: true, ordem: 60 },
];

const ALLOWED_NAMES = [
  "Igor Florense",
  "Jessé Diniz",
  "Sérgio Da Silva",
  "Diego Gavioli",
  "Matheus Luz",
  "Resultado",
  "Lucas Silva",
  "Enzo Rodrigues",
];

function doGet(e) {
  const p = getParams_(e);
  const action = String(p.action || "").trim();

  if (!action) {
    return ContentService.createTextOutput("ok").setMimeType(ContentService.MimeType.TEXT);
  }

  const result = handleAction_(action, p);
  return jsonp_(p.callback, result);
}

function doPost(e) {
  const p = getParams_(e);
  const action = String(p.action || "").trim();

  if (action) {
    const result = handleAction_(action, p);
    return json_(result);
  }

  const result = processEntry_(p);
  const message = Object.assign({ source: "palpites" }, result);

  const html = `
    <html><body>
      <script>
        window.parent.postMessage(${JSON.stringify(message)}, "*");
        document.body.innerText = ${JSON.stringify(result.ok ? "ok" : "error")};
      </script>
    </body></html>
  `;

  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function handleAction_(action, p) {
  const lock = shouldLockAction_(action) ? LockService.getScriptLock() : null;

  try {
    if (lock) lock.waitLock(30000);

    if (action === "adminLogin") return adminLogin_(p);

    if (action === "list") {
      ensureSheetsAndHeaders();
      migrateResponseIds();
      const includeDeleted = asBool_(p.includeDeleted);
      if (includeDeleted) assertAdminToken_(p.token);
      requirePublicSecretOrToken_(p);
      return { ok: true, rows: listRows_({ includeDeleted }) };
    }

    if (action === "teams") {
      ensureSheetsAndHeaders();
      const includeInactive = asBool_(p.includeInactive);
      if (includeInactive) assertAdminToken_(p.token);
      requirePublicSecretOrToken_(p);
      return { ok: true, teams: listTeams_({ includeInactive }) };
    }

    if (action === "competitions") {
      ensureSheetsAndHeaders();
      const includeInactive = asBool_(p.includeInactive);
      if (includeInactive) assertAdminToken_(p.token);
      requirePublicSecretOrToken_(p);
      return { ok: true, competitions: listCompetitions_({ includeInactive }) };
    }

    if (action === "gameSuggestions") {
      ensureSheetsAndHeaders();
      migrateResponseIds();
      requirePublicSecretOrToken_(p);
      return {
        ok: true,
        games: listGameSuggestions_({
          fromDate: p.fromDate,
          limit: p.limit,
          includeWithResult: asBool_(p.includeWithResult),
        }),
      };
    }

    if (action === "adminEntries") {
      ensureSheetsAndHeaders();
      migrateResponseIds();
      assertAdminToken_(p.token);
      return { ok: true, rows: listAdminEntries_(p) };
    }

    if (action === "adminDeleteEntry") {
      ensureSheetsAndHeaders();
      migrateResponseIds();
      assertAdminToken_(p.token);
      return adminDeleteEntry_(p);
    }

    if (action === "adminUpsertTeam") {
      ensureSheetsAndHeaders();
      assertAdminToken_(p.token);
      return adminUpsertTeam_(p);
    }

    if (action === "adminUpsertCompetition") {
      ensureSheetsAndHeaders();
      assertAdminToken_(p.token);
      return adminUpsertCompetition_(p);
    }

    return { ok: false, error: "unknown_action" };
  } catch (err) {
    return { ok: false, error: normalizeError_(err), details: String(err && err.message ? err.message : err) };
  } finally {
    if (lock) lock.releaseLock();
  }
}

function shouldLockAction_(action) {
  return [
    "list",
    "gameSuggestions",
    "adminEntries",
    "adminDeleteEntry",
    "adminUpsertTeam",
    "adminUpsertCompetition",
  ].indexOf(action) >= 0;
}

function getParams_(e) {
  return e && e.parameter ? e.parameter : {};
}

function requirePublicSecretOrToken_(p) {
  if (p.secret === SECRET) return true;
  if (p.token) return assertAdminToken_(p.token);
  throw new Error("unauthorized");
}

function assertAdminToken_(token) {
  const value = String(token || "").trim();
  if (!value) throw new Error("unauthorized");

  const cached = CacheService.getScriptCache().get(ADMIN_TOKEN_PREFIX + value);
  if (cached !== "1") throw new Error("unauthorized");
  return true;
}

function adminLogin_(p) {
  const expected = PropertiesService.getScriptProperties().getProperty(ADMIN_PASSWORD_PROPERTY);
  if (!expected) return { ok: false, error: "admin_password_not_configured" };

  const password = String(p.password || "");
  if (!password || password !== expected) return { ok: false, error: "unauthorized" };

  const token = Utilities.getUuid();
  CacheService.getScriptCache().put(ADMIN_TOKEN_PREFIX + token, "1", ADMIN_TOKEN_SECONDS);
  return { ok: true, token, expiresInSeconds: ADMIN_TOKEN_SECONDS };
}

function processEntry_(p) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    if (p.secret !== SECRET) return { ok: false, error: "unauthorized" };

    ensureSheetsAndHeaders();

    const nome = String(p.nome || "").trim();
    const dataJogo = formatDateValue_(String(p.dataJogo || "").trim());
    const competicao = String(p.competicao || "").trim();
    const mandante = String(p.mandante || "").trim();
    const visitante = String(p.visitante || "").trim();
    const tipoLancamento = String(p.tipoLancamento || "").trim();
    const golsMandante = parseInt(p.golsMandante, 10);
    const golsVisitante = parseInt(p.golsVisitante, 10);

    if (!nome || !dataJogo || !competicao || !mandante || !visitante || !tipoLancamento) {
      return { ok: false, error: "missing_fields" };
    }
    if (mandante === visitante) return { ok: false, error: "same_team" };
    if (!Number.isInteger(golsMandante) || golsMandante < 0) {
      return { ok: false, error: "invalid_golsMandante" };
    }
    if (!Number.isInteger(golsVisitante) || golsVisitante < 0) {
      return { ok: false, error: "invalid_golsVisitante" };
    }
    if (tipoLancamento !== "palpite" && tipoLancamento !== "resultado") {
      return { ok: false, error: "invalid_tipoLancamento" };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sh = ss.getSheetByName(SHEET_NAME);
    const headers = getHeaders_(sh);
    const id = Utilities.getUuid();
    const now = nowBR_();

    appendObject_(sh, headers, {
      createdAt: p.createdAt ? String(p.createdAt) : now,
      nome,
      dataJogo,
      competicao,
      mandante,
      golsMandante,
      visitante,
      golsVisitante,
      tipoLancamento,
      id,
      status: "ativo",
      deletedAt: "",
      deletedBy: "",
      deleteReason: "",
    });

    return { ok: true, id, status: "ativo" };
  } catch (err) {
    return { ok: false, error: "server_error", details: String(err) };
  } finally {
    lock.releaseLock();
  }
}

function ensureSheetsAndHeaders() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ensureSheetHeaders_(ss, SHEET_NAME, RESPONSE_HEADERS);
  ensureSheetHeaders_(ss, TEAMS_SHEET_NAME, TEAM_HEADERS);
  ensureSheetHeaders_(ss, COMPETITIONS_SHEET_NAME, COMPETITION_HEADERS);
  seedCompetitions_();
}

function ensureSheetHeaders_(ss, sheetName, expectedHeaders) {
  const sh = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
    return sh;
  }

  const current = sh
    .getRange(1, 1, 1, Math.max(sh.getLastColumn(), expectedHeaders.length))
    .getValues()[0]
    .map((header) => String(header || "").trim())
    .filter(Boolean);

  const finalHeaders = current.slice();
  expectedHeaders.forEach((header) => {
    if (finalHeaders.indexOf(header) < 0) finalHeaders.push(header);
  });

  sh.getRange(1, 1, 1, finalHeaders.length).setValues([finalHeaders]);
  return sh;
}

function seedCompetitions_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(COMPETITIONS_SHEET_NAME);
  if (!sh || sh.getLastRow() > 1) return;

  const now = nowBR_();
  const rows = DEFAULT_COMPETITIONS.map((item) => [
    item.competicao,
    item.nome,
    item.ativa ? "TRUE" : "FALSE",
    item.ordem,
    now,
    now,
  ]);
  sh.getRange(2, 1, rows.length, COMPETITION_HEADERS.length).setValues(rows);
}

function migrateResponseIds() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return;

  const headers = getHeaders_(sh);
  const idCol = columnIndex_(headers, "id") + 1;
  const statusCol = columnIndex_(headers, "status") + 1;
  const rowCount = sh.getLastRow() - 1;
  const ids = sh.getRange(2, idCol, rowCount, 1).getValues();
  const statuses = sh.getRange(2, statusCol, rowCount, 1).getValues();
  let changed = false;

  for (let i = 0; i < rowCount; i++) {
    if (!String(ids[i][0] || "").trim()) {
      ids[i][0] = Utilities.getUuid();
      changed = true;
    }
    if (!String(statuses[i][0] || "").trim()) {
      statuses[i][0] = "ativo";
      changed = true;
    }
  }

  if (changed) {
    sh.getRange(2, idCol, rowCount, 1).setValues(ids);
    sh.getRange(2, statusCol, rowCount, 1).setValues(statuses);
  }
}

function listRows_(options) {
  const opts = options || {};
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return [];

  const values = sh.getDataRange().getValues();
  const headers = values[0].map((h) => String(h).trim());
  const out = [];

  for (let i = 1; i < values.length; i++) {
    const row = objectFromRow_(headers, values[i]);
    const status = normalizeStatus_(row.status);
    if (!opts.includeDeleted && status === "excluido") continue;

    out.push(normalizeResponseRow_(row));
  }

  return out;
}

function normalizeResponseRow_(row) {
  const gm = parseInt(row.golsMandante, 10);
  const gv = parseInt(row.golsVisitante, 10);

  return {
    createdAt: row.createdAt ? String(row.createdAt) : "",
    nome: row.nome ? String(row.nome).trim() : "",
    dataJogo: formatDateValue_(row.dataJogo),
    competicao: row.competicao ? String(row.competicao).trim() : "",
    mandante: row.mandante ? String(row.mandante).trim() : "",
    golsMandante: Number.isInteger(gm) ? gm : Number(row.golsMandante),
    visitante: row.visitante ? String(row.visitante).trim() : "",
    golsVisitante: Number.isInteger(gv) ? gv : Number(row.golsVisitante),
    tipoLancamento: row.tipoLancamento ? String(row.tipoLancamento).trim() : "",
    id: row.id ? String(row.id).trim() : "",
    status: normalizeStatus_(row.status),
    deletedAt: row.deletedAt ? String(row.deletedAt) : "",
    deletedBy: row.deletedBy ? String(row.deletedBy) : "",
    deleteReason: row.deleteReason ? String(row.deleteReason) : "",
  };
}

function listTeams_(options) {
  const opts = options || {};
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(TEAMS_SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return [];

  const values = sh.getDataRange().getValues();
  const headers = values[0].map((h) => String(h).trim());
  const out = [];

  for (let i = 1; i < values.length; i++) {
    const row = objectFromRow_(headers, values[i]);
    const time = String(row.time || "").trim();
    const campeonato = String(row.campeonato || "").trim();
    const logo = String(row.logo || "").trim();
    const ativo = isActiveCell_(row.ativo);

    if (!time || !campeonato) continue;
    if (!opts.includeInactive && !ativo) continue;

    out.push({
      time,
      campeonato,
      logo,
      ativo,
      createdAt: row.createdAt ? String(row.createdAt) : "",
      updatedAt: row.updatedAt ? String(row.updatedAt) : "",
    });
  }

  out.sort((a, b) => (a.campeonato + a.time).localeCompare(b.campeonato + b.time));
  return out;
}

function listCompetitions_(options) {
  const opts = options || {};
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(COMPETITIONS_SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return [];

  const values = sh.getDataRange().getValues();
  const headers = values[0].map((h) => String(h).trim());
  const out = [];

  for (let i = 1; i < values.length; i++) {
    const row = objectFromRow_(headers, values[i]);
    const competicao = String(row.competicao || "").trim();
    const nome = String(row.nome || "").trim();
    const ativa = isActiveCell_(row.ativa);
    const ordem = parseInt(row.ordem, 10);

    if (!competicao || !nome) continue;
    if (!opts.includeInactive && !ativa) continue;

    out.push({
      competicao,
      nome,
      ativa,
      ordem: Number.isInteger(ordem) ? ordem : 999,
      createdAt: row.createdAt ? String(row.createdAt) : "",
      updatedAt: row.updatedAt ? String(row.updatedAt) : "",
    });
  }

  out.sort((a, b) => (a.ordem - b.ordem) || a.nome.localeCompare(b.nome));
  return out;
}

function listGameSuggestions_(options) {
  const opts = options || {};
  const fromDate = formatDateValue_(opts.fromDate || today_());
  const limit = Math.max(1, Math.min(parseInt(opts.limit || 20, 10) || 20, 50));
  const includeWithResult = !!opts.includeWithResult;
  const competitions = listCompetitions_({ includeInactive: true });
  const competitionByCode = {};

  competitions.forEach((item) => {
    competitionByCode[item.competicao] = item.nome;
  });

  const rows = listRows_({ includeDeleted: false });
  const grouped = {};

  rows.forEach((row) => {
    if (!row.dataJogo || row.dataJogo < fromDate) return;
    if (!row.competicao || !row.mandante || !row.visitante) return;

    const key = [row.dataJogo, row.competicao, row.mandante, row.visitante].join("|");
    if (!grouped[key]) {
      grouped[key] = {
        key,
        dataJogo: row.dataJogo,
        competicao: row.competicao,
        competicaoNome: competitionByCode[row.competicao] || row.competicao,
        mandante: row.mandante,
        visitante: row.visitante,
        palpites: 0,
        hasResultado: false,
      };
    }

    if (row.tipoLancamento === "resultado") grouped[key].hasResultado = true;
    if (row.tipoLancamento === "palpite") grouped[key].palpites += 1;
  });

  return Object.keys(grouped)
    .map((key) => grouped[key])
    .filter((game) => includeWithResult || !game.hasResultado)
    .sort((a, b) =>
      a.dataJogo.localeCompare(b.dataJogo) ||
      a.competicaoNome.localeCompare(b.competicaoNome) ||
      a.mandante.localeCompare(b.mandante)
    )
    .slice(0, limit);
}

function listAdminEntries_(p) {
  const rows = listRows_({ includeDeleted: true });
  const tipo = String(p.tipoLancamento || "").trim();
  const nome = String(p.nome || "").trim().toLowerCase();
  const dataInicio = formatDateValue_(p.dataInicio || "");
  const dataFim = formatDateValue_(p.dataFim || "");
  const competicao = String(p.competicao || "").trim();
  const status = String(p.status || "ativo").trim();
  const q = String(p.q || "").trim().toLowerCase();

  return rows
    .filter((row) => !tipo || row.tipoLancamento === tipo)
    .filter((row) => !nome || row.nome.toLowerCase().indexOf(nome) >= 0)
    .filter((row) => !dataInicio || row.dataJogo >= dataInicio)
    .filter((row) => !dataFim || row.dataJogo <= dataFim)
    .filter((row) => !competicao || row.competicao === competicao)
    .filter((row) => status === "todos" || row.status === status)
    .filter((row) => {
      if (!q) return true;
      const hay = [
        row.nome,
        row.competicao,
        row.mandante,
        row.visitante,
        row.tipoLancamento,
        row.status,
      ].join(" ").toLowerCase();
      return hay.indexOf(q) >= 0;
    })
    .sort((a, b) => parseCreatedAt_(b.createdAt) - parseCreatedAt_(a.createdAt))
    .slice(0, 200);
}

function adminDeleteEntry_(p) {
  const id = String(p.id || "").trim();
  if (!id) return { ok: false, error: "missing_id" };

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME);
  const values = sh.getDataRange().getValues();
  const headers = values[0].map((h) => String(h).trim());
  const idIdx = columnIndex_(headers, "id");
  const rowNumber = findRowByValue_(values, idIdx, id);

  if (rowNumber < 0) return { ok: false, error: "not_found" };

  setRowValues_(sh, headers, rowNumber, {
    status: "excluido",
    deletedAt: nowBR_(),
    deletedBy: "admin",
    deleteReason: String(p.reason || "").trim(),
  });

  return { ok: true, id, status: "excluido" };
}

function adminUpsertTeam_(p) {
  const time = String(p.time || "").trim();
  const campeonato = String(p.campeonato || "").trim();
  const logo = String(p.logo || "").trim();
  const ativo = asBoolDefault_(p.ativo, true);

  if (!time || !campeonato) return { ok: false, error: "missing_fields" };

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(TEAMS_SHEET_NAME);
  const values = sh.getDataRange().getValues();
  const headers = values[0].map((h) => String(h).trim());
  const timeIdx = columnIndex_(headers, "time");
  const campIdx = columnIndex_(headers, "campeonato");
  const now = nowBR_();
  let rowNumber = -1;

  for (let i = 1; i < values.length; i++) {
    const sameTime = String(values[i][timeIdx] || "").trim().toLowerCase() === time.toLowerCase();
    const sameCamp = String(values[i][campIdx] || "").trim() === campeonato;
    if (sameTime && sameCamp) {
      rowNumber = i + 1;
      break;
    }
  }

  const payload = {
    time,
    campeonato,
    logo,
    ativo: ativo ? "TRUE" : "FALSE",
    updatedAt: now,
  };

  if (rowNumber > 0) {
    setRowValues_(sh, headers, rowNumber, payload);
    return { ok: true, team: { time, campeonato, logo, ativo }, mode: "updated" };
  }

  appendObject_(sh, headers, Object.assign({ createdAt: now }, payload));
  return { ok: true, team: { time, campeonato, logo, ativo }, mode: "created" };
}

function adminUpsertCompetition_(p) {
  const nome = String(p.nome || "").trim();
  const competicao = String(p.competicao || generateCompetitionCode(nome)).trim();
  const ativa = asBoolDefault_(p.ativa, true);
  const ordem = parseInt(p.ordem, 10);

  if (!nome || !competicao) return { ok: false, error: "missing_fields" };

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(COMPETITIONS_SHEET_NAME);
  const values = sh.getDataRange().getValues();
  const headers = values[0].map((h) => String(h).trim());
  const codeIdx = columnIndex_(headers, "competicao");
  const now = nowBR_();
  const rowNumber = findRowByValue_(values, codeIdx, competicao);
  const payload = {
    competicao,
    nome,
    ativa: ativa ? "TRUE" : "FALSE",
    ordem: Number.isInteger(ordem) ? ordem : 999,
    updatedAt: now,
  };

  if (rowNumber > 0) {
    setRowValues_(sh, headers, rowNumber, payload);
    return { ok: true, competition: { competicao, nome, ativa, ordem: payload.ordem }, mode: "updated" };
  }

  appendObject_(sh, headers, Object.assign({ createdAt: now }, payload));
  return { ok: true, competition: { competicao, nome, ativa, ordem: payload.ordem }, mode: "created" };
}

function generateCompetitionCode(nome) {
  return String(nome || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function getHeaders_(sh) {
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map((h) => String(h).trim());
}

function objectFromRow_(headers, row) {
  const obj = {};
  headers.forEach((header, index) => {
    if (header) obj[header] = row[index];
  });
  return obj;
}

function appendObject_(sh, headers, obj) {
  sh.appendRow(headers.map((header) => obj[header] !== undefined ? obj[header] : ""));
}

function setRowValues_(sh, headers, rowNumber, values) {
  Object.keys(values).forEach((key) => {
    const index = columnIndex_(headers, key);
    if (index >= 0) sh.getRange(rowNumber, index + 1).setValue(values[key]);
  });
}

function columnIndex_(headers, name) {
  const index = headers.indexOf(name);
  if (index < 0) throw new Error("missing_header_" + name);
  return index;
}

function findRowByValue_(values, columnIndex, value) {
  const needle = String(value || "").trim();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][columnIndex] || "").trim() === needle) return i + 1;
  }
  return -1;
}

function normalizeStatus_(value) {
  const status = String(value || "").trim().toLowerCase();
  return status === "excluido" ? "excluido" : "ativo";
}

function isActiveCell_(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  if (!raw) return true;
  return raw === "true" || raw === "ativo" || raw === "1" || raw === "sim";
}

function asBool_(value) {
  const raw = String(value === undefined || value === null ? "" : value).trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "sim" || raw === "ativo";
}

function asBoolDefault_(value, fallback) {
  if (value === undefined || value === null || String(value).trim() === "") return fallback;
  return asBool_(value);
}

function formatDateValue_(value) {
  if (!value) return "";
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, TIMEZONE, "yyyy-MM-dd");
  }

  const raw = String(value).trim();
  const iso = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];

  const br = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (br) {
    return [
      br[3],
      String(br[2]).padStart(2, "0"),
      String(br[1]).padStart(2, "0"),
    ].join("-");
  }

  return raw;
}

function today_() {
  return Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd");
}

function nowBR_() {
  return Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy HH:mm:ss");
}

function parseCreatedAt_(value) {
  if (!value) return 0;
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return value.getTime();
  }

  const raw = String(value).trim();
  const br = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (br) {
    return new Date(
      Number(br[3]),
      Number(br[2]) - 1,
      Number(br[1]),
      Number(br[4]),
      Number(br[5]),
      Number(br[6] || 0)
    ).getTime();
  }

  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeError_(err) {
  const message = String(err && err.message ? err.message : err);
  if (message.indexOf("unauthorized") >= 0) return "unauthorized";
  if (message.indexOf("missing_header_") >= 0) return message;
  return "server_error";
}

function jsonp_(callback, obj) {
  const cb = String(callback || "callback").replace(/[^\w$.]/g, "");
  const body = `${cb}(${JSON.stringify(obj)});`;
  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
