"use client";

import { Brain, Gamepad2, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";

export default function Recomendacoes() {
  const [idade, setIdade] = useState("Adolescente");
  const [objetivo, setObjetivo] = useState("Criatividade");
  const [estilo, setEstilo] = useState("Construção");
  const [resultado, setResultado] = useState(null);

  function gerarRecomendacao() {
    let perfil = "";
    let jogo = "";
    let descricao = "";

    if (objetivo === "Criatividade" || estilo === "Construção") {
      perfil = "Perfil Criativo Explorador";
      jogo = "Minecraft";
      descricao =
        "Você demonstrou interesse por criação, construção e liberdade de exploração. Jogos sandbox são boas opções para estimular criatividade e resolução de problemas.";
    } else if (objetivo === "Raciocínio" || estilo === "Puzzle") {
      perfil = "Perfil Lógico Estratégico";
      jogo = "Portal 2";
      descricao =
        "Seu perfil indica interesse por desafios mentais, lógica e resolução de problemas. Jogos de puzzle podem estimular raciocínio e pensamento crítico.";
    } else if (objetivo === "Planejamento" || objetivo === "Estratégia") {
      perfil = "Perfil Estrategista";
      jogo = "Civilization VI";
      descricao =
        "Você demonstrou preferência por decisões táticas, organização e visão de longo prazo. Jogos de estratégia ajudam a desenvolver planejamento e análise.";
    } else if (objetivo === "Coordenação" || estilo === "Esporte") {
      perfil = "Perfil Ágil Competitivo";
      jogo = "Rocket League";
      descricao =
        "Seu perfil combina reflexos, movimento e tomada rápida de decisão. Jogos de coordenação podem estimular precisão e agilidade.";
    } else if (objetivo === "Aprendizado") {
      perfil = "Perfil Aprendiz";
      jogo = "Kerbal Space Program";
      descricao =
        "Você demonstrou interesse por conhecimento e evolução. Jogos educativos e de simulação podem unir diversão, curiosidade e aprendizagem.";
    } else {
      perfil = "Perfil Equilibrado";
      jogo = "Stardew Valley";
      descricao =
        "Seu perfil combina exploração, organização e experiência leve. Jogos de simulação podem oferecer equilíbrio entre diversão e planejamento.";
    }

    if (idade === "Criança") {
      descricao +=
        " Para usuários mais novos, é recomendado acompanhamento de um responsável e atenção à classificação indicativa.";
    }

    setResultado({
      perfil,
      jogo,
      descricao,
    });
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-6xl px-8 py-12">
        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-10">
          <p className="mb-4 inline-block rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            Recomendação personalizada
          </p>

         <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">
            Descubra jogos alinhados ao seu perfil.
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
            Responda algumas informações sobre seus interesses, idade e objetivos
            para receber uma sugestão calculada com lógica JavaScript.
          </p>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          <form className="rounded-3xl border border-slate-800 bg-[#061225] p-8">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <UserRound className="text-lime-400" />
              Perfil do jogador
            </h2>

            <label className="mb-5 block">
              <span className="mb-2 block font-semibold text-slate-200">
                Faixa etária
              </span>

              <select
                value={idade}
                onChange={(event) => setIdade(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#020817] p-4 text-slate-300"
              >
                <option>Criança</option>
                <option>Adolescente</option>
                <option>Adulto</option>
              </select>
            </label>

            <label className="mb-5 block">
              <span className="mb-2 block font-semibold text-slate-200">
                O que deseja desenvolver?
              </span>

              <select
                value={objetivo}
                onChange={(event) => setObjetivo(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#020817] p-4 text-slate-300"
              >
                <option>Criatividade</option>
                <option>Raciocínio</option>
                <option>Planejamento</option>
                <option>Coordenação</option>
                <option>Estratégia</option>
                <option>Aprendizado</option>
              </select>
            </label>

            <label className="mb-6 block">
              <span className="mb-2 block font-semibold text-slate-200">
                Estilo de jogo preferido
              </span>

              <select
                value={estilo}
                onChange={(event) => setEstilo(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#020817] p-4 text-slate-300"
              >
                <option>Aventura</option>
                <option>Estratégia</option>
                <option>Construção</option>
                <option>Esporte</option>
                <option>Puzzle</option>
                <option>Simulação</option>
              </select>
            </label>

            <button
              type="button"
              onClick={gerarRecomendacao}
              className="w-full rounded-xl bg-lime-400 px-6 py-4 font-extrabold text-slate-950 transition hover:bg-lime-300"
            >
              Gerar recomendação
            </button>
          </form>

          <div className="rounded-3xl border border-lime-400/20 bg-[#061225] p-8">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <Sparkles className="text-lime-400" />
              Resultado dinâmico
            </h2>

            {resultado ? (
              <div className="rounded-2xl border border-slate-800 bg-[#020817] p-6">
                <Gamepad2 size={42} className="mb-5 text-lime-400" />

                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-lime-400">
                  {resultado.perfil}
                </p>

                <h3 className="mb-3 text-3xl font-extrabold text-white">
                  {resultado.jogo}
                </h3>

                <p className="text-slate-300">{resultado.descricao}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-[#020817] p-6">
                <Brain size={42} className="mb-5 text-lime-400" />

                <h3 className="mb-3 text-2xl font-extrabold text-white">
                  Aguardando respostas
                </h3>

                <p className="text-slate-300">
                  Selecione as opções do formulário e clique em “Gerar
                  recomendação” para visualizar um perfil calculado com lógica
                  JavaScript.
                </p>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-slate-800 bg-[#020817] p-6">
              <Brain size={42} className="mb-5 text-lime-400" />

              <h3 className="mb-3 text-2xl font-extrabold text-white">
                Lógica aplicada
              </h3>

              <p className="text-slate-300">
                O resultado é gerado com estados do React, eventos de formulário
                e uma estrutura de decisão com if/else. Em versões futuras, essa
                lógica poderá ser substituída ou ampliada com IA generativa.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}