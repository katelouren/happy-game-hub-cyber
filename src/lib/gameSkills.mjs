// Associação educativa por mecânica/gênero, sem avaliação clínica de desempenho.
const SKILL_BY_GENRE = {
  shooter: "Atenção e Foco",
  action: "Coordenação e Tempo de Reação",
  fighting: "Coordenação e Tempo de Reação",
  racing: "Coordenação e Tempo de Reação",
  sports: "Coordenação e Tempo de Reação",
  platformer: "Coordenação e Tempo de Reação",
  coordenacao: "Coordenação e Tempo de Reação",
  "battle royale": "Atenção e Foco",
  strategy: "Estratégia",
  estrategia: "Estratégia",
  planejamento: "Estratégia",
  moba: "Estratégia",
  rpg: "Tomada de Decisão",
  mmorpg: "Tomada de Decisão",
  arpg: "Tomada de Decisão",
  "action rpg": "Tomada de Decisão",
  survival: "Tomada de Decisão",
  puzzle: "Resolução de Problemas",
  aprendizado: "Resolução de Problemas",
  raciocinio: "Raciocínio Lógico",
  card: "Raciocínio Lógico",
  "card game": "Raciocínio Lógico",
  memory: "Memória",
  memoria: "Memória",
  sandbox: "Criatividade",
  building: "Criatividade",
  construction: "Criatividade",
  criatividade: "Criatividade",
};

function normalize(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function getGameSkill(game) {
  if (normalize(game.title ?? game.nome) === "fall guys") {
    return "Coordenação e Tempo de Reação";
  }
  return SKILL_BY_GENRE[normalize(game.genre ?? game.categoria)] ?? "Tomada de Decisão";
}

export function filterGamesBySkill(games, searchTerm = "", selectedSkill = "Todos") {
  const search = normalize(searchTerm);
  return games.filter((game) => {
    const skill = game.skill ?? getGameSkill(game);
    return (selectedSkill === "Todos" || skill === selectedSkill)
      && normalize(`${game.title} ${game.genre} ${game.platform} ${skill}`).includes(search);
  });
}
