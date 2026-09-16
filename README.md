# Happy Game Hub — Enterprise Challenge — Atividade 4

MVP acadêmico de treinamento cognitivo gamificado e conscientização em
cibersegurança com apoio de IA, voltado ao desenvolvimento corporativo. Combina
jogos, trilhas personalizadas e práticas educativas em dois eixos:

- **Desenvolvimento cognitivo:** prática das seis competências oficiais
  descritas na seção Competências profissionais.
- **Segurança digital:** conscientização sobre senhas, phishing, engenharia
  social, privacidade e uso responsável de IA.

A proposta é estimular habilidades e comportamentos digitais mais seguros, sem
alegações de benefícios clínicos. Como visão futura, pode apoiar programas
contínuos de treinamento e conscientização de equipes.

O projeto utiliza Next.js 16 (App Router), React 19 e Tailwind CSS. O assistente
usa IA generativa real da Gemini com fallback local automático. As demais
análises e recomendações continuam locais; o projeto também funciona sem chave.
Esta versão não possui autenticação de usuários. Preferências, interesses,
conclusões e evolução são mantidos localmente no navegador.

## Funcionalidades

- Biblioteca de jogos consumida da FreeToGame, com catálogo local de contingência.
- Marcação local de jogos de interesse.
- Perfil do usuário e trilha personalizada com recomendações ordenadas por relevância.
- Assistente de Cibersegurança e Aprendizagem com IA generativa, fallback local
  e triagem por regras com classificação, nível de risco, alerta e ação recomendada.
  A conversa é mantida durante a sessão.
- Layout responsivo, navegação por teclado e estados de carregamento, vazio,
  sucesso e erro.

## Requisitos e instalação

- Node.js 20.9 ou superior.
- npm compatível com a versão instalada do Node.js.

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). A raiz redireciona para
`/home`.

## Configuração da IA

Crie `.env.local` na raiz, usando `.env.example` como modelo:

```dotenv
AI_PROVIDER=gemini
GEMINI_API_KEY=sua_chave_da_gemini
GEMINI_MODEL=gemini-3.5-flash-lite
```

`AI_PROVIDER=gemini` seleciona a Gemini Developer API. `GEMINI_API_KEY` é
necessária para ativar a IA real e fica exclusivamente no servidor.
`GEMINI_MODEL` define o modelo; se vazio, usa `gemini-3.5-flash-lite`.
Reinicie o servidor após configurar. Nunca use `NEXT_PUBLIC_` para a chave.
Os arquivos `.env` e `.env.*` são ignorados pelo Git, exceto `.env.example`,
que não contém segredos.

