"use client";

import Link from "next/link";
import { useState } from "react";
import { Activity, Info } from "lucide-react";
import { useActivity } from "@/hooks/useActivity";
import { COMPETENCIES, SATURATION_SCALE, POINTS, calculateEstimatedProgress, getCompetencyProgress } from "@/lib/estimatedProgress.mjs";


const percent = (value) => value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

export default function Evolucao() {
  const { activity, isHydrated } = useActivity();
  const [showTable, setShowTable] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(COMPETENCIES[0].id);
  const rows = getCompetencyProgress(activity);
  const selected = rows.find((row) => row.id === selectedSkill);
  const totals = rows.reduce((sum, row) => ({ interests: sum.interests + row.interests, completed: sum.completed + row.completed, points: sum.points + row.points }), { interests: 0, completed: 0, points: 0 });
  const maxCount = Math.max(SATURATION_SCALE * 3, selected.points);
  const x = (n) => 65 + (n / maxCount) * 610;
  const y = (value) => 255 - value * 2;
  const points = Array.from({ length: 121 }, (_, i) => { const n = Math.round(i * maxCount / 120); return `${x(n)},${y(calculateEstimatedProgress(n))}`; }).join(" ");
  const samples = [0, 1, 5, 10, 30, 60];
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round(i * maxCount / 4));

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-10">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lime-400"><Activity aria-hidden="true" size={18} />Minha Evolução</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">Evolução de Competências</h1>
          <p className="mt-5 max-w-3xl leading-relaxed text-slate-300">Acompanhe uma estimativa da sua evolução com base nas interações registradas dentro do Happy Game Hub.</p>
          <p className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-slate-400"><Info aria-hidden="true" className="mt-1 shrink-0 text-lime-400" size={18} />Os indicadores representam uma estimativa baseada nas interações registradas no Happy Game Hub e não constituem avaliação psicológica, clínica ou profissional.</p>
        </header>

        <section aria-labelledby="source-title" className="mt-8 rounded-2xl border border-lime-400/20 bg-[#061225] p-5 sm:p-6">
          <h2 id="source-title" className="text-lg font-bold">O que conta para sua evolução?</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">O índice considera os jogos marcados como interesse e os jogos ou atividades concluídos. Cada interesse vale {POINTS.interest} ponto, enquanto uma conclusão vale {POINTS.completed} pontos na competência principal associada ao jogo. Quando um jogo favoritado é concluído, ele passa a valer {POINTS.completed} pontos no total, sem duplicação.</p>
          <p className="mt-3 text-sm text-slate-400">As conclusões de jogos externos são declaradas pelo próprio usuário no catálogo.</p>
          <p role="status" aria-atomic="true" className="mt-4 text-sm text-lime-300">{!isHydrated ? "Carregando seus dados locais..." : `${totals.interests} interesses marcados; ${totals.completed} jogos ou atividades concluídos; ${totals.points} pontos acumulados.`}</p>
          {isHydrated && totals.points === 0 && <p className="mt-3 text-sm text-slate-400">Sem evidências registradas. Marque interesses ou registre conclusões no catálogo.</p>}
          <Link href="/jogos" className="mt-4 inline-block rounded font-bold text-lime-400 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-400">Explorar jogos e desenvolver competências</Link>
        </section>

        <section aria-labelledby="skills-title" aria-busy={!isHydrated} className="mt-8">
          <h2 id="skills-title" className="mb-5 text-2xl font-bold">Competências trabalhadas</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {rows.map((row) => (
              <article key={row.skill} className="flex flex-col rounded-2xl border border-slate-800 bg-[#061225] p-5">
                <h3 className="min-h-12 font-bold leading-relaxed">{row.skill}</h3>
                <p className="mt-3 text-sm text-slate-400">{isHydrated ? `${row.interests} interesses · ${row.completed} conclusões` : "Carregando..."}</p>
                <p className="mt-3 text-3xl font-extrabold text-lime-400">{isHydrated ? `${percent(row.progress)}%` : "—"}</p>
                <p className="mt-2 text-sm text-slate-300">{row.points} pontos acumulados</p>
                <p className="mb-4 mt-2 text-xs text-slate-400">{row.completed ? "Competência praticada" : row.interests ? "Interesse identificado" : "Sem evidências"}</p>
                <div role="progressbar" aria-label={`Índice estimado: ${row.skill}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={row.progress} aria-valuetext={`${percent(row.progress)} por cento de índice estimado`} className="mt-auto h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-lime-400 transition-all" style={{ width: `${row.progress}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="curve-title" className="mt-8 rounded-3xl border border-slate-800 bg-[#061225] p-5 sm:p-8">
          <h2 id="curve-title" className="text-2xl font-bold">Conversão da pontuação em índice estimado</h2>
          <label htmlFor="competency" className="mb-2 mt-5 block text-sm font-semibold">Selecione uma competência</label>
          <select id="competency" value={selectedSkill} onChange={(event) => setSelectedSkill(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-[#020817] p-3 text-slate-200 focus-visible:outline-2 focus-visible:outline-lime-400 sm:max-w-sm">
            {COMPETENCIES.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
          </select>
          <p id="curve-description" aria-live="polite" className="mt-4 text-sm leading-relaxed text-slate-300">{selected.skill}: {isHydrated ? `${selected.points} pontos e índice estimado de ${percent(selected.progress)}%.` : "carregando dados."} O eixo horizontal representa a pontuação acumulada e o vertical, o índice estimado. A curva cresce rapidamente no início e desacelera ao se aproximar de 100%. Não é um histórico temporal. A marca circular indica a pontuação atual. A curva é igual para todas as competências; a posição depende da pontuação registrada.</p>
          <div className="mt-5 overflow-x-auto rounded-xl bg-[#020817]" role="region" aria-label="Gráfico da curva exponencial; role horizontalmente em telas pequenas" tabIndex={0}>
            <svg viewBox="0 0 720 320" className="min-w-[480px] w-full" role="img" aria-labelledby="chart-title" aria-describedby="curve-description">
              <title id="chart-title">{`Curva exponencial de ${selected.skill}`}</title>
              {[0, 25, 50, 75, 100].map((tick) => <g key={tick}><line x1="65" x2="675" y1={y(tick)} y2={y(tick)} stroke="#334155" /><text x="53" y={y(tick) + 5} textAnchor="end" fill="#cbd5e1" fontSize="13">{tick}</text></g>)}
              {ticks.map((tick) => <text key={tick} x={x(tick)} y="279" textAnchor="middle" fill="#cbd5e1" fontSize="13">{tick}</text>)}
              <text x="65" y="28" fill="#cbd5e1" fontSize="14">Índice estimado (%)</text>
              <text x="370" y="308" textAnchor="middle" fill="#cbd5e1" fontSize="14">Pontuação acumulada (P)</text>
              <polyline points={points} fill="none" stroke="#a3e635" strokeWidth="3" />
              {isHydrated && <circle cx={x(selected.points)} cy={y(selected.progress)} r="6" fill="#ffffff" stroke="#a3e635" strokeWidth="3" />}
            </svg>
          </div>
          <div className="mt-4 text-sm text-slate-300">
            <button type="button" aria-expanded={showTable} aria-controls="curve-table" onClick={() => setShowTable(!showTable)} className="cursor-pointer rounded font-semibold text-lime-400 focus-visible:outline-2 focus-visible:outline-lime-400">Ver valores da curva em tabela</button>
            <table id="curve-table" hidden={!showTable} className="mt-3 w-full text-left"><caption className="mb-2 text-left text-slate-400">Referência do modelo para qualquer competência</caption><thead><tr><th scope="col" className="p-2">Pontos (P)</th><th scope="col" className="p-2">Índice E(P)</th></tr></thead><tbody>{samples.map((n) => <tr key={n} className="border-t border-slate-800"><th scope="row" className="p-2">{n}</th><td className="p-2">{percent(calculateEstimatedProgress(n))}%</td></tr>)}</tbody></table>
          </div>
        </section>

        <section aria-labelledby="formula-title" className="mt-8 rounded-3xl border border-slate-800 bg-[#061225] p-5 sm:p-8">
          <h2 id="formula-title" className="text-2xl font-bold">Como o cálculo funciona</h2>
          <p className="my-5 break-words font-mono text-lg text-lime-400">E(P) = 100 × (1 − e<sup>−P / {SATURATION_SCALE}</sup>)</p>
          <p className="text-sm leading-relaxed text-slate-300">P soma o maior peso alcançado por cada jogo na competência: {POINTS.interest} ponto por interesse ou {POINTS.completed} por conclusão, sem duplicação.</p>
          <p className="mt-4 leading-relaxed text-slate-300">A pontuação acumulada é convertida em um índice de 0 a 100. A curva cresce mais rapidamente nas primeiras interações e desacelera gradualmente, fazendo com que índices elevados dependam de mais evidências.</p>
          <p className="mt-4 text-sm text-slate-400">O índice não representa XP, nível profissional ou avaliação de aprendizagem.</p>
        </section>
      </section>
    </main>
  );
}
