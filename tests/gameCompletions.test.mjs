import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { getCompetencyProgress } from '../src/lib/estimatedProgress.mjs';
import { readActivity, toggleGameInterest, setGameCompleted } from '../src/lib/activityStore.js';

const game = { id: 'api:1', title: 'Example', genre: 'Shooter' };
const points = (activity) => getCompetencyProgress(activity).reduce((sum, row) => sum + row.points, 0);

test('maior estado por jogo: interesses, conclusões e duplicatas', () => {
  assert.equal(points({ gameInterests: [game] }), 1);
  assert.equal(points({ gameCompletions: [game] }), 5);
  assert.equal(points({ gameInterests: [game], gameCompletions: [game, game] }), 5);
  assert.equal(points({ gameInterests: [game, { ...game, id: 'api:2' }], gameCompletions: [game] }), 6);
  const row = getCompetencyProgress({ gameInterests: [game], gameCompletions: [game] }).find(row => row.skill === 'Atenção e Concentração');
  assert.equal(row.interests, 1);
  assert.equal(row.completed, 1);
  assert.equal(row.points, 5);
});

test('persistência, desfazer e migração preservam interesses antigos', (t) => {
  const previousWindow = globalThis.window;
  const storage = new Map();
  globalThis.window = new EventTarget();
  window.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  t.after(() => { if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow; });
  const key = 'happy-game-hub:activity:v1';
  storage.set(key, JSON.stringify({ version: 1, gameInterests: [game], profile: { idade: 'Adulto' }, evolution: { totals: { 'Atenção e Foco': { points: 999 } } } }));
  assert.equal(points(readActivity()), 1);
  assert.equal(readActivity().evolution, undefined);
  assert.equal(readActivity().profile.idade, 'Adulto');
  setGameCompleted(game, true);
  setGameCompleted(game, true);
  assert.equal(readActivity().gameCompletions.length, 1);
  assert.equal(points(readActivity()), 5);
  assert.equal(JSON.parse(storage.get(key)).evolution, undefined);
  toggleGameInterest(game);
  assert.equal(points(readActivity()), 5);
  setGameCompleted(game, false);
  assert.equal(points(readActivity()), 0);
  toggleGameInterest(game);
  assert.equal(points(readActivity()), 1);
  setGameCompleted(game, true);
  setGameCompleted(game, false);
  assert.equal(points(readActivity()), 1);
  toggleGameInterest(game);
  assert.equal(points(readActivity()), 0);
  storage.set(key, JSON.stringify({ gameInterests: [game], gameCompletions: [null, {}, game, game] }));
  assert.equal(readActivity().gameCompletions.length, 1);
  assert.equal(points(readActivity()), 5);
});

test('Cyber permanece com uma ferramenta e Evolução sem atividades ou exclusão', () => {
  const cyber = readFileSync(new URL('../app/cyber/page.jsx', import.meta.url), 'utf8');
  assert.deepEqual([...cyber.matchAll(/href: "([^"]+)"/g)].map(match => match[1]), ['/cyber/assistente']);
  const evolution = readFileSync(new URL('../app/evolucao/page.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(evolution, /<form|SecurityChallenge|attempt|history-title|provisórios/);
  for (const folder of ['app', 'src']) {
    const root = new URL(`../${folder}/`, import.meta.url);
    for (const file of readdirSync(root, { recursive: true }).filter(file => /\.(jsx?|mjs)$/.test(file))) {
      assert.doesNotMatch(readFileSync(new URL(file, root), 'utf8'), /SecurityChallenge|security-decisions-v1|Concluir desafio|Desafio: decisões de segurança/);
    }
  }
});
