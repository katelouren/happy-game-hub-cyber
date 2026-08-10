import assert from "node:assert/strict";
import test from "node:test";
import { analyzePassword } from "../src/lib/passwordAnalyzer.mjs";

test("mantém estado de espera para campo vazio", () => {
  const result = analyzePassword("");

  assert.equal(result.score, 0);
  assert.equal(result.level, "Aguardando");
  assert.match(result.recommendation, /não será enviada nem armazenada/i);
});
test("classifica uma senha fraca e explica os critérios ausentes", () => {
  const result = analyzePassword("abc");

  assert.equal(result.level, "Fraca");
  assert.ok(result.score < 50);
  assert.match(result.recommendation, /12 caracteres/i);
});

test("classifica uma senha intermediária", () => {
  const result = analyzePassword("Senha123");

  assert.equal(result.level, "Média");
  assert.ok(result.score >= 50 && result.score < 80);
});

test("classifica uma senha forte sem expor seu conteúdo no resultado", () => {
  const password = "C0fre!Azul_2026";
  const result = analyzePassword(password);

  assert.equal(result.level, "Forte");
  assert.equal(result.score, 100);
  assert.ok(result.criteria.every((criterion) => criterion.valid));
  assert.doesNotMatch(JSON.stringify(result), new RegExp(password));
});
