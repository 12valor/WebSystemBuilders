import Link from "next/link";

const inputClass = "min-h-11 w-full rounded-lg border border-white/15 bg-background px-3 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none";
const textareaClass = `${inputClass} min-h-28 resize-y py-3 leading-6`;

const sections = [
  ["Basic information", "basic"],
  ["Media", "media"],
  ["Features", "features"],
  ["Pricing and sale", "pricing"],
  ["Files and versions", "files"],
  ["License and delivery", "license"],
  ["SEO", "seo"],
] as const;

export function AdminSystemEditor() {
  return (
    <main id="admin-content">
      <div className="sticky top-16 z-10 border-b border-white/10 bg-[#090a0b]/95 px-5 py-4 backdrop-blur-md sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/systems" aria-label="Back to systems" className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 text-secondary hover:text-foreground">&larr;</Link>
            <div><div className="flex items-center gap-2"><h1 className="text-xl font-semibold tracking-[-0.03em]">New system</h1><span className="rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-2 py-0.5 text-[0.68rem] font-semibold text-amber-300">Draft</span></div><p className="mt-1 text-xs text-muted">Changes are not saved in this Phase 1 preview.</p></div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex">
            <button type="button" disabled className="min-h-10 cursor-not-allowed rounded-lg border border-white/10 px-4 text-xs font-semibold text-muted">Save draft</button>
            <button type="button" disabled className="min-h-10 cursor-not-allowed rounded-lg border border-white/10 px-4 text-xs font-semibold text-muted">Preview</button>
            <button type="button" disabled className="min-h-10 cursor-not-allowed rounded-lg bg-white/10 px-4 text-xs font-semibold text-muted">Publish</button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[220px_minmax(0,760px)_minmax(240px,1fr)] lg:px-10 lg:py-10">
        <nav aria-label="System editor sections" className="hidden h-fit rounded-xl border border-white/10 bg-surface p-2 lg:sticky lg:top-36 lg:grid">
          {sections.map(([label, id]) => <a key={id} href={`#${id}`} className="min-h-10 rounded-lg px-3 py-2.5 text-sm text-secondary hover:bg-white/[0.04] hover:text-foreground">{label}</a>)}
        </nav>

        <form className="grid gap-6" aria-label="System editor preview">
          <label className="grid gap-2 text-xs font-semibold text-secondary lg:hidden"><span>Editor section</span><select className={inputClass}>{sections.map(([label]) => <option key={label}>{label}</option>)}</select></label>

          <EditorSection id="basic" number="01" title="Basic information" description="Define how the system is identified and positioned in the catalog.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="system-name" label="System name" placeholder="Required" />
              <Field id="system-slug" label="URL slug" placeholder="generated-from-name" />
              <SelectField id="system-audience" label="Audience" options={["Select audience", "Students", "Business", "Both"]} />
              <SelectField id="system-category" label="Category" options={["Select category", "Point of Sale", "Inventory Management", "Warehouse Management", "Capstone Systems", "Thesis-Related Systems"]} />
              <SelectField id="product-type" label="Product type" options={["Ready-made system", "Customizable template", "Custom development"]} />
              <SelectField id="system-status" label="Initial status" options={["Draft", "Unlisted"]} />
            </div>
            <TextAreaField id="short-description" label="Short description" hint="Used on catalog cards. Keep it clear and specific." />
            <TextAreaField id="full-description" label="Full description" hint="Explain intended users, outcomes, limitations, and workflow." />
          </EditorSection>

          <EditorSection id="media" number="02" title="Media" description="Add real product screenshots, cover media, and an optional demo.">
            <div className="rounded-xl border border-dashed border-white/15 bg-background px-6 py-10 text-center">
              <p className="font-semibold">No media uploaded</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-secondary">Private media upload and ordering will connect to Supabase Storage in Phase 2.</p>
              <button type="button" disabled className="mt-5 min-h-10 cursor-not-allowed rounded-lg border border-white/10 px-4 text-sm font-semibold text-muted">Upload media</button>
            </div>
            <Field id="demo-url" label="Demo URL" type="url" placeholder="Optional secure demo link" />
          </EditorSection>

          <EditorSection id="features" number="03" title="Features and package" description="State exactly what the buyer receives and what is excluded.">
            <TextAreaField id="system-features" label="Features" hint="Enter one customer-facing feature per line." />
            <div className="grid gap-5 sm:grid-cols-2"><TextAreaField id="package-inclusions" label="Package inclusions" /><TextAreaField id="package-exclusions" label="Package exclusions" /></div>
            <Field id="technology-stack" label="Technology stack" placeholder="Frameworks, database, and required services" />
          </EditorSection>

          <EditorSection id="pricing" number="04" title="Pricing and manual sale" description="Prices are stored in PHP and validated on the server before checkout.">
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField id="pricing-mode" label="Pricing mode" options={["Fixed price", "Starting price", "Request a quote"]} />
              <SelectField id="currency" label="Base currency" options={["PHP - Philippine peso"]} />
              <Field id="regular-price" label="Regular price" type="number" min="0" step="0.01" placeholder="Enter amount" />
              <Field id="sale-price" label="Sale price" type="number" min="0" step="0.01" placeholder="Optional" />
            </div>
            <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-background p-4 text-sm text-secondary"><input type="checkbox" className="mt-1 size-4 accent-blue-500" /><span><strong className="block text-foreground">Activate sale price manually</strong><span className="mt-1 block leading-6">New orders use the validated sale price only while this setting is active.</span></span></label>
          </EditorSection>

          <EditorSection id="files" number="05" title="Files and versions" description="Delivery files stay private and are never exposed as permanent public URLs.">
            <div className="grid gap-5 sm:grid-cols-2"><Field id="system-version" label="Version" placeholder="Required before publishing" /><SelectField id="delivery-method" label="Delivery method" options={["Private uploaded ZIP", "Protected external URL", "Manual delivery"]} /></div>
            <TextAreaField id="release-notes" label="Release notes" />
            <div className="rounded-xl border border-dashed border-white/15 bg-background px-6 py-8 text-center"><p className="font-semibold">No delivery file attached</p><p className="mt-2 text-sm text-secondary">ZIP upload becomes available with private storage.</p><button type="button" disabled className="mt-5 min-h-10 cursor-not-allowed rounded-lg border border-white/10 px-4 text-sm font-semibold text-muted">Attach delivery file</button></div>
          </EditorSection>

          <EditorSection id="license" number="06" title="License, support, and delivery" description="Keep commercial permissions and service boundaries visible before purchase.">
            <SelectField id="license-type" label="License" options={["Broad non-exclusive commercial source license"]} />
            <div className="grid gap-5 sm:grid-cols-2"><Field id="support-days" label="Included support" value="30 days" readOnly /><Field id="delivery-estimate" label="Delivery estimate" placeholder="Shown on the product page" /></div>
            <TextAreaField id="system-requirements" label="System requirements" />
            <TextAreaField id="license-summary" label="Customer-facing license summary" />
          </EditorSection>

          <EditorSection id="seo" number="07" title="Search presentation" description="Public pages use these fields only after the system is published.">
            <Field id="seo-title" label="SEO title" placeholder="Defaults to system name" />
            <TextAreaField id="seo-description" label="SEO description" hint="Summarize the real product without unsupported claims." />
          </EditorSection>
        </form>

        <aside className="h-fit rounded-xl border border-white/10 bg-surface p-5 lg:sticky lg:top-36">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Publication readiness</p>
          <h2 className="mt-3 text-lg font-semibold tracking-[-0.025em]">Complete required fields</h2>
          <p className="mt-2 text-sm leading-6 text-secondary">Publishing remains blocked until the record has the minimum trustworthy product and delivery information.</p>
          <ul className="mt-5 grid gap-3 text-sm text-secondary">
            {["Name, slug, audience, and category", "Descriptions and real media", "Pricing and PHP amount", "Version and private delivery file", "License, support, and requirements", "SEO title and description"].map((item) => <li key={item} className="grid grid-cols-[18px_1fr] gap-2"><span className="text-amber-300" aria-hidden="true">!</span><span>{item}</span></li>)}
          </ul>
          <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-5 text-muted">Server validation and administrator authorization will enforce these rules in Phase 2.</p>
        </aside>
      </div>
    </main>
  );
}

function EditorSection({ id, number, title, description, children }: { id: string; number: string; title: string; description: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-36 rounded-xl border border-white/10 bg-surface-subtle p-5 sm:p-7"><div className="mb-6 grid grid-cols-[28px_1fr] gap-3 border-b border-white/10 pb-5"><span className="text-xs text-muted">{number}</span><div><h2 className="text-xl font-semibold tracking-[-0.03em]">{title}</h2><p className="mt-1 text-sm leading-6 text-secondary">{description}</p></div></div><div className="grid gap-5">{children}</div></section>;
}

function Field({ id, label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) {
  return <label htmlFor={id} className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span><input id={id} className={inputClass} {...props} /></label>;
}

function SelectField({ id, label, options }: { id: string; label: string; options: string[] }) {
  return <label htmlFor={id} className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span><select id={id} className={inputClass}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function TextAreaField({ id, label, hint }: { id: string; label: string; hint?: string }) {
  return <label htmlFor={id} className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span><textarea id={id} className={textareaClass} />{hint && <span className="font-normal leading-5 text-muted">{hint}</span>}</label>;
}
