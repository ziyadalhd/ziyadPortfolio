import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6 text-slate-100">
      <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="eyebrow text-amber-300">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          This page does not exist.
        </h1>
        <p className="mt-4 text-slate-300">
          The link may be outdated, or the page may have moved.
        </p>
        <Link href="/" className="button-primary mt-6 inline-flex">
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
