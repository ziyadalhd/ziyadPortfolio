export default function Loading() {
  return (
    <main
      role="status"
      aria-label="Loading portfolio content"
      className="min-h-screen bg-base px-6 py-10 text-slate-100"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="h-28 animate-pulse rounded-2xl bg-white/10" />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="h-72 animate-pulse rounded-3xl bg-white/10" />
          <div className="h-72 animate-pulse rounded-3xl bg-white/10" />
        </div>
      </div>
    </main>
  );
}
