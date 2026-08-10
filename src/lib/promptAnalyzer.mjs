const ACTION_PATTERN =
  /\b(analise|avalie|compare|crie|descreva|explique|gere|identifique|liste|mostre|organize|proponha|recomende|responda|resuma|revise|transforme)\b/i;
const CONTEXT_PATTERN =
  /\b(contexto|cen[aá]rio|situa[cç][aã]o|considerando|levando em conta|para (?:um|uma|o|a|meu|minha|quem)|sou |estou |trabalho |preciso )\b/i;
const AUDIENCE_PATTERN =
  /\b(p[uú]blico|audi[eê]ncia|usu[aá]rios?|iniciantes?|especialistas?|crian[cç]as?|adolescentes?|adultos?|professores?|alunos?|equipe)\b/i;
const FORMAT_PATTERN =
  /\b(lista|tabela|json|markdown|t[oó]picos?|passo a passo|par[aá]grafos?|resumo|roteiro|checklist|formato|itens?)\b/i;
const CONSTRAINT_PATTERN =
  /\b(no m[aá]ximo|no m[ií]nimo|limite|sem |inclua|evite|use |tom |palavras?|caracteres?|exemplos?|fontes?|crit[eé]rios?)\b/i;
const VAGUE_PATTERN =
  /\b(isso|isto|aquilo|coisa|neg[oó]cio|de alguma forma|algo legal|melhor poss[ií]vel|fa[cç]a a[ií])\b/i;

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function clamp(value, minimum = 0, maximum = 100) {
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
}

function detectConflicts(text) {
  const conflicts = [];
  const textWithoutNegativeExampleRule = text.replace(
    /\bn[aã]o (?:use|inclua|cite) exemplos?\b/gi,
    "",
  );

  if (
    /\b(resposta curta|seja breve|resuma|em uma frase)\b/i.test(text) &&
    /\b(detalhadamente|resposta completa|explique tudo|muito detalhad[oa])\b/i.test(
      text,
    )
  ) {
    conflicts.push(
      "O pedido combina uma resposta curta com uma explicação muito detalhada.",
    );
  }

  if (
    /\b(n[aã]o (?:use|inclua|cite) exemplos?)\b/i.test(text) &&
    /\b(?:use|inclua|cite) exemplos?\b/i.test(textWithoutNegativeExampleRule)
  ) {
    conflicts.push("As instruções sobre incluir exemplos são contraditórias.");
  }

  if (
    /\b(?:apenas|somente) (?:sim ou n[aã]o|uma palavra)\b/i.test(text) &&
    /\b(explique|justifique|detalhe)\b/i.test(text)
  ) {
    conflicts.push(
      "O formato limitado entra em conflito com o pedido de explicação.",
    );
  }

  return conflicts;
}

