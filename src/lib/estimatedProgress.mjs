import { COMPETENCIES } from "./competencies.mjs";
export { COMPETENCIES } from "./competencies.mjs";
import { getGameCompetencyId, migrateGameGenre } from "./gameSkills.mjs";

export const SATURATION_SCALE = 20;
export const MAX_PROGRESS = 100;
export const POINTS = Object.freeze({ interest: 1, completed: 5 });

// Saturação didática: incrementos decrescentes, sem medição clínica e sem XP.
export function calculateEstimatedProgress(points, scale = SATURATION_SCALE) {
  if (!Number.isSafeInteger(points) || points < 0 || !Number.isFinite(scale) || scale <= 0) {
    throw new RangeError("Pontos devem ser inteiros não negativos; a escala deve ser positiva e finita.");
  }
  return Math.min(MAX_PROGRESS, Math.max(0, -MAX_PROGRESS * Math.expm1(-points / scale)));
}

// Canonical game records keep one contribution per identifier.
export function uniqueGames(value) {
  const games = new Map();
  for (const game of Array.isArray(value) ? value : []) {
    if (!game || !["string", "number"].includes(typeof game.id) || !String(game.id).trim() ||
        typeof game.title !== "string" || typeof game.genre !== "string") continue;
    const record = { ...game };
    delete record.skill;
    record.genre = migrateGameGenre(game);
    if (record.categoria) record.categoria = record.genre;
    if (!games.has(String(game.id))) games.set(String(game.id), {
      ...record, competencyId: getGameCompetencyId(game),
    });
  }
  return [...games.values()];
}

export function getCompetencyProgress(activity = {}) {
  const rows = COMPETENCIES.map(({ id, label }) => ({ id, skill: label, interests: 0, completed: 0, points: 0 }));
  const interests = new Map(uniqueGames(activity?.gameInterests).map((game) => [String(game.id), game]));
  const completions = new Map(uniqueGames(activity?.gameCompletions).map((game) => [String(game.id), game]));
  const games = new Map([...interests, ...completions]);
  for (const [id, game] of games) {
    const row = rows.find((item) => item.id === getGameCompetencyId(game));
    row.interests += Number(interests.has(id));
    row.completed += Number(completions.has(id));
    row.points += completions.has(id) ? POINTS.completed : POINTS.interest;
  }
  return rows.map((row) => ({ ...row, progress: calculateEstimatedProgress(row.points) }));
}
