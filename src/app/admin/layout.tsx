import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { getSafeNextPath } from "@/lib/auth/redirects";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabasePubliclyConfigured()) {
    if (process.env.NODE_ENV === "development") return children;
    return <AdminConfigurationRequired />;
  }

  let authorizationError: AuthorizationError | null = null;

  try {
    await requireAdmin();
  } catch (error) {
    if (!(error instanceof AuthorizationError)) throw error;
    authorizationError = error;
  }

  if (authorizationError?.code === "unauthenticated") {
    const requestHeaders = await headers();
    const nextPath = getSafeNextPath(
      requestHeaders.get("x-websystembuilders-pathname"),
      "/admin/systems",
    );
    redirect(`/auth/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  if (authorizationError) redirect("/auth/unauthorized");

  return children;
}

function AdminConfigurationRequired() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-16 text-center">
      <div className="max-w-xl">
        <span className="mx-auto grid size-12 place-items-center rounded-xl border border-amber-300/20 bg-amber-300/[0.06] text-xs font-semibold text-amber-200" aria-hidden="true">SET</span>
        <h1 className="mt-6 text-[clamp(2.4rem,7vw,4.5rem)] font-semibold leading-none tracking-[-0.06em]">Administrator access is not configured.</h1>
        <p className="mt-5 text-base leading-7 text-secondary">This environment is missing its authentication connection. The admin workspace stays closed until secure access is available.</p>
        <Link href="/" className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[9px] border border-white/15 px-5 text-sm font-semibold hover:bg-white/[0.04]">Return to the public site</Link>
      </div>
    </main>
  );
}
