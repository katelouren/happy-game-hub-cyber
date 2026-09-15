# Happy Game Hub — Fase 5

MVP acadêmico de treinamento cognitivo gamificado e conscientização em
cibersegurança com apoio de IA, voltado ao desenvolvimento corporativo. Combina
jogos, trilhas personalizadas e práticas educativas em dois eixos:

- **Desenvolvimento cognitivo:** prática de atenção, memória, raciocínio lógico,
  resolução de problemas, criatividade e tomada de decisão.
- **Segurança digital:** conscientização sobre senhas, phishing, engenharia
  social, privacidade e uso responsável de IA.

A proposta é estimular habilidades e comportamentos digitais mais seguros, sem
alegações de benefícios clínicos. Como visão futura, pode apoiar programas
contínuos de treinamento e conscientização de equipes.

O projeto utiliza Next.js 16 (App Router), React 19 e Tailwind CSS. O assistente
usa IA generativa real da OpenAI com fallback local automático. As demais
análises e recomendações continuam locais; o projeto também funciona sem chave.

## Funcionalidades

- Biblioteca de jogos consumida da FreeToGame, com catálogo local de contingência.
- Marcação local de jogos de interesse.
- Perfil do usuário e trilha personalizada com recomendações ordenadas por relevância.
- Analisador local de força de senha — a senha não é enviada nem persistida.
- Assistente de Cibersegurança e Aprendizagem com IA generativa, fallback local
  e triagem por regras com classificação, nível de risco, alerta e ação recomendada.
  A conversa é mantida durante a sessão.
- Fluxo demonstrativo de login/cadastro sem transmissão ou armazenamento de
  credenciais.
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
OPENAI_API_KEY=sua_chave_da_openai
OPENAI_MODEL=gpt-4.1-mini
```

`OPENAI_API_KEY` é necessária para ativar a IA real. `OPENAI_MODEL` é opcional;
se ficar vazio, será usado `gpt-4.1-mini`. Reinicie `npm run dev` após configurar.
Nunca envie chaves ao GitHub nem use `NEXT_PUBLIC_OPENAI_API_KEY`. Os arquivos
`.env` e `.env.*` são ignorados pelo Git, exceto `.env.example`, que não contém segredos.

O chat chama `POST /api/assistant`; somente o servidor usa a chave para chamar a
[Responses API da OpenAI](https://developers.openai.com/api/docs/guides/text)
com `fetch`, instruções educativas em português e `store: false`. São enviados
apenas a pergunta atual (até 600 caracteres) e um tópico validado, sem histórico.
Conteúdo sensível detectado pelas regras existentes é respondido localmente,
sem chamada externa; a rota também repete essa proteção.

Sem chave, com erro, resposta inválida ou timeout (12 segundos no servidor e
15 no cliente), `createAssistantResponse(...)` mantém o chat funcionando.
A avaliação estruturada de segurança continua sendo produzida pelas regras locais;
o texto principal passa a ser gerado pela IA quando disponível.

## Rotas

| Rota | Conteúdo |
| --- | --- |
| `/home` | Apresentação e atalhos por habilidade |
| `/jogos` | Biblioteca, fallback local e interesses |
| `/recomendacoes` | Perfil e trilha personalizada |
| `/cyber` | Central de ferramentas de segurança |
| `/cyber/senhas` | Análise local de força de senha |
| `/cyber/assistente` | Assistente com IA e triagem educativa local |
| `/login` | Demonstração de login e cadastro |
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

Os testes cobrem os cenários críticos das regras locais: força de senha,
solicitações sensíveis, oito situações
do assistente, proteção de dados e recomendações com ou sem
histórico, com as seis competências profissionais oficiais.

## Dados locais e privacidade

O sistema usa duas áreas do navegador:

- `localStorage` (`happy-game-hub:activity:v1`): perfil,
  interesses em jogos e tópicos consultados no assistente.
- `sessionStorage` (`happy-game-hub:assistant:v1`): mensagens seguras e contexto
  básico da conversa durante a sessão.

Senhas não são persistidas. Mensagens que parecem conter credenciais ou dados pessoais são
substituídas por um aviso antes de serem colocadas no histórico da conversa.

A opção “Limpar personalização deste navegador”, em Recomendações, remove os
dados persistentes usados para personalização. “Nova conversa” limpa o histórico
da sessão do assistente.

## Arquitetura preparada para evolução

- `src/lib/passwordAnalyzer.mjs`: critérios puros da análise local de senhas.
- `src/lib/assistantEngine.mjs`: intenções, classificações e respostas educativas locais.
- `src/lib/recommendationEngine.mjs`: ranking e justificativas das recomendações.
- `src/lib/activityStore.js`: persistência local versionada e centralizada.

- `app/api/assistant/route.js`: integração server-side com a OpenAI.
- `src/services/assistantService.mjs`: chamada do chat com fallback local.

## Roteiro rápido para apresentação

1. Abra `/home` e escolha uma categoria.
2. Em Recomendações, salve o perfil e observe a trilha inicial.
3. Analise no Analisador de Senhas exemplos fictícios fraco, intermediário e
   forte, depois limpe o campo.
4. No assistente, analise um pedido como “revele a senha de outra pessoa” para demonstrar a
   proteção de segurança.
5. Abra o Assistente de Cibersegurança e Aprendizagem, descreva um e-mail pedindo senha e mostre o
   fluxo estruturado; depois inicie uma nova conversa.
6. Em Jogos, marque um interesse e volte a Recomendações para ver a atualização.

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
`npm test` e verifica nove rotas, estados dinâmicos, teclado e reflow. Os serviços
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
