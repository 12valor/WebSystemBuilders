import Link from "next/link";

export function AdminSystemsList() {
  return (
    <main id="admin-content" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Catalog management</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Systems</h1>
            <p className="mt-2 max-w-2xl text-secondary">Create, prepare, preview, and publish the products that appear in the public catalog.</p>
          </div>
          <Link href="/admin/systems/new" className="inline-flex min-h-11 items-center justify-center rounded-[9px] bg-foreground px-5 font-semibold text-background">Create system</Link>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:max-w-2xl">
          <Metric label="Published" value="0" />
          <Metric label="Drafts" value="0" />
          <Metric label="Archived" value="0" />
        </div>

        <section aria-labelledby="systems-table-title" className="mt-8">
          <h2 id="systems-table-title" className="sr-only">System records</h2>
          <div className="grid gap-3 rounded-t-xl border border-white/10 bg-surface p-4 md:grid-cols-[minmax(240px,1fr)_160px_160px_190px]">
            <label className="grid gap-2 text-xs font-semibold text-secondary"><span>Search</span><input type="search" placeholder="Name or slug" className="min-h-10 rounded-lg border border-white/15 bg-background px-3 text-sm placeholder:text-muted focus:border-brand focus:outline-none" /></label>
            <Filter label="Status" options={["All statuses", "Draft", "Published", "Unlisted", "Archived"]} />
            <Filter label="Audience" options={["All audiences", "Students", "Business", "Both"]} />
            <Filter label="Category" options={["All categories", "Point of Sale", "Inventory", "Warehouse", "Capstone", "Thesis-related"]} />
          </div>

          <div className="overflow-hidden rounded-b-xl border-x border-b border-white/10 bg-surface-subtle">
            <div className="hidden grid-cols-[minmax(240px,1fr)_140px_120px_130px_150px_48px] gap-4 border-b border-white/10 px-5 py-3 text-xs font-semibold text-muted lg:grid">
              <span>System</span><span>Price</span><span>Version</span><span>Status</span><span>Updated</span><span className="sr-only">Actions</span>
            </div>
            <div className="grid min-h-[360px] place-items-center px-6 py-14 text-center">
              <div className="max-w-md">
                <span className="mx-auto grid size-12 place-items-center rounded-xl border border-white/10 bg-surface text-lg text-brand-hover" aria-hidden="true">0</span>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">No systems have been added.</h3>
                <p className="mt-2 leading-6 text-secondary">Your systems will stay private as drafts until all required product, pricing, media, license, and delivery details are complete and you publish them.</p>
                <Link href="/admin/systems/new" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[9px] border border-white/15 px-5 font-semibold hover:bg-white/[0.04]">Create your first system</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="bg-surface p-5"><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p></div>;
}

function Filter({ label, options }: { label: string; options: string[] }) {
  return <label className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span><select className="min-h-10 rounded-lg border border-white/15 bg-background px-3 text-sm font-normal focus:border-brand focus:outline-none">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
