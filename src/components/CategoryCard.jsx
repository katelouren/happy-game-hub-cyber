import {
  Brain,
  Lightbulb,
  Rocket,
  Target,
  GraduationCap,
  Trophy,
} from "lucide-react";

const icons = {
  Criatividade: Lightbulb,
  Raciocínio: Brain,
  Planejamento: Rocket,
  Coordenação: Target,
  Estratégia: Trophy,
  Aprendizado: GraduationCap,
};

export default function CategoryCard({ title }) {
  const Icon = icons[title];

  return (
    <div className="group rounded-3xl border border-slate-800 bg-[#071326] p-10 text-center transition hover:border-lime-400/60 hover:shadow-[0_0_30px_rgba(132,204,22,0.12)]">
      <div className="mb-6 flex justify-center">
        <div className="rounded-2xl border border-lime-400/20 bg-lime-400/5 p-5">
          <Icon size={52} strokeWidth={1.8} className="text-lime-400" />
        </div>
      </div>

      <h3 className="text-2xl font-extrabold text-lime-400">{title}</h3>
    </div>
  );
}