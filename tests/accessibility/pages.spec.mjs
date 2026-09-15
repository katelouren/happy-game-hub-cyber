import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes = ['/home', '/jogos', '/recomendacoes', '/evolucao', '/cyber', '/login', '/cyber/assistente', '/cyber/senhas', '/sobre'];
test.beforeEach(async ({ page }) => {
  await page.route('**/api/games', route => route.fulfill({ json: [{ id: 1, title: 'Jogo de teste', genre: 'RPG', platform: 'PC', game_url: 'https://example.com' }] }));
  await page.route('**/api/assistant', route => route.fulfill({ json: { answer: 'Use os canais oficiais da empresa para confirmar mensagens suspeitas.' } }));
});
async function audit(page) {
 const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 expect(results.violations, JSON.stringify(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),null,2)).toEqual([]);
}
for (const route of routes) test(`axe, estrutura e atalho: ${route}`, async ({ page }) => {
 await page.goto(route);
 await expect(page.locator('main')).toHaveCount(1);
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
 await page.goto('/login');
 const submit=page.getByRole('button',{name:'Validar acesso local'});
 await tabTo(page,submit); await page.keyboard.press('Enter');
 const email=page.getByRole('textbox',{name:'E-mail (obrigatório)'});
 await expect(email).toBeFocused();await expect(email).toHaveAttribute('aria-invalid','true');
 await expect(page.locator('#email-error')).toContainText(/e-mail/);
 await audit(page);
 await page.keyboard.press('Tab');
 await page.keyboard.press('Shift+Tab'); await expect(email).toBeFocused();
 expect(await email.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
 await page.goto('/cyber/assistente');
 const message=page.getByRole('textbox',{name:/Escreva sua pergunta/});
 await tabTo(page,message);await page.keyboard.press('Enter');
 await expect(message).toHaveAttribute('aria-invalid','true');
 await expect(page.getByRole('alert').filter({hasText:'Digite uma pergunta'})).toBeVisible();
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
 await page.evaluate(()=>localStorage.setItem('happy-game-hub:activity:v1',JSON.stringify({profile:{objetivo:'Segurança Digital',idade:'Adulto',estilo:'Puzzle'},gameInterests:[{id:'local:4',title:'Rocket League',genre:'Coordenação'}],gameCompletions:[]})));
 await page.reload();
 await expect(page.getByLabel('Competência que deseja desenvolver')).toHaveValue('');
 await expect(page.getByRole('status').filter({hasText:'Seus interesses e conclusões foram preservados'})).toBeVisible();
 await audit(page);
});
