import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import CategoryCard from "@/components/CategoryCard";
import Footer from "@/components/Footer";
import { Target, Brain, Users, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Descoberta Inteligente",
    description: "Encontre jogos que combinam com seus interesses e objetivos.",
  },
  {
    icon: Brain,
    title: "Desenvolvimento",
    description: "Jogos que estimulam habilidades cognitivas e emocionais.",
  },
  {
    icon: Users,
    title: "Para Todos",
    description: "Recomendações para qualquer idade e estilo de jogador.",
  },
  {
    icon: ShieldCheck,
    title: "Jogos Conscientes",
    description: "Diversão equilibrada com saúde mental e segurança.",
  },
];

const categories = [
  { title: "Criatividade" },
  { title: "Raciocínio" },
  { title: "Planejamento" },
  { title: "Coordenação" },
  { title: "Estratégia" },
  { title: "Aprendizado" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-7xl px-8 pt-4 pb-12">
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

          <h2 className="mb-10 text-center text-4xl font-extrabold">
            O que você quer desenvolver?
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.title} title={category.title} />
            ))}
          </div>
        </section>

        <Footer />
      </section>
    </main>
  );
}