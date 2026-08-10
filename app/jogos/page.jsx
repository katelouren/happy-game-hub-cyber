"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Gamepad2,
  LoaderCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
  WifiOff,
} from "lucide-react";
import ApiGameCard from "@/components/ApiGameCard";
import { useActivity } from "@/hooks/useActivity";
import { toggleGameInterest } from "@/lib/activityStore";
import localGames from "../../data/games.json";

const API_URL = "/api/games";
const API_TIMEOUT_MS = 8000;
const API_ATTEMPTS = 2;

function normalizeText(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function safeHttpUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function normalizeGame(game, index, source) {
  if (!game || typeof game !== "object") return null;

  const title = normalizeText(game.title ?? game.nome, "Jogo sem título");
  const genre = normalizeText(game.genre ?? game.categoria, "Outros");

  return {
    id: `${source}:${game.id ?? index}`,
    title,
    genre,
    platform: normalizeText(game.platform, "Plataforma não informada"),
    thumbnail: safeHttpUrl(game.thumbnail),
    gameUrl: safeHttpUrl(game.game_url),
    description: normalizeText(
      game.short_description ?? game.beneficio,
      "Explore esta experiência e descubra novas habilidades.",
    ),
    age: normalizeText(game.idade, ""),
    risk: normalizeText(game.risco, ""),
    source,
  };
}

function normalizeCatalog(games, source) {
  if (!Array.isArray(games)) return [];

  return games
    .map((game, index) => normalizeGame(game, index, source))
    .filter(Boolean);
}

async function fetchApiCatalog(parentSignal) {
  const requestController = new AbortController();
  const forwardAbort = () => requestController.abort();
  const timeoutId = window.setTimeout(
    () => requestController.abort(),
    API_TIMEOUT_MS,
  );

  if (parentSignal.aborted) {
    requestController.abort();
  } else {
    parentSignal.addEventListener("abort", forwardAbort, { once: true });
  }

  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: requestController.signal,
    });

    if (!response.ok) {
      throw new Error(`FreeToGame respondeu com status ${response.status}.`);
    }

    const data = await response.json();
    const catalog = normalizeCatalog(data, "api").slice(0, 12);

    if (catalog.length === 0) {
      throw new Error("A FreeToGame retornou um catálogo vazio.");
    }

    return catalog;
  } finally {
    window.clearTimeout(timeoutId);
    parentSignal.removeEventListener("abort", forwardAbort);
  }
}

