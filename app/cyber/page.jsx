import Link from "next/link";
import {
  ShieldCheck,
  KeyRound,
  MessageSquareWarning,
  Bot,
  ArrowRight,
} from "lucide-react";

const ferramentas = [
  {
    icon: KeyRound,
    titulo: "Analisador de Senhas",
    descricao:
      "Avalie a força de uma senha e receba recomendações para torná-la mais segura.",
    href: "/cyber/senhas",
  },
  {
    icon: MessageSquareWarning,
    titulo: "Avaliador de Prompts",
    descricao:
      "Analise prompts, identifique possíveis riscos e pratique uma definição de escopo mais segura.",
    href: "/cyber/prompts",
  },
  {
    icon: Bot,
    titulo: "Assistente de Segurança",
    descricao:
      "Converse sobre a plataforma, jogos, prompts, IA e boas práticas de segurança digital.",
    href: "/cyber/assistente",
  },
];

export default function Cyber() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-10">
          <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            <ShieldCheck size={16} />
            Segurança Digital
          </p>

          <h1 className="mb-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-5xl">
            Segurança digital também faz parte do jogo.
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
            Explore ferramentas educativas sobre senhas, uso responsável de
            Inteligência Artificial e tomada de decisão diante de situações de
            risco digital, inspiradas nos temas trabalhados na mentoria da Palo
            Alto Networks.
          </p>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {ferramentas.map((ferramenta) => {
            const Icon = ferramenta.icon;

            return (
              <Link
                key={ferramenta.titulo}
                href={ferramenta.href}
                className="group rounded-3xl border border-slate-800 bg-[#061225] p-6 transition hover:border-lime-400/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 sm:p-8"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-lime-400/20 bg-[#020817]">
                  <Icon size={30} className="text-lime-400" />
                </div>

                <h2 className="mb-3 text-2xl font-extrabold">
                  {ferramenta.titulo}
                </h2>

                <p className="mb-6 leading-relaxed text-slate-400">
                  {ferramenta.descricao}
                </p>

                <span className="flex items-center gap-2 font-bold text-lime-400">
                  Acessar ferramenta
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </Link>
            );
          })}
        </section>

        <section className="mt-10 rounded-3xl border border-lime-400/20 bg-[#061225] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck
              size={36}
              className="mt-1 shrink-0 text-lime-400"
            />

            <div>
              <h2 className="mb-3 text-2xl font-extrabold">
                Segurança aplicada ao Happy Game Hub
              </h2>

              <p className="max-w-4xl leading-relaxed text-slate-300">
                Esta área foi desenvolvida a partir dos conceitos discutidos
                durante a mentoria de Cybersecurity da Palo Alto Networks,
                incorporando boas
                práticas relacionadas à complexidade de senhas, uso responsável
                de Inteligência Artificial, definição adequada de prompts e
                análise de situações de risco.
              </p>
            </div>
          </div>
        </section>

      </section>
    </main>
  );
}
