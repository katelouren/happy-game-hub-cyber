import assert from "node:assert/strict";
import test from "node:test";
import { generateRecommendations } from "../src/lib/recommendationEngine.mjs";

test("oferece início útil quando ainda não há histórico", () => {
  const result = generateRecommendations({});

  assert.equal(result.personalized, false);
  assert.ok(result.items.length >= 3);
  assert.ok(result.items.some((item) => item.href === "/cyber/assistente"));
});

test("prioriza o perfil e ignora avaliações antigas da funcionalidade removida", () => {
  const result = generateRecommendations({
    profile: {
      idade: "Adolescente",
      objetivo: "Raciocínio",
      estilo: "Puzzle",
    },
    promptAnalyses: [{ score: 35, risk: "Baixo" }],
    gameInterests: [],
    assistantInteractions: [],
  });

  assert.equal(result.personalized, true);
  assert.equal(result.items[0].title, "Portal 2");
  assert.ok(result.items.some((item) => item.title === "Portal 2"));
});

test("preserva interesses sem duplicar itens ao receber dados antigos", () => {
  const result = generateRecommendations({
    profile: {
      idade: "Adulto",
      objetivo: "Estratégia",
      estilo: "Estratégia",
    },
    promptAnalyses: [{ score: 42, risk: "Alto" }],
    gameInterests: [{ id: 1, title: "Game", genre: "Strategy" }],
    assistantInteractions: [],
  });
  const ids = result.items.map((item) => item.id);

  assert.equal(result.items[0].title, "Civilization VI");
  assert.ok(result.items.some((item) => item.id === "game-interest"));
  assert.equal(new Set(ids).size, ids.length);
});

test("objetivo incompatível pede nova seleção sem inventar desafio", () => {
  const result = generateRecommendations({ profile: { objetivo: "Segurança Digital", estilo: "Puzzle" } });
  assert.ok(result.items.some(item => item.href === "#perfil-jogador"));
  assert.ok(result.items.every(item => !item.competencyId));
  assert.doesNotMatch(JSON.stringify(result), /Desafio Cyber/);
});

test("considera idade, objetivo e estilo sem rotas ou temas contraditórios", () => {
  const profiles = [
    { idade: "Criança", objetivo: "Criatividade", estilo: "Construção" },
    { idade: "Adolescente", objetivo: "Raciocínio", estilo: "Puzzle" },
    { idade: "Adulto", objetivo: "Estratégia", estilo: "Estratégia" },
    {
      idade: "Adolescente",
      objetivo: "Segurança Digital",
      estilo: "Puzzle",
    },
  ];
  const validRoutes = new Set([
    "/jogos",
    "/cyber",
    "/cyber/assistente",
  ]);

  for (const profile of profiles) {
    const result = generateRecommendations({
      profile,
      promptAnalyses: [],
      gameInterests: [],
      assistantInteractions: [],
    });
    const ids = result.items.map((item) => item.id);
    const serialized = JSON.stringify(result);

    assert.equal(new Set(ids).size, ids.length);
    assert.ok(result.items.every((item) => validRoutes.has(item.href.split("?")[0]) || item.href === "#perfil-jogador"));
    assert.doesNotMatch(
      serialized,
      /recursos humanos|seleção profissional|playintel|avaliação psicológica|análise comportamental/i,
    );
  }

  const childResult = generateRecommendations({
    profile: profiles[0],
    promptAnalyses: [],
    gameInterests: [],
    assistantInteractions: [],
  });
  assert.match(childResult.items[0].reason, /acompanhamento responsável/i);
});

test("histórico exclusivo de avaliações antigas retorna atividades atuais", () => {
  const result = generateRecommendations({ promptAnalyses: [{ score: 30, risk: "Alto" }] });
  assert.equal(result.personalized, false);
  assert.ok(result.items.every((item) => ["#perfil-jogador", "/jogos", "/cyber/assistente"].includes(item.href)));
});
