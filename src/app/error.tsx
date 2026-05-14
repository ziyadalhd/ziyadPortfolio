"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6 text-slate-100">
      <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="eyebrow text-cyan-300">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          The portfolio could not load.
        </h1>
        <p className="mt-4 text-slate-300">
          Please retry. If the issue continues, contact Ziyad directly.
        </p>
        <button type="button" className="button-primary mt-6" onClick={reset}>
          Try again
        </button>
        {error.digest ? (
          <p className="mt-4 text-xs text-slate-400">
            Error ID: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}
