import { COMPETENCIES, getCompetency, migrateProfile } from './competencies.mjs';
import { getGameCompetencyId } from './gameSkills.mjs';
import games from '../../data/games.json' with { type: 'json' };

const STARTERS = [
  { id: 'starter-profile', title: 'Defina seu perfil de desenvolvimento', type: 'Primeiro passo', priority: 100, topic: 'Personalização', reason: 'Escolha uma competência para receber sugestões personalizadas.', href: '#perfil-jogador', action: 'Preencher perfil' },
  { id: 'starter-games', title: 'Explore a biblioteca de jogos', type: 'Descoberta', priority: 70, topic: 'Jogos', reason: 'Marcar jogos de interesse ajuda a identificar suas preferências.', href: '/jogos', action: 'Explorar jogos' },
  { id: 'starter-security', title: 'Pratique segurança digital com o assistente', type: 'Prática de segurança', priority: 60, topic: 'Cibersegurança', reason: 'Converse sobre situações suspeitas e cuidados para proteger seus dados.', href: '/cyber/assistente', action: 'Conversar com o assistente' },
];
export function generateRecommendations(activity = {}) {
  const profile = migrateProfile(activity.profile);
  const competency = getCompetency(profile?.objetivo);
  const items = [];
  if (competency) {
    const game = games.find(game => getGameCompetencyId(game) === competency.id);
    items.push({ id: `game-${competency.id}`, title: game.title, type: 'Jogo recomendado', priority: 90,
      competencyId: competency.id, reason: `${competency.description} Esta associação é educativa. Seu estilo escolhido foi ${profile.estilo ?? 'não informado'}.`,
      href: `/jogos?competencia=${competency.id}`, action: 'Encontrar na biblioteca' });
  }
  if (activity.gameInterests?.length) {
    const game = activity.gameInterests[0];
    items.push({ id: 'game-interest', title: `Continue explorando ${game.genre || 'novos gêneros'}`, type: 'Com base nos seus interesses', priority: 76,
      competencyId: getGameCompetencyId(game), reason: `Você marcou ${game.title} como interessante. Compare experiências relacionadas.`, href: `/jogos?competencia=${getGameCompetencyId(game)}`, action: 'Explorar jogos relacionados' });
  }
  if (activity.assistantInteractions?.length) items.push({ id: 'assistant-follow-up', title: 'Continue sua trilha com o assistente', type: 'Orientação', priority: 58, topic: 'Aprendizagem guiada', reason: 'Uma pergunta de acompanhamento pode ajudar a colocar a orientação em prática.', href: '/cyber/assistente', action: 'Continuar conversa' });
  for (const starter of STARTERS) {
    if (items.length >= 3) break;
    if (starter.id === 'starter-profile' && competency) continue;
    items.push(starter);
  }
  return { personalized: Boolean(competency || activity.gameInterests?.length || activity.assistantInteractions?.length),
    summary: competency ? 'Sugestões relacionadas à competência escolhida e às interações salvas neste navegador.' : 'Escolha uma das seis competências para personalizar as recomendações.',
    items: items.sort((a,b) => b.priority-a.priority) };
}
export const recommendationOptions = {
  objectives: COMPETENCIES.map(item => item.id),
  styles: ['Aventura', 'Estratégia', 'Construção', 'Esporte', 'Puzzle', 'Simulação'],
};
