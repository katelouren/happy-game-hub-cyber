import { analyzePassword } from "./passwordAnalyzer.mjs";

// Heurística educativa local: não mede entropia nem consulta vazamentos.
export function evaluateLoginPassword(value) {
  const password = String(value ?? "");
  const normalized = password.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[@4]/g, "a").replace(/[03]/g, (char) => char === "0" ? "o" : "e");
  const common = /password|senha|qwerty|admin|letmein|company|welcome|happygamehub/.test(normalized);
  const obvious = common || /(.)\1{3,}/.test(password) || /(.{2,4})\1{2,}/.test(password);
  const sequences = /1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321|qwerty|asdf|zxcv|abcd|abc123/i.test(password);
  const criteria = analyzePassword(password).criteria.map(({ id, label, valid }) => ({
    id, label, valid: Boolean(password) && (id === "symbol" ? /[^\p{L}\p{N}\s]/u.test(password) : valid),
  }));
  criteria.push(
    { id: "predictable", label: "Sem senhas comuns ou padrões óbvios", valid: Boolean(password) && !obvious },
    { id: "sequence", label: "Sem sequências simples (123456, qwerty, abc123)", valid: Boolean(password) && !sequences },
  );
  const meetsMinimum = criteria.every((criterion) => criterion.valid);
  const passed = criteria.filter((criterion) => criterion.valid).length;
  const strength = !password ? 0 : password.length < 8 || obvious || sequences ? 1 : meetsMinimum ? (password.length >= 16 ? 5 : 4) : passed >= 5 ? 3 : passed >= 3 ? 2 : 1;
  return {
    criteria, meetsMinimum, strength,
    level: ["Aguardando", "Muito fraca", "Fraca", "Média", "Forte", "Muito forte"][strength],
    feedback: !password ? "Preencha a senha para conferir os critérios locais."
      : obvious || sequences ? "Evite palavras comuns, repetições e sequências previsíveis, mesmo com símbolos."
      : !meetsMinimum ? "Atenda aos critérios pendentes antes de continuar."
      : password.length < 16 ? "Critérios atendidos. Uma frase mais longa pode dificultar a previsão."
      : "Critérios atendidos. Esta estimativa não garante segurança nem verifica vazamentos.",
  };
}

export function validateLoginFields({ name, email, password, mode }) {
  const errors = {};
  if (mode === "register" && name.trim().length < 2) errors.name = "Informe um nome com pelo menos dois caracteres.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Informe um e-mail em formato válido.";
  if (!password) errors.password = "Informe uma senha para a validação local.";
  else if (!evaluateLoginPassword(password).meetsMinimum) errors.password = "A senha precisa atender a todos os critérios abaixo (nível Forte ou superior).";
  return errors;
}
