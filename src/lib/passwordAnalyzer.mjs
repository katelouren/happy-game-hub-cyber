const CRITERIA = [
  {
    id: "length",
    label: "Pelo menos 12 caracteres",
    weight: 30,
    test: (password) => password.length >= 12,
    suggestion: "Use pelo menos 12 caracteres.",
  },
  {
    id: "uppercase",
    label: "Pelo menos uma letra maiúscula",
    weight: 15,
    test: (password) => /[A-Z]/.test(password),
    suggestion: "Inclua uma letra maiúscula.",
  },
  {
    id: "lowercase",
    label: "Pelo menos uma letra minúscula",
    weight: 15,
    test: (password) => /[a-z]/.test(password),
    suggestion: "Inclua uma letra minúscula.",
  },
  {
    id: "number",
    label: "Pelo menos um número",
    weight: 20,
    test: (password) => /\d/.test(password),
    suggestion: "Inclua um número.",
  },
  {
    id: "symbol",
    label: "Pelo menos um caractere especial",
    weight: 20,
    test: (password) => /[^A-Za-z0-9]/.test(password),
    suggestion: "Inclua um símbolo.",
  },
];

export function analyzePassword(value) {
  const password = String(value ?? "");
  const criteria = CRITERIA.map((criterion) => ({
    id: criterion.id,
    label: criterion.label,
    valid: criterion.test(password),
    weight: criterion.weight,
    suggestion: criterion.suggestion,
  }));
  const score = password
    ? criteria.reduce(
        (total, criterion) => total + (criterion.valid ? criterion.weight : 0),
        0,
      )
    : 0;
  const level = !password
    ? "Aguardando"
    : score >= 80
      ? "Forte"
      : score >= 50
        ? "Média"
        : "Fraca";
  const missingSuggestions = criteria
    .filter((criterion) => !criterion.valid)
    .map((criterion) => criterion.suggestion);

  return {
    score,
    level,
    criteria,
    recommendation: !password
      ? "Digite uma senha apenas para a análise local. Ela não será enviada nem armazenada."
      : score >= 80
        ? "A senha atende aos critérios desta simulação. Use uma senha única para cada serviço e considere um gerenciador confiável."
        : missingSuggestions.join(" "),
  };
}
