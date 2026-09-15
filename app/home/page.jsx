import { COMPETENCIES } from "@/lib/competencies.mjs";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import CategoryCard from "@/components/CategoryCard";
import { Target, Brain, Users, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Treinamento cognitivo",
    description: "Jogos e desafios para estimular atenção, memória, raciocínio e tomada de decisão.",
  },
  {
    icon: Brain,
    title: "Trilhas personalizadas",
    description: "Recomendações baseadas no perfil, interesses e atividades realizadas.",
  },
  {
    icon: Users,
    title: "Evolução contínua",
    description: "Atividades e recomendações que se atualizam conforme você pratica na plataforma.",
  },
  {
    icon: ShieldCheck,
    title: "Cibersegurança",
    description: "Práticas educativas para reconhecer riscos digitais e desenvolver comportamentos mais seguros.",
  },
];

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-800 bg-[#020817] p-0">
          <HeroSection />

          <section className="grid gap-0 rounded-b-[2rem] border-t border-slate-800 bg-[#061225] md:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </section>
        </div>

        <section className="mt-16">
          <p className="mb-3 text-center text-sm font-bold uppercase tracking-[0.35em] text-lime-400">
            Categorias
          </p>

          <h2 className="mb-10 text-center text-3xl font-extrabold sm:text-4xl">
            O que você quer desenvolver?
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COMPETENCIES.map((category) => (
              <CategoryCard key={category.id} competency={category} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
