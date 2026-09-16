import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
  storage.set(key, JSON.stringify({ version: 1, gameInterests: [game], profile: { estilo: 'Puzzle' }, evolution: { totals: { 'Atenção e Foco': { points: 999 } } } }));
  assert.equal(points(readActivity()), 1);
  assert.equal(readActivity().evolution, undefined);
  assert.equal(readActivity().profile.estilo, 'Puzzle');
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


test('funcionalidades retiradas não possuem páginas nem referências no produto', () => {
  for (const route of ['login', 'cyber/senhas']) {
    assert.equal(existsSync(new URL(`../app/${route}/page.jsx`, import.meta.url)), false);
  }
  for (const folder of ['app', 'src']) {
    const root = new URL(`../${folder}/`, import.meta.url);
    for (const file of readdirSync(root, { recursive: true }).filter(file => /\.(jsx?|mjs)$/.test(file))) {
      assert.doesNotMatch(readFileSync(new URL(file, root), 'utf8'), /\/cyber\/senhas|\/login|analisador|análise de senhas/i);
    }
  }
});

test('remove idade do perfil persistido sem perder preferências ou histórico', async t => {
  const { savePlayerProfile } = await import('../src/lib/activityStore.js');
  const previousWindow = globalThis.window;
  const storage = new Map();
  globalThis.window = new EventTarget();
  window.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  t.after(() => { if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow; });
  const key = 'happy-game-hub:activity:v1';
  const saved = { version: 1, profile: { idade: 'Criança', objetivo: 'creativity', estilo: 'Construção', updatedAt: '2026-01-01', extra: 'preservado' }, gameInterests: [game], gameCompletions: [game], assistantInteractions: [{ topic: 'cyber' }] };
  storage.set(key, JSON.stringify(saved));
  const activity = readActivity();
  assert.equal(Object.hasOwn(activity.profile, 'idade'), false);
  const expected = structuredClone(saved);
  delete expected.profile.idade;
  assert.deepEqual(JSON.parse(storage.get(key)), expected);
  assert.deepEqual(readActivity(), activity);
  savePlayerProfile({ objetivo: 'logical_reasoning', estilo: 'Puzzle', idade: 'Adulto' });
  const persisted = JSON.parse(storage.get(key));
  assert.equal(Object.hasOwn(persisted.profile, 'idade'), false);
  assert.equal(persisted.profile.estilo, 'Puzzle');
  assert.equal(persisted.profile.objetivo, 'logical_reasoning');
  assert.equal(persisted.profile.extra, 'preservado');
  assert.equal(persisted.gameInterests[0].id, game.id);
  assert.equal(persisted.gameCompletions[0].id, game.id);
  assert.deepEqual(persisted.assistantInteractions, saved.assistantInteractions);
  storage.set(key, JSON.stringify(saved));
  window.localStorage.setItem = () => { throw Error('Armazenamento bloqueado'); };
  assert.deepEqual(readActivity(), activity);
});