function detectRisk(text) {
  const findings = [];
  const credentialType =
    "senha|password|credencial|token|chave (?:de acesso|privada|da api)|c[oó]digo de autentica[cç][aã]o";
  const personalType =
    "cpf|rg|cart[aã]o|c[oó]digo de seguran[cç]a|dados pessoais|endere[cç]o|telefone";
  const requestVerb =
    "revele|mostre|diga|forne[cç]a|envie|liste|extraia|descubra|obtenha|acesse|recupere|hackeie|compartilhe|exponha";

  const unsafeRequest = new RegExp(
    `\\b(?:${requestVerb})\\b.{0,70}\\b(?:${credentialType}|${personalType})\\b|\\b(?:${credentialType}|${personalType})\\b.{0,45}\\b(?:${requestVerb})\\b`,
    "i",
  );
  const credentialValue = new RegExp(
    `\\b(?:${credentialType})\\s*[:=]\\s*["']?[^\\s,;."']{4,}`,
    "i",
  );
  const statedCredentialValue =
    /\b(?:minha senha|meu password|minha credencial|meu token|chave de acesso)\s+(?:é|eh)\s+\S*(?:\d|[#@!$%&*])\S*/i;
  const cpfValue = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/;
  const cardValue = /\b(?:\d[ -]?){13,19}\b/;
  const emailValue = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phoneValue =
    /\b(?:telefone|celular|whatsapp)\s*(?:é|eh|:|=)\s*(?:\+?55\s*)?(?:\(?\d{2}\)?[\s.-]?)?\d{4,5}[\s.-]?\d{4}\b/i;
  const promptInjection =
    /\b(ignore|desconsidere|contorne|burle)\b.{0,40}\b(instru[cç][oõ]es|regras|pol[ií]ticas|seguran[cç]a)\b|\b(system prompt|prompt do sistema)\b/i;

  const requestsSensitiveData = unsafeRequest.test(text);
  const containsCredentialOrDocument =
    credentialValue.test(text) ||
    statedCredentialValue.test(text) ||
    cpfValue.test(text) ||
    cardValue.test(text);
  const containsContactData = emailValue.test(text) || phoneValue.test(text);

  if (requestsSensitiveData) {
    findings.push(
      "Há uma solicitação para obter ou expor credenciais ou dados pessoais.",
    );
  }
  if (containsCredentialOrDocument) {
    findings.push("O texto parece conter um dado sensível real ou uma credencial.");
  }
  if (containsContactData) {
    findings.push("O texto parece conter um e-mail ou telefone pessoal.");
  }
  if (promptInjection.test(text)) {
    findings.push(
      "Há uma tentativa de ignorar regras ou revelar instruções protegidas.",
    );
  }

  const hasSensitiveExposure =
    requestsSensitiveData || containsCredentialOrDocument || containsContactData;

  return {
    level: hasSensitiveExposure ? "Alto" : findings.length ? "Médio" : "Baixo",
    score: hasSensitiveExposure ? 10 : findings.length ? 45 : 100,
    findings,
  };
}

function sanitizeSensitiveValues(text) {
  return text
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF REMOVIDO]")
    .replace(/\b(?:\d[ -]?){13,19}\b/g, "[DADO FINANCEIRO REMOVIDO]")
    .replace(
      /\b(senha|password|token|chave de acesso|chave da api)\s*(?:é|:|=)\s*[^\s,;.]+/gi,
      "$1: [VALOR REMOVIDO]",
    )
    .replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      "[E-MAIL REMOVIDO]",
    );
}

function buildImprovedPrompt(text, signals, risk) {
  if (risk.findings.length > 0) {
    return [
      "Objetivo: explique boas práticas para proteger informações sensíveis no cenário descrito.",
      "Público-alvo: usuários iniciantes.",
      "Formato: apresente uma lista curta de ações preventivas e um exemplo fictício.",
      "Segurança: não solicite, revele, reproduza ou utilize senhas, credenciais ou dados pessoais reais.",
    ].join("\n");
  }

  const safeText = sanitizeSensitiveValues(text).replace(/[.?!]+$/, "");
  const parts = [];

  if (!signals.hasContext) {
    parts.push(
      "Contexto: esta resposta será usada por uma pessoa iniciante que precisa compreender o tema com segurança.",
    );
  }

  parts.push(`Objetivo: ${safeText}.`);

  if (!signals.hasAudience) {
    parts.push("Público-alvo: usuários iniciantes.");
  }
  if (!signals.hasFormat) {
    parts.push(
      "Formato: organize a resposta em uma introdução breve e uma lista de passos práticos.",
    );
  }
  if (!signals.hasConstraints) {
    parts.push(
      "Critérios: use linguagem clara, exemplos fictícios e destaque os cuidados mais importantes.",
    );
  }

  parts.push(
    "Segurança: não solicite nem exponha dados pessoais, senhas ou credenciais.",
  );

  return parts.join("\n");
}

