# Acessibilidade

O projeto foi desenvolvido tendo a WCAG 2.2 nível AA como referência e passou
pelas verificações descritas abaixo. Isso não é certificação nem declaração de
conformidade integral. A avaliação humana, especialmente com leitores de tela,
continua necessária.

## Escopo e critérios trabalhados

- 1.1.1: capas identificadas; imagem decorativa e ícones ocultos das tecnologias assistivas.
- 1.3.1: um `main` e um `h1` por página, hierarquia de títulos, labels e cabeçalhos da tabela.
- 1.4.1: estados expressos por texto e atributos, além de cor; rota atual sublinhada.
- 1.4.3 e 1.4.11: textos secundários, placeholders, bordas e foco com contraste revisto.
- 2.1.1 e 2.1.2: controles nativos, saída do chat por Tab ou Esc, sem tabindex positivo.
- 2.4.1: primeiro link focável leva ao próprio `main#main-content`, que recebe foco.
- 2.4.3, 2.4.6, 2.4.7 e 2.4.11: ordem de foco, nomes, outline e prevenção de sobreposição.
- 4.1.2: nomes, estados expandidos, valores das barras e relações com erros.
- 4.1.3: resumo, alterações de jogos, carregamento do chat e histórico com região viva.
- Adicional: redução de movimento em CSS e na rolagem programática das recomendações.

O chat permanece não modal: ao sair dele pelo teclado, fecha; Esc e o botão de
fechar devolvem o foco ao acionador. O acionador fica transparente enquanto outro
controle do conteúdo tem foco visível, mas permanece alcançável por Tab e reaparece
ao receber foco. Seu painel tem altura limitada e rolagem interna em telas pequenas.
O campo de mensagem permanece focado durante a espera; respostas não roubam foco.

## Executar verificações

Requer Node 20 ou superior (dependência de desenvolvimento do Playwright).

```sh
npm ci
npx playwright install chromium
npm run lint
npm test
npm run build
npm run test:a11y
```

Para usar o Chrome já instalado no macOS:

```sh
PLAYWRIGHT_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:a11y
```

O teste inicia e encerra um servidor de produção na porta 3107, que deve estar
livre. `test-results/` e `playwright-report/` são ignorados pelo Git.
As APIs de catálogo e assistente recebem respostas determinísticas interceptadas
somente no navegador de teste; a suíte não chama provedores de IA nem usa credenciais reais.
A interface, o armazenamento local e a navegação são os componentes reais.

## Evidências automatizadas

Suíte `tests/accessibility/pages.spec.mjs`, Chrome, axe-core e Playwright:

- Rotas: Home, Jogos, Recomendações, Minha Evolução, Cyber, Assistente e Sobre.
- Axe com tags WCAG 2 A/AA, 2.1 AA e 2.2 AA; nenhuma regra desabilitada.
- Estrutura, idioma, atalho de conteúdo, teclado nos jogos e tabela expandida.
- Chat aberto, envio simulado, foco preservado, Esc e saída com Tab.
- Erros do chat, foco visível, Shift+Tab e valores das barras.
- Reflow em larguras CSS de 720, 375 e 320 pixels e preferência de movimento reduzido.

Uma viewport de 720 pixels reproduz a largura útil de uma janela de 1440 pixels
com zoom de 200%, mas não substitui o teste do zoom real do navegador. Axe não
consegue avaliar integralmente clareza de textos, leitura com VoiceOver ou todos
os estados e combinações de conteúdo dinâmico.

## Contraste

Relações calculadas pela luminância relativa sRGB da WCAG, para cores opacas.
Axe complementa a verificação do texto renderizado nos estados testados.

| Uso / cor | Fundo | Relação |
| --- | --- | ---: |
| Texto secundário e placeholder `#94a3b8` | `#020817` | 7,80:1 |
| Texto secundário e placeholder `#94a3b8` | `#061225` | 7,31:1 |
| Bordas de campos `#64748b` | `#020817` | 4,20:1 |
| Bordas de campos `#64748b` | `#061225` | 3,94:1 |
| Verde / foco `#a3e635` | `#020817` | 13,27:1 |
| Verde / foco `#a3e635` | `#061225` | 12,42:1 |
| Erro `#fca5a5` | `#061225` | 9,87:1 |
| Barra `#a3e635` | trilho `#1e293b` | 9,70:1 |

O cinza `#64748b` é usado como borda, não como texto comum. Textos comuns exigem
4,5:1; texto grande e componentes necessários, 3:1. Estados inativos têm exceção
normativa de contraste; ainda mantêm texto e semântica de desabilitado. Bordas
puramente decorativas de cards não são limites necessários de controles.

