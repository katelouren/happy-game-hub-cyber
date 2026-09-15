# Competências oficiais

A fonte única é `src/lib/competencies.mjs`: ID estável, rótulo, descrição moderada,
exemplos e ordem. IDs são usados no perfil, nas associações dos jogos, nos filtros,
nas recomendações e na agregação do índice. Rótulos são apenas apresentação.

| ID | Competência |
| --- | --- |
| creativity | Criatividade |
| attention_concentration | Atenção e Concentração |
| logical_reasoning | Raciocínio Lógico |
| strategic_thinking | Pensamento Estratégico |
| problem_solving | Resolução de Problemas |
| decision_making | Tomada de Decisão |

## Associação dos seis jogos locais

| Jogo | Competência principal | Mecânica considerada |
| --- | --- | --- |
| Minecraft | Criatividade | Construção e experimentação em sandbox |
| Portal 2 | Raciocínio Lógico | Puzzles espaciais, padrões e relações entre portais |
| Stardew Valley | Tomada de Decisão | Escolhas de rotina, prioridades e uso do tempo |
| Rocket League | Atenção e Concentração | Acompanhamento visual e precisão com bola e veículos |
| Civilization VI | Pensamento Estratégico | Recursos, objetivos e consequências de longo prazo |
| Kerbal Space Program | Resolução de Problemas | Testar projetos, observar falhas e superar obstáculos de engenharia |

Stardew Valley também envolve planejamento, mas o cálculo considera somente
as escolhas e prioridades como competência principal. Rocket League não recebeu
uma substituição textual de “Coordenação”: sua mecânica de precisão e observação
motivou a nova associação. Kerbal mantém associação à experimentação para resolver
problemas, não a uma competência genérica chamada “Aprendizado”. Nenhum jogo novo
foi criado. Essas associações são educativas, não validação clínica ou científica.

## Jogos externos

`src/lib/gameSkills.mjs` é o classificador compartilhado entre a API, o catálogo,
a migração e o cálculo. A API devolve `competencyId` válido por jogo. Títulos
conhecidos têm associação específica; Fall Guys, por exemplo, usa Atenção e
Concentração devido ao acompanhamento visual e precisão nos obstáculos.

- Shooter, ação, luta, corrida, esportes, plataforma, memória e battle royale:
  Atenção e Concentração.
- Puzzle, programação, cartas e padrões: Raciocínio Lógico.
- Strategy e MOBA: Pensamento Estratégico.
- RPG, sobrevivência e simulação: Tomada de Decisão.
- Investigação e aventura: Resolução de Problemas.
- Sandbox e construção: Criatividade.

O catálogo externo é dinâmico. Na ausência de título conhecido, ID válido ou gênero
reconhecido, usa-se Tomada de Decisão como associação educativa provisória, baseada
na escolha de ações. Essa regra é uma limitação: não comprova análise individual
da mecânica de cada título futuro e deve ser revisada quando houver dados melhores.

O filtro usa seis IDs. Se não houver resultado da API para a competência, oferece
os jogos locais existentes que correspondem ao filtro, identificados como catálogo
local. Busca e filtro combinados ainda podem legitimamente não encontrar resultados.

## Migração local

A chave de armazenamento é preservada. A normalização na leitura é idempotente;
a próxima gravação persiste a representação canônica.

- Criatividade, Resolução de Problemas e Tomada de Decisão: respectivos IDs.
- Raciocínio, Raciocínio Lógico e Lógica: `logical_reasoning`.
- Planejamento, Estratégia e Pensamento Estratégico: `strategic_thinking`.
- Atenção e Foco e Atenção e Concentração: `attention_concentration`.
- Objetivos Aprendizado, Segurança Digital e Coordenação: seleção nula, com aviso
  para escolher novamente em Recomendações. Não são convertidos arbitrariamente.

Interesses, conclusões, identificadores de jogos, datas, estilo e demais campos do
perfil são preservados. Associações dos jogos antigos são recalculadas pelo título
ou mecânica; o campo de apresentação antigo `skill` é descartado. Gêneros locais
antigos que eram objetivos são convertidos em gêneros reais pelo título do jogo.

A fórmula permanece `100 * (1 - Math.exp(-P / 20))`: interesse 1, conclusão 5,
maior estado por jogo. Não há soma 1+5, repetição de pontos ou competência secundária.
Os indicadores não constituem avaliação psicológica, clínica ou profissional.

## Assistente e temas

Cibersegurança é tema do produto e da área Cyber, não competência calculada.
Aprendizado e estratégia continuam em textos educativos e gêneros apropriados.

O contexto do servidor informa IDs e nomes canônicos. O fallback local também
apresenta a lista central. Modelo, chave, endpoint e mecanismo de fallback permanecem
iguais. O contrato da IA atual é texto (`answer`): não alimenta filtros, registros
ou cálculos com competências estruturadas. Campos extras do provedor não são
utilizados como competências. Texto generativo não oferece garantia absoluta de
vocabulário; nenhum dado pessoal adicional foi incluído na chamada.

## Verificação

Execute `npm run lint`, `npm test`, `npm run build` e `npm run test:a11y`.
Os testes incluem as seis opções, associação dos jogos, migração, peso máximo,
recomendações para cada competência e acessibilidade dos seletores/cards/gráfico.
Os testes de navegador usam APIs simuladas: não comprovam disponibilidade do
catálogo externo nem resposta real da OpenAI. VoiceOver e avaliação manual humana
continuam pendentes, conforme `ACCESSIBILITY.md`.

## Arquivos desta alteração

- Fonte central: `src/lib/competencies.mjs` (novo).
- Dados, cálculo e persistência: `data/games.json`, `src/lib/gameSkills.mjs`,
  `src/lib/estimatedProgress.mjs`, `src/lib/activityStore.js`,
  `src/lib/recommendationEngine.mjs`.
- Interface: `app/home/page.jsx`, `app/jogos/page.jsx`,
  `app/recomendacoes/page.jsx`, `app/evolucao/page.jsx`,
  `src/components/CategoryCard.jsx`, `src/components/ApiGameCard.jsx`.
- APIs/assistente: `app/api/games/route.js`, `app/api/assistant/route.js`,
  `src/lib/assistantEngine.mjs`.
- Testes: `tests/competencies.test.mjs` (novo), `tests/gameSkills.test.mjs`,
  `tests/recommendationEngine.test.mjs`, `tests/estimatedProgress.test.mjs`,
  `tests/gameCompletions.test.mjs`, `tests/assistantApi.test.mjs`,
  `tests/accessibility/pages.spec.mjs`.
- Documentação: `README.md`, `docs/COMPETENCIES.md` (novo).

Alterações anteriores foram preservadas. Nenhum commit, merge ou push.
