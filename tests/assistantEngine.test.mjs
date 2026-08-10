import assert from "node:assert/strict";
import test from "node:test";
import {
  containsSensitiveContent,
  createAssistantResponse,
  getQuickPrompts,
  getSafeUserMessage,
} from "../src/lib/assistantEngine.mjs";

function assertStructuredAssessment(response, category, riskLevel) {
  assert.equal(response.topic, "cyber");
  assert.equal(response.category, category);
  assert.equal(response.riskLevel, riskLevel);
  assert.equal(typeof response.situation, "string");
  assert.equal(typeof response.classification, "string");
  assert.equal(typeof response.alert, "string");
  assert.equal(typeof response.recommendedAction, "string");
  assert.ok(response.situation.length > 0);
  assert.ok(response.classification.length > 0);
  assert.ok(response.alert.length > 0);
  assert.ok(response.recommendedAction.length > 0);
  assert.doesNotThrow(() => JSON.stringify(response));
}

test("responde sobre a plataforma e os jogos com linguagem introdutória", () => {
  const platform = createAssistantResponse("O que encontro no Happy Game Hub?");
  const games = createAssistantResponse("Como escolho um jogo?");

  assert.equal(platform.topic, "platform");
  assert.match(platform.answer, /jogos, recomendações/i);
  assert.equal(games.topic, "games");
  assert.match(games.answer, /área Jogos/i);
});

test("orienta sobre prompts e inteligência artificial", () => {
  const prompt = createAssistantResponse("Como criar um bom prompt?");
  const ai = createAssistantResponse("A inteligência artificial sempre acerta?");

  assert.equal(prompt.topic, "prompts");
  assert.match(prompt.answer, /contexto, objetivo/i);
  assert.equal(ai.topic, "ai");
  assert.match(ai.answer, /pode produzir respostas incorretas/i);
});

test("oferece orientação de cibersegurança sem bloquear dúvidas educativas", () => {
  const response = createAssistantResponse("Como criar uma senha forte?");
  const secondResponse = createAssistantResponse("Qual é uma senha forte?");

  assert.equal(response.topic, "cyber");
  assert.equal(response.safety, "ok");
  assert.match(response.answer, /senhas longas e únicas/i);
  assert.equal(secondResponse.safety, "ok");
  assert.equal(response.classification, undefined);
});

test("classifica e-mail pedindo senha como possível roubo de credencial", () => {
  const response = createAssistantResponse(
    "Recebi um e-mail pedindo minha senha. É seguro?",
  );

  assertStructuredAssessment(response, "credential-request", "Alto");
  assert.match(response.classification, /phishing/i);
  assert.match(response.recommendedAction, /não responda/i);
});

test("classifica link desconhecido e orienta a usar o endereço oficial", () => {
  const response = createAssistantResponse(
    "Posso abrir um link de remetente desconhecido?",
  );

  assertStructuredAssessment(response, "unknown-link", "Médio");
  assert.match(response.alert, /destino real/i);
  assert.match(response.recommendedAction, /endereço oficial/i);
});

test("classifica pedido de código de autenticação como alto risco", () => {
  const response = createAssistantResponse(
    "Alguém pediu meu código de autenticação. O que faço?",
  );

  assertStructuredAssessment(
    response,
    "authentication-code-request",
    "Alto",
  );
  assert.match(response.recommendedAction, /não compartilhe/i);
});

test("classifica urgência com pagamento como possível fraude financeira", () => {
  const response = createAssistantResponse(
    "Recebi uma mensagem urgente solicitando pagamento por Pix.",
  );

  assertStructuredAssessment(response, "urgent-payment", "Alto");
  assert.match(response.classification, /fraude financeira/i);
  assert.match(response.recommendedAction, /não pague/i);
});

test("classifica download inesperado como arquivo potencialmente malicioso", () => {
  const response = createAssistantResponse(
    "Mandaram baixar um anexo inesperado no meu celular.",
  );

  assertStructuredAssessment(response, "suspicious-download", "Alto");
  assert.match(response.alert, /malware/i);
});

test("classifica tentativa de obter dado pessoal", () => {
  const response = createAssistantResponse(
    "Uma pessoa pediu meu CPF por mensagem. Devo enviar?",
  );

  assertStructuredAssessment(response, "personal-data-request", "Alto");
  assert.match(response.recommendedAction, /não envie/i);
});

