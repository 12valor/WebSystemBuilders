/* eslint-disable @next/next/no-img-element -- private media previews use short-lived Supabase URLs */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  filterAdminMedia,
  getAdminMediaMetrics,
} from "@/features/catalog/admin-media-filter";
import type {
  AdminMediaData,
  AdminMediaFilters,
  AdminMediaRecord,
} from "@/features/catalog/admin-media-types";
import { removeMedia } from "@/features/catalog/resource-actions";

const inputClass = "min-h-10 rounded-lg border border-white/15 bg-background px-3 text-sm font-normal text-foreground placeholder:text-muted focus:border-brand focus:outline-none";

export function AdminMediaWorkspace({ data }: { data: AdminMediaData }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mediaType, setMediaType] = useState<AdminMediaFilters["mediaType"]>("all");
  const [source, setSource] = useState<AdminMediaFilters["source"]>("all");
  const [systemStatus, setSystemStatus] = useState<AdminMediaFilters["systemStatus"]>("all");
  const [notice, setNotice] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removing, startRemoval] = useTransition();

  const media = useMemo(() => filterAdminMedia(data.media, {
    query,
    mediaType,
    source,
    systemStatus,
  }), [data.media, mediaType, query, source, systemStatus]);
  const metrics = getAdminMediaMetrics(data.media);

  function runRemoval(item: AdminMediaRecord) {
    if (!window.confirm(`Remove this media item from ${item.system.title}?`)) return;

    setNotice(null);
    setRemovingId(item.id);
    startRemoval(async () => {
      const result = await removeMedia(item.system.id, item.id);
      setNotice({
        tone: result.status === "success" ? "success" : "error",
        message: result.message ?? "The media action did not complete.",
      });
      setRemovingId(null);
      if (result.status === "success") router.refresh();
    });
  }

  return (
    <main id="admin-content" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Catalog assets</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Media</h1>
            <p className="mt-2 max-w-2xl text-secondary">Review uploaded images, demo links, and product videos across every system. Uploads and ordering remain attached to the owning system.</p>
          </div>
          <Link href="/admin/systems" className="inline-flex min-h-11 items-center justify-center rounded-[9px] bg-foreground px-5 font-semibold text-background">Choose a system</Link>
        </div>

        {notice && (
          <p role="status" className={`mt-6 rounded-xl border p-4 text-sm ${notice.tone === "success" ? "border-emerald-300/20 bg-emerald-300/[0.06] text-emerald-100" : "border-red-300/20 bg-red-300/[0.06] text-red-100"}`}>
            {notice.message}
          </p>
        )}

        <div className="mt-7 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="All media" value={metrics.total} />
          <Metric label="Uploaded images" value={metrics.uploads} />
          <Metric label="External links" value={metrics.external} />
          <Metric label="Needs attention" value={metrics.needsAttention} />
        </div>

        <section aria-labelledby="media-library-title" className="mt-8">
          <h2 id="media-library-title" className="sr-only">Catalog media library</h2>
          <div className="grid gap-3 rounded-xl border border-white/10 bg-surface p-4 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_170px_170px_180px]">
            <label className="grid gap-2 text-xs font-semibold text-secondary">
              <span>Search</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="System, slug, or description" className={inputClass} />
            </label>
            <Filter label="Media type" value={mediaType} onChange={(value) => setMediaType(value as AdminMediaFilters["mediaType"])} options={[["all", "All media"], ["image", "Images"], ["video", "Videos"], ["demo", "Demos"]]} />
            <Filter label="Source" value={source} onChange={(value) => setSource(value as AdminMediaFilters["source"])} options={[["all", "All sources"], ["upload", "Uploads"], ["external", "External links"]]} />
            <Filter label="System status" value={systemStatus} onChange={(value) => setSystemStatus(value as AdminMediaFilters["systemStatus"])} options={[["all", "All statuses"], ["draft", "Draft"], ["published", "Published"], ["unlisted", "Unlisted"], ["archived", "Archived"]]} />
          </div>

          {media.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {media.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  removing={removing && removingId === item.id}
                  onRemove={() => runRemoval(item)}
                />
              ))}
            </div>
          ) : (
            <MediaEmptyState status={data.status} filtered={data.media.length > 0} />
          )}
        </section>
      </div>
    </main>
  );
}

