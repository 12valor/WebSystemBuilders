import Image from "next/image";
import { ShoppingCart, Boxes, Code2, GraduationCap } from "lucide-react";

export function FloatingSoftwareMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[1180px] select-none px-2 pb-0 pt-3 sm:px-4 sm:pt-4">

      {/* Centerpiece Hero Product Showcase (mockup.svg) - UNCONSTRAINED FULL SIZE */}
      <div className="relative z-10 mx-auto flex w-full items-center justify-center">
        <div className="mx-auto w-full max-w-[960px] drop-shadow-[0_22px_42px_rgba(15,23,42,0.1)] xl:max-w-[1040px]">
          <Image
            src="/mockup.svg"
            alt="WebSystemBuilders Software Platform Showcase"
            width={1350}
            height={1080}
            priority
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 90vw, 1040px"
            className="w-full h-auto object-contain block mx-auto"
          />
        </div>
      </div>

      {/* ABSOLUTE OVERLAY FLOATING CARDS WITH CURLY CONNECTOR LINES (Desktop lg+ Only) */}
      <div className="hidden lg:block absolute inset-0 z-30 pointer-events-none">
        {/* ================= CARD 1: TOP LEFT (POS & Sales) ================= */}
        <div className="pointer-events-auto absolute left-[1%] top-[6%] w-[210px] -rotate-2 rounded-[20px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_36px_-18px_rgba(15,23,42,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 motion-reduce:transform-none motion-reduce:transition-none xl:left-[-8px] xl:w-[224px]">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100/80 shadow-xs mb-3">
            <ShoppingCart className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">POS & Sales System</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[170px]">
            Streamline sales, invoices, and transactions.
          </p>
        </div>

        {/* Curly Connector Line 1 (Top Left) */}
        <svg className="absolute top-[18%] left-[17%] xl:left-[16%] w-24 h-16 pointer-events-none" viewBox="0 0 100 60" fill="none">
          <path d="M 10 10 Q 50 40 90 50" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="90" cy="50" r="3" fill="#94A3B8" />
        </svg>

        {/* ================= CARD 2: BOTTOM LEFT (Inventory & Warehouse) ================= */}
        <div className="pointer-events-auto absolute bottom-[16%] left-0 w-[210px] rotate-2 rounded-[20px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_36px_-18px_rgba(15,23,42,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 motion-reduce:transform-none motion-reduce:transition-none xl:left-[-8px] xl:w-[224px]">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100/80 shadow-xs mb-3">
            <Boxes className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">Inventory & Warehouse</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[170px]">
            Track stock, manage suppliers, and warehouses.
          </p>
        </div>

        {/* Curly Connector Line 2 (Bottom Left) */}
        <svg className="absolute bottom-[24%] left-[16%] xl:left-[15%] w-24 h-16 pointer-events-none" viewBox="0 0 100 60" fill="none">
          <path d="M 10 50 Q 50 10 90 20" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="90" cy="20" r="3" fill="#94A3B8" />
        </svg>

        {/* ================= CARD 3: TOP RIGHT (Custom Development) ================= */}
        <div className="pointer-events-auto absolute right-[1%] top-[6%] w-[210px] rotate-2 rounded-[20px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_36px_-18px_rgba(15,23,42,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 motion-reduce:transform-none motion-reduce:transition-none xl:right-[-8px] xl:w-[224px]">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100/80 shadow-xs mb-3">
            <Code2 className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">Custom Development</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[170px]">
            Requirements-reviewed software for a defined workflow.
          </p>
        </div>

        {/* ================= CARD 4: BOTTOM RIGHT (Academic & Capstone) ================= */}
        <div className="pointer-events-auto absolute bottom-[16%] right-0 w-[210px] -rotate-2 rounded-[20px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_36px_-18px_rgba(15,23,42,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 motion-reduce:transform-none motion-reduce:transition-none xl:right-[-8px] xl:w-[224px]">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100/80 shadow-xs mb-3">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">Academic & Capstone</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[170px]">
            Ethical technical foundations with disclosed scope.
          </p>
        </div>

        {/* Curly Connector Line 4 (Bottom Right) */}
        <svg className="absolute bottom-[24%] right-[16%] xl:right-[15%] w-24 h-16 pointer-events-none" viewBox="0 0 100 60" fill="none">
          <path d="M 90 50 Q 50 10 10 20" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="10" cy="20" r="3" fill="#94A3B8" />
        </svg>
      </div>

      {/* Mobile & Tablet Responsive Feature Cards Grid (< lg screens) */}
      <div className="mt-6 grid grid-cols-1 gap-3.5 sm:mt-8 sm:grid-cols-2 lg:hidden">
        {/* Card 1 */}
        <div className="rounded-[18px] bg-white/95 p-4 border border-slate-200/80 shadow-sm backdrop-blur-md flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">POS & Sales System</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Streamline sales, invoices, and transactions.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-[18px] bg-white/95 p-4 border border-slate-200/80 shadow-sm backdrop-blur-md flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Inventory & Warehouse</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Track stock, manage suppliers, and warehouses.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-[18px] bg-white/95 p-4 border border-slate-200/80 shadow-sm backdrop-blur-md flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Custom Development</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Requirements-reviewed software for a defined workflow.</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-[18px] bg-white/95 p-4 border border-slate-200/80 shadow-sm backdrop-blur-md flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Academic & Capstone</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Ethical technical foundations with disclosed scope.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
