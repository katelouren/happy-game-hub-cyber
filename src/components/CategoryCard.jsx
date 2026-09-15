import {
  Brain,
  Lightbulb,
  Rocket,
  Target,
  
  Trophy,
  
} from "lucide-react";
import Link from "next/link";

const icons = { creativity: Lightbulb, attention_concentration: Target, logical_reasoning: Brain, strategic_thinking: Trophy, problem_solving: Rocket, decision_making: Brain };

export default function CategoryCard({ competency }) {
  const { id, label: title } = competency;
  const Icon = icons[id];

  return (
    <Link
      href={`/recomendacoes?objetivo=${encodeURIComponent(id)}`}
      className="group rounded-3xl border border-slate-800 bg-[#071326] p-7 text-center transition hover:border-lime-400/60 hover:shadow-[0_0_30px_rgba(132,204,22,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 sm:p-10"
      aria-label={`Receber recomendações para desenvolver ${title}`}
    >
      <div className="mb-6 flex justify-center">
        <div className="rounded-2xl border border-lime-400/20 bg-lime-400/5 p-5">
          <Icon aria-hidden="true" size={52} strokeWidth={1.8} className="text-lime-400" />
        </div>
      </div>

      <h3 className="text-2xl font-extrabold text-lime-400">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">Ver recomendações</p>
    </Link>
  );
}
