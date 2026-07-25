import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getDownloadGrant } from "@/features/delivery/repository";

export const metadata: Metadata = { title: "Private delivery", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DownloadPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const grant = await getDownloadGrant(token);
  return <><SiteHeader /><main id="main-content" className="grid min-h-[66vh] place-items-center px-5 py-16"><section className="w-full max-w-3xl rounded-2xl border border-white/10 bg-surface p-7 sm:p-9">{grant ? <><p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Private delivery - {grant.orderNumber}</p><h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Your system files.</h1><p className="mt-4 leading-7 text-secondary">{grant.productName}, version {grant.versionLabel}. This private link expires {formatDate(grant.expiresAt)} and must not be shared.</p><div className="mt-7 grid gap-3">{grant.files.map((file) => <a key={file.id} href={`/api/downloads/${encodeURIComponent(token)}/${file.id}`} className="flex min-h-16 items-center justify-between gap-5 rounded-xl border border-white/10 bg-background px-4 py-3 hover:border-white/20"><span className="min-w-0"><strong className="block truncate">{file.filename}</strong><span className="mt-1 block text-xs text-muted">{formatBytes(file.byteSize)}</span></span><span className="text-sm font-semibold text-brand-hover">Download</span></a>)}</div><p className="mt-5 text-xs leading-5 text-muted">{grant.downloadCount} of {grant.maxDownloads} file downloads used. Each file request consumes one use.</p></> : <><h1 className="text-4xl font-semibold tracking-[-0.05em]">Delivery link unavailable.</h1><p className="mt-4 leading-7 text-secondary">The link is invalid, expired, revoked, exhausted, awaiting email confirmation, or no longer belongs to a paid order. No private file information is shown.</p></>}<Link href="/contact" className="mt-7 inline-flex min-h-11 items-center rounded-[9px] border border-white/15 px-5 font-semibold">Contact support</Link></section></main><SiteFooter /></>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(value)); }
function formatBytes(value: number | null) { if (!value) return "File size unavailable"; if (value < 1024 * 1024) return `${Math.ceil(value / 1024)} KB`; return `${(value / (1024 * 1024)).toFixed(1)} MB`; }
