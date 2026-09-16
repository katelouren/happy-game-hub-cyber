import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes = ['/home', '/jogos', '/recomendacoes', '/evolucao', '/cyber', '/cyber/assistente', '/sobre'];
test.beforeEach(async ({ page }) => {
  await page.route('**/api/games', route => route.fulfill({ json: [{ id: 1, title: 'Jogo de teste', genre: 'RPG', platform: 'PC', game_url: 'https://example.com' }] }));
  await page.route('**/api/assistant', route => route.fulfill({ json: { answer: 'Use os canais oficiais da empresa para confirmar mensagens suspeitas.', provider: 'gemini', mode: 'live', unavailable: false } }));
});
async function audit(page) {
 const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 expect(results.violations, JSON.stringify(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),null,2)).toEqual([]);
}
for (const route of routes) test(`axe, estrutura e atalho: ${route}`, async ({ page }) => {
 await page.goto(route);
 await expect(page.locator('main')).toHaveCount(1);
 await expect(page.locator('a').filter({hasText: /Analisador de Senhas|Login/})).toHaveCount(0);
 if(route==='/cyber') {
  await expect(page.locator('main a')).toHaveCount(1);
  await expect(page.locator('main a')).toHaveAttribute('href','/cyber/assistente');
 }
 await expect(page.locator('h1')).toHaveCount(1);
 await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
 await page.keyboard.press('Tab');
 await expect(page.getByRole('link',{name:'Pular para o conteúdo principal'})).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(page.locator('main')).toBeFocused();
 if(route==='/jogos') await expect(page.getByRole('button',{name:'Adicionar Jogo de teste aos interesses'})).toBeVisible();
 await audit(page);
});
async function tabTo(page, locator) {
 for(let i=0;i<100;i++) {
  if(await locator.evaluate(el=>el===document.activeElement)) return;
  await page.keyboard.press('Tab');
 }
 throw Error('Controle não alcançado com Tab');
}
test('teclado: jogos, estados, gráfico e tabela',async({page})=>{
 await page.goto('/jogos');
 const interest=page.getByRole('button',{name:'Adicionar Jogo de teste aos interesses'});
 await interest.waitFor(); await tabTo(page,interest); await page.keyboard.press('Space');
 await expect(page.getByRole('status').filter({hasText:'adicionado'})).toBeVisible();
 const complete=page.getByRole('button',{name:'Marcar como concluído: Jogo de teste'});
 await tabTo(page,complete);await page.keyboard.press('Enter');
 await expect(complete).toHaveCount(0);
 await page.goto('/evolucao');
 await expect(page.getByRole('progressbar')).toHaveCount(6);
 const bar=page.getByRole('progressbar',{name:'Índice estimado: Tomada de Decisão'});
 await expect(bar).toHaveAttribute('aria-valuenow',/22\.119/);
 const table=page.getByRole('button',{name:'Ver valores da curva em tabela'});
 await tabTo(page,table); await page.keyboard.press('Enter');
 await expect(table).toHaveAttribute('aria-expanded','true');
 await expect(page.getByRole('table')).toBeVisible();
 await audit(page);
});
test('assistente: abrir, enviar, sair e fechar pelo teclado',async({page})=>{
 await page.goto('/home');
 const launcher=page.getByRole('button',{name:'Pergunte ao assistente',exact:true});
 await tabTo(page,launcher); await page.keyboard.press('Enter');
 const input=page.getByRole('textbox',{name:/Escreva sua pergunta/});
 await expect(input).toBeFocused();
 await input.fill('Como reconhecer phishing?'); await page.keyboard.press('Enter');
 await expect(page.getByRole('log')).toContainText('Use os canais oficiais');
 await expect(input).toBeFocused();
 await audit(page);
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);await expect(launcher).toBeFocused();
 await page.keyboard.press('Enter');await expect(input).toBeFocused();
 await page.keyboard.press('Tab');await page.keyboard.press('Tab');
 await page.keyboard.press('Tab');
 await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('mobile, viewport equivalente a zoom 200%, movimento e menu',async({page})=>{
 for(const width of [720,375,320]) {
  await page.setViewportSize({width,height:500});
  for(const route of routes) {
   await page.goto(route);
   await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
 }
 await page.goto('/home');
 const menu=page.getByRole('button',{name:'Abrir menu'});
 await tabTo(page,menu);await page.keyboard.press('Enter');
 await expect(menu).toHaveCount(0);
 await page.keyboard.press('Escape');await expect(menu).toBeFocused();
 await page.emulateMedia({reducedMotion:'reduce'});
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});
test('erros associados, navegação reversa e foco visível',async({page})=>{
 await page.goto('/cyber/assistente');
 const message=page.getByRole('textbox',{name:/Escreva sua pergunta/});
 await tabTo(page,message);await page.keyboard.press('Enter');
 await expect(message).toHaveAttribute('aria-invalid','true');
 await expect(page.getByRole('alert').filter({hasText:'Digite uma pergunta'})).toBeVisible();
 await page.keyboard.press('Tab');
 await page.keyboard.press('Shift+Tab');
 await expect(message).toBeFocused();
 expect(await message.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
 await audit(page);
});
test('seis competências: Home, seletores e recomendações por teclado',async({page})=>{
 const { COMPETENCIES }=await import('../../src/lib/competencies.mjs');
 await page.goto('/home');
 const cards=page.getByRole('link',{name:/Receber recomendações para desenvolver/});
 await expect(cards).toHaveCount(6);
 for(const c of COMPETENCIES) await expect(page.getByRole('link',{name:`Receber recomendações para desenvolver ${c.label}`})).toHaveAttribute('href',`/recomendacoes?objetivo=${c.id}`);
 for(const c of COMPETENCIES) {
  await page.goto(`/recomendacoes?objetivo=${c.id}`);
  const select=page.getByLabel('Competência que deseja desenvolver');
  await expect(select).toHaveValue(c.id);
  await expect(select.locator('option')).toHaveText(COMPETENCIES.map(c=>c.label));
  await tabTo(page,select);await page.keyboard.press('ArrowDown');
  await select.selectOption(c.id);
  const save=page.getByRole('button',{name:'Salvar perfil e atualizar trilha'});
  await tabTo(page,save);await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({hasText:'Perfil salvo'})).toBeVisible();
  await expect(page.getByText(`Competência relacionada: ${c.label}`,{exact:true})).toBeVisible();
  await page.goto(`/jogos?competencia=${c.id}`);
  await expect(page.getByLabel('Filtrar por competência')).toHaveValue(c.id);
  await expect(page.locator('main article')).not.toHaveCount(0);
 }
 await page.goto('/evolucao');
 await expect(page.getByRole('progressbar')).toHaveCount(6);
 await expect(page.locator('#competency option')).toHaveText(COMPETENCIES.map(c=>c.label));
 await audit(page);
});
test('perfil incompatível mantém favoritos e pede nova competência',async({page})=>{
 await page.goto('/recomendacoes');
 await page.evaluate(()=>localStorage.setItem('happy-game-hub:activity:v1',JSON.stringify({profile:{objetivo:'Segurança Digital',estilo:'Puzzle'},gameInterests:[{id:'local:4',title:'Rocket League',genre:'Coordenação'}],gameCompletions:[]})));
 await page.reload();
 await expect(page.getByLabel('Competência que deseja desenvolver')).toHaveValue('');
 await expect(page.getByRole('status').filter({hasText:'Seus interesses e conclusões foram preservados'})).toBeVisible();
 await audit(page);
});


test('origem Gemini, contingência e proteção local permanecem identificadas na sessão', async ({page}) => {
 await page.goto('/cyber/assistente');
 const input = page.getByRole('textbox', {name: /Escreva sua pergunta/});
 const log = page.getByRole('log');
 const send = async message => {
  await input.fill(message);
  await input.press('Enter');
  await expect(page.getByRole('button', {name:'Enviar pergunta', exact:true})).toBeEnabled();
 };
 await send('Como reconhecer phishing?');
 await expect(log.getByText('Gerado com IA — Gemini', {exact:true})).toHaveCount(1);
 await page.reload();
 await expect(log.getByText('Gerado com IA — Gemini', {exact:true})).toHaveCount(1);
 await page.route('**/api/assistant', route => route.fulfill({status:503, json:{error:'detalhe interno que não deve aparecer'}}));
 await send('Como criar um bom prompt?');
 await expect(log.getByText('IA indisponível — orientação local ativada', {exact:true})).toHaveCount(1);
 await expect(log).not.toContainText('detalhe interno');
 await audit(page);
 let requests = 0;
 page.on('request', request => { if (request.url().includes('/api/assistant')) requests++; });
 await send('Minha senha é Segredo#123');
 const last = log.locator('article').last();
 await expect(last.getByText('Orientação local de segurança', {exact:true})).toBeVisible();
 await expect(log).not.toContainText('Segredo#123');
 expect(requests).toBe(0);
 await page.reload();
 await expect(log.getByText('IA indisponível — orientação local ativada', {exact:true})).toHaveCount(1);
 await expect(log.locator('article').last().getByText('Orientação local de segurança', {exact:true})).toBeVisible();
 expect(await page.evaluate(() => sessionStorage.getItem('happy-game-hub:assistant:v1'))).not.toContain('Segredo#123');
 await audit(page);
});


test('perfil sem faixa etária migra dados antigos e salva competência e estilo', async ({page}) => {
 await page.goto('/recomendacoes');
 await page.evaluate(() => localStorage.setItem('happy-game-hub:activity:v1', JSON.stringify({
  version: 1,
  profile: {idade:'Criança', objetivo:'creativity', estilo:'Construção'},
  gameInterests: [{id:'local:4',title:'Rocket League',genre:'Coordenação'}],
  gameCompletions: [{id:'local:4',title:'Rocket League',genre:'Coordenação'}],
  assistantInteractions: [{topic:'cyber'}],
 })));
 await page.reload();
 const form = page.locator('#perfil-jogador');
 await expect(form.getByRole('combobox')).toHaveCount(2);
 await expect(form.getByRole('combobox').nth(0)).toHaveAccessibleName('Competência que deseja desenvolver');
 await expect(form.getByRole('combobox').nth(1)).toHaveAccessibleName('Estilo de jogo preferido');
 await expect(page.getByText('Faixa etária', {exact:true})).toHaveCount(0);
 await expect(form.getByRole('combobox').nth(0)).toHaveValue('creativity');
 const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('happy-game-hub:activity:v1')));
 expect((await stored()).profile).not.toHaveProperty('idade');
 await form.getByRole('combobox').nth(0).selectOption('logical_reasoning');
 await form.getByRole('combobox').nth(1).selectOption('Puzzle');
 const save = page.getByRole('button', {name:'Salvar perfil e atualizar trilha'});
 await tabTo(page, save); await page.keyboard.press('Enter');
 await expect(page.getByRole('status').filter({hasText:'Perfil salvo'})).toBeVisible();
 await expect(page.getByRole('heading', {name:'Portal 2'})).toBeVisible();
 const data = await stored();
 expect(data.profile).toMatchObject({objetivo:'logical_reasoning', estilo:'Puzzle'});
 expect(data.profile).not.toHaveProperty('idade');
 expect(data.gameInterests[0].id).toBe('local:4');
 expect(data.gameCompletions[0].id).toBe('local:4');
 expect(data.assistantInteractions).toEqual([{topic:'cyber'}]);
 await page.reload();
 await expect(form.getByRole('combobox').nth(0)).toHaveValue('logical_reasoning');
 await expect(form.getByRole('combobox').nth(1)).toHaveValue('Puzzle');
 await audit(page);
});
