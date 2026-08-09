import { Brain, ShieldCheck, Sparkles, Gamepad2 } from "lucide-react";

export default function Sobre() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-6xl px-8 py-12">

        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-10">
          <p className="mb-4 inline-block rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            Sobre o projeto
          </p>

          <h1 className="mb-6 text-5xl font-extrabold">
            Conheça o Happy Game Hub
          </h1>

          <p className="max-w-4xl text-lg leading-relaxed text-slate-300">
            O Happy Game Hub é uma plataforma desenvolvida para ajudar pais e jogadores a encontrarem jogos alinhados aos seus
            objetivos de desenvolvimento cognitivo, emocional e criativo.
          </p>
        </div>

        <section className="mt-12 grid gap-8 md:grid-cols-2">

          <div className="rounded-3xl border border-slate-800 bg-[#061225] p-8">
            <Brain size={50} className="mb-4 text-lime-400" />

            <h2 className="mb-4 text-2xl font-bold">
              Desenvolvimento Cognitivo
            </h2>

            <p className="text-slate-300 leading-relaxed">
              A plataforma valoriza jogos capazes de estimular habilidades como
              raciocínio lógico, criatividade, resolução de problemas,
              planejamento e aprendizagem contínua.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#061225] p-8">
            <ShieldCheck size={50} className="mb-4 text-lime-400" />

            <h2 className="mb-4 text-2xl font-bold">
              Jogos Conscientes
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Nosso objetivo é incentivar uma relação saudável com os games,
              destacando experiências equilibradas e adequadas para diferentes
              faixas etárias.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#061225] p-8">
            <Sparkles size={50} className="mb-4 text-lime-400" />

            <h2 className="mb-4 text-2xl font-bold">
              Recomendação Inteligente
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Em versões futuras, recursos de Inteligência Artificial poderão
              analisar preferências e sugerir jogos personalizados para cada
              perfil de usuário.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#061225] p-8">
            <Gamepad2 size={50} className="mb-4 text-lime-400" />

            <h2 className="mb-4 text-2xl font-bold">
              Diversão com Propósito
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Acreditamos que os jogos podem ser ferramentas poderosas para
              entretenimento, aprendizagem e desenvolvimento pessoal.
            </p>
          </div>

        </section>

        <section className="mt-12 rounded-3xl border border-lime-400/20 bg-[#061225] p-10 text-center">

          <h2 className="mb-4 text-3xl font-extrabold">
            Projeto Acadêmico de Kate Lourenço - FIAP
          </h2>

          <p className="mx-auto max-w-3xl text-slate-300">
            Este projeto foi desenvolvido como parte da graduação em Sistemas
            de Informação, explorando conceitos de experiência do usuário,
            desenvolvimento web, componentes reutilizáveis, design responsivo
            e aplicações futuras de Inteligência Artificial.
          </p>

        </section>

      </section>
    </main>
  );
}