export function analyzePrompt(input) {
  const text = normalizeText(String(input ?? ""));

  if (!text) {
    const error = new Error("Digite um prompt antes de solicitar a análise.");
    error.code = "EMPTY_PROMPT";
    throw error;
  }

  const words = text.split(/\s+/);
  const hasAction = ACTION_PATTERN.test(text);
  const hasContext = CONTEXT_PATTERN.test(text);
  const hasAudience = AUDIENCE_PATTERN.test(text);
  const hasFormat = FORMAT_PATTERN.test(text);
  const hasConstraints = CONSTRAINT_PATTERN.test(text) || /\b\d+\b/.test(text);
  const hasAmbiguity = VAGUE_PATTERN.test(text) || words.length < 4;
  const conflicts = detectConflicts(text);
  const risk = detectRisk(text);

  const clarityScore = clamp(
    25 +
      (hasAction ? 35 : 0) +
      (words.length >= 6 ? 25 : 0) +
      (/[?.!]$/.test(text) ? 10 : 0) -
      (hasAmbiguity ? 30 : 0) -
      conflicts.length * 15,
  );
  const contextScore = clamp(
    15 + (hasContext ? 55 : 0) + (hasAudience ? 30 : 0),
  );
  const objectiveScore = clamp(
    20 + (hasAction ? 60 : 0) + (words.length >= 5 ? 20 : 0),
  );
  const specificityScore = clamp(
    15 +
      (hasConstraints ? 40 : 0) +
      (hasAudience ? 20 : 0) +
      (words.length >= 12 ? 25 : words.length >= 7 ? 10 : 0),
  );
  const formatScore = hasFormat ? 100 : hasConstraints ? 55 : 20;

  const criteria = [
    {
      id: "clarity",
      label: "Clareza",
      score: clarityScore,
      description: "A instrução principal é direta e evita referências vagas.",
    },
    {
      id: "context",
      label: "Contexto",
      score: contextScore,
      description: "O cenário e o público da resposta estão definidos.",
    },
    {
      id: "objective",
      label: "Objetivo",
      score: objectiveScore,
      description: "Existe uma ação ou resultado esperado identificável.",
    },
    {
      id: "specificity",
      label: "Especificidade",
      score: specificityScore,
      description: "Há limites, critérios ou detalhes úteis para orientar a resposta.",
    },
    {
      id: "format",
      label: "Formato",
      score: formatScore,
      description: "O formato de saída esperado está explícito.",
    },
    {
      id: "safety",
      label: "Segurança",
      score: risk.score,
      description: "O texto evita pedidos ou exposição de informações sensíveis.",
    },
  ];

  const weights = {
    clarity: 0.18,
    context: 0.16,
    objective: 0.2,
    specificity: 0.16,
    format: 0.14,
    safety: 0.16,
  };
  const weightedScore = clamp(
    criteria.reduce(
      (total, criterion) => total + criterion.score * weights[criterion.id],
      0,
    ),
  );
  const score =
    risk.level === "Alto"
      ? Math.min(weightedScore, 35)
      : risk.level === "Médio"
        ? Math.min(weightedScore, 69)
        : weightedScore;

  const strengths = criteria
    .filter((criterion) => criterion.score >= 70)
    .map((criterion) => `${criterion.label}: ${criterion.description}`);
  const problems = criteria
    .filter((criterion) => criterion.score < 60)
    .map((criterion) => {
      const messages = {
        clarity: "A instrução está vaga ou não deixa clara a ação principal.",
        context: "Faltam cenário e/ou público-alvo para orientar a resposta.",
        objective: "O resultado esperado não está definido com clareza.",
        specificity: "Faltam critérios, limites ou detalhes verificáveis.",
        format: "O formato da resposta não foi especificado.",
        safety: "O pedido apresenta risco de segurança ou privacidade.",
      };
      return messages[criterion.id];
    });

  problems.push(...conflicts, ...risk.findings);

  const suggestions = [];
  if (!hasAction) suggestions.push("Comece com um verbo de ação, como “explique”, “compare” ou “crie”.");
  if (!hasContext) suggestions.push("Informe em qual cenário a resposta será utilizada.");
  if (!hasAudience) suggestions.push("Defina para quem a resposta deve ser adequada.");
  if (!hasConstraints) suggestions.push("Inclua limites, quantidade, tom ou critérios de qualidade.");
  if (!hasFormat) suggestions.push("Indique o formato desejado, como lista, tabela ou passo a passo.");
  if (conflicts.length) suggestions.push("Escolha uma única orientação para cada requisito conflitante.");
  if (risk.findings.length) suggestions.push("Use apenas exemplos fictícios e remova pedidos ou valores sensíveis.");
  if (!suggestions.length) suggestions.push("O prompt já está consistente; revise apenas fatos e limites específicos do seu caso.");

  return {
    score,
    level:
      score >= 85
        ? "Excelente"
        : score >= 70
          ? "Bom"
          : score >= 50
            ? "Em desenvolvimento"
            : "Precisa melhorar",
    criteria,
    strengths:
      strengths.length > 0
        ? strengths
        : ["O prompt já apresenta um tema que pode ser desenvolvido."],
    problems: [...new Set(problems)],
    suggestions: [...new Set(suggestions)],
    conflicts,
    risk,
    improvedPrompt: buildImprovedPrompt(
      text,
      { hasContext, hasAudience, hasFormat, hasConstraints },
      risk,
    ),
  };
}