export default function Jogos() {
  const { activity, isHydrated } = useActivity();
  const activeRequest = useRef(null);
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [feedback, setFeedback] = useState("");

  const loadGames = useCallback(async () => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;

    setIsLoading(true);
    setError("");
    setFeedback("");

    for (let attempt = 0; attempt < API_ATTEMPTS; attempt += 1) {
      try {
        const apiGames = await fetchApiCatalog(controller.signal);

        if (controller.signal.aborted) return;

        setGames(apiGames);
        setSource("api");
        setIsLoading(false);
        return;
      } catch {
        if (controller.signal.aborted) return;
      }
    }

    if (controller.signal.aborted) return;

    const fallbackCatalog = normalizeCatalog(localGames, "local");
    setGames(fallbackCatalog);
    setSource("local");
    setError(
      fallbackCatalog.length > 0
        ? "A FreeToGame não respondeu após duas tentativas. Você está vendo o catálogo educacional salvo no projeto."
        : "Não foi possível carregar a FreeToGame nem o catálogo local.",
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(loadGames, 0);

    return () => {
      window.clearTimeout(initialLoad);
      activeRequest.current?.abort();
    };
  }, [loadGames]);

  const genres = useMemo(
    () => [
      "Todos",
      ...Array.from(new Set(games.map((game) => game.genre))).sort((a, b) =>
        a.localeCompare(b, "pt-BR"),
      ),
    ],
    [games],
  );

  const visibleGames = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("pt-BR");

    return games.filter((game) => {
      const matchesGenre =
        selectedGenre === "Todos" || game.genre === selectedGenre;
      const searchableText = `${game.title} ${game.genre} ${game.platform}`
        .toLocaleLowerCase("pt-BR");
      const matchesSearch =
        normalizedSearch.length === 0 || searchableText.includes(normalizedSearch);

      return matchesGenre && matchesSearch;
    });
  }, [games, searchTerm, selectedGenre]);

  const interestedIds = useMemo(
    () => new Set(activity.gameInterests.map((game) => String(game.id))),
    [activity.gameInterests],
  );

  function handleToggleInterest(game) {
    const { selected } = toggleGameInterest(game);
    setFeedback(
      selected
        ? `${game.title} foi adicionado aos seus interesses.`
        : `${game.title} foi removido dos seus interesses.`,
    );
  }

  function clearFilters() {
    setSearchTerm("");
    setSelectedGenre("Todos");
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-lime-400/20 bg-lime-400/5">
              <Gamepad2 aria-hidden="true" size={38} className="text-lime-400" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-lime-400 sm:text-sm">
                Biblioteca de Jogos
              </p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Descubra sua próxima experiência
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-4xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Explore jogos da FreeToGame, encontre experiências alinhadas às suas
            preferências e marque as opções que deseja considerar nas suas
            recomendações.
          </p>
        </div>

        {!isLoading && error && (
          <div
            role={games.length > 0 ? "status" : "alert"}
            className={`mt-8 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
              games.length > 0
                ? "border-amber-400/30 bg-amber-400/5"
                : "border-red-400/30 bg-red-400/5"
            }`}
          >
            <div className="flex items-start gap-3">
              {games.length > 0 ? (
                <WifiOff aria-hidden="true" className="mt-0.5 shrink-0 text-amber-300" />
              ) : (
                <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-red-300" />
              )}
              <div>
                <p className="font-bold text-slate-100">
                  {games.length > 0
                    ? "Modo de continuidade ativado"
                    : "Catálogo indisponível"}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={loadGames}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-300/50 px-4 py-3 text-sm font-bold text-amber-200 transition hover:border-amber-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              <RefreshCw aria-hidden="true" size={17} />
              Tentar API novamente
            </button>
          </div>
        )}

        {!isLoading && games.length > 0 && (
          <section aria-labelledby="catalog-filters" className="mt-8">
            <div className="rounded-2xl border border-slate-800 bg-[#061225] p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2
                  id="catalog-filters"
                  className="flex items-center gap-2 font-bold text-slate-100"
                >
                  <SlidersHorizontal aria-hidden="true" size={19} className="text-lime-400" />
                  Filtrar catálogo
                </h2>
                <p className="text-sm text-slate-400" aria-live="polite">
                  {visibleGames.length} de {games.length}{" "}
                  {games.length === 1 ? "jogo" : "jogos"}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
                <label>
                  <span className="sr-only">Buscar por título, gênero ou plataforma</span>
                  <span className="relative block">
                    <Search
                      aria-hidden="true"
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Buscar jogo, gênero ou plataforma"
                      className="w-full rounded-xl border border-slate-700 bg-[#020817] py-3 pl-11 pr-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
                    />
                  </span>
                </label>

                <label>
                  <span className="sr-only">Filtrar por gênero</span>
                  <select
                    value={selectedGenre}
                    onChange={(event) => setSelectedGenre(event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-[#020817] px-4 py-3 text-slate-100 outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre === "Todos" ? "Todos os gêneros" : genre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </section>
        )}

        <p className="sr-only" role="status" aria-live="polite">
          {feedback}
        </p>

        {isLoading ? (
          <section
            aria-label="Carregando jogos"
            aria-busy="true"
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="col-span-full flex min-h-64 flex-col items-center justify-center rounded-3xl border border-slate-800 bg-[#061225] px-6 text-center">
              <LoaderCircle aria-hidden="true" className="animate-spin text-lime-400" size={42} />
              <p className="mt-4 font-bold text-slate-200">Carregando biblioteca...</p>
              <p className="mt-2 max-w-md text-sm text-slate-400">
                Consultando a FreeToGame. Se ela estiver indisponível, o catálogo
                educacional local será exibido automaticamente.
              </p>
            </div>
          </section>
        ) : visibleGames.length > 0 ? (
          <section
            aria-label={`Catálogo de jogos ${source === "local" ? "local" : "da FreeToGame"}`}
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleGames.map((game, index) => (
              <ApiGameCard
                key={game.id}
                title={game.title}
                genre={game.genre}
                platform={game.platform}
                thumbnail={game.thumbnail}
                gameUrl={game.gameUrl}
                description={game.description}
                age={game.age}
                risk={game.risk}
                priority={index < 3}
                isInterested={interestedIds.has(String(game.id))}
                isInterestReady={isHydrated}
                onToggleInterest={() => handleToggleInterest(game)}
              />
            ))}
          </section>
        ) : games.length > 0 ? (
          <section className="mt-8 rounded-3xl border border-slate-800 bg-[#061225] p-8 text-center sm:p-12">
            <Search aria-hidden="true" className="mx-auto text-slate-500" size={42} />
            <h2 className="mt-4 text-2xl font-extrabold">Nenhum jogo encontrado</h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-400">
              Tente outro termo ou remova o filtro de gênero para voltar a explorar
              o catálogo.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-lime-400 px-5 py-3 font-extrabold text-slate-950 transition hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            >
              Limpar filtros
            </button>
          </section>
        ) : (
          <section className="mt-8 rounded-3xl border border-red-400/30 bg-red-400/5 p-8 text-center sm:p-12">
            <AlertTriangle aria-hidden="true" className="mx-auto text-red-300" size={42} />
            <h2 className="mt-4 text-2xl font-extrabold">Biblioteca vazia</h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-300">
              Nenhum jogo está disponível no momento. Tente carregar as fontes
              novamente.
            </p>
            <button
              type="button"
              onClick={loadGames}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 font-extrabold text-slate-950 transition hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            >
              <RefreshCw aria-hidden="true" size={18} />
              Recarregar catálogo
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
