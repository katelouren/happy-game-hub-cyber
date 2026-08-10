import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-[#061225] p-5 sm:p-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-5 inline-block rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            Descubra. Jogue. Evolua.
          </p>

          <h1 className="mb-6 max-w-xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Encontre jogos que combinam com{" "}
            <span className="text-lime-400">você.</span>
          </h1>

          <p className="mb-8 max-w-lg text-lg leading-relaxed text-slate-300">
            O Happy Game Hub ajuda você a descobrir jogos incríveis alinhados
            aos seus interesses, objetivos e estilo de jogo. Diversão com
            propósito, do seu jeito.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/jogos"
              className="flex items-center justify-center gap-2 rounded-lg bg-lime-400 px-7 py-4 text-sm font-extrabold text-slate-950 transition hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            >
              <Gamepad2 size={18} />
              Explorar Jogos
            </Link>

            <Link
              href="/recomendacoes"
              className="flex items-center justify-center gap-2 rounded-lg border border-lime-400 px-7 py-4 text-sm font-extrabold text-white transition hover:bg-lime-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
            >
              <Sparkles size={18} className="text-lime-400" />
              Descobrir Jogos
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
