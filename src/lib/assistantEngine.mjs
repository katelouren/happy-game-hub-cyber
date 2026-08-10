const DEFAULT_SUGGESTIONS = [
  "O que encontro no Happy Game Hub?",
  "Como criar um bom prompt?",
  "Recebi um e-mail pedindo minha senha. É seguro?",
];

const TOPIC_SUGGESTIONS = {
  platform: [
    "O que encontro no Happy Game Hub?",
    "Onde ficam os jogos?",
    "O que há na área Cyber?",
  ],
  games: [
    "Como escolher um jogo?",
    "Que habilidades os jogos estimulam?",
    "Onde vejo recomendações?",
  ],
  prompts: [
    "Como criar um bom prompt?",
    "Dê um exemplo de prompt seguro",
    "O que devo evitar em um prompt?",
  ],
  ai: [
    "O que é inteligência artificial?",
    "A IA sempre acerta?",
    "Como usar IA com responsabilidade?",
  ],
  cyber: [
    "Recebi um e-mail pedindo minha senha. É seguro?",
    "Posso abrir um link de remetente desconhecido?",
    "Alguém pediu meu código de autenticação. O que faço?",
    "Recebi uma cobrança urgente por mensagem.",
    "É seguro baixar um anexo inesperado?",
    "Pedirem meu CPF por mensagem é seguro?",
    "Confirmei o remetente por outro canal. Ainda há risco?",
  ],
  passwords: [
    "Como criar uma senha forte?",
    "Que cuidados devo ter com minha senha?",
    "Por que usar autenticação em dois fatores?",
  ],
};

const INTENTS = [
  {
    topic: "prompts",
    keywords: [
      "prompt",
      "instrucao para ia",
      "pergunta para ia",
      "contexto e objetivo",
    ],
  },
  {
    topic: "games",
    keywords: [
      "jogo",
      "jogos",
      "jogar",
      "quiz",
      "memoria",
      "habilidade cognitiva",
      "recomendacao de jogo",
    ],
  },
  {
    topic: "cyber",
    keywords: [
      "ciberseguranca",
      "cyber",
      "seguranca digital",
      "golpe",
      "phishing",
      "link suspeito",
      "malware",
      "virus",
      "senha",
      "autenticacao",
      "2fa",
      "privacidade",
    ],
  },
  {
    topic: "ai",
    keywords: [
      "inteligencia artificial",
      "ia",
      "chatbot",
      "modelo de linguagem",
      "algoritmo",
    ],
  },
  {
    topic: "platform",
    keywords: [
      "happy game hub",
      "plataforma",
      "site",
      "pagina",
      "navegar",
      "menu",
      "onde encontro",
      "como funciona",
    ],
  },
];

const RESPONSES = {
  platform:
    "O Happy Game Hub reúne jogos, recomendações e ferramentas educativas de cibersegurança. Use o menu principal para visitar cada área; na seção Cyber você encontra análises de senhas, prompts e este assistente.",
  games:
    "Na área Jogos você pode explorar experiências educativas e cognitivas. Leia a descrição de cada card para escolher uma atividade e use Recomendações quando quiser uma sugestão mais direcionada.",
  prompts:
    "Um bom prompt informa contexto, objetivo, público e formato esperado. Seja específico, peça uma resposta verificável e nunca inclua senhas, documentos, tokens ou outros dados pessoais.",
  ai:
    "Inteligência artificial identifica padrões para produzir respostas ou previsões, mas pode errar. Confira informações importantes, preserve sua privacidade e use a IA como apoio, não como única fonte de decisão.",
  cyber:
    "Em segurança digital, pare e verifique antes de agir: desconfie de urgência, confira remetente e endereço do site, não abra links inesperados e ative autenticação em dois fatores quando disponível.",
  unknown:
    "Ainda não tenho uma resposta confiável para esse assunto. Posso ajudar com o Happy Game Hub, jogos, prompts, inteligência artificial e noções básicas de cibersegurança. Tente reformular a pergunta dentro de um desses temas.",
  empty:
    "Escreva uma pergunta para começar. Posso explicar a plataforma, os jogos, prompts, inteligência artificial ou segurança digital.",
  sensitive:
    "Não envie nem peça senhas, tokens, documentos ou outros dados pessoais aqui. Remova a informação sensível, troque qualquer credencial que tenha sido exposta e descreva a situação apenas de forma genérica. Posso orientar sobre práticas seguras.",
};

