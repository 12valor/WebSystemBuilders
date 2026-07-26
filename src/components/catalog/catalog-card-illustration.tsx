export function CatalogCardIllustration({ categorySlug, title }: { categorySlug?: string; title: string }) {
  const slug = (categorySlug || "").toLowerCase();

  if (slug.includes("pos") || title.toLowerCase().includes("point of sale")) {
    return (
      <div className="relative size-full bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
        <div className="absolute -right-6 -top-6 size-32 rounded-full bg-white/10 blur-xl" />
        <div className="size-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
          <svg className="size-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="mt-3 text-xs font-bold uppercase tracking-wider text-blue-100/90">POS & Cashier System</span>
      </div>
    );
  }

  if (slug.includes("student") || slug.includes("capstone") || title.toLowerCase().includes("school")) {
    return (
      <div className="relative size-full bg-gradient-to-br from-purple-600 to-violet-700 flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
        <div className="absolute -left-6 -bottom-6 size-32 rounded-full bg-white/10 blur-xl" />
        <div className="size-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
          <svg className="size-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <span className="mt-3 text-xs font-bold uppercase tracking-wider text-purple-100/90">Capstone & Academic System</span>
      </div>
    );
  }

  if (slug.includes("inventory") || slug.includes("warehouse")) {
    return (
      <div className="relative size-full bg-gradient-to-br from-amber-500 to-orange-600 flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
        <div className="absolute -right-6 -bottom-6 size-32 rounded-full bg-white/10 blur-xl" />
        <div className="size-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
          <svg className="size-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <span className="mt-3 text-xs font-bold uppercase tracking-wider text-amber-100/90">Inventory & Stock System</span>
      </div>
    );
  }

  if (slug.includes("ecommerce") || slug.includes("booking") || slug.includes("hotel")) {
    return (
      <div className="relative size-full bg-gradient-to-br from-emerald-600 to-teal-700 flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
        <div className="absolute -left-6 -top-6 size-32 rounded-full bg-white/10 blur-xl" />
        <div className="size-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
          <svg className="size-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <span className="mt-3 text-xs font-bold uppercase tracking-wider text-emerald-100/90">E-Commerce & Booking</span>
      </div>
    );
  }

  return (
    <div className="relative size-full bg-gradient-to-br from-slate-700 to-slate-900 flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
      <div className="absolute -right-6 -top-6 size-32 rounded-full bg-blue-500/10 blur-xl" />
      <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15 shadow-inner">
        <svg className="size-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <span className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-300">Management System</span>
    </div>
  );
}
