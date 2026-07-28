export default function AdminLoading() {
  return (
    <main id="main-content" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10" aria-busy="true" aria-label="Loading administrator workspace">
      <div className="mx-auto max-w-[1440px]">
        <div className="border-b border-slate-200/80 pb-7">
          <div className="h-3 w-24 rounded bg-slate-200/80 animate-pulse" />
          <div className="mt-4 h-10 w-64 max-w-full rounded-lg bg-slate-200/60 animate-pulse" />
          <div className="mt-3 h-4 w-[520px] max-w-full rounded bg-slate-200/40 animate-pulse" />
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/60 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-28 bg-white" />)}
        </div>
        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <div className="h-80 rounded-2xl border border-slate-200/80 bg-white shadow-xs" />
          <div className="h-80 rounded-2xl border border-slate-200/80 bg-white shadow-xs" />
        </div>
      </div>
    </main>
  );
}
