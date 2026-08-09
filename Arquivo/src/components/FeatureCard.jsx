export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#061225] p-6 transition hover:border-lime-400/40">
      <div className="mb-5">
        <Icon size={42} className="text-lime-400" />
      </div>

      <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>

      <p className="text-slate-400">{description}</p>
    </div>
  );
}