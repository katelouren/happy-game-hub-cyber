# Fase 6: Análise, Integração e Impacto

## Entrega e escopo

Projeto acadêmico individual de Kate Lourenço, Sistemas de Informação, FIAP.
A Fase 6 amplia o assistente existente com políticas demonstrativas da empresa
fictícia Nexa Solutions e orientação inicial sobre o ambiente de trabalho.
Recomendações, jogos, perfil, persistência local e evolução de competências
permanecem disponíveis.

## Organização do trabalho

Kate responde pelo planejamento, implementação, testes, documentação,
versionamento e apresentação. A sequência de dependências para reproduzir
a validação da entrega é:

1. Identificar a revisão do código com `git rev-parse HEAD`.
2. Instalar as dependências registradas no lockfile com `npm ci`.
3. Conferir os cenários e resultados esperados descritos neste documento e no README.
4. Executar testes funcionais e lint, corrigindo e retestando eventuais falhas.
5. Gerar o build e executar a suíte de acessibilidade em Chromium.
6. Demonstrar as funcionalidades e registrar os limites de cada verificação.

Esta sequência é um guia de reprodução. Não constitui um cronograma com datas
de implementação nem substitui o relatório acadêmico e o vídeo de apresentação.

## Evolução implementada

| Parte | Arquivo principal | Comportamento |
| --- | --- | --- |
| Políticas demonstrativas | `src/lib/companyContext.mjs` | Contexto da Nexa Solutions controlado pela aplicação |
| Orientação e triagem locais | `src/lib/assistantEngine.mjs` | Políticas de credenciais/dados, situações de trabalho e prioridade para risco imediato |
| Integração com IA | `app/api/assistant/route.js` | Instruções corporativas no servidor, separadas da mensagem do usuário |
| Contingência do cliente | `src/services/assistantService.mjs` | Orientação local quando a resposta externa falha ou é rejeitada |
| Interface | `app/cyber/assistente/page.jsx` e `src/components/AssistantChat.jsx` | Escopo, limites e identificação da origem das respostas |

O navegador envia a mensagem e um tópico validado para `POST /api/assistant`.
O servidor reúne instruções educativas e contexto corporativo em
`systemInstruction`, mantendo a pergunta em `contents`. A resposta externa passa
pelas proteções locais. Sem uma resposta aceita, o assistente utiliza contingência
local identificada. Os filtros são heurísticos e não garantem proteção absoluta.

## Cenários para demonstração e reteste

| Cenário | Resultado esperado | Cobertura automatizada |
| --- | --- | --- |
| Envio de senha pelo WhatsApp a um colega | Não compartilhar, usar acesso individual e canais oficiais | `tests/assistantEngine.test.mjs` |
| Planilha confidencial enviada a e-mail pessoal | Orientar ambiente corporativo autorizado | `tests/assistantEngine.test.mjs` |
| Piadas ofensivas e humilhação recorrente | Reconhecer sinais, orientar registro e RH/SST, sem diagnóstico | `tests/assistantEngine.test.mjs` |
| Feedback sobre relatório com erros | Não classificar automaticamente como assédio | `tests/assistantEngine.test.mjs` |
| Ameaça imediata combinada com pedido de senha | Priorizar integridade física e preservar orientação de credenciais | `tests/assistantEngine.test.mjs` |
| Tentativa de alterar políticas pela pergunta | Orientação local, sem adotar a regra inventada | `tests/assistantApi.test.mjs` |
| Resposta com negação, como “não pode compartilhar senha” | Preservar orientação segura sem bloqueio indevido | `tests/assistantApi.test.mjs` |
| Gemini sem chave ou indisponível | Resposta local com origem e contingência identificadas | `tests/assistantApi.test.mjs` |
| Relato de trabalho enviado pelo teclado em contingência | Foco, histórico e orientação preservados após recarregar | `tests/accessibility/pages.spec.mjs` |

Os exemplos completos A–G estão no [README](../README.md#revisão-manual-da-fase-6).
As asserções dos testes registram os resultados esperados e fazem a comparação
automática com o resultado obtido. A execução funcional abaixo aprovou os 88 testes.
Uma demonstração manual com IA real exige configuração e revisão próprias.

## Verificação técnica

Revisão documental de 20/10/2026, sobre o código da Fase 6 do commit
[`0078f45`](https://github.com/katelouren/happy-game-hub-cyber/commit/0078f45854dc347b0e62a99da24a3b6b3a9e7ea0).

| Verificação | Resultado desta revisão |
| --- | --- |
| `npm ci --ignore-scripts --no-audit --no-fund` | Dependências instaladas a partir do lockfile |
| `npm test` | 88 aprovados, zero falhas |
| `npm run lint` | Aprovado |
| `npm run build` | Aprovado |
| `npm run test:a11y -- --list` | 16 testes de navegador definidos |
| Execução dos 16 testes de acessibilidade | Não reexecutada: instalação do Chromium falhou por download truncado no ambiente |
| Chamada real à Gemini | Não executada; testes funcionais utilizam respostas simuladas |

Os 16 testes listados não representam 16 aprovações nesta revisão. Não se soma
essa contagem aos 88 aprovados para afirmar 104 verificações executadas aqui.
Uma execução anterior registrada em outro relatório deve manter sua própria data
e evidência. O [relatório de acessibilidade](ACCESSIBILITY.md) preserva o histórico
e as pendências de avaliação humana.

Para completar a validação em um ambiente com Chromium disponível:

```sh
npm ci
npm run check
npx playwright install chromium
npm run test:a11y
```

O servidor de produção dos testes usa a porta 3107. Para utilizar um Chrome já
instalado, configure `PLAYWRIGHT_EXECUTABLE_PATH` conforme ACCESSIBILITY.md.

## Limites e próximos passos

As políticas e a empresa são fictícias. O assistente oferece orientação inicial,
sem diagnóstico, conclusão jurídica, avaliação formal de riscos ou substituição
de RH, SST, compliance, GRO ou PGR. Não há contatos reais cadastrados.

Preferências e evolução ficam no navegador. Não há autenticação, banco de dados,
painel de RH ou isolamento de ambientes por organização. Esses recursos são
possibilidades futuras. A proteção de dados e o filtro de saída usam heurísticas,
que podem falhar. A avaliação humana de acessibilidade e a validação semântica
com IA real permanecem necessárias.