test("não confunde o relato de uma tentativa com exposição de dado pessoal", () => {
  const situation = "Uma pessoa tentou obter meus dados pessoais por mensagem.";
  const response = createAssistantResponse(situation);

  assert.equal(getSafeUserMessage(situation), situation);
  assertStructuredAssessment(response, "personal-data-request", "Alto");
});

test("reconhece relato com boas práticas como baixo risco sem prometer segurança", () => {
  const response = createAssistantResponse(
    "Confirmei o remetente por outro canal oficial. Ainda há risco?",
  );

  assertStructuredAssessment(response, "low-risk", "Baixo");
  assert.match(response.alert, /não significa garantia absoluta/i);
});

test("assume incerteza quando faltam sinais para classificar uma situação", () => {
  const response = createAssistantResponse(
    "Recebi uma mensagem estranha e não sei se devo confiar.",
  );

  assertStructuredAssessment(response, "unknown", "Médio");
  assert.match(response.classification, /não classificada/i);
  assert.match(response.answer, /não consegui classificar/i);
});

test("recusa credencial compartilhada sem ecoar o segredo", () => {
  const secret = "Minha senha é Segredo#123";
  const response = createAssistantResponse(secret);

  assert.equal(containsSensitiveContent(secret), true);
  assert.equal(response.safety, "blocked");
  assert.doesNotMatch(response.answer, /Segredo#123/);
  assert.match(response.answer, /Não envie nem peça senhas/i);
  assert.equal(
    getSafeUserMessage(secret),
    "[Mensagem sensível omitida por segurança]",
  );
  assert.equal(response.category, "sensitive-data");
  assert.doesNotMatch(JSON.stringify(response), /Segredo#123/);
});

test("recusa pedido de obtenção de credencial de terceiros", () => {
  const response = createAssistantResponse(
    "Quero descobrir a senha da conta de outra pessoa",
  );

  assert.equal(response.safety, "blocked");
  assert.equal(response.topic, "safety");
});

test("protege dados pessoais estruturados", () => {
  const response = createAssistantResponse("Meu CPF é 123.456.789-00");

  assert.equal(response.safety, "blocked");
  assert.doesNotMatch(response.answer, /123\.456/);
});

test("omite código de autenticação informado e não o repete na resposta", () => {
  const secret = "Meu código de autenticação é 483921";
  const response = createAssistantResponse(secret);

  assert.equal(containsSensitiveContent(secret), true);
  assert.equal(response.safety, "blocked");
  assert.equal(getSafeUserMessage(secret), "[Mensagem sensível omitida por segurança]");
  assert.doesNotMatch(JSON.stringify(response), /483921/);
});

test("mantém contexto básico em uma pergunta de continuidade", () => {
  const first = createAssistantResponse("Como criar um bom prompt?");
  const followUp = createAssistantResponse("E pode dar um exemplo?", first.context);

  assert.equal(first.context.lastTopic, "prompts");
  assert.equal(followUp.topic, "prompts");
  assert.equal(followUp.context.lastTopic, "prompts");
});

test("admite quando o assunto não está na base", () => {
  const response = createAssistantResponse("Como cuidar de uma orquídea rara?");

  assert.equal(response.topic, "unknown");
  assert.equal(response.classification, undefined);
  assert.match(response.answer, /não tenho uma resposta confiável/i);
});

test("retorna sugestões adequadas à rota atual", () => {
  const assistantSuggestions = getQuickPrompts("/cyber/assistente");
  const personalDataSuggestion = assistantSuggestions.find((suggestion) =>
    /CPF/i.test(suggestion),
  );

  assert.match(getQuickPrompts("/cyber/prompts")[0], /prompt/i);
  assert.match(getQuickPrompts("/jogos")[0], /jogo/i);
  assert.match(getQuickPrompts("/cyber/senhas")[1], /senha/i);
  assert.match(assistantSuggestions[0], /e-mail.*senha/i);
  assert.ok(
    assistantSuggestions.some((suggestion) =>
      /código de autenticação/i.test(suggestion),
    ),
  );
  assert.equal(
    createAssistantResponse(personalDataSuggestion).category,
    "personal-data-request",
  );
});
