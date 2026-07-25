export default function AdminLoading() {
  return (
    <main id="main-content" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10" aria-busy="true" aria-label="Loading administrator workspace">
      <div className="mx-auto max-w-[1440px]">
        <div className="border-b border-white/10 pb-7">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="mt-4 h-10 w-64 max-w-full rounded bg-white/10" />
          <div className="mt-3 h-4 w-[520px] max-w-full rounded bg-white/[0.07]" />
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-28 bg-surface" />)}
        </div>
        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <div className="h-80 rounded-xl border border-white/10 bg-surface-subtle" />
          <div className="h-80 rounded-xl border border-white/10 bg-surface-subtle" />
        </div>
      </div>
    </main>
  );
}
