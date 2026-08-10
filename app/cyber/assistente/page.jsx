import Link from "next/link";
import {
  ArrowRight,
  Bot,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import AssistantChat from "@/components/AssistantChat";

export const metadata = {
  title: "Assistente de Segurança",
  description:
    "Assistente educativo para classificar situações de segurança digital e orientar ações seguras.",
};

export default function AssistentePage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-10">
          <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            <ShieldCheck size={16} aria-hidden="true" />
            Orientação segura
          </p>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-4xl font-extrabold md:text-5xl">
                <Bot className="shrink-0 text-lime-400" aria-hidden="true" />
                Assistente de Segurança
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                Descreva uma situação digital e receba uma triagem educativa com
                classificação, nível de risco, alerta e ação recomendada. Você
                também pode tirar dúvidas sobre o Happy Game Hub, jogos, prompts e
                inteligência artificial.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-lime-400/20 bg-[#020817] px-4 py-3 text-sm text-slate-300">
              <Sparkles size={18} className="shrink-0 text-lime-400" aria-hidden="true" />
              Análise local, sem envio para serviços externos
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <AssistantChat pathname="/cyber/assistente" />

          <aside className="space-y-5" aria-label="Informações sobre o assistente">
            <div className="rounded-3xl border border-lime-400/20 bg-[#061225] p-6">
              <LockKeyhole size={28} className="text-lime-400" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold">Converse com segurança</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Descreva situações de forma genérica. Nunca informe senhas, CPF,
                e-mail, tokens, números de cartão ou outras credenciais.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6">
              <h2 className="text-lg font-bold">Como funciona</h2>
              <ol className="mt-3 space-y-2 text-sm text-slate-400">
                <li>1. Situação relatada</li>
                <li>2. Classificação educativa</li>
                <li>3. Nível de risco</li>
                <li>4. Alerta principal</li>
                <li>5. Ação recomendada</li>
              </ol>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6">
              <h2 className="text-lg font-bold">Limites da ferramenta</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                A classificação usa heurísticas locais e não é um detector
                infalível. Para um incidente real, procure o suporte do serviço
                afetado ou um profissional qualificado.
              </p>
            </div>

            <nav
              aria-label="Próximas atividades"
              className="rounded-3xl border border-slate-800 bg-[#061225] p-6"
            >
              <h2 className="text-lg font-bold">Continue aprendendo</h2>
              <div className="mt-4 space-y-3">
                <Link
                  href="/cyber/prompts"
                  className="flex items-center justify-between gap-3 rounded-lg text-sm font-bold text-lime-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
                >
                  Avaliar um prompt
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link
                  href="/recomendacoes"
                  className="flex items-center justify-between gap-3 rounded-lg text-sm font-bold text-lime-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
                >
                  Ver recomendações
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      </section>
    </main>
  );
}
