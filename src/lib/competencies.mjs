// Única definição de competências do produto. IDs são persistidos; labels são apresentação.
export const COMPETENCIES = Object.freeze([
  { id: 'creativity', label: 'Criatividade', description: 'Capacidade de experimentar possibilidades e desenvolver soluções ou ideias diferentes.', examples: ['Criação', 'Construção', 'Sandbox'], order: 1 },
  { id: 'attention_concentration', label: 'Atenção e Concentração', description: 'Capacidade de manter o foco, acompanhar informações e perceber elementos relevantes durante uma atividade.', examples: ['Foco', 'Observação', 'Precisão'], order: 2 },
  { id: 'logical_reasoning', label: 'Raciocínio Lógico', description: 'Capacidade de reconhecer padrões, organizar informações e estabelecer relações coerentes.', examples: ['Puzzles', 'Programação', 'Padrões'], order: 3 },
  { id: 'strategic_thinking', label: 'Pensamento Estratégico', description: 'Capacidade de planejar ações considerando objetivos, recursos e possíveis consequências.', examples: ['Estratégia', 'Gestão de recursos'], order: 4 },
  { id: 'problem_solving', label: 'Resolução de Problemas', description: 'Capacidade de analisar obstáculos, testar alternativas e encontrar caminhos para uma solução.', examples: ['Investigação', 'Enigmas', 'Experimentação'], order: 5 },
  { id: 'decision_making', label: 'Tomada de Decisão', description: 'Capacidade de escolher entre alternativas considerando informações, prioridades e riscos.', examples: ['Simulação', 'Escolhas', 'Riscos'], order: 6 },
].map(item => Object.freeze({ ...item, examples: Object.freeze(item.examples) })));
export const getCompetency = id => COMPETENCIES.find(item => item.id === id);
const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const aliases = new Map([
  ...COMPETENCIES.flatMap(item => [[normalize(item.id), item.id], [normalize(item.label), item.id]]),
  ['raciocinio', 'logical_reasoning'], ['logica', 'logical_reasoning'],
  ['estrategia', 'strategic_thinking'], ['planejamento', 'strategic_thinking'],
  ['atencao e foco', 'attention_concentration'],
]);
export function normalizeCompetencyId(value) { return aliases.get(normalize(value)) ?? null; }
export function migrateProfile(profile) {
  if (!profile || typeof profile !== 'object') return null;
  const migrated = { ...profile, objetivo: normalizeCompetencyId(profile.objetivo) };
  delete migrated.idade;
  return migrated;
}
export const COMPETENCY_INSTRUCTIONS = `Competências oficiais (id: nome): ${COMPETENCIES.map(item => `${item.id}: ${item.label}`).join('; ')}. Use somente estas competências ao descrever o sistema. Cibersegurança é tema, não competência calculada. Os índices são estimativas das interações, não avaliações profissionais.`;
