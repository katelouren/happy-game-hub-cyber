import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-[#061225] p-5 sm:p-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-5 inline-block rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            Aprenda. Pratique. Evolua.
          </p>

          <h1 className="mb-6 max-w-xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Treine sua mente.{" "}
            <span className="text-lime-400">Proteja sua empresa.</span>
          </h1>

          <p className="mb-8 max-w-lg text-lg leading-relaxed text-slate-300">
            O Happy Game Hub combina jogos, trilhas personalizadas e inteligência
            artificial para desenvolver habilidades cognitivas e fortalecer a
            conscientização em cibersegurança no ambiente corporativo.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-5">
            <Link
              href="/jogos"
              className="flex min-h-[60px] items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-lime-400 px-8 py-[17px] text-base font-extrabold text-slate-950 transition hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            >
              <Gamepad2 size={22} className="shrink-0" />
              Explorar Jogos
            </Link>

            <Link
              href="/recomendacoes"
              className="flex min-h-[60px] items-center justify-center gap-3 whitespace-nowrap rounded-lg border border-lime-400 px-8 py-[17px] text-base font-extrabold text-white transition hover:bg-lime-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
            >
              <Sparkles size={22} className="shrink-0 text-lime-400" />
              Minha trilha
            </Link>
          </div>
        </div>

        <div className="relative h-64 overflow-hidden rounded-3xl sm:h-[390px]">
          <Image
            src="/images/hero-gaming.png"
            alt="Portal gamer futurista"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
