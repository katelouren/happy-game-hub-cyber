"use client";

import { COMPETENCIES, getCompetency, normalizeCompetencyId } from "@/lib/competencies.mjs";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Brain,
  Gamepad2,
  History,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { savePlayerProfile } from "@/lib/activityStore";
import {
  generateRecommendations,
  recommendationOptions,
} from "@/lib/recommendationEngine.mjs";
import { useActivity } from "@/hooks/useActivity";

function priorityLabel(priority) {
  if (priority >= 90) return "Prioridade alta";
  if (priority >= 70) return "Prioridade média";
  return "Complementar";
}

export default function Recomendacoes() {
  const { activity, isHydrated, clearActivity } = useActivity();
  const [idade, setIdade] = useState("Adulto");
  const [objetivo, setObjetivo] = useState(COMPETENCIES[0].id);
  const [estilo, setEstilo] = useState("Construção");
  const [formStatus, setFormStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const initializedForm = useRef(false);
  const profileRequest = useRef(0);

  useEffect(() => {
    if (!isHydrated || initializedForm.current) return;

    let active = true;

    const queryObjective = normalizeCompetencyId(new URLSearchParams(window.location.search).get("objetivo"));
    const savedProfile = activity.profile;

    queueMicrotask(() => {
      if (!active) return;

      const hasQueryObjective = recommendationOptions.objectives.includes(
        queryObjective,
      );

      if (savedProfile) {
        setIdade("Adulto");
        setObjetivo(hasQueryObjective ? queryObjective : savedProfile.objetivo ?? "");
        if (!hasQueryObjective && !savedProfile.objetivo) setFeedback("Escolha uma das seis competências para atualizar seu perfil. Seus interesses e conclusões foram preservados.");
        setEstilo(savedProfile.estilo);
      } else if (hasQueryObjective) {
        setObjetivo(queryObjective);
      }

      if (hasQueryObjective) {
        document.querySelector("#perfil-jogador")?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
          block: "start",
        });
      }

      initializedForm.current = true;
    });

    return () => {
      active = false;
    };
  }, [activity.profile, isHydrated]);

  const result = useMemo(
    () => generateRecommendations({
      ...activity,
      profile: activity.profile ? { ...activity.profile, idade: "Adulto" } : null,
    }),
    [activity],
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const requestId = profileRequest.current + 1;
    const nextProfile = { idade, objetivo, estilo };
    profileRequest.current = requestId;
    setFormStatus("loading");
    setFeedback("");

    await new Promise((resolve) => window.setTimeout(resolve, 300));
    if (requestId !== profileRequest.current) return;

    savePlayerProfile(nextProfile);
    setFormStatus("success");
    setFeedback(
      "Perfil salvo neste navegador. As recomendações foram atualizadas.",
    );
  }

  function handleFieldChange(setter) {
    return (event) => {
      setter(event.target.value);
      if (formStatus === "success") {
        setFormStatus("idle");
        setFeedback("Salve novamente para aplicar as novas escolhas.");
      }
    };
  }

  function handleClearHistory() {
    profileRequest.current += 1;
    clearActivity();
    setFormStatus("idle");
    setFeedback(
      "Personalização local removida. Você pode criar um novo perfil quando quiser.",
    );
  }

  const historyCount =
    activity.gameInterests.length +
    activity.assistantInteractions.length +
    (activity.profile ? 1 : 0);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-10">
          <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            <Sparkles aria-hidden="true" size={16} />
            Desenvolvimento personalizado
          </p>

          <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Minha trilha de desenvolvimento
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
            Seu perfil, interesses e atividades realizadas ajudam a organizar uma
            trilha personalizada de desenvolvimento cognitivo e segurança digital,
            combinando jogos, prática de IA e cibersegurança.
          </p>
        </div>

        <section className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[0.85fr_1.15fr]">
          <form
            id="perfil-jogador"
            onSubmit={handleSubmit}
            className="scroll-mt-6 rounded-3xl border border-slate-800 bg-[#061225] p-5 sm:p-8"
          >
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <UserRound aria-hidden="true" className="text-lime-400" />
              Meu perfil de desenvolvimento
            </h2>

            <label htmlFor="idade" className="mb-5 block">
              <span className="mb-2 block font-semibold text-slate-200">
                Faixa etária
              </span>
              <select
                id="idade"
                value={idade}
                disabled={formStatus === "loading"}
                onChange={handleFieldChange(setIdade)}
                className="w-full rounded-xl border border-slate-700 bg-[#020817] p-4 text-slate-200 outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
              >
                {recommendationOptions.ages.filter((age) => age === "Adulto").map((age) => (
                  <option key={age}>{age}</option>
                ))}
              </select>
            </label>

            <label htmlFor="objetivo" className="mb-5 block">
              <span className="mb-2 block font-semibold text-slate-200">
                Competência que deseja desenvolver
              </span>
              <select
                id="objetivo"
                required
                value={objetivo}
                disabled={formStatus === "loading"}
                onChange={handleFieldChange(setObjetivo)}
                className="w-full rounded-xl border border-slate-700 bg-[#020817] p-4 text-slate-200 outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
              >
                {!objetivo && <option value="" disabled>Selecione uma competência</option>}
                {COMPETENCIES.map(({ id, label }) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </label>

            <label htmlFor="estilo" className="mb-6 block">
              <span className="mb-2 block font-semibold text-slate-200">
                Estilo de jogo preferido
              </span>
              <select
                id="estilo"
                value={estilo}
                disabled={formStatus === "loading"}
                onChange={handleFieldChange(setEstilo)}
                className="w-full rounded-xl border border-slate-700 bg-[#020817] p-4 text-slate-200 outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
              >
                {recommendationOptions.styles.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              disabled={formStatus === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-4 font-extrabold text-slate-950 transition hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 disabled:cursor-wait disabled:opacity-70"
            >
              {formStatus === "loading" ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" size={20} />
              ) : (
                <Target aria-hidden="true" size={20} />
              )}
              {formStatus === "loading" ? "Atualizando..." : "Salvar perfil e atualizar trilha"}
            </button>

            <p
              role="status"
              aria-live="polite"
              className={`mt-4 min-h-10 text-sm leading-relaxed ${
                formStatus === "success" ? "text-lime-400" : "text-slate-400"
              }`}
            >
              {feedback}
            </p>

            {isHydrated && historyCount > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                disabled={formStatus === "loading"}
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
              >
                <RotateCcw aria-hidden="true" size={16} />
                Limpar personalização deste navegador
              </button>
            )}
          </form>

          <div
            aria-live="polite"
            aria-busy={!isHydrated || formStatus === "loading"}
            className="rounded-3xl border border-lime-400/20 bg-[#061225] p-5 sm:p-8"
          >
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="flex items-center gap-3 text-2xl font-bold">
                  <Brain aria-hidden="true" className="text-lime-400" />
                  Sua trilha recomendada
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
                  {isHydrated
                    ? result.summary
                    : "Carregando suas preferências locais..."}
                </p>
              </div>

              {isHydrated && (
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300">
                  <History aria-hidden="true" size={14} />
                  {historyCount} {historyCount === 1 ? "dado local" : "dados locais"}
                </span>
              )}
            </div>

            {!isHydrated || formStatus === "loading" ? (
              <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-800 bg-[#020817]">
                <LoaderCircle aria-hidden="true" className="animate-spin text-lime-400" size={40} />
                <span className="sr-only">Carregando recomendações</span>
              </div>
            ) : (
              <ol className="space-y-4">
                {result.items.map((item, index) => (
                  <li
                    key={item.id}
                    className="rounded-2xl border border-slate-800 bg-[#020817] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-400 font-extrabold text-slate-950">
                        {index + 1}
                      </span>
                      <span className="rounded-full border border-lime-400/30 px-3 py-1 text-xs font-bold text-lime-400">
                        {priorityLabel(item.priority)}
                      </span>
                    </div>

                    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-lime-400">
                      {item.type}
                    </p>
                    <h3 className="mt-2 text-2xl font-extrabold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-slate-300">
                      {item.reason}
                    </p>
                    <p className="mt-3 text-sm text-slate-400">
                      {item.competencyId ? `Competência relacionada: ${getCompetency(item.competencyId).label}` : `Tema: ${item.topic}`}
                    </p>

                    <Link
                      href={item.href}
                      className="mt-5 inline-flex items-center gap-2 rounded-lg font-bold text-lime-400 transition hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
                    >
                      {item.action}
                      <ArrowRight aria-hidden="true" size={18} />
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/jogos"
            className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-[#061225] p-5 transition hover:border-lime-400/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
          >
            <Gamepad2 aria-hidden="true" className="shrink-0 text-lime-400" />
            <span>
              <strong className="block">Atualizar interesses</strong>
              <span className="text-sm text-slate-400">Marque jogos que chamam sua atenção.</span>
            </span>
          </Link>
          <Link
            href="/cyber/assistente"
            className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-[#061225] p-5 transition hover:border-lime-400/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
          >
            <Bot aria-hidden="true" className="shrink-0 text-lime-400" />
            <span>
              <strong className="block">Entender a recomendação</strong>
              <span className="text-sm text-slate-400">Converse com o assistente educativo.</span>
            </span>
          </Link>
        </section>
      </section>
    </main>
  );
}
