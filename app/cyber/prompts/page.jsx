"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  Clipboard,
  Eraser,
  LoaderCircle,
  MessageSquareWarning,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  XCircle,
} from "lucide-react";
import { recordPromptAnalysis } from "@/lib/activityStore";
import { requestPromptAnalysis } from "@/services/promptAnalysisService";

const EXAMPLE_PROMPT =
  "Explique cinco boas práticas para criação de senhas fortes, considerando usuários iniciantes. Apresente a resposta em uma lista objetiva, com exemplos fictícios, e não solicite nem utilize dados pessoais.";

function scoreColor(score) {
  if (score >= 70) return "bg-lime-400";
  if (score >= 50) return "bg-amber-400";
  return "bg-red-400";
}

export default function Prompts() {
  const [prompt, setPrompt] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("idle");
  const analysisRequest = useRef(0);

  async function handleAnalyze(event) {
    event.preventDefault();
    setError("");
    setCopyStatus("idle");

    if (!prompt.trim()) {
      setAnalysis(null);
      setStatus("error");
      setError("Digite ou cole um prompt antes de solicitar a análise.");
      return;
    }

    const requestId = analysisRequest.current + 1;
    analysisRequest.current = requestId;
    setAnalysis(null);
    setStatus("loading");

    try {
      const nextAnalysis = await requestPromptAnalysis(prompt);
      if (requestId !== analysisRequest.current) return;

      setAnalysis(nextAnalysis);
      recordPromptAnalysis(nextAnalysis);
      setStatus("success");
    } catch (analysisError) {
      if (requestId !== analysisRequest.current) return;

      setAnalysis(null);
      setStatus("error");
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : "Não foi possível analisar o prompt. Tente novamente.",
      );
    }
  }

  function handleClear() {
    analysisRequest.current += 1;
    setPrompt("");
    setAnalysis(null);
    setStatus("idle");
    setError("");
    setCopyStatus("idle");
  }

  async function handleCopy() {
    if (!analysis?.improvedPrompt) return;

    try {
      await navigator.clipboard.writeText(analysis.improvedPrompt);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  }

  function handlePromptChange(event) {
    analysisRequest.current += 1;
    setPrompt(event.target.value);
    setAnalysis(null);
    setStatus("idle");
    setError("");
    setCopyStatus("idle");
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-10">
          <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            <ShieldCheck aria-hidden="true" size={16} />
            Segurança em IA
          </p>

          <h1 className="mb-4 text-3xl font-extrabold sm:text-4xl md:text-5xl">
            Avaliador de Prompts
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
            Analise clareza, contexto, objetivo, formato e segurança. A avaliação
            acontece localmente e o texto digitado não é armazenado.
          </p>
        </div>

        <section
          aria-labelledby="prompt-form-title"
          className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <form
            onSubmit={handleAnalyze}
            className="rounded-3xl border border-slate-800 bg-[#061225] p-5 sm:p-8"
          >
            <h2
              id="prompt-form-title"
              className="mb-6 flex items-center gap-3 text-2xl font-bold"
            >
              <MessageSquareWarning
                aria-hidden="true"
                className="shrink-0 text-lime-400"
              />
              Digite seu prompt
            </h2>

            <label htmlFor="prompt-input" className="block">
              <span className="mb-2 block font-semibold text-slate-200">
                Prompt para análise
              </span>

              <textarea
                id="prompt-input"
                value={prompt}
                onChange={handlePromptChange}
                placeholder="Exemplo: explique boas práticas de segurança em uma lista com cinco itens para usuários iniciantes."
                rows={11}
                aria-describedby="prompt-counter prompt-error"
                aria-invalid={Boolean(error)}
                className="w-full resize-y rounded-xl border border-slate-700 bg-[#020817] p-4 text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
              />
            </label>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-400">
              <span id="prompt-counter">{prompt.length} caracteres</span>
              <button
                type="button"
                onClick={() => {
                  analysisRequest.current += 1;
                  setPrompt(EXAMPLE_PROMPT);
                  setAnalysis(null);
                  setStatus("idle");
                  setError("");
                  setCopyStatus("idle");
                }}
                className="rounded-md px-2 py-1 font-semibold text-lime-400 transition hover:bg-lime-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
              >
                Usar exemplo seguro
              </button>
            </div>

            {error && (
              <div
                id="prompt-error"
                role="alert"
                className="mt-4 flex items-start gap-3 rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200"
              >
                <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0" size={19} />
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-4 font-extrabold text-slate-950 transition hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 disabled:cursor-wait disabled:opacity-70"
              >
                {status === "loading" ? (
                  <LoaderCircle aria-hidden="true" className="animate-spin" size={20} />
                ) : (
                  <WandSparkles aria-hidden="true" size={20} />
                )}
                {status === "loading" ? "Analisando..." : "Analisar prompt"}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={!prompt && !analysis && !error}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-4 font-bold text-slate-200 transition hover:border-lime-400 hover:text-lime-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Eraser aria-hidden="true" size={19} />
                Limpar
              </button>
            </div>
          </form>

          <div
            aria-live="polite"
            aria-busy={status === "loading"}
            className="rounded-3xl border border-slate-800 bg-[#061225] p-5 sm:p-8"
          >
            <h2 className="mb-6 text-2xl font-bold">Resultado da análise</h2>

            {status === "loading" ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-800 bg-[#020817] p-8 text-center">
                <LoaderCircle
                  aria-hidden="true"
                  className="mb-4 animate-spin text-lime-400"
                  size={42}
                />
                <p className="font-bold">Verificando os critérios...</p>
                <p className="mt-2 text-sm text-slate-400">
                  A análise é local e não envia seu texto a um servidor.
                </p>
              </div>
            ) : analysis ? (
              <>
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-[#020817] p-5">
                    <p className="text-sm font-semibold text-slate-400">Nota geral</p>
                    <p className="mt-2 text-3xl font-extrabold text-lime-400">
                      {analysis.score}
                      <span className="text-base text-slate-400">/100</span>
                    </p>
                    <p className="mt-1 font-bold text-white">{analysis.level}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-[#020817] p-5">
                    <p className="text-sm font-semibold text-slate-400">Risco</p>
                    <p
                      className={`mt-2 text-2xl font-extrabold ${
                        analysis.risk.level === "Alto"
                          ? "text-red-400"
                          : analysis.risk.level === "Médio"
                            ? "text-amber-400"
                            : "text-lime-400"
                      }`}
                    >
                      {analysis.risk.level}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">Segurança e privacidade</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {analysis.criteria.map((criterion) => (
                    <div
                      key={criterion.id}
                      className="rounded-xl border border-slate-800 bg-[#020817] p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <span className="font-semibold text-slate-200">
                          {criterion.label}
                        </span>
                        <span className="font-bold text-white">{criterion.score}/100</span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label={`Nota de ${criterion.label}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={criterion.score}
                        className="h-2 overflow-hidden rounded-full bg-slate-800"
                      >
                        <div
                          className={`h-full rounded-full transition-all ${scoreColor(criterion.score)}`}
                          style={{ width: `${criterion.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-[#020817] p-8 text-center">
                <Sparkles aria-hidden="true" className="mb-4 text-lime-400" size={42} />
                <h3 className="text-xl font-bold">Nenhuma análise realizada</h3>
                <p className="mt-2 max-w-sm text-slate-400">
                  Escreva um prompt e selecione “Analisar prompt” para receber notas e sugestões.
                </p>
              </div>
            )}
          </div>
        </section>

        {analysis && status === "success" && (
          <section aria-labelledby="details-title" className="mt-8 space-y-8">
            <h2 id="details-title" className="sr-only">
              Detalhes da avaliação
            </h2>

            <div className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-slate-800 bg-[#061225] p-5 sm:p-8">
                <h3 className="mb-5 flex items-center gap-3 text-xl font-bold">
                  <CheckCircle2 aria-hidden="true" className="text-lime-400" />
                  Pontos fortes
                </h3>
                <ul className="space-y-3 text-slate-300">
                  {analysis.strengths.map((strength) => (
                    <li key={strength} className="flex gap-3">
                      <Check aria-hidden="true" className="mt-1 shrink-0 text-lime-400" size={17} />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-3xl border border-slate-800 bg-[#061225] p-5 sm:p-8">
                <h3 className="mb-5 flex items-center gap-3 text-xl font-bold">
                  {analysis.problems.length ? (
                    <XCircle aria-hidden="true" className="text-amber-400" />
                  ) : (
                    <ShieldCheck aria-hidden="true" className="text-lime-400" />
                  )}
                  Pontos de atenção
                </h3>
                {analysis.problems.length ? (
                  <ul className="space-y-3 text-slate-300">
                    {analysis.problems.map((problem) => (
                      <li key={problem} className="flex gap-3">
                        <AlertTriangle
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-amber-400"
                          size={17}
                        />
                        <span>{problem}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-300">
                    Nenhum problema relevante foi encontrado pelas regras locais.
                  </p>
                )}
              </article>
            </div>

            <article className="rounded-3xl border border-lime-400/20 bg-[#061225] p-5 sm:p-8">
              <h3 className="mb-5 flex items-center gap-3 text-xl font-bold">
                <WandSparkles aria-hidden="true" className="text-lime-400" />
                Sugestões práticas
              </h3>
              <ul className="grid gap-3 text-slate-300 md:grid-cols-2">
                {analysis.suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    className="rounded-xl border border-slate-800 bg-[#020817] p-4"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-lime-400/30 bg-[#061225] p-5 sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-lime-400">
                    Versão aprimorada
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold">
                    Um ponto de partida mais completo
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-lime-400 px-5 py-3 font-bold text-lime-400 transition hover:bg-lime-400 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
                >
                  {copyStatus === "success" ? (
                    <Check aria-hidden="true" size={19} />
                  ) : (
                    <Clipboard aria-hidden="true" size={19} />
                  )}
                  {copyStatus === "success" ? "Copiado" : "Copiar prompt"}
                </button>
              </div>

              <pre className="mt-6 whitespace-pre-wrap break-words rounded-2xl border border-slate-800 bg-[#020817] p-5 font-sans leading-relaxed text-slate-200">
                {analysis.improvedPrompt}
              </pre>

              <p
                role="status"
                className={`mt-3 min-h-5 text-sm ${
                  copyStatus === "error" ? "text-red-300" : "text-lime-400"
                }`}
              >
                {copyStatus === "success"
                  ? "Prompt aprimorado copiado para a área de transferência."
                  : copyStatus === "error"
                    ? "O navegador bloqueou a cópia. Selecione o texto acima e copie manualmente."
                    : ""}
              </p>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/cyber/assistente"
                className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-[#061225] p-5 transition hover:border-lime-400/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
              >
                <Bot aria-hidden="true" className="shrink-0 text-lime-400" />
                <span>
                  <strong className="block">Conversar com o assistente</strong>
                  <span className="text-sm text-slate-400">Peça ajuda para interpretar sua nota.</span>
                </span>
              </Link>
              <Link
                href="/recomendacoes"
                className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-[#061225] p-5 transition hover:border-lime-400/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
              >
                <ShieldAlert aria-hidden="true" className="shrink-0 text-lime-400" />
                <span>
                  <strong className="block">Ver recomendações</strong>
                  <span className="text-sm text-slate-400">Use o resultado para definir o próximo estudo.</span>
                </span>
              </Link>
            </div>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-slate-800 bg-[#061225] p-5 sm:p-8">
          <h2 className="mb-3 text-2xl font-bold">Como a análise funciona?</h2>
          <p className="max-w-4xl leading-relaxed text-slate-300">
            Regras locais independentes avaliam seis critérios, procuram instruções
            vagas ou conflitantes e detectam sinais de exposição indevida. O texto
            não sai do navegador; somente nota, risco e áreas de melhoria são salvos
            localmente para personalizar recomendações. Esta é uma ferramenta
            educativa baseada em heurísticas: ela não é um detector infalível e não
            substitui revisão humana em situações reais.
          </p>
        </section>
      </section>
    </main>
  );
}
