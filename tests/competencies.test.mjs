import assert from 'node:assert/strict';
import test from 'node:test';
import games from '../data/games.json' with { type: 'json' };
import { COMPETENCIES, getCompetency, normalizeCompetencyId, migrateProfile } from '../src/lib/competencies.mjs';
import { getGameCompetencyId } from '../src/lib/gameSkills.mjs';
import { generateRecommendations, recommendationOptions } from '../src/lib/recommendationEngine.mjs';
import { getCompetencyProgress } from '../src/lib/estimatedProgress.mjs';
import { readActivity, setGameCompleted } from '../src/lib/activityStore.js';

test('seis competências canônicas, completas e ordenadas',()=>{
 assert.equal(COMPETENCIES.length,6);
 assert.equal(new Set(COMPETENCIES.map(c=>c.id)).size,6);
 assert.deepEqual(COMPETENCIES.map(c=>c.order),[1,2,3,4,5,6]);
 assert.ok(COMPETENCIES.every(c=>/^[a-z_]+$/.test(c.id)&&c.description&&c.examples.length));
 assert.deepEqual(recommendationOptions.objectives,COMPETENCIES.map(c=>c.id));
});
test('equivalências claras migram; objetivos incompatíveis não recebem substitutos',()=>{
 for(const value of ['Raciocínio','Raciocínio Lógico','Lógica']) assert.equal(normalizeCompetencyId(value),'logical_reasoning');
 for(const value of ['Estratégia','Planejamento','Pensamento Estratégico']) assert.equal(normalizeCompetencyId(value),'strategic_thinking');
 for(const value of ['Atenção e Foco','Atenção e Concentração']) assert.equal(normalizeCompetencyId(value),'attention_concentration');
 for(const value of ['Aprendizado','Segurança Digital','Coordenação']) {
  assert.deepEqual(migrateProfile({objetivo:value,estilo:'Puzzle',extra:'preservado'}),{objetivo:null,estilo:'Puzzle',extra:'preservado'});
 }
 for(const c of COMPETENCIES) assert.equal(normalizeCompetencyId(c.label),c.id);
});
test('todos os jogos locais e recomendações usam a competência principal válida',()=>{
 for(const game of games) assert.ok(getCompetency(game.competencyId));
 for(const c of COMPETENCIES) {
  const result=generateRecommendations({profile:{objetivo:c.id,estilo:'Puzzle',idade:'Adulto'}});
  assert.equal(result.items[0].competencyId,c.id);
  const game=games.find(g=>g.title===result.items[0].title);
  assert.equal(getGameCompetencyId(game),c.id);
  const rows=getCompetencyProgress({gameInterests:[game],gameCompletions:[game,game]});
  assert.equal(rows.length,6);
  assert.equal(rows.find(r=>r.id===c.id).points,5);
  assert.equal(rows.reduce((sum,r)=>sum+r.points,0),5);
 }
});
test('migração preserva jogos, conclusões, preferências e é idempotente',t=>{
 const old=globalThis.window;const store=new Map();globalThis.window=new EventTarget();
 window.localStorage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)};
 t.after(()=>{if(old===undefined)delete globalThis.window;else globalThis.window=old;});
 const game={id:'local:4',title:'Rocket League',genre:'Coordenação',selectedAt:'2026-01-01'};
 store.set('happy-game-hub:activity:v1',JSON.stringify({version:1,profile:{objetivo:'Coordenação',estilo:'Esporte'},gameInterests:[game],gameCompletions:[game],assistantInteractions:[{topic:'cyber'}]}));
 const migrated=readActivity();
 assert.equal(migrated.profile.objetivo,null);assert.equal(migrated.profile.estilo,'Esporte');
 assert.equal(migrated.gameInterests[0].id,game.id);assert.equal(migrated.gameInterests[0].selectedAt,game.selectedAt);
 assert.equal(migrated.gameCompletions[0].competencyId,'attention_concentration');
 assert.equal(migrated.assistantInteractions.length,1);
 setGameCompleted(game,true);assert.deepEqual(readActivity(),migrated);
 assert.equal(getCompetencyProgress(migrated).find(r=>r.id==='attention_concentration').points,5);
});
