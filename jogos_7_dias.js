// jogos_proximos_7_dias_browser.js
// Inclua luxon via CDN no HTML: <script src="https://moment.github.io/luxon/global/luxon.min.js"></script>

const { DateTime } = luxon;

const campeonatos = {
  "Copa Betano do Brasil": 373,
  "Campeonato Brasileiro": 325,
  "CONMEBOL Libertadores": 70083,
};

const TIMEZONE_BR = 'America/Sao_Paulo';

function formatarDataYYYYMMDD(data) {
  return data.toFormat('yyyy-MM-dd');
}

function formatarHorarioBR(timestamp) {
  return DateTime.fromSeconds(timestamp, { zone: TIMEZONE_BR }).toFormat('HH:mm');
}

async function buscarJogosNaData(dataStr, campeonatoId) {
  const url = `https://api.sofascore.com/api/v1/sport/football/scheduled-events/${dataStr}`;
  const headers = { 'User-Agent': 'Mozilla/5.0' };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.error(`Erro ao acessar API para data ${dataStr}: Status ${response.status}`);
      return [];
    }

    const data = await response.json();
    const eventos = data.events || [];
    return eventos
      .filter(evento => evento.tournament?.uniqueTournament?.id === campeonatoId)
      .map(evento => ({
        timeCasa: evento.homeTeam.name,
        timeFora: evento.awayTeam.name,
        horarioBR: formatarHorarioBR(evento.startTimestamp),
        timestamp: evento.startTimestamp,
      }));
  } catch (error) {
    console.error(`Erro na requisição para data ${dataStr}:`, error);
    return [];
  }
}

async function buscarJogosProximos7Dias() {
  const hoje = DateTime.now().setZone(TIMEZONE_BR).startOf('day');
  const resultados = {};

  for (const [nomeCampeonato, idCampeonato] of Object.entries(campeonatos)) {
    resultados[nomeCampeonato] = {};
    for (let i = 0; i < 7; i++) {
      const dataFutura = hoje.plus({ days: i });
      const dataStr = formatarDataYYYYMMDD(dataFutura);
      const jogos = await buscarJogosNaData(dataStr, idCampeonato);
      if (jogos.length > 0) {
        resultados[nomeCampeonato][dataStr] = jogos;
      }
    }
  }

  // Exibir no HTML
  const output = document.getElementById('output');
  let html = '<h2>Jogos nos próximos 7 dias:</h2>';
  for (const [nomeCampeonato, datas] of Object.entries(resultados)) {
    html += `<h3>${nomeCampeonato}</h3>`;
    for (const [data, jogos] of Object.entries(datas)) {
      html += `<p><strong>Data: ${data}</strong></p>`;
      html += '<ul>';
      jogos.forEach(jogo => {
        html += `<li>${jogo.timeCasa} x ${jogo.timeFora} às ${jogo.horarioBR}</li>`;
      });
      html += '</ul>';
    }
  }
  if (Object.keys(resultados).every(c => Object.keys(resultados[c]).length === 0)) {
    html += '<p>Nenhum jogo encontrado nos próximos 7 dias.</p>';
  }
  output.innerHTML = html;
}

// Chamar a função ao carregar a página
document.addEventListener('DOMContentLoaded', buscarJogosProximos7Dias);