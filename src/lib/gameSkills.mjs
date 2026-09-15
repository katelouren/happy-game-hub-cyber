import { getCompetency } from './competencies.mjs';

// Mecânica principal, inclusive para jogos antigos sem ID de competência.
const BY_TITLE = {
  minecraft: 'creativity', 'portal 2': 'logical_reasoning',
  'stardew valley': 'decision_making', 'rocket league': 'attention_concentration',
  'civilization vi': 'strategic_thinking', 'kerbal space program': 'problem_solving',
  'fall guys': 'attention_concentration',
};
const BY_GENRE = {
  shooter: 'attention_concentration', action: 'attention_concentration', fighting: 'attention_concentration',
  racing: 'attention_concentration', sports: 'attention_concentration', platformer: 'attention_concentration',
  'battle royale': 'attention_concentration', memory: 'attention_concentration', memoria: 'attention_concentration',
  strategy: 'strategic_thinking', estrategia: 'strategic_thinking', planejamento: 'strategic_thinking', moba: 'strategic_thinking',
  rpg: 'decision_making', mmorpg: 'decision_making', arpg: 'decision_making', 'action rpg': 'decision_making',
  survival: 'decision_making', simulation: 'decision_making', simulacao: 'decision_making',
  puzzle: 'logical_reasoning', programming: 'logical_reasoning', raciocinio: 'logical_reasoning',
  card: 'logical_reasoning', 'card game': 'logical_reasoning',
  investigation: 'problem_solving', adventure: 'problem_solving',
  sandbox: 'creativity', building: 'creativity', construction: 'creativity', criatividade: 'creativity',
};
function normalize(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
export function getGameCompetencyId(game) {
  return BY_TITLE[normalize(game.title ?? game.nome)]
    ?? (getCompetency(game.competencyId) ? game.competencyId : null)
    ?? BY_GENRE[normalize(game.genre ?? game.categoria)]
    // Fonte externa sem mecânica detalhada: associação educativa provisória por escolhas.
    ?? 'decision_making';
}
export function getGameSkill(game) { return getCompetency(getGameCompetencyId(game)).label; }
export function filterGamesBySkill(games, searchTerm = '', selectedSkill = 'Todos') {
  const search = normalize(searchTerm);
  return games.filter(game => (selectedSkill === 'Todos' || getGameCompetencyId(game) === selectedSkill)
    && normalize(`${game.title} ${game.genre} ${game.platform} ${getGameSkill(game)}`).includes(search));
}

// Former local categories described objectives rather than actual game genres.
export function migrateGameGenre(game) {
  const genres = { minecraft: 'Sandbox', 'portal 2': 'Puzzle', 'stardew valley': 'Simulation', 'rocket league': 'Sports', 'civilization vi': 'Strategy', 'kerbal space program': 'Simulation' };
  return genres[normalize(game.title ?? game.nome)] ?? game.genre;
}
