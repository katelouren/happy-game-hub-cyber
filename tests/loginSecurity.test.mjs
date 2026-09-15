import assert from "node:assert/strict";
import test from "node:test";
import { evaluateLoginPassword, validateLoginFields } from "../src/lib/loginSecurity.mjs";

test("rejeita senhas comuns mesmo com comprimento e símbolos", () => {
  for (const password of ['password', 'senha123', '123456', 'qwerty', 'admin', 'letmein', 'company123', 'Password1234!Extra', 'Company123!Longa', 'Nuvem123456!Azul', 'Abcd!Longa9876', 'AAAA!bbbb2345']) {
    assert.equal(evaluateLoginPassword(password).meetsMinimum, false);
  }
});

test("exige todos os critérios e oferece cinco níveis", () => {
  const samples = ['a', 'ventomar', 'Sol7!Nuvem', 'Sol7!NuvemAz', 'Sol7!NuvemAzul#Rio'];
  assert.deepEqual(samples.map((password) => evaluateLoginPassword(password).level), ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte']);
  assert.equal(evaluateLoginPassword('Sol7 NuvemAzul').meetsMinimum, false);
  assert.equal(evaluateLoginPassword('').strength, 0);
  assert.equal(evaluateLoginPassword(samples[4]).meetsMinimum, true);
  assert.ok(!JSON.stringify(evaluateLoginPassword(samples[4])).includes(samples[4]));
});

test("valida e-mail, senha e nome sem criar conta", () => {
  const base = { mode: 'login', name: '', email: 'pessoa@example.com', password: 'Sol7!NuvemAzul#Rio' };
  assert.deepEqual(validateLoginFields(base), {});
  for (const email of ['abc', 'a@', 'a@b', 'a b@example.com']) assert.ok(validateLoginFields({ ...base, email }).email);
  assert.ok(validateLoginFields({ ...base, password: '' }).password);
  assert.ok(validateLoginFields({ ...base, password: 'curta' }).password);
  assert.ok(validateLoginFields({ ...base, mode: 'register' }).name);
});
