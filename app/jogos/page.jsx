"use client";

import { useEffect, useState } from "react";
import { Gamepad2 } from "lucide-react";
import ApiGameCard from "../../src/components/ApiGameCard.jsx";

export default function Jogos() {
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarJogos() {
      try {
        const resposta = await fetch("https://www.freetogame.com/api/games");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar jogos.");
        }

        const dados = await resposta.json();
        setJogos(dados.slice(0, 12));
      } catch (error) {
        setErro("Não foi possível carregar os jogos da API.");
      } finally {
        setCarregando(false);
      }
    }

    buscarJogos();
  }, []);

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-7xl px-8 py-12">
        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-10">
          <div className="flex items-center gap-4">
            <Gamepad2 size={50} className="text-lime-400" />

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-lime-400">
                Biblioteca de Jogos
              </p>

              <h1 className="text-5xl font-extrabold">
                Jogos via API Real
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-4xl text-lg leading-relaxed text-slate-300">
            Esta página consome dados reais da FreeToGame API utilizando
            fetch, async/await e useEffect. Os jogos são exibidos dinamicamente
            em cards reutilizáveis :)
          </p>
        </div>

        {carregando && (
          <p className="mt-10 text-center text-lg text-slate-300">
            Carregando jogos...
          </p>
        )}

        {erro && (
          <p className="mt-10 text-center text-lg text-red-400">
            {erro}
          </p>
        )}

        {!carregando && !erro && (
          <section className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {jogos.map((jogo) => (
              <ApiGameCard
                key={jogo.id}
                title={jogo.title}
                genre={jogo.genre}
                platform={jogo.platform}
                thumbnail={jogo.thumbnail}
              />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}