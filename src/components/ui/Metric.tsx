export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface rounded-xl px-4 py-3">
      <p className="eyebrow text-slate-300">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