const SECURITY_ASSESSMENTS = {
  "credential-request": {
    situation: "E-mail ou mensagem solicitando senha ou credencial",
    classification: "Possível phishing e tentativa de roubo de credencial",
    category: "credential-request",
    riskLevel: "Alto",
    alert:
      "Uma organização legítima não deve pedir que você envie sua senha por e-mail, SMS ou aplicativo de mensagens.",
    recommendedAction:
      "Não responda nem use links da mensagem. Acesse o serviço digitando o endereço oficial, confirme o contato por outro canal e denuncie a tentativa. Se informou a senha, troque-a imediatamente e encerre sessões abertas.",
    answer:
      "A situação apresenta sinais fortes de tentativa de obtenção de credencial.",
  },
  "unknown-link": {
    situation: "Link desconhecido, encurtado ou recebido sem contexto confiável",
    classification: "Link potencialmente malicioso",
    category: "unknown-link",
    riskLevel: "Médio",
    alert:
      "O destino real pode imitar um site conhecido, coletar dados ou iniciar um download malicioso.",
    recommendedAction:
      "Não abra o link. Confirme a mensagem com o remetente por outro canal e acesse o serviço pelo aplicativo ou endereço oficial. Se já clicou, não informe dados e faça uma verificação de segurança no dispositivo.",
    answer:
      "Não há informação suficiente para confiar no destino desse link.",
  },
  "authentication-code-request": {
    situation: "Pessoa ou mensagem solicitando código de autenticação",
    classification: "Tentativa de assumir uma conta protegida por autenticação",
    category: "authentication-code-request",
    riskLevel: "Alto",
    alert:
      "Códigos de autenticação são pessoais e temporários; quem os recebe pode concluir um acesso em seu nome.",
    recommendedAction:
      "Não compartilhe o código. Interrompa o contato, revise os acessos recentes pelo canal oficial e troque a senha se não reconhece a tentativa de login.",
    answer:
      "O pedido deve ser tratado como uma tentativa de acesso indevido.",
  },
  "urgent-payment": {
    situation: "Mensagem com urgência incomum solicitando pagamento ou transferência",
    classification: "Possível engenharia social ou fraude financeira",
    category: "urgent-payment",
    riskLevel: "Alto",
    alert:
      "Pressão para agir rápido, sigilo e mudança inesperada de dados de pagamento são sinais frequentes de golpe.",
    recommendedAction:
      "Não pague antes de verificar. Confirme a identidade e os dados usando um telefone ou canal oficial já conhecido, nunca os contatos fornecidos na própria mensagem.",
    answer:
      "A combinação de urgência e pedido financeiro indica alto risco de fraude.",
  },
  "suspicious-download": {
    situation: "Download, programa ou anexo inesperado",
    classification: "Arquivo potencialmente malicioso",
    category: "suspicious-download",
    riskLevel: "Alto",
    alert:
      "Arquivos inesperados podem instalar malware, capturar informações ou comprometer o dispositivo.",
    recommendedAction:
      "Não baixe nem execute o arquivo. Confirme a origem por outro canal e obtenha programas apenas da loja ou do site oficial. Se já abriu, desconecte-se de redes sensíveis e procure suporte técnico.",
    answer:
      "Um arquivo inesperado deve ser tratado como potencialmente perigoso.",
  },
  "personal-data-request": {
    situation: "Solicitação de CPF, documento, cartão ou outro dado pessoal",
    classification: "Possível coleta indevida de dados pessoais",
    category: "personal-data-request",
    riskLevel: "Alto",
    alert:
      "Dados pessoais podem ser usados em fraudes, falsidade de identidade e recuperação indevida de contas.",
    recommendedAction:
      "Não envie os dados. Confirme a necessidade e a identidade da organização em um canal oficial, compartilhe somente o mínimo indispensável e denuncie solicitações suspeitas.",
    answer:
      "O pedido envolve informação pessoal e exige verificação antes de qualquer envio.",
  },
  "low-risk": {
    situation: "Contato esperado e confirmado por um canal oficial independente",
    classification: "Boas práticas observadas, sem sinal de ameaça no relato",
    category: "low-risk",
    riskLevel: "Baixo",
    alert:
      "Baixo risco não significa garantia absoluta; páginas e contatos ainda podem ser falsificados.",
    recommendedAction:
      "Continue usando o aplicativo ou endereço oficial, confira o domínio antes de informar dados e mantenha autenticação em dois fatores ativa.",
    answer:
      "Os cuidados descritos reduzem o risco, embora a atenção ainda seja necessária.",
  },
  unknown: {
    situation: "Situação digital com informações insuficientes para análise",
    classification: "Não classificada pelas regras locais",
    category: "unknown",
    riskLevel: "Médio",
    alert:
      "A ausência de sinais claros não comprova que a situação seja segura.",
    recommendedAction:
      "Não clique, pague, baixe arquivos nem compartilhe dados até confirmar origem, contexto e identidade por um canal oficial. Reformule a descrição sem incluir informações pessoais.",
    answer:
      "Não consegui classificar a situação com confiança; aplique uma pausa de segurança antes de agir.",
  },
  "sensitive-data": {
    situation: "Conteúdo sensível informado ou solicitado na conversa",
    classification: "Exposição ou tentativa de obtenção de informação sensível",
    category: "sensitive-data",
    riskLevel: "Alto",
    alert:
      "Senhas, códigos, documentos, tokens e dados financeiros não devem ser compartilhados em chats.",
    recommendedAction:
      "Remova a informação do relato. Se um dado real foi exposto, troque a credencial ou contate imediatamente a instituição responsável usando um canal oficial.",
    answer: RESPONSES.sensitive,
  },
};

