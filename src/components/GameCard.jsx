export default function GameCard({
  nome,
  categoria,
  idade,
  beneficio,
  risco,
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#061225] p-8 transition hover:border-lime-400/40 hover:shadow-[0_0_20px_rgba(132,204,22,0.15)]">
      <div className="mb-4">
        <span className="rounded-full border border-lime-400 px-4 py-1 text-xs font-bold uppercase tracking-widest text-lime-400">
          {categoria}
        </span>
      </div>

      <h2 className="mb-4 text-3xl font-extrabold text-white">
        {nome}
      </h2>

      <div className="mb-5">
        <span className="font-semibold text-lime-400">
          Faixa etária:
        </span>{" "}
        <span className="text-slate-300">{idade}</span>
      </div>

      <div className="mb-5">
        <h3 className="mb-2 font-bold text-lime-400">
          Benefícios
        </h3>

        <p className="text-slate-300">
          {beneficio}
        </p>
      </div>

      <div>
        <h3 className="mb-2 font-bold text-yellow-400">
          Atenção
        </h3>

        <p className="text-slate-300">
          {risco}
        </p>
      </div>
    </div>
  );
}