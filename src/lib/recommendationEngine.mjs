const GAME_BY_OBJECTIVE = {
  Criatividade: {
    title: "Minecraft",
    skill: "Criatividade e resolução de problemas",
    reason:
      "Seu objetivo valoriza criação, experimentação e construção de soluções próprias.",
  },
  Raciocínio: {
    title: "Portal 2",
    skill: "Lógica e pensamento crítico",
    reason:
      "Seu perfil indica interesse em desafios que exigem observar padrões e testar hipóteses.",
  },
  Planejamento: {
    title: "Stardew Valley",
    skill: "Organização e gestão de recursos",
    reason:
      "A atividade combina decisões de rotina, prioridades e planejamento progressivo.",
  },
  Coordenação: {
    title: "Rocket League",
    skill: "Coordenação e tomada rápida de decisão",
    reason:
      "Seu objetivo está relacionado a precisão, percepção espacial e respostas rápidas.",
  },
  Estratégia: {
    title: "Civilization VI",
    skill: "Estratégia e visão de longo prazo",
    reason:
      "Seu perfil valoriza decisões táticas, análise de consequências e planejamento.",
  },
  Aprendizado: {
    title: "Kerbal Space Program",
    skill: "Curiosidade científica e experimentação",
    reason:
      "Seu objetivo combina aprendizagem prática, tentativa, revisão e descoberta.",
  },
  "Segurança Digital": {
    title: "Desafio Cyber do Happy Game Hub",
    skill: "Prevenção de riscos e cidadania digital",
    reason:
      "Seu objetivo prioriza reconhecer situações suspeitas e tomar decisões digitais mais seguras.",
    href: "/cyber",
    action: "Iniciar desafio de segurança",
    type: "Experiência interativa",
  },
};

const GAME_BY_STYLE = {
  Aventura: "Exploração e tomada de decisão",
  Estratégia: "Planejamento e análise",
  Construção: "Criatividade e organização",
  Esporte: "Coordenação e colaboração",
  Puzzle: "Lógica e resolução de problemas",
  Simulação: "Gestão e pensamento sistêmico",
};

const STARTER_RECOMMENDATIONS = [
  {
    id: "starter-profile",
    title: "Defina seu perfil de jogador",
    type: "Primeiro passo",
    priority: 100,
    skill: "Autoconhecimento",
    reason:
      "Ainda não há preferências salvas. Responda ao formulário para receber sugestões personalizadas.",
    href: "#perfil-jogador",
    action: "Preencher perfil",
  },
  {
    id: "starter-games",
    title: "Explore a biblioteca de jogos",
    type: "Descoberta",
    priority: 70,
    skill: "Exploração de interesses",
    reason:
      "Marcar jogos de interesse ajuda o sistema a entender quais experiências combinam com você.",
    href: "/jogos",
    action: "Explorar jogos",
  },
  {
    id: "starter-prompt",
    title: "Faça sua primeira avaliação de prompt",
    type: "Prática de IA",
    priority: 60,
    skill: "Comunicação com IA",
    reason:
      "Uma avaliação cria dados de aprendizagem e permite recomendar os próximos conteúdos.",
    href: "/cyber/prompts",
    action: "Avaliar prompt",
  },
];

function hasMeaningfulHistory(activity) {
  return Boolean(
    activity?.profile ||
      activity?.promptAnalyses?.length ||
      activity?.gameInterests?.length ||
      activity?.assistantInteractions?.length,
  );
}

function addUnique(recommendations, recommendation) {
  const current = recommendations.get(recommendation.id);
  if (!current || current.priority < recommendation.priority) {
    recommendations.set(recommendation.id, recommendation);
  }
}

export function generateRecommendations(activity = {}) {
  if (!hasMeaningfulHistory(activity)) {
    return {
      personalized: false,
      summary:
        "Ainda não há histórico suficiente. Comece por uma das atividades abaixo.",
      items: STARTER_RECOMMENDATIONS,
    };
  }

  const recommendations = new Map();
  const profile = activity.profile;

  if (profile) {
    const game = GAME_BY_OBJECTIVE[profile.objetivo] ?? GAME_BY_OBJECTIVE.Criatividade;
    const ageNote =
      profile.idade === "Criança"
        ? " Para crianças, consulte a classificação indicativa e conte com acompanhamento responsável."
        : "";

    addUnique(recommendations, {
      id: `game-${profile.objetivo.toLowerCase()}`,
      title: game.title,
      type: game.type ?? "Jogo recomendado",
      priority: 90,
      skill: game.skill,
      reason: `${game.reason} Seu estilo escolhido foi ${profile.estilo.toLowerCase()}.${ageNote}`,
      href: game.href ?? "/jogos",
      action: game.action ?? "Encontrar na biblioteca",
    });

    addUnique(recommendations, {
      id: "profile-secondary-skill",
      title: `Pratique ${GAME_BY_STYLE[profile.estilo] ?? "novas habilidades"}`,
      type: "Habilidade complementar",
      priority: 68,
      skill: GAME_BY_STYLE[profile.estilo] ?? profile.objetivo,
      reason: `Esta prática complementa seu objetivo de ${profile.objetivo.toLowerCase()} sem repetir a recomendação principal.`,
      href: "/jogos",
      action: "Ver opções de jogos",
    });
  }

  const latestPrompt = activity.promptAnalyses?.[0];
  if (latestPrompt) {
    if (latestPrompt.risk === "Alto") {
      addUnique(recommendations, {
        id: "prompt-safety",
        title: "Revise segurança e privacidade em prompts",
        type: "Prioridade alta",
        priority: 100,
        skill: "Proteção de dados",
        reason:
          "Sua avaliação mais recente encontrou risco alto de exposição ou solicitação de informação sensível.",
        href: "/cyber/prompts",
        action: "Reformular com segurança",
      });
    } else if (latestPrompt.score < 70) {
      addUnique(recommendations, {
        id: "prompt-structure",
        title: "Pratique a estrutura de um bom prompt",
        type: "Próximo estudo",
        priority: latestPrompt.score < 50 ? 96 : 84,
        skill: "Clareza e comunicação com IA",
        reason: `Sua última avaliação recebeu ${latestPrompt.score}/100. Contexto, objetivo, limites e formato podem tornar o pedido mais útil.`,
        href: "/cyber/prompts",
        action: "Tentar nova avaliação",
      });
    } else {
      addUnique(recommendations, {
        id: "prompt-advanced",
        title: "Avance para prompts mais específicos",
        type: "Evolução",
        priority: 72,
        skill: "Especificidade e revisão crítica",
        reason: `Sua última nota foi ${latestPrompt.score}/100. Você já tem uma boa base e pode experimentar critérios e formatos mais exigentes.`,
        href: "/cyber/prompts",
        action: "Criar outro prompt",
      });
    }
  }

  if (activity.gameInterests?.length) {
    const latestGame = activity.gameInterests[0];
    addUnique(recommendations, {
      id: "game-interest",
      title: `Continue explorando ${latestGame.genre || "novos gêneros"}`,
      type: "Com base nos seus interesses",
      priority: 76,
      skill: "Descoberta e repertório",
      reason: `Você marcou ${latestGame.title} como interessante. Compare outras opções antes de escolher sua próxima experiência.`,
      href: "/jogos",
      action: "Explorar jogos relacionados",
    });
  }

  if (activity.assistantInteractions?.length) {
    addUnique(recommendations, {
      id: "assistant-follow-up",
      title: "Continue sua trilha com o assistente",
      type: "Orientação",
      priority: 58,
      skill: "Aprendizagem guiada",
      reason:
        "Você já utilizou o assistente; uma pergunta de acompanhamento pode ajudar a transformar a orientação em uma ação prática.",
      href: "/cyber/assistente",
      action: "Continuar conversa",
    });
  }

  if (recommendations.size < 3) {
    addUnique(
      recommendations,
      profile?.objetivo === "Segurança Digital"
        ? {
            id: "security-scenarios",
            title: "Pratique decisões em situações suspeitas",
            type: "Orientação complementar",
            priority: 55,
            skill: "Análise de risco digital",
            reason:
              "O Assistente de Segurança ajuda a praticar como reagir a links, pedidos de credenciais e mensagens urgentes.",
            href: "/cyber/assistente",
            action: "Praticar com o assistente",
          }
        : {
            id: "cyber-awareness",
            title: "Conheça as ferramentas de segurança",
            type: "Conteúdo complementar",
            priority: 55,
            skill: "Cidadania digital",
            reason:
              "A área Cyber reúne práticas de senhas, prompts e orientação para decisões digitais mais seguras.",
            href: "/cyber",
            action: "Acessar Cyber",
          },
    );
  }

  return {
    personalized: true,
    summary:
      "As sugestões estão ordenadas por relevância usando seu perfil e suas interações salvas neste navegador.",
    items: [...recommendations.values()].sort(
      (first, second) => second.priority - first.priority,
    ),
  };
}

export const recommendationOptions = {
  ages: ["Criança", "Adolescente", "Adulto"],
  objectives: Object.keys(GAME_BY_OBJECTIVE),
  styles: Object.keys(GAME_BY_STYLE),
};
