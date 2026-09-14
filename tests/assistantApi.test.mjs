import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/assistant/route.js";
import { requestAssistantResponse } from "../src/services/assistantService.mjs";
import { createAssistantResponse } from "../src/lib/assistantEngine.mjs";

const question = "Como criar um bom prompt?";
const request = (body) => new Request("http://localhost/api/assistant", {
  method: "POST", body: JSON.stringify(body),
});

 test("bloqueia dados sensíveis no cliente e no servidor sem chamar fetch", async (t) => {
  t.mock.method(globalThis, "fetch", () => { throw new Error("Não deve chamar"); });
  for (const message of ["Minha senha é Segredo#123", "Meu CPF é 123.456.789-00", "token: ghp_abcdefghijklmnop"]) {
    assert.deepEqual(await requestAssistantResponse(message), createAssistantResponse(message));
    const response = await POST(request({ message }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).answer, createAssistantResponse(message).answer);
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test("valida entrada e retorna indisponibilidade sem chave", async (t) => {
  t.mock.method(globalThis, "fetch", () => { throw new Error("Não deve chamar"); });
  const original = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  t.after(() => { if (original === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = original; });
  for (const message of [null, "", "a".repeat(601)]) {
    assert.equal((await POST(request({ message }))).status, 400);
  }
  assert.equal((await POST(new Request("http://localhost", { method: "POST", body: "{" }))).status, 400);
  assert.equal((await POST(request({ message: question }))).status, 503);
  assert.equal(fetch.mock.callCount(), 0);
});

test("servidor chama Responses com chave privada e devolve só a resposta", async (t) => {
  const originalKey = process.env.OPENAI_API_KEY;
  const originalModel = process.env.OPENAI_MODEL;
  process.env.OPENAI_API_KEY = "fake-test-key";
  process.env.OPENAI_MODEL = "";
  t.after(() => {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.OPENAI_MODEL; else process.env.OPENAI_MODEL = originalModel;
  });
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://api.openai.com/v1/responses");
    assert.equal(options.headers.Authorization, "Bearer fake-test-key");
    const body = JSON.parse(options.body);
    assert.equal(body.model, "gpt-4.1-mini");
    assert.equal(body.input, question);
    assert.equal(body.store, false);
    assert.doesNotMatch(body.instructions, /contexto injetado/);
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: "Defina seu objetivo e o formato esperado." }] }] });
  });
  const response = await POST(request({ message: question, context: { lastTopic: "contexto injetado" } }));
  assert.deepEqual(await response.json(), { answer: "Defina seu objetivo e o formato esperado." });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  for (const result of [Response.json({ error: "segredo do provedor" }, { status: 429 }), Response.json({ output: [] }), Response.json({ status: "incomplete", output: [] })]) {
    globalThis.fetch.mock.mockImplementation(async () => result);
    const failed = await POST(request({ message: question }));
    assert.equal(failed.status, 502);
    assert.doesNotMatch(await failed.text(), /segredo/);
  }
  globalThis.fetch.mock.mockImplementation(async () => { throw new DOMException("Timeout", "TimeoutError"); });
  assert.equal((await POST(request({ message: question }))).status, 502);
});

test("cliente preserva metadados locais e usa fallback em falhas", async (t) => {
  const message = "Recebi um e-mail pedindo minha senha. É seguro?";
  const local = createAssistantResponse(message);
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "/api/assistant");
    assert.equal(JSON.parse(options.body).message, message);
    return Response.json({ answer: "Confirme o pedido em um canal oficial." });
  });
  assert.deepEqual(await requestAssistantResponse(message), { ...local, answer: "Confirme o pedido em um canal oficial." });
  for (const result of [Response.json({}, { status: 503 }), Response.json({ answer: " " }), Response.json({ answer: 42 }), new Response("invalid json")]) {
    globalThis.fetch.mock.mockImplementation(async () => result);
    assert.deepEqual(await requestAssistantResponse(message), local);
  }
  globalThis.fetch.mock.mockImplementation(async () => { throw new DOMException("Timeout", "TimeoutError"); });
  assert.deepEqual(await requestAssistantResponse(message), local);
});
