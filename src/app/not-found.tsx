import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="grid min-h-[70vh] place-items-center bg-background px-5 py-16 text-center"><div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">404</p><h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em]">Page not found.</h1><p className="mt-4 leading-7 text-secondary">The address may be outdated, private, or unavailable.</p><Link href="/" className="mt-7 inline-flex min-h-11 items-center rounded-lg border border-white/15 px-5 text-sm font-semibold">Return home</Link></div></main>;
}
