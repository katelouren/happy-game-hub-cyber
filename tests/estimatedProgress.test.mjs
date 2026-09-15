import assert from "node:assert/strict";
import test from "node:test";
import { calculateEstimatedProgress, getCompetencyProgress, COMPETENCIES } from "../src/lib/estimatedProgress.mjs";

test("curva exponencial: zero e referências intermediárias", () => {
  assert.equal(calculateEstimatedProgress(0), 0);
  for (const [n, expected] of [[1, 4.8771], [6, 25.9182], [16, 55.0671], [30, 77.6870], [60, 95.0213]]) {
    assert.ok(Math.abs(calculateEstimatedProgress(n) - expected) < 0.0001);
  }
});

test("rejeita contagens inválidas sem coerção silenciosa", () => {
  for (const value of [-1, -100, 1.5, NaN, Infinity, -Infinity, '5', null, undefined, {}, true, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => calculateEstimatedProgress(value), RangeError);
  }
});

test("índice cresce com incrementos decrescentes sem ultrapassar 100", () => {
  let previous = 0;
  let previousGain = Infinity;
  for (let n = 1; n <= 200; n++) {
    const value = calculateEstimatedProgress(n);
    const gain = value - previous;
    assert.ok(value >= previous && value <= 100);
    assert.ok(gain <= previousGain + 1e-12);
    previous = value;
    previousGain = gain;
  }
  assert.equal(calculateEstimatedProgress(10000), 100);
  assert.equal(calculateEstimatedProgress(Number.MAX_SAFE_INTEGER), 100);
});

test("interesses únicos alimentam a habilidade existente, sem inventar conclusões", () => {
  const game = { id: 'api:1', title: 'Enlisted', genre: 'Shooter' };
  const activity = { gameInterests: [game, game, { id: 'api:2', title: 'Fall Guys', genre: 'Battle Royale' }, null, {}] };
  const before = JSON.stringify(activity);
  const rows = getCompetencyProgress(activity);
  assert.equal(rows.length, COMPETENCIES.length);
  assert.equal(rows.find(row => row.skill === 'Atenção e Concentração').interests, 2);
  assert.equal(rows.reduce((total, row) => total + row.interests, 0), 2);
  assert.equal(JSON.stringify(activity), before);
  for (const empty of [undefined, null, {}, { gameInterests: 'inválido' }, { assistantInteractions: [{ topic: 'games' }] }]) {
    assert.ok(getCompetencyProgress(empty).every(row => row.interests === 0 && row.progress === 0));
  }
  assert.ok(getCompetencyProgress({ gameInterests: [] }).every(row => row.progress === 0));
});
