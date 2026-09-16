import assert from 'node:assert/strict';
import test from 'node:test';
import { POST } from '../app/api/assistant/route.js';
import { requestAssistantResponse } from '../src/services/assistantService.mjs';
import { createAssistantResponse } from '../src/lib/assistantEngine.mjs';

const question = 'Como criar um bom prompt?';
const request = body => new Request('http://localhost/api/assistant', { method: 'POST', body: JSON.stringify(body) });
const origin = (mode, unavailable = false) => ({ provider: 'gemini', mode, unavailable });
const candidate = (text, finishReason = 'STOP') => ({ candidates: [{ finishReason, content: { parts: [{ text }] } }] });
function configure(t, overrides = {}) {
  for (const [key, value] of Object.entries({ AI_PROVIDER: 'gemini', GEMINI_API_KEY: 'fake-test-key', GEMINI_MODEL: 'gemini-3.5-flash-lite', ...overrides })) {
    const previous = process.env[key];
    process.env[key] = value;
    t.after(() => { if (previous === undefined) delete process.env[key]; else process.env[key] = previous; });
  }
}

test('bloqueia dados sensíveis no cliente e servidor sem enviar à Gemini', async t => {
  configure(t);
  t.mock.method(globalThis, 'fetch', () => { throw Error('Não deve chamar'); });
  for (const message of ['Minha senha é Segredo#123', 'Meu CPF é 123.456.789-00', 'token: ghp_abcdefghijklmnop', 'Meu e-mail é teste@example.com']) {
    const local = createAssistantResponse(message);
    assert.deepEqual(await requestAssistantResponse(message), { ...local, ...origin('local') });
    const response = await POST(request({ message }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { answer: local.answer, ...origin('local') });
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test('valida entrada e usa contingência identificada sem chave ou provedor compatível', async t => {
  configure(t, { GEMINI_API_KEY: '' });
  t.mock.method(globalThis, 'fetch', () => { throw Error('Não deve chamar'); });
  for (const message of [null, '', ' ', 'a'.repeat(601), 123, {}]) {
    assert.equal((await POST(request({ message }))).status, 400);
  }
  assert.equal((await POST(new Request('http://localhost', { method: 'POST', body: '{' }))).status, 400);
  assert.deepEqual(await (await POST(request({ message: question }))).json(), { answer: createAssistantResponse(question).answer, ...origin('local', true) });
  process.env.GEMINI_API_KEY = 'fake-test-key';
  process.env.AI_PROVIDER = 'unsupported';
  assert.equal((await (await POST(request({ message: question }))).json()).mode, 'local');
  assert.equal(fetch.mock.callCount(), 0);
});

test('servidor chama generateContent com chave privada e retorna somente texto e origem seguros', async t => {
  configure(t);
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent');
    assert.equal(options.headers['x-goog-api-key'], 'fake-test-key');
    assert.doesNotMatch(url, /fake-test-key/);
    const body = JSON.parse(options.body);
    assert.deepEqual(body.contents, [{ role: 'user', parts: [{ text: question }] }]);
    for (const id of ['creativity', 'attention_concentration', 'logical_reasoning', 'strategic_thinking', 'problem_solving', 'decision_making']) assert.ok(body.systemInstruction.parts[0].text.includes(id));
    assert.doesNotMatch(JSON.stringify(body), /contexto injetado|histórico privado|fake-test-key/);
    assert.ok(options.signal instanceof AbortSignal);
    assert.equal(options.cache, 'no-store');
    return Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'Interno', thought: true }, { text: 'Defina seu objetivo.' }] } }], modelVersion: 'internal', usageMetadata: {} });
  });
  const response = await POST(request({ message: question, context: { lastTopic: 'contexto injetado' }, history: 'histórico privado' }));
  assert.deepEqual(await response.json(), { answer: 'Defina seu objetivo.', ...origin('live') });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('falhas, bloqueios, respostas incompletas e timeout ativam orientação local sem detalhes internos', async t => {
  configure(t);
  t.mock.method(globalThis, 'fetch');
  for (const result of [Response.json({ error: 'fake-test-key erro interno' }, { status: 429 }), Response.json({}), Response.json(candidate('')), Response.json(candidate('Parcial', 'MAX_TOKENS')), Response.json(candidate('Bloqueado', 'SAFETY')), Response.json({ promptFeedback: { blockReason: 'SAFETY' } }), new Response('invalid json')]) {
    fetch.mock.mockImplementation(async () => result);
    const response = await POST(request({ message: question }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { answer: createAssistantResponse(question).answer, ...origin('local', true) });
  }
  fetch.mock.mockImplementation(async () => { throw new DOMException('fake-test-key detalhe interno', 'TimeoutError'); });
  assert.equal((await (await POST(request({ message: question }))).json()).unavailable, true);
});

test('resposta sensível do provedor é substituída por orientação local', async t => {
  configure(t);
  t.mock.method(globalThis, 'fetch', async () => Response.json(candidate('Minha senha é Segredo#123')));
  const data = await (await POST(request({ message: question }))).json();
  assert.equal(data.mode, 'local');
  assert.doesNotMatch(JSON.stringify(data), /Segredo#123/);
});

test('cliente preserva avaliação local, reconhece origem e trata falhas sem expor detalhes', async t => {
  const message = 'Recebi um e-mail pedindo minha senha. É seguro?';
  const local = createAssistantResponse(message);
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/assistant');
    assert.deepEqual(JSON.parse(options.body), { message, context: { lastTopic: local.context.lastTopic } });
    return Response.json({ answer: 'Confirme o pedido em um canal oficial.', ...origin('live'), internal: 'segredo' });
  });
  assert.deepEqual(await requestAssistantResponse(message), { ...local, answer: 'Confirme o pedido em um canal oficial.', ...origin('live') });
  fetch.mock.mockImplementation(async () => Response.json({ answer: local.answer, ...origin('local', true) }));
  assert.deepEqual(await requestAssistantResponse(message), { ...local, ...origin('local', true) });
  for (const result of [Response.json({}, { status: 503 }), Response.json({ answer: ' ', ...origin('live') }), Response.json({ answer: 42 }), Response.json({ answer: 'Sem origem' }), Response.json({ answer: 'Resposta', provider: 'unknown', mode: 'live' }), new Response('invalid json')]) {
    fetch.mock.mockImplementation(async () => result);
    assert.deepEqual(await requestAssistantResponse(message), { ...local, ...origin('local', true) });
  }
  fetch.mock.mockImplementation(async () => { throw new DOMException('detalhes internos', 'TimeoutError'); });
  assert.deepEqual(await requestAssistantResponse(message), { ...local, ...origin('local', true) });
});
