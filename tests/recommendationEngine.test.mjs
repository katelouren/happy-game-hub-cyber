import assert from "node:assert/strict";
import test from "node:test";
import { generateRecommendations } from "../src/lib/recommendationEngine.mjs";

test("oferece início útil quando ainda não há histórico", () => {
  const result = generateRecommendations({});

  assert.equal(result.personalized, false);
  assert.ok(result.items.length >= 3);
  assert.ok(result.items.some((item) => item.href === "/cyber/prompts"));
});

test("combina perfil e avaliação de prompt por prioridade", () => {
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
  assert.equal(result.items[0].id, "prompt-structure");
  assert.ok(result.items.some((item) => item.title === "Portal 2"));
});

test("prioriza segurança após uma avaliação de alto risco e não duplica itens", () => {
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

  assert.equal(result.items[0].id, "prompt-safety");
  assert.equal(new Set(ids).size, ids.length);
});

test("oferece uma trilha coerente para o objetivo Segurança Digital", () => {
  const result = generateRecommendations({
    profile: {
      idade: "Adolescente",
      objetivo: "Segurança Digital",
      estilo: "Puzzle",
    },
    promptAnalyses: [],
    gameInterests: [],
    assistantInteractions: [],
  });
  const cyberRecommendation = result.items.find(
    (item) => item.title === "Desafio Cyber do Happy Game Hub",
  );

  assert.ok(cyberRecommendation);
  assert.equal(cyberRecommendation.href, "/cyber");
  assert.match(cyberRecommendation.skill, /cidadania digital/i);
  assert.match(cyberRecommendation.reason, /situações suspeitas/i);
  assert.ok(
    result.items.some((item) => item.href === "/cyber/assistente"),
  );
  assert.equal(
    result.items.filter((item) => item.href === "/cyber").length,
    1,
  );
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
    "/cyber/prompts",
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
    assert.ok(result.items.every((item) => validRoutes.has(item.href)));
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
