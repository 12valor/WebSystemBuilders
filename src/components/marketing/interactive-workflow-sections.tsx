"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  Minus,
  PackageCheck,
  Plus,
  ReceiptText,
  RefreshCw,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

type OperationsView = "checkout" | "inventory";
type CartState = Record<string, number>;

type DemoProduct = {
  id: string;
  name: string;
  detail: string;
  price: number;
};

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  threshold: number;
};

const demoProducts: DemoProduct[] = [
  { id: "beans", name: "Coffee beans", detail: "1 kg house blend", price: 320 },
  { id: "cups", name: "Paper cups", detail: "Pack of 50", price: 110 },
  { id: "labels", name: "Barcode labels", detail: "Thermal roll", price: 85 },
];

const initialInventory: InventoryItem[] = [
  { id: "coffee", name: "Coffee beans", sku: "CB-001", stock: 12, threshold: 5 },
  { id: "paper", name: "Paper cups", sku: "PC-050", stock: 8, threshold: 10 },
  { id: "syrup", name: "Vanilla syrup", sku: "VS-750", stock: 4, threshold: 6 },
];

function formatDemoMoney(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function BusinessWorkflowPlayground() {
  const [view, setView] = useState<OperationsView>("checkout");
  const [cart, setCart] = useState<CartState>({ beans: 1 });
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [saleComplete, setSaleComplete] = useState(false);
  const [inventory, setInventory] = useState(initialInventory);

  const total = useMemo(
    () => demoProducts.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0),
    [cart],
  );

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  const changeQuantity = (productId: string, delta: number) => {
    setSaleComplete(false);
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[productId] ?? 0) + delta);
      return { ...current, [productId]: nextQuantity };
    });
  };

  const changeStock = (itemId: string, delta: number) => {
    setInventory((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, stock: Math.max(0, item.stock + delta) } : item,
      ),
    );
  };

  return (
    <section aria-labelledby="operations-playground-title" className="relative overflow-hidden border-y border-slate-200 bg-white py-20 sm:py-28">
      <div className="relative mx-auto grid w-[min(calc(100%-40px),1280px)] items-center gap-12 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            <Sparkles className="size-3.5" /> Interactive business preview
          </span>
          <h2 id="operations-playground-title" className="mt-5 text-3xl font-bold tracking-[-0.035em] text-[#0F172A] sm:text-4xl lg:text-5xl">
            Try the workflow, not just the screenshot.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Switch between a retail checkout and an inventory workspace. Every control runs locally with demo data so visitors can understand the experience before discussing a build.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <FeatureLine icon={ShoppingCart} title="Checkout flow" copy="Add products, change quantities, choose a payment method, and generate a demo receipt." />
            <FeatureLine icon={Boxes} title="Inventory control" copy="Simulate stock movement and see low-stock rules update immediately." />
          </div>

          <Link href="/for-business" className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0F172A] px-5 text-sm font-semibold text-white transition hover:bg-blue-700">
            Explore business systems <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0B1120] shadow-[0_28px_70px_-24px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-slate-500/80" />
                <span className="size-2.5 rounded-full bg-slate-400/80" />
                <span className="size-2.5 rounded-full bg-slate-300/80" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Operations interface demo</span>
            </div>
            <span className="w-fit rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Demo data only</span>
          </div>

          <div className="border-b border-white/10 p-3 sm:p-4">
            <div role="tablist" aria-label="Business interface previews" className="grid grid-cols-2 rounded-xl bg-white/5 p-1">
              <PreviewTab active={view === "checkout"} onClick={() => setView("checkout")} icon={ReceiptText} label="Retail checkout" />
              <PreviewTab active={view === "inventory"} onClick={() => setView("inventory")} icon={Boxes} label="Inventory control" />
            </div>
          </div>

          <div className="min-h-[520px] p-4 sm:p-6">
            {view === "checkout" ? (
              <div className="grid gap-5 xl:grid-cols-[1fr_0.78fr]">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div><p className="text-xs font-semibold text-white">Quick products</p><p className="mt-1 text-[11px] text-slate-500">Tap an item to add it to the demo cart.</p></div>
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-300">{cartCount} item{cartCount === 1 ? "" : "s"}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    {demoProducts.map((product) => (
                      <button key={product.id} type="button" onClick={() => changeQuantity(product.id, 1)} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-blue-400/40 hover:bg-blue-500/10">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-blue-300"><PackageCheck className="size-4.5" /></span>
                        <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-white">{product.name}</span><span className="mt-1 block text-[10px] text-slate-500">{product.detail}</span></span>
                        <span className="text-xs font-semibold text-slate-300">{formatDemoMoney(product.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex items-center justify-between"><p className="text-xs font-semibold text-white">Current sale</p><ShoppingCart className="size-4 text-slate-500" /></div>
                  <div className="mt-4 space-y-3">
                    {demoProducts.filter((product) => (cart[product.id] ?? 0) > 0).map((product) => (
                      <div key={product.id} className="flex items-center gap-2.5">
                        <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-semibold text-slate-200">{product.name}</p><p className="mt-0.5 text-[10px] text-slate-500">{formatDemoMoney(product.price * (cart[product.id] ?? 0))}</p></div>
                        <div className="flex items-center rounded-lg border border-white/10 bg-slate-950/50">
                          <button type="button" aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(product.id, -1)} className="grid size-7 place-items-center text-slate-400 hover:text-white"><Minus className="size-3" /></button>
                          <span className="w-6 text-center text-[11px] font-semibold text-white">{cart[product.id]}</span>
                          <button type="button" aria-label={`Add one ${product.name}`} onClick={() => changeQuantity(product.id, 1)} className="grid size-7 place-items-center text-slate-400 hover:text-white"><Plus className="size-3" /></button>
                        </div>
                      </div>
                    ))}
                    {cartCount === 0 && <p className="rounded-xl border border-dashed border-white/10 px-3 py-8 text-center text-[11px] text-slate-500">Add a product to begin.</p>}
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Payment method</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {["Cash", "GCash", "QRPh"].map((method) => (
                        <button key={method} type="button" onClick={() => { setPaymentMethod(method); setSaleComplete(false); }} className={`rounded-lg border px-2 py-2 text-[10px] font-semibold transition ${paymentMethod === method ? "border-blue-400 bg-blue-500/15 text-blue-200" : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"}`}>{method}</button>
                      ))}
                    </div>
                    <div className="mt-4 flex items-end justify-between"><div><p className="text-[10px] text-slate-500">Demo total</p><p className="mt-1 text-xl font-bold text-white">{formatDemoMoney(total)}</p></div><span className="text-[10px] text-slate-500">via {paymentMethod}</span></div>
                    <button type="button" disabled={cartCount === 0} onClick={() => setSaleComplete(true)} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 text-xs font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40">Complete demo sale <ChevronRight className="size-3.5" /></button>
                    <div aria-live="polite" className="min-h-9">
                      {saleComplete && <p className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[10px] font-semibold text-emerald-300"><CheckCircle2 className="size-3.5" /> Demo receipt generated. No payment was created.</p>}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-sm font-semibold text-white">Stock overview</p><p className="mt-1 text-[11px] text-slate-500">Change quantities to see threshold rules react.</p></div>
                  <button type="button" onClick={() => setInventory(initialInventory)} className="inline-flex min-h-9 w-fit items-center gap-2 rounded-full border border-white/10 px-3 text-[10px] font-semibold text-slate-300 hover:bg-white/5"><RefreshCw className="size-3" /> Reset demo</button>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <MiniMetric label="Tracked items" value={String(inventory.length)} icon={Boxes} />
                  <MiniMetric label="Low stock" value={String(inventory.filter((item) => item.stock <= item.threshold).length)} icon={BarChart3} />
                  <MiniMetric label="Total units" value={String(inventory.reduce((sum, item) => sum + item.stock, 0))} icon={PackageCheck} />
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                  <div className="hidden grid-cols-[1fr_90px_180px] gap-4 border-b border-white/10 bg-white/[0.04] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:grid"><span>Item</span><span>Stock</span><span>Actions</span></div>
                  {inventory.map((item) => {
                    const isLow = item.stock <= item.threshold;
                    return (
                      <div key={item.id} className="grid gap-3 border-t border-white/10 p-4 first:border-t-0 sm:grid-cols-[1fr_90px_180px] sm:items-center sm:gap-4">
                        <div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-semibold text-white">{item.name}</p>{isLow && <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-300">Low stock</span>}</div><p className="mt-1 text-[10px] text-slate-500">{item.sku} · threshold {item.threshold}</p></div>
                        <p className={`text-lg font-bold ${isLow ? "text-amber-300" : "text-emerald-300"}`}>{item.stock}</p>
                        <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => changeStock(item.id, -1)} className="min-h-9 rounded-lg border border-white/10 text-[10px] font-semibold text-slate-300 hover:bg-white/5">Simulate sale</button><button type="button" onClick={() => changeStock(item.id, 10)} className="min-h-9 rounded-lg bg-blue-600/20 text-[10px] font-semibold text-blue-200 hover:bg-blue-600/30">Restock +10</button></div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-[10px] leading-4 text-slate-500">This simulation is illustrative. Inventory changes are not saved or sent anywhere.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectRoadmapIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 760 560"
      className="size-full"
      fill="none"
    >
      <rect width="760" height="560" rx="42" fill="#EAF0F8" />
      <circle cx="632" cy="94" r="112" fill="#BFDBFE" />
      <circle cx="110" cy="468" r="144" fill="#BFDBFE" />

      <path
        d="M108 402C190 402 185 306 274 306C361 306 348 202 452 202C544 202 542 118 644 118"
        stroke="#FFFFFF"
        strokeWidth="24"
        strokeLinecap="round"
        opacity="0.78"
      />
      <path
        d="M108 402C190 402 185 306 274 306C361 306 348 202 452 202C544 202 542 118 644 118"
        stroke="#2563EB"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="10 12"
      />

      <g transform="translate(54 50)">
        <rect width="218" height="116" rx="22" fill="#FFFFFF" stroke="#0F172A" strokeWidth="5" />
        <rect x="24" y="25" width="54" height="64" rx="10" fill="#DBEAFE" />
        <path d="M39 43H63M39 56H63M39 69H55" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
        <text x="96" y="47" fill="#0F172A" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="17" fontWeight="700">Project plan</text>
        <text x="96" y="74" fill="#64748B" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="13">Scope and milestones</text>
      </g>

      <g transform="translate(78 367)">
        <circle cx="30" cy="35" r="30" fill="#2563EB" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M19 35L27 43L43 27" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="72" width="176" height="70" rx="18" fill="#FFFFFF" />
        <text x="94" y="30" fill="#0F172A" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="16" fontWeight="700">Requirements</text>
        <text x="94" y="52" fill="#64748B" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="12">Confirmed</text>
      </g>

      <g transform="translate(244 271)">
        <circle cx="30" cy="35" r="30" fill="#2563EB" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M20 26H40V43H20Z" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
        <rect x="72" width="164" height="70" rx="18" fill="#FFFFFF" />
        <text x="94" y="30" fill="#0F172A" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="16" fontWeight="700">Prototype</text>
        <text x="94" y="52" fill="#64748B" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="12">Ready to review</text>
      </g>

      <g transform="translate(422 167)">
        <circle cx="30" cy="35" r="30" fill="#2563EB" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M17 35H43M30 22V48" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        <rect x="72" width="150" height="70" rx="18" fill="#FFFFFF" />
        <text x="94" y="30" fill="#0F172A" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="16" fontWeight="700">Build</text>
        <text x="94" y="52" fill="#64748B" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="12">In progress</text>
      </g>

      <g transform="translate(614 83)">
        <circle cx="30" cy="35" r="30" fill="#0F172A" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M19 35L27 43L43 27" stroke="#60A5FA" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <g transform="translate(482 374)">
        <rect width="224" height="116" rx="22" fill="#FFFFFF" stroke="#0F172A" strokeWidth="5" />
        <path d="M44 85L26 102V84" fill="#FFFFFF" stroke="#0F172A" strokeWidth="5" strokeLinejoin="round" />
        <circle cx="38" cy="36" r="13" fill="#DBEAFE" />
        <path d="M62 31H180M62 50H148" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
        <rect x="24" y="69" width="138" height="9" rx="4.5" fill="#E2E8F0" />
        <circle cx="185" cy="76" r="18" fill="#10B981" />
        <path d="M176 76L182 82L194 69" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function ProjectWorkspacePlayground() {
  return (
    <section
      aria-labelledby="project-workspace-title"
      className="relative overflow-hidden border-y border-slate-200 bg-[#F3F6FB] py-20 sm:py-28"
    >
      <div className="relative mx-auto grid w-[min(calc(100%-40px),1280px)] items-center gap-12 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-[#EAF0F8] p-3 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.22)] sm:p-5">
          <div className="aspect-[4/3] overflow-hidden rounded-[24px]">
            <ProjectRoadmapIllustration />
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            <ClipboardCheck className="size-3.5" />
            Structured project support
          </span>
          <h2 id="project-workspace-title" className="mt-5 text-3xl font-bold tracking-[-0.035em] text-[#0F172A] sm:text-4xl lg:text-5xl">
            Make project progress visible and reviewable.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
            See how requirements, milestones, deliverables, and review notes can stay organized throughout an ethical student-development engagement.
          </p>
          <div className="mt-7 space-y-3">
            <FeatureLine icon={LayoutDashboard} title="Clear milestones" copy="Show what is confirmed, what is being built, and what still needs review." />
            <FeatureLine icon={ClipboardCheck} title="Structured feedback" copy="Keep revision requests attached to the correct stage and deliverable." />
          </div>
          <Link
            href="/for-students"
            className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5"
          >
            Explore student support
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
function FeatureLine({ icon: Icon, title, copy }: { icon: typeof ShoppingCart; title: string; copy: string }) {
  return <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon className="size-4.5" /></span><div><p className="text-sm font-semibold text-slate-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{copy}</p></div></div>;
}

function PreviewTab({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof ShoppingCart; label: string }) {
  return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-[11px] font-semibold transition ${active ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"}`}><Icon className="size-3.5" />{label}</button>;
}

function MiniMetric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Boxes }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-slate-500">{label}</span><Icon className="size-3.5 text-slate-500" /></div><p className="mt-2 text-lg font-bold text-white">{value}</p></div>;
}