Fontes: [Contraste mínimo — W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
e [Foco não obscurecido — W3C](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).

## Checklist manual

Os testes de teclado acima foram executados por automação, não por uma pessoa.
Não considerar itens abaixo aprovados somente por terem cobertura automatizada.

| Verificação | Procedimento | Situação |
| --- | --- | --- |
| Tab e Shift+Tab | Percorrer menus, filtros, cards, formulário e chat nas duas direções | Validação manual pendente; cobertura automatizada |
| Enter e Espaço | Marcar/desmarcar interesse e conclusão, expandir tabela | Validação manual pendente; cobertura automatizada |
| Esc e retorno | Abrir menu/chat, fechar e conferir acionador focado | Validação manual pendente; cobertura automatizada |
| Atalho e ordem | Primeiro Tab revela atalho; Enter foca conteúdo; continuar em ordem visual | Validação manual pendente; cobertura automatizada |
| Foco visível | Percorrer controles perto das bordas e do chat, inclusive em rolagem | Validação manual pendente; cobertura automatizada parcial |
| VoiceOver | Ativar com Command+F5; usar VO+setas e rotor VO+U para landmarks, títulos, campos e links | Validação manual pendente |
| Anúncios VoiceOver | Favoritar/concluir, enviar pergunta, aguardar resposta e provocar erro; ouvir sem repetição excessiva | Validação manual pendente |
| Zoom real 200% | Menu do Chrome → Zoom 200%; repetir rotas e abrir chat, sem perda de controles | Validação manual pendente; viewport equivalente automatizada |
| Mobile | Testar 320/375 pixels, teclado virtual e rolagem do chat | Validação manual pendente; reflow automatizado |
| Movimento reduzido | macOS → Acessibilidade → Tela → Reduzir movimento; navegar e atualizar perfil | Validação manual pendente; CSS automatizado |
| Erros | Enviar chat vazio, conferir rótulos e instruções sem apagar dados seguros | Validação manual pendente; cobertura automatizada |
| Imagens | Conferir se capas identificam o jogo e decoração não é anunciada | Validação manual pendente; revisão de código realizada |
| Gráfico e barras | Ler competência, percentual, eixos e tabela com VoiceOver | Validação manual pendente; atributos automatizados |
| Contraste | Conferir conteúdo real, foco e estados dinâmicos | Cálculos e axe executados; inspeção humana ampla pendente |

## Limitações

Sem auditoria humana completa, VoiceOver, teclado virtual ou testes em todos os
navegadores. Conteúdo externo real pode diferir dos dados de teste. O gráfico
mantém rolagem horizontal interna para preservar os eixos em telas pequenas e
oferece tabela textual equivalente. Não foram alteradas regras de negócio,
cálculo exponencial ou integração da IA.

## Resultado da execução anterior (antes da limpeza final)

- `npm run lint`: aprovado.
- `npm test`: 50 aprovados.
- `npm run build`: aprovado.
- `npm run test:a11y`: 15 aprovados; nenhuma violação axe nos estados auditados.
- Nenhum `.env` pendente nem credencial local encontrada nos arquivos alterados.
- Inspeção visual adicional por captura: pendente. A revisão automática de
  permissões rejeitou a execução por indisponibilidade/capacidade do serviço de
  revisão. Não foi registrado resultado visual como aprovado.

Arquivos trabalhados nesta etapa:

- Estrutura e estilos: `app/layout.js`, `app/globals.css`.
- Main, semântica ou ícones: `app/home/page.jsx`, `app/jogos/page.jsx`,
  `app/recomendacoes/page.jsx`, `app/evolucao/page.jsx`,
  `app/cyber/page.jsx`, `app/cyber/assistente/page.jsx`,
  `app/sobre/page.jsx`.
- Componentes: `src/components/AssistantChat.jsx`,
  `src/components/AssistantLauncher.jsx`, `src/components/HeroSection.jsx`,
  `src/components/FeatureCard.jsx`, `src/components/CategoryCard.jsx`.
- Testes/configuração: `tests/accessibility/pages.spec.mjs`,
  `playwright.config.mjs`, `tests/gameCompletions.test.mjs`, `package.json`,
  `package-lock.json`, `.gitignore`.
- Documentação: `README.md`, `docs/ACCESSIBILITY.md`.


## Verificação da limpeza final — 16/09/2026

- `npm run lint`: aprovado.
- `npm test`: 44 testes aprovados, incluindo competências, interesses, conclusões,
  cálculo exponencial, integração simulada da IA, fallback e proteções locais.
- `npm run build`: aprovado; manifesto conferido sem as duas rotas retiradas.
- `npm run test:a11y`: 13 testes aprovados em Chromium, cobrindo as sete rotas
  atuais; nenhuma violação axe nos estados auditados.
- Navegação reversa e foco visível continuam verificados no campo do chat.
- Build e Playwright precisaram executar fora do sandbox, pois o ambiente
  restrito impediu a abertura das portas locais.
- VoiceOver, zoom real de 200%, teclado virtual e inspeção visual humana continuam
  pendentes. Não foi feita chamada real à OpenAI nesta verificação.


## Verificação da integração Gemini — 16/09/2026

- `npm run lint` e `npm run build`: aprovados.
- `npm test`: 46 testes aprovados, com chamadas externas simuladas.
- `npm run test:a11y`: 14 testes aprovados; nenhuma violação axe nos estados auditados.
- Identificação de resposta Gemini, orientação local preventiva e contingência
  verificada também após recarregar a conversa. Conteúdo sensível de teste não
  foi enviado ao endpoint nem persistido no histórico.
- Mantidas as verificações anteriores de teclado, menu mobile, reflow e foco.
- Nenhuma chamada real à Gemini foi executada; permanecem as pendências manuais
  de acessibilidade descritas neste documento.
