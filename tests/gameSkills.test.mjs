import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { getGameSkill, filterGamesBySkill } from "../src/lib/gameSkills.mjs";

const localGames = JSON.parse(readFileSync(new URL('../data/games.json', import.meta.url)));

test("associa gêneros e respeita a mecânica de Fall Guys", () => {
  for (const [genre, expected] of [
    ['Shooter', 'Atenção e Foco'], ['Strategy', 'Estratégia'],
    ['MMORPG', 'Tomada de Decisão'], ['Action RPG', 'Tomada de Decisão'],
    ['Puzzle', 'Resolução de Problemas'], ['Racing', 'Coordenação e Tempo de Reação'],
    ['Sandbox', 'Criatividade'], ['Memory', 'Memória'],
  ]) assert.equal(getGameSkill({ genre }), expected);
  assert.equal(getGameSkill({ title: 'Fall Guys', genre: 'Battle Royale' }), 'Coordenação e Tempo de Reação');
  assert.equal(getGameSkill({ genre: 'novo gênero' }), 'Tomada de Decisão');
});

test("preserva e classifica os seis jogos do catálogo local", () => {
  const original = JSON.stringify(localGames);
  assert.equal(localGames.length, 6);
  assert.deepEqual(localGames.map(getGameSkill), ['Criatividade', 'Raciocínio Lógico', 'Estratégia', 'Coordenação e Tempo de Reação', 'Estratégia', 'Resolução de Problemas']);
  assert.equal(JSON.stringify(localGames), original);
});

test("busca por nome, plataforma, gênero e habilidade, com ou sem acentos", () => {
  const games = [{ title: 'Enlisted', genre: 'Shooter', platform: 'PC (Windows)' }, { title: 'Elvenar', genre: 'Strategy', platform: 'Web Browser' }];
  for (const search of ['enlisted', 'windows', 'shooter', 'atenção', 'atencao']) {
    assert.deepEqual(filterGamesBySkill(games, search), [games[0]]);
  }
  assert.deepEqual(filterGamesBySkill(games, '', 'Estratégia'), [games[1]]);
  assert.deepEqual(filterGamesBySkill(games, 'shooter', 'Estratégia'), []);
  assert.deepEqual(filterGamesBySkill(games), games);
});
