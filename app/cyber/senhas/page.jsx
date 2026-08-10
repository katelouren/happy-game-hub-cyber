"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Eraser,
} from "lucide-react";
import { analyzePassword } from "@/lib/passwordAnalyzer.mjs";

export default function Senhas() {
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const analysis = useMemo(() => analyzePassword(senha), [senha]);
  const pontuacao = analysis.score;
  const nivel = analysis.level;

  const larguraBarra = `${pontuacao}%`;

  const listaCriterios = analysis.criteria;

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-10">
          <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            <ShieldCheck size={16} />
            Segurança de Senhas
          </p>

          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Analisador de Senhas
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
            Verifique a força de uma senha com base em critérios de comprimento,
            variedade de caracteres e complexidade.
          </p>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-[#061225] p-5 sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <KeyRound className="text-lime-400" />
              Teste sua senha
            </h2>

            <label
              htmlFor="password-analysis-input"
              className="mb-2 block font-semibold text-slate-200"
            >
              Digite uma senha
            </label>

            <div className="flex items-center rounded-xl border border-slate-700 bg-[#020817] pl-4 pr-1 transition focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-400/20">
              <input
                id="password-analysis-input"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="Digite uma senha para analisar"
                autoComplete="new-password"
                spellCheck="false"
                maxLength={128}
                className="w-full bg-transparent py-4 text-slate-300 outline-none"
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-lime-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={mostrarSenha}
              >
                {mostrarSenha ? (
                  <EyeOff aria-hidden="true" size={22} />
                ) : (
                  <Eye aria-hidden="true" size={22} />
                )}
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-400">
              <span>{senha.length}/128 caracteres</span>
              <button
                type="button"
                onClick={() => {
                  setSenha("");
                  setMostrarSenha(false);
                }}
                disabled={!senha}
                className="inline-flex items-center gap-2 rounded px-2 py-1 font-semibold transition hover:text-lime-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Eraser aria-hidden="true" size={16} />
                Limpar
              </button>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold text-slate-200">
                  Força da senha
                </span>

                <span aria-live="polite" className="font-extrabold text-lime-400">
                  {nivel}
                </span>
              </div>

              <div
                role="progressbar"
                aria-label="Força estimada da senha"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pontuacao}
                aria-valuetext={`${nivel}: ${pontuacao} de 100`}
                className="h-3 overflow-hidden rounded-full bg-slate-800"
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    pontuacao >= 80
                      ? "bg-lime-400"
                      : pontuacao >= 50
                        ? "bg-amber-400"
                        : "bg-red-400"
                  }`}
                  style={{ width: larguraBarra }}
                />
              </div>

              <div className="mt-3 text-sm text-slate-400">
                Pontuação: {pontuacao}/100
              </div>
            </div>
          </div>

          <div
            aria-live="polite"
            className="rounded-3xl border border-slate-800 bg-[#061225] p-5 sm:p-8"
          >
            <h2 className="mb-6 text-2xl font-bold">
              Critérios de segurança
            </h2>

            <div className="space-y-4">
              {listaCriterios.map((criterio) => (
                <div
                  key={criterio.label}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#020817] p-4"
                >
                  {criterio.valid ? (
                    <CheckCircle2 aria-hidden="true" className="text-lime-400" size={22} />
                  ) : (
                    <XCircle aria-hidden="true" className="text-slate-500" size={22} />
                  )}

                  <span
                    className={
                      criterio.valid
                        ? "text-slate-200"
                        : "text-slate-400"
                    }
                  >
                    {criterio.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-lime-400/20 bg-[#020817] p-5">
              <p className="font-semibold text-white">
                Recomendação
              </p>

              <p className="mt-2 leading-relaxed text-slate-400">
                {analysis.recommendation}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-[#061225] p-5 sm:p-8">
          <h2 className="mb-3 text-2xl font-bold">
            Como esta análise funciona?
          </h2>

          <p className="max-w-4xl leading-relaxed text-slate-300">
            O analisador utiliza regras em JavaScript para verificar critérios
            de complexidade. A senha digitada não é enviada para servidores nem
            armazenada pela aplicação nesta versão.
          </p>
        </section>
      </section>
    </main>
  );
}
