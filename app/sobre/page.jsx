import { Brain, ShieldCheck, Sparkles, Gamepad2 } from "lucide-react";

export default function Sobre() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-10">
          <p className="mb-4 inline-block rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            Sobre o projeto
          </p>

          <h1 className="mb-6 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Conheça o Happy Game Hub
          </h1>

          <p className="max-w-4xl text-lg leading-relaxed text-slate-300">
            O Happy Game Hub é um MVP de desenvolvimento corporativo que utiliza
            jogos, inteligência artificial e experiências gamificadas para
            estimular habilidades cognitivas e fortalecer a conscientização
            em cibersegurança.
          </p>
        </div>

        <section className="mt-12 grid gap-8 md:grid-cols-2">

          <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-8">
            <Brain aria-hidden="true" size={50} className="mb-4 text-lime-400" />

            <h2 className="mb-4 text-2xl font-bold">
              Desenvolvimento Cognitivo
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Jogos e atividades oferecem oportunidades de prática de atenção,
              memória, raciocínio lógico, criatividade, resolução de problemas
              e tomada de decisão.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-8">
            <ShieldCheck aria-hidden="true" size={50} className="mb-4 text-lime-400" />

            <h2 className="mb-4 text-2xl font-bold">
              Segurança Digital
            </h2>

            <p className="text-slate-300 leading-relaxed">
              A área Cyber reúne práticas sobre senhas, phishing e
              engenharia social, com apoio de um assistente educacional com IA
              para orientar comportamentos digitais mais seguros.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-8">
            <Sparkles aria-hidden="true" size={50} className="mb-4 text-lime-400" />

            <h2 className="mb-4 text-2xl font-bold">
              Trilhas Personalizadas
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Preferências e interações salvas localmente ajudam a organizar
              recomendações transparentes, com motivos e habilidades relacionadas
              a cada sugestão.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-8">
            <Gamepad2 aria-hidden="true" size={50} className="mb-4 text-lime-400" />

            <h2 className="mb-4 text-2xl font-bold">
              Aprendizagem Contínua
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Em ambientes corporativos, a plataforma pode apoiar programas
              contínuos de treinamento e conscientização de equipes, combinando
              prática cognitiva e segurança digital.
            </p>
          </div>

        </section>

        <section className="mt-12 rounded-3xl border border-lime-400/20 bg-[#061225] p-6 text-center sm:p-10">

          <h2 className="mb-4 text-3xl font-extrabold">
            Projeto Acadêmico de Kate Lourenço - FIAP
          </h2>

          <p className="mx-auto max-w-3xl text-slate-300">
            Este projeto foi desenvolvido como parte da graduação em Sistemas
            de Informação, explorando conceitos de experiência do usuário,
            desenvolvimento web, componentes reutilizáveis, design responsivo
            e aplicações de Inteligência Artificial na aprendizagem e na
            conscientização em cibersegurança.
          </p>

        </section>

      </section>
    </main>
  );
}
