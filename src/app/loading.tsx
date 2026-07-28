export default function GlobalLoading() {
  return (
    <main
      id="main-content"
      aria-busy="true"
      aria-label="Loading page"
      className="mx-auto min-h-[60vh] w-[min(calc(100%-40px),1180px)] py-14"
    >
      <div className="h-3.5 w-28 rounded-md bg-slate-200/80 animate-pulse" />
      <div className="mt-6 h-12 w-[540px] max-w-full rounded-2xl bg-slate-200/60 animate-pulse" />
      <div className="mt-4 h-5 w-[420px] max-w-full rounded-lg bg-slate-200/40 animate-pulse" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="h-64 rounded-3xl border border-slate-200/80 bg-white/60 p-6 shadow-xs animate-pulse" />
        <div className="h-64 rounded-3xl border border-slate-200/80 bg-white/60 p-6 shadow-xs animate-pulse" />
      </div>
    </main>
  );
}
