export default function ApiGameCard({ title, genre, platform, thumbnail }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 transition hover:border-lime-400/50">
      <img
        src={thumbnail}
        alt={title}
        className="mb-5 h-44 w-full rounded-2xl object-cover"
      />

      <span className="rounded-full border border-lime-400 px-4 py-1 text-xs font-bold uppercase tracking-widest text-lime-400">
        {genre}
      </span>

      <h2 className="mt-4 text-2xl font-extrabold text-white">{title}</h2>

      <p className="mt-3 text-slate-300">
        <strong className="text-lime-400">Plataforma:</strong> {platform}
      </p>
    </div>
  );
}