const FOLLOW_UP_PATTERN =
  /^(e\s|como\s|por que\s|porque\s|onde\s|qual\s|quais\s|pode\s|isso\b|mais\b|de um exemplo\b|tem exemplo\b)/;

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeSensitiveRequest(normalized) {
  const target =
    "(?:senha|password|pin|token|credencial|chave de api|chave de acesso|cpf|rg|dados pessoais|cartao)";
  const directAction =
    "(?:descobrir|obter|revelar|roubar|hackear|invadir|quebrar|me diga|mostre)";
  const directRequest = new RegExp(
    `^(?:por favor[, ]*)?(?:(?:quero|preciso|gostaria de|me ajude a|me ensine a|como|como posso|como faco para)\\s+)?${directAction}\\s+(?:a|o|uma|um)?\\s*${target}(?:\\s+(?:de|da|do)\\b|[?.!]*$)`,
  );
  const thirdPartyRequest = new RegExp(
    `^(?:(?:qual (?:e|eh)|voce (?:pode|consegue) (?:me )?(?:dizer|mostrar)).{0,35})${target}.{0,45}(?:de outra pessoa|de alguem|da conta|do usuario|sem permissao)`,
  );

  return directRequest.test(normalized) || thirdPartyRequest.test(normalized);
}

/**
 * Identifica indícios de compartilhamento ou solicitação de dados sensíveis.
 * A função é determinística e não registra nem transforma o conteúdo recebido.
 */
