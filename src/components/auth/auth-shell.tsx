import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10">
        <div className="mx-auto flex min-h-[74px] w-[min(calc(100%-40px),1120px)] items-center justify-between gap-6 md:w-[min(calc(100%-64px),1120px)]">
          <Link href="/" aria-label="WebSystemBuilders home">
            <BrandLogo priority className="h-auto w-[184px] sm:w-[214px]" />
          </Link>
          <Link href="/systems" className="text-sm font-semibold text-secondary transition-colors hover:text-foreground">
            Browse systems
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
