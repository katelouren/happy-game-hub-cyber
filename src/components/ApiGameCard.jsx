"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ExternalLink,
  Gamepad2,
  Heart,
  ImageOff,
  ShieldAlert,
} from "lucide-react";

export default function ApiGameCard({
  title,
  genre,
  platform,
  thumbnail,
  gameUrl = "",
  description = "",
  age = "",
  risk = "",
  priority = false,
  isInterested = false,
  isInterestReady = true,
  onToggleInterest,
}) {
  const [failedImage, setFailedImage] = useState("");
  const coverUrl = thumbnail
    ? `/api/game-image?url=${encodeURIComponent(thumbnail)}`
    : "";
  const hasValidImage = Boolean(coverUrl) && failedImage !== coverUrl;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#061225] transition hover:border-lime-400/50 hover:shadow-[0_18px_50px_rgba(0,0,0,0.2)] focus-within:border-lime-400/60">
      <div className="relative h-48 overflow-hidden bg-[#020817]">
        {hasValidImage ? (
          <Image
            src={coverUrl}
            alt={`Capa do jogo ${title}`}
            fill
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            onError={() => setFailedImage(coverUrl)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(163,230,53,0.14),_transparent_65%)] px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-400/20 bg-lime-400/5">
              {thumbnail ? (
                <ImageOff aria-hidden="true" size={32} className="text-lime-400" />
              ) : (
                <Gamepad2 aria-hidden="true" size={34} className="text-lime-400" />
              )}
            </span>
            <span className="mt-3 text-sm font-semibold text-slate-400">
              {thumbnail ? "Imagem indisponível" : "Experiência em destaque"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-lime-400/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400">
            {genre}
          </span>
          {age && (
            <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
              {age}
            </span>
          )}
        </div>

        <h2 className="mt-4 text-2xl font-extrabold leading-tight text-white">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          <span className="font-semibold text-slate-200">Plataforma:</span>{" "}
          {platform}
        </p>

        {description && (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-300">
            {description}
          </p>
        )}

        {risk && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-relaxed text-amber-100/90">
            <ShieldAlert aria-hidden="true" className="mt-0.5 shrink-0 text-amber-300" size={16} />
            <span>
              <span className="font-bold">Uso consciente:</span> {risk}
            </span>
          </p>
        )}

        <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
          <button
            type="button"
            aria-pressed={isInterested}
            aria-label={`${isInterested ? "Remover" : "Adicionar"} ${title} ${
              isInterested ? "dos" : "aos"
            } interesses`}
            disabled={!isInterestReady || !onToggleInterest}
            onClick={onToggleInterest}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 disabled:cursor-wait disabled:opacity-60 ${
              isInterested
                ? "border-lime-400 bg-lime-400 text-slate-950 hover:bg-lime-300"
                : "border-slate-700 text-slate-200 hover:border-lime-400 hover:text-lime-400"
            }`}
          >
            <Heart aria-hidden="true" size={17} fill={isInterested ? "currentColor" : "none"} />
            {isInterested ? "Interessado" : "Tenho interesse"}
          </button>

          {gameUrl ? (
            <a
              href={gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir página externa de ${title} em uma nova aba`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-2 text-sm font-extrabold text-slate-950 transition hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            >
              Ver jogo
              <ExternalLink aria-hidden="true" size={16} />
            </a>
          ) : (
            <span className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-800 px-4 py-2 text-center text-xs font-semibold text-slate-500">
              Link não disponível
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
