export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <p
        className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-lg font-bold text-white"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {value}
      </p>
    </div>
  );
}
