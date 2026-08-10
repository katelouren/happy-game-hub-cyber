export default function ApiGameCard({ title, genre, platform, thumbnail }) {
  const coverUrl = thumbnail
    ? `/api/game-image?url=${encodeURIComponent(thumbnail)}`
    : null;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#061225] transition hover:border-lime-400/50">
      <div className="h-44 w-full bg-slate-900">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`Capa do jogo ${title}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-sm text-slate-400"
            role="img"
            aria-label={`Capa indisponível para ${title}`}
          >
            Capa indisponível
          </div>
        )}
      </div>

      <div className="p-6">
        <span className="rounded-full border border-lime-400 px-4 py-1 text-xs font-bold uppercase tracking-widest text-lime-400">
          {genre}
        </span>

        <h2 className="mt-4 text-2xl font-extrabold text-white">{title}</h2>

        <p className="mt-3 text-slate-300">
          <strong className="text-lime-400">Plataforma:</strong> {platform}
        </p>
      </div>
    </div>
  );
}