export function containsSensitiveContent(message) {
  const raw = String(message ?? "").trim();
  const normalized = normalizeText(raw);

  if (!normalized) return false;

  const credentialAssignment =
    /\b(?:(?:(?:minha|meu|a minha|o meu)\s+(?:senha|password|pin|token|credencial|api[ -]?key|chave (?:de )?(?:api|acesso))\s*(?:e|eh|:|=)\s*\S+)|(?:(?:senha|password|pin|token|credencial|api[ -]?key|chave (?:de )?(?:api|acesso))\s*[:=]\s*\S+)|(?:(?:senha|password|pin|token)\s+(?:e|eh)\s+\S*(?:\d|[#@!$%&*])\S*))/i;
  const explicitPersonalData =
    /\b(?:meu|minha)\s+(?:cpf|rg|telefone|celular|e-?mail|endereco|cartao)\s*(?:e|eh|:|=)\s*\S+/i;
  const authenticationCodeAssignment =
    /\b(?:meu\s+)?codigo\s+(?:de\s+)?(?:autenticacao|verificacao|seguranca|acesso|2fa)\s*(?:e|eh|:|=)\s*\d{4,10}\b/i;
  const emailAddress = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const cpfNumber = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/;
  const cardNumber = /\b(?:\d[ -]*?){13,19}\b/;
  const commonSecret =
    /\b(?:sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9]{12,}|AKIA[A-Z0-9]{12,}|bearer\s+[A-Za-z0-9._-]{12,})\b/i;

  return (
    credentialAssignment.test(normalized) ||
    explicitPersonalData.test(normalized) ||
    authenticationCodeAssignment.test(normalized) ||
    emailAddress.test(raw) ||
    cpfNumber.test(raw) ||
    cardNumber.test(raw) ||
    commonSecret.test(raw) ||
    looksLikeSensitiveRequest(normalized)
  );
}

/**
 * Retorna uma representação segura para a interface e para o sessionStorage.
 */
export function getSafeUserMessage(message) {
  return containsSensitiveContent(message)
    ? "[Mensagem sensível omitida por segurança]"
    : String(message ?? "").trim();
}

function hasRequestLanguage(normalized) {
  return /\b(?:pede|pedem|pediu|pediram|pedirem|pedido|pedindo|solicita|solicitam|solicitou|solicitaram|solicitarem|solicitacao|solicitando|exigiu|exigiram|quer|querem|mandou|mandaram|obter|coletar|enviar|envie|informar|informe|compartilhar|compartilhe|confirmar|confirme|fornecer|forneca)\b/.test(
    normalized,
  );
}

function classifySecuritySituation(normalized) {
  const hasAuthenticationCode =
    /\b(?:codigo (?:de )?(?:autenticacao|verificacao|seguranca|acesso)|codigo 2fa|token de confirmacao|otp)\b/.test(
      normalized,
    );
  if (hasAuthenticationCode && hasRequestLanguage(normalized)) {
    return "authentication-code-request";
  }

  const hasPassword = /\b(?:senha|password|credencial)\b/.test(normalized);
  const hasMessageContext =
    /\b(?:e-?mail|mensagem|sms|whatsapp|remetente|suporte|banco|empresa|pessoa|alguem|atendente)\b/.test(
      normalized,
    );
  if (hasPassword && hasRequestLanguage(normalized) && hasMessageContext) {
    return "credential-request";
  }

  const hasPayment =
    /\b(?:pagamento|pagar|pix|transferencia|deposito|boleto|dinheiro|cobranca)\b/.test(
      normalized,
    );
  const hasUrgency =
    /\b(?:urgente|urgencia|agora|imediatamente|imediato|hoje|prazo curto|sem demora|conta bloqueada)\b/.test(
      normalized,
    );
  if (hasPayment && (hasUrgency || (hasMessageContext && hasRequestLanguage(normalized)))) {
    return "urgent-payment";
  }

  const hasDownload =
    /\b(?:download|baixar|baixe|arquivo|anexo|programa|aplicativo|apk|executavel|exe|zip)\b/.test(
      normalized,
    );
  const hasSuspiciousFileContext =
    /\b(?:suspeito|suspeita|estranho|estranha|inesperado|inesperada|desconhecido|desconhecida|recebi|mandaram|enviaram|abrir|execute|executar)\b/.test(
      normalized,
    );
  if (hasDownload && hasSuspiciousFileContext) {
    return "suspicious-download";
  }

  const hasPersonalData =
    /\b(?:dados pessoais|cpf|rg|documento|identidade|cartao|endereco|data de nascimento|telefone|celular)\b/.test(
      normalized,
    );
  if (hasPersonalData && hasRequestLanguage(normalized)) {
    return "personal-data-request";
  }

  const hasLink = /\b(?:link|url)\b/.test(normalized);
  const hasUnknownLinkContext =
    /\b(?:desconhecido|desconhecida|suspeito|suspeita|estranho|estranha|encurtado|encurtada|recebi|mandaram|enviaram|clicar|cliquei|abrir|remetente)\b/.test(
      normalized,
    );
  if (hasLink && hasUnknownLinkContext) return "unknown-link";

  const followsSafePractices =
    /(?:digitei|acessei).{0,45}(?:endereco|site|aplicativo) oficial/.test(normalized) ||
    /(?:confirmei|verifiquei).{0,40}(?:remetente|origem|contato|pedido).{0,45}(?:outro canal|canal oficial|telefone oficial)/.test(
      normalized,
    ) ||
    /(?:mensagem|contato).{0,35}(?:esperada|esperado).{0,45}(?:remetente confirmado|canal oficial)/.test(
      normalized,
    ) ||
    /(?:ativei|uso|habilitei).{0,35}(?:2fa|autenticacao em dois fatores).{0,55}(?:senha unica|senhas unicas|gerenciador)/.test(
      normalized,
    );
  if (followsSafePractices) return "low-risk";

  const asksForSecurityAssessment =
    /\b(?:e seguro|eh seguro|devo confiar|isso e golpe|isso eh golpe|pode ser golpe|pode ser fraude|mensagem estranha|situacao estranha|situacao suspeita|nao sei se e golpe|nao sei se eh golpe)\b/.test(
      normalized,
    ) ||
    /\b(?:recebi|aconteceu|enviaram|mandaram)\b.{0,80}\b(?:mensagem|contato|aviso|pedido|situacao)\b/.test(
      normalized,
    );
  if (asksForSecurityAssessment) return "unknown";

  return null;
}

function detectTopic(normalized, previousTopic) {
  let bestTopic = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    const score = intent.keywords.reduce((total, keyword) => {
      const matches =
        keyword === "ia"
          ? /(^|[^a-z0-9])ia([^a-z0-9]|$)/.test(normalized)
          : normalized.includes(keyword);

      return total + (matches ? keyword.length : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestTopic = intent.topic;
    }
  }

  if (
    !bestTopic &&
    previousTopic &&
    RESPONSES[previousTopic] &&
    normalized.length <= 90 &&
    FOLLOW_UP_PATTERN.test(normalized)
  ) {
    return previousTopic;
  }

  return bestTopic ?? "unknown";
}

function contextualResponse(topic, normalized) {
  if (topic === "cyber" && /senha|password/.test(normalized)) {
    return "Crie senhas longas e únicas, de preferência com uma frase fácil de lembrar, e use um gerenciador confiável. Ative autenticação em dois fatores e nunca reutilize a mesma senha em serviços diferentes.";
  }

  if (topic === "cyber" && /golpe|phishing|link suspeito/.test(normalized)) {
    return "Não clique nem responda por impulso. Confira o domínio e o remetente por outro canal, procure sinais de urgência ou promessa exagerada e denuncie a mensagem. Se já clicou, troque credenciais afetadas e avise o serviço responsável.";
  }

  if (topic === "ai" && /sempre|confiavel|acerta|erro/.test(normalized)) {
    return "Não. Uma IA pode produzir respostas incorretas ou inventadas. Compare informações importantes com fontes confiáveis, revise o resultado e nunca delegue decisões críticas sem supervisão humana.";
  }

  return RESPONSES[topic];
}

function createSecurityResponse(category, previousTopic, safety = "warning") {
  const assessment = SECURITY_ASSESSMENTS[category];

  return {
    answer: assessment.answer,
    topic: category === "sensitive-data" ? "safety" : "cyber",
    safety: assessment.riskLevel === "Baixo" ? "ok" : safety,
    situation: assessment.situation,
    classification: assessment.classification,
    category: assessment.category,
    riskLevel: assessment.riskLevel,
    alert: assessment.alert,
    recommendedAction: assessment.recommendedAction,
    context: {
      lastTopic: category === "sensitive-data" ? previousTopic : "cyber",
    },
    suggestions: TOPIC_SUGGESTIONS.cyber,
  };
}

/**
 * Engine local, pura e substituível por uma chamada de API no componente.
 * Recebe somente a mensagem e um contexto simples e retorna dados serializáveis.
 */
export function createAssistantResponse(message, context = {}) {
  const normalized = normalizeText(message);
  const previousTopic = context?.lastTopic ?? null;

  if (!normalized) {
    return {
      answer: RESPONSES.empty,
      topic: previousTopic,
      safety: "ok",
      context: { lastTopic: previousTopic },
      suggestions: previousTopic
        ? TOPIC_SUGGESTIONS[previousTopic] ?? DEFAULT_SUGGESTIONS
        : DEFAULT_SUGGESTIONS,
    };
  }

  const securityCategory = classifySecuritySituation(normalized);

  if (containsSensitiveContent(message)) {
    return createSecurityResponse(
      securityCategory ?? "sensitive-data",
      previousTopic,
      "blocked",
    );
  }

  if (securityCategory) {
    return createSecurityResponse(securityCategory, previousTopic);
  }

  const topic = detectTopic(normalized, previousTopic);
  const nextTopic = topic === "unknown" ? previousTopic : topic;

  return {
    answer: contextualResponse(topic, normalized),
    topic,
    safety: "ok",
    context: { lastTopic: nextTopic },
    suggestions: TOPIC_SUGGESTIONS[topic] ?? DEFAULT_SUGGESTIONS,
  };
}

/**
 * Sugestões adequadas à página atual, usadas pelo launcher e pela página completa.
 */
export function getQuickPrompts(pathname = "/") {
  if (pathname.startsWith("/cyber/prompts")) return TOPIC_SUGGESTIONS.prompts;
  if (pathname.startsWith("/cyber/senhas")) return TOPIC_SUGGESTIONS.passwords;
  if (pathname.startsWith("/cyber/assistente")) return TOPIC_SUGGESTIONS.cyber;
  if (pathname.startsWith("/cyber")) return TOPIC_SUGGESTIONS.cyber;
  if (pathname.startsWith("/jogos")) return TOPIC_SUGGESTIONS.games;
  if (pathname.startsWith("/recomendacoes")) return TOPIC_SUGGESTIONS.games;

  return DEFAULT_SUGGESTIONS;
}

export const ASSISTANT_WELCOME =
  "Olá! Sou o Assistente de Segurança do Happy Game Hub. Descreva uma situação sem informar dados pessoais; também posso ajudar com a plataforma, jogos, prompts e IA.";
