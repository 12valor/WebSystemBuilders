export function CatalogCardIllustration({ categorySlug, title }: { categorySlug?: string; title: string }) {
  const slug = (categorySlug || "").toLowerCase();

  if (slug.includes("pos") || title.toLowerCase().includes("point of sale")) {
    return (
      <div className="relative size-full bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
        <div className="absolute -right-6 -top-6 size-32 rounded-full bg-white/10 blur-xl" />
        <div className="size-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20 shadow-inner">
          💳
        </div>
        <span className="mt-3 text-xs font-bold uppercase tracking-wider text-blue-100/90">POS & Cashier System</span>
      </div>
    );
  }

  if (slug.includes("student") || slug.includes("capstone") || title.toLowerCase().includes("school")) {
    return (
      <div className="relative size-full bg-gradient-to-br from-purple-600 to-violet-700 flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
        <div className="absolute -left-6 -bottom-6 size-32 rounded-full bg-white/10 blur-xl" />
        <div className="size-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20 shadow-inner">
          🎓
        </div>
        <span className="mt-3 text-xs font-bold uppercase tracking-wider text-purple-100/90">Capstone & Academic System</span>
      </div>
    );
  }

  if (slug.includes("inventory") || slug.includes("warehouse")) {
    return (
      <div className="relative size-full bg-gradient-to-br from-amber-500 to-orange-600 flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
        <div className="absolute -right-6 -bottom-6 size-32 rounded-full bg-white/10 blur-xl" />
        <div className="size-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20 shadow-inner">
          📦
        </div>
        <span className="mt-3 text-xs font-bold uppercase tracking-wider text-amber-100/90">Inventory & Stock System</span>
      </div>
    );
  }

  if (slug.includes("ecommerce") || slug.includes("booking") || slug.includes("hotel")) {
    return (
      <div className="relative size-full bg-gradient-to-br from-emerald-600 to-teal-700 flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
        <div className="absolute -left-6 -top-6 size-32 rounded-full bg-white/10 blur-xl" />
        <div className="size-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20 shadow-inner">
          🛍️
        </div>
        <span className="mt-3 text-xs font-bold uppercase tracking-wider text-emerald-100/90">E-Commerce & Booking</span>
      </div>
    );
  }

  return (
    <div className="relative size-full bg-gradient-to-br from-slate-700 to-slate-900 flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
      <div className="absolute -right-6 -top-6 size-32 rounded-full bg-blue-500/10 blur-xl" />
      <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl border border-white/15 shadow-inner">
        💻
      </div>
      <span className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-300">Management System</span>
    </div>
  );
}