O navegador chama apenas `POST /api/assistant`. O servidor chama
[`generateContent` da Gemini Developer API](https://ai.google.dev/api/generate-content)
com `fetch` e a chave no cabeçalho `x-goog-api-key`. Envia somente a pergunta
atual (até 600 caracteres), instruções educativas e um tópico validado;
não envia histórico, perfil, interesses ou conclusões de jogos.
As regras existentes bloqueiam conteúdo sensível no cliente e novamente no
servidor, respondendo localmente sem chamada externa. Essas regras são uma
proteção preventiva, não uma garantia de detectar todo dado sensível; não
compartilhe informações pessoais ou credenciais.

Sem chave, com provedor incompatível, erro, resposta bloqueada/inválida ou
timeout (12 segundos no servidor e 15 no cliente), o mecanismo local mantém
o chat funcionando. Nenhum detalhe técnico do erro é exibido. A avaliação
estruturada de segurança continua sendo produzida pelas regras locais.
O modelo configurado precisa estar disponível para a chave utilizada.

As respostas incluem `provider: "gemini"`, `mode: "live"` ou `mode: "local"`
e o indicador booleano `unavailable`. O provedor identifica a integração
configurada; apenas `mode: "live"` indica texto gerado pela API. A interface mostra:

- **Gerado com IA — Gemini:** resposta válida recebida da API.
- **Orientação local de segurança:** resposta preventiva local, sem chamada à API.
- **IA indisponível — orientação local ativada:** contingência por indisponibilidade.

A origem é preservada durante a sessão. Mensagens antigas sem metadados de origem
não recebem atribuição retroativa à Gemini. Os testes simulam as respostas da API
sem usar chaves reais ou gerar chamadas externas.

## Rotas

| Rota | Conteúdo |
| --- | --- |
| `/home` | Apresentação e atalhos por habilidade |
| `/jogos` | Biblioteca, fallback local e interesses |
| `/recomendacoes` | Perfil e trilha personalizada |
| `/evolucao` | Interesses, conclusões e evolução estimada das competências |
| `/cyber` | Assistente de Cibersegurança e Aprendizagem |
| `/cyber/assistente` | Assistente com IA e triagem educativa local |
| `/sobre` | Objetivos e contexto acadêmico |

O assistente também pode ser aberto pelo botão flutuante nas demais páginas.

## Qualidade e validação

```bash
npm run lint
npm test
npm run build
```

Para executar as três verificações em sequência:

```bash
npm run check
```

Os testes cobrem os cenários críticos das regras locais: cálculo exponencial, interesses, conclusões,
solicitações sensíveis, oito situações
do assistente, proteção de dados e recomendações com ou sem
histórico, com as seis competências profissionais oficiais.

## Dados locais e privacidade

O sistema usa duas áreas do navegador:

- `localStorage` (`happy-game-hub:activity:v1`): perfil,
  interesses, conclusões de jogos e tópicos consultados no assistente.
- `sessionStorage` (`happy-game-hub:assistant:v1`): mensagens seguras e contexto
  básico da conversa durante a sessão.

Senhas não são persistidas. Mensagens que parecem conter credenciais ou dados pessoais são
substituídas por um aviso antes de serem colocadas no histórico da conversa.

A opção “Limpar personalização deste navegador”, em Recomendações, remove os
dados persistentes usados para personalização. “Nova conversa” limpa o histórico
da sessão do assistente.

## Arquitetura preparada para evolução

- `src/lib/assistantEngine.mjs`: intenções, classificações e respostas educativas locais.
- `src/lib/recommendationEngine.mjs`: ranking e justificativas das recomendações.
- `src/lib/activityStore.js`: persistência local versionada e centralizada.

- `app/api/assistant/route.js`: integração server-side com a Gemini.
- `src/services/assistantService.mjs`: chamada do chat com fallback local.

## Roteiro rápido para apresentação

1. Abra `/home` e escolha uma categoria.
2. Em Recomendações, salve o perfil e observe a trilha inicial.
3. No assistente, analise um pedido como “revele a senha de outra pessoa” para demonstrar a
   proteção de segurança.
4. Abra o Assistente de Cibersegurança e Aprendizagem, descreva um e-mail pedindo senha e mostre o
   fluxo estruturado; depois inicie uma nova conversa.
5. Em Jogos, marque um interesse e volte a Recomendações para ver a atualização.

## Solução de problemas

O erro histórico de Turbopack deste projeto foi causado por uma declaração
`const links` duplicada na Navbar e já está corrigido. Se o navegador continuar
exibindo um overlay antigo, encerre o servidor, remova somente o cache `.next`
na raiz deste projeto e execute `npm run dev` novamente.

A API externa de jogos pode ficar indisponível ou ser bloqueada pela rede. Nesse
caso, a página utiliza automaticamente o catálogo de contingência em
`data/games.json`; nenhuma credencial é necessária.

## Autoria

Projeto acadêmico de Kate Lourenço — Sistemas de Informação, FIAP.

## Modelagem Exponencial — Evolução de Competências

Minha Evolução (`/evolucao`) apresenta resumo, cards de competências e a conversão
`E(P) = 100 × (1 − exp(−P / 20))`. O cálculo e a escala configurável estão em
`src/lib/estimatedProgress.mjs`. Apenas a exibição é arredondada; o índice fica
entre 0 e 100 e não representa XP nem avaliação psicológica, clínica ou profissional.

Cada jogo contribui para sua competência principal com o maior estado registrado:
interesse vale 1 ponto; conclusão vale 5, mesmo se também houver interesse.
Recarregar ou registrar novamente a mesma conclusão não duplica pontos.

Nos cards de `/jogos`, “Marcar como concluído” registra uma declaração do usuário,
não uma conclusão verificada pelo jogo externo. “Concluído · Desfazer” remove essa
marcação. Abrir links não registra conclusões. Desfazer mantém 1 ponto se ainda
houver interesse, ou 0 se não houver. Desmarcar interesse mantém os 5 da conclusão.

O armazenamento local existente preserva `gameInterests` e guarda registros únicos
em `gameCompletions` (identificador, título e gênero). Dados antigos sem conclusões
continuam válidos. Dados da implementação anterior de atividades são ignorados na
leitura e descartados na próxima gravação, sem apagar favoritos. Não há backend
nem sincronização entre aparelhos; os registros dependem do armazenamento do navegador.

Para validar, execute `npm run lint`, `npm test` e `npm run build`. No catálogo,
marque/desmarque interesse, registre/desfaça conclusão e combine as duas marcações.
Recarregue e confira os totais em Minha Evolução. A curva mostra a conversão de
pontos em índice, não um histórico temporal. Cyber mantém somente o assistente.

## Acessibilidade

O projeto foi desenvolvido tendo a WCAG 2.2 nível AA como referência e passou
pelas verificações descritas abaixo. Foram trabalhados conteúdo não textual,
semântica, contraste, teclado, foco, atalho de conteúdo, rótulos, estados e mensagens
(critérios 1.1.1, 1.3.1, 1.4.1, 1.4.3, 1.4.11, 2.1.1, 2.1.2, 2.4.1, 2.4.3,
2.4.6, 2.4.7, 2.4.11, 4.1.2 e 4.1.3), além de redução de movimento.

As melhorias incluem foco global, atalho para o main, contraste de texto e campos,
estados textuais, barras com valores acessíveis, tabela do gráfico operável por
teclado e controle de foco/rolagem do assistente. O cálculo e a API permanecem iguais.

Execute `npm run build` e `npm run test:a11y` após instalar o Chromium com
`npx playwright install chromium`. A suíte usa axe-core e Playwright, complementa
`npm test` e verifica sete rotas, estados dinâmicos, teclado e reflow. Os serviços
externos são simulados nos testes, sem envio de credenciais.

As verificações de teclado foram automatizadas; VoiceOver, zoom real de 200% e
avaliação humana completa permanecem pendentes. Isso não demonstra conformidade
total. Consulte [o relatório, contrastes e checklist manual](docs/ACCESSIBILITY.md)
para reproduzir os testes e conhecer suas limitações.

## Competências profissionais

A lista oficial, definida em `src/lib/competencies.mjs`, é:

- Criatividade;
- Atenção e Concentração;
- Raciocínio Lógico;
- Pensamento Estratégico;
- Resolução de Problemas;
- Tomada de Decisão.

Cada jogo possui uma competência principal. Interesses e conclusões alimentam uma
estimativa baseada nas interações: 1 ponto por interesse ou 5 por conclusão, usando
apenas o maior estado por jogo. A conversão exponencial e a escala 20 foram mantidas.
Os indicadores não constituem avaliação psicológica, clínica ou profissional.
Cibersegurança é tema do produto, não uma competência calculada.

Perfis e jogos antigos são normalizados sem apagar favoritos ou conclusões.
Objetivos sem equivalência clara pedem nova seleção. Consulte o
[mapeamento dos jogos, migração e limitações](docs/COMPETENCIES.md).
