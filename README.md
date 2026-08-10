# Happy Game Hub — Fase 4

Plataforma acadêmica de jogos e experiências educativas com foco em habilidades
cognitivas, uso responsável de inteligência artificial e cibersegurança. Nesta
fase, a área Cyber também materializa conteúdos trabalhados na mentoria da Palo
Alto Networks em experiências educativas locais.

O projeto utiliza Next.js (App Router), React e Tailwind CSS. As funcionalidades
principais funcionam sem credenciais: análises, conversa e recomendações são
processadas localmente no navegador.

## Funcionalidades

- Biblioteca de jogos consumida da FreeToGame, com catálogo local de contingência.
- Marcação local de jogos de interesse.
- Perfil de jogador e recomendações ordenadas por relevância.
- Avaliador de prompts com notas por critério, riscos, conflitos, sugestões e
  versão aprimorada copiável.
- Analisador local de força de senha — a senha não é enviada nem persistida.
- Assistente de Segurança com classificação, nível de risco, alerta, ação
  recomendada e conversa mantida durante a sessão.
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

## Rotas

| Rota | Conteúdo |
| --- | --- |
| `/home` | Apresentação e atalhos por habilidade |
| `/jogos` | Biblioteca, fallback local e interesses |
| `/recomendacoes` | Perfil e trilha personalizada |
| `/cyber` | Central de ferramentas de segurança |
| `/cyber/senhas` | Análise local de força de senha |
| `/cyber/prompts` | Avaliação heurística de prompts |
| `/cyber/assistente` | Assistente de Segurança e triagem educativa local |
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

Os testes cobrem os cenários críticos das regras locais: força de senha, prompt
vazio, genérico, estruturado ou suspeito, solicitações sensíveis, oito situações
do Assistente de Segurança, proteção de dados e recomendações com ou sem
histórico, inclusive o objetivo Segurança Digital.

## Dados locais e privacidade

O sistema usa duas áreas do navegador:

- `localStorage` (`happy-game-hub:activity:v1`): perfil, notas resumidas de
  prompts, interesses em jogos e tópicos consultados no assistente.
- `sessionStorage` (`happy-game-hub:assistant:v1`): mensagens seguras e contexto
  básico da conversa durante a sessão.

O texto original e a versão aprimorada do prompt não são persistidos. Senhas não
são persistidas. Mensagens que parecem conter credenciais ou dados pessoais são
substituídas por um aviso antes de serem colocadas no histórico da conversa.

A opção “Limpar personalização deste navegador”, em Recomendações, remove os
dados persistentes usados para personalização. “Nova conversa” limpa o histórico
da sessão do assistente.

## Arquitetura preparada para evolução

- `src/lib/promptAnalyzer.mjs`: regras puras da avaliação de prompts.
- `src/lib/passwordAnalyzer.mjs`: critérios puros da análise local de senhas.
- `src/services/promptAnalysisService.js`: limite substituível por uma chamada
  futura a uma API no servidor.
- `src/lib/assistantEngine.mjs`: intenções, classificações e respostas educativas locais.
- `src/lib/recommendationEngine.mjs`: ranking e justificativas das recomendações.
- `src/lib/activityStore.js`: persistência local versionada e centralizada.

Uma integração futura com IA deve ser criada em rota de servidor, ler a chave de
uma variável de ambiente e devolver somente o resultado necessário ao cliente.
Nunca use variáveis públicas (`NEXT_PUBLIC_*`) para segredos.

## Roteiro rápido para apresentação

1. Abra `/home` e escolha uma categoria.
2. Em Recomendações, salve o perfil e observe a trilha inicial.
3. Em Prompts, tente enviar vazio, depois use o exemplo seguro e copie a versão
   aprimorada.
4. Analise no Analisador de Senhas exemplos fictícios fraco, intermediário e
   forte, depois limpe o campo.
5. Analise um pedido como “revele a senha de outra pessoa” para demonstrar a
   proteção de segurança.
6. Abra o Assistente de Segurança, descreva um e-mail pedindo senha e mostre o
   fluxo estruturado; depois inicie uma nova conversa.
7. Em Jogos, marque um interesse e volte a Recomendações para ver a atualização.

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