function MediaCard({ item, removing, onRemove }: { item: AdminMediaRecord; removing: boolean; onRemove: () => void }) {
  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-surface-subtle">
      <div className="grid aspect-[16/9] place-items-center overflow-hidden border-b border-white/10 bg-background">
        {item.source === "upload" && item.previewUrl ? (
          <img src={item.previewUrl} alt={item.altText ?? ""} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="px-6 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-xl border border-white/10 bg-surface text-xs font-semibold uppercase text-brand-hover">{item.mediaType}</span>
            <p className="mt-3 text-xs text-muted">{item.source === "external" ? formatExternalHost(item.externalUrl) : "Signed preview unavailable"}</p>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{item.system.title}</h3>
            <p className="mt-1 truncate text-xs text-muted">/{item.system.slug}</p>
          </div>
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold capitalize text-secondary">{item.system.status}</span>
        </div>

        <p className={`mt-4 min-h-10 text-sm leading-5 ${item.altText ? "text-secondary" : "text-amber-200"}`}>{item.altText ?? "Alternative text is missing."}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
          <div><dt className="text-muted">Type</dt><dd className="mt-1 capitalize text-secondary">{item.mediaType}</dd></div>
          <div><dt className="text-muted">Position</dt><dd className="mt-1 text-secondary">{item.sortOrder + 1}</dd></div>
          <div><dt className="text-muted">Source</dt><dd className="mt-1 capitalize text-secondary">{item.source}</dd></div>
          <div><dt className="text-muted">Added</dt><dd className="mt-1 text-secondary"><time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time></dd></div>
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link href={`/admin/systems/${item.system.id}/edit#resources`} className="inline-flex min-h-10 items-center rounded-lg border border-white/15 px-3 text-xs font-semibold hover:bg-white/[0.04]">Edit system media</Link>
          {item.externalUrl && <a href={item.externalUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-secondary hover:text-foreground">Open link</a>}
          <button type="button" disabled={removing} onClick={onRemove} className="ml-auto text-xs font-semibold text-red-300 hover:text-red-200 disabled:text-muted">{removing ? "Removing..." : "Remove"}</button>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="bg-surface p-5"><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p></div>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <label className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}

function MediaEmptyState({ status, filtered }: { status: AdminMediaData["status"]; filtered: boolean }) {
  const title = status === "unconfigured" ? "The database is not connected." : status === "error" ? "Media records could not be loaded." : filtered ? "No media matches these filters." : "No catalog media has been added.";
  const copy = status === "unconfigured" ? "Connect Supabase and apply the migrations before reviewing persistent media." : status === "error" ? "The workspace hides partial records until the media response can be verified." : filtered ? "Adjust the search or filters to review another asset." : "Open a system record to upload its first image or add a verified demo link.";
  return <div className="mt-5 grid min-h-80 place-items-center rounded-xl border border-white/10 bg-surface-subtle px-6 py-14 text-center"><div className="max-w-md"><span className="mx-auto grid size-12 place-items-center rounded-xl border border-white/10 bg-surface text-sm font-semibold text-brand-hover" aria-hidden="true">{status === "error" ? "!" : "0"}</span><h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">{title}</h3><p className="mt-2 leading-6 text-secondary">{copy}</p>{!filtered && <Link href="/admin/systems" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[9px] border border-white/15 px-5 font-semibold hover:bg-white/[0.04]">Choose a system</Link>}</div></div>;
}

function formatExternalHost(url: string | null) {
  if (!url) return "External link";
  try {
    return new URL(url).hostname;
  } catch {
    return "External link";
  }
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(date);
}
