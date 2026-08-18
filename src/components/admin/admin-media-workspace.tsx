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

const inputClass = "min-h-10 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none transition-all";

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
        <div className="flex flex-col gap-6 border-b border-slate-200/80 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Catalog assets</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Media</h1>
            <p className="mt-2 max-w-2xl text-slate-600 font-medium">Review uploaded images, demo links, and product videos across every system. Uploads and ordering remain attached to the owning system.</p>
          </div>
          <Link href="/admin/systems" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">Choose a system</Link>
        </div>

        {notice && (
          <p role="status" className={`mt-6 rounded-2xl border p-4 text-sm font-medium shadow-2xs ${notice.tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`}>
            {notice.message}
          </p>
        )}

        <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/60 sm:grid-cols-2 xl:grid-cols-4 shadow-xs">
          <Metric label="All media" value={metrics.total} />
          <Metric label="Uploaded images" value={metrics.uploads} />
          <Metric label="External links" value={metrics.external} />
          <Metric label="Needs attention" value={metrics.needsAttention} />
        </div>

        <section aria-labelledby="media-library-title" className="mt-8">
          <h2 id="media-library-title" className="sr-only">Catalog media library</h2>
          <div className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_170px_170px_180px] shadow-xs">
            <label className="grid gap-2 text-xs font-bold text-slate-700">
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
    <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="grid aspect-[16/9] place-items-center overflow-hidden border-b border-slate-200/80 bg-slate-50">
        {item.source === "upload" && item.previewUrl ? (
          <img src={item.previewUrl} alt={item.altText ?? ""} className="h-full w-full object-contain p-1" loading="lazy" />
        ) : (
          <div className="px-6 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-slate-200 bg-white text-xs font-bold uppercase text-blue-600 shadow-2xs">{item.mediaType}</span>
            <p className="mt-3 text-xs text-slate-500 font-medium">{item.source === "external" ? formatExternalHost(item.externalUrl) : "Signed preview unavailable"}</p>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-900">{item.system.title}</h3>
            <p className="mt-1 truncate text-xs text-slate-500 font-medium">/{item.system.slug}</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold capitalize text-slate-600">{item.system.status}</span>
        </div>

        <p className={`mt-4 min-h-10 text-sm leading-5 ${item.altText ? "text-slate-600 font-medium" : "text-amber-800 font-semibold"}`}>{item.altText ?? "Alternative text is missing."}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
          <div><dt className="text-slate-500 font-medium">Type</dt><dd className="mt-1 capitalize text-slate-900 font-bold">{item.mediaType}</dd></div>
          <div><dt className="text-slate-500 font-medium">Position</dt><dd className="mt-1 text-slate-900 font-bold">{item.sortOrder + 1}</dd></div>
          <div><dt className="text-slate-500 font-medium">Source</dt><dd className="mt-1 capitalize text-slate-900 font-bold">{item.source}</dd></div>
          <div><dt className="text-slate-500 font-medium">Added</dt><dd className="mt-1 text-slate-900 font-bold"><time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time></dd></div>
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link href={`/admin/systems/${item.system.id}/edit#resources`} className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors">Edit system media</Link>
          {item.externalUrl && <a href={item.externalUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors">Open link</a>}
          <button type="button" disabled={removing} onClick={onRemove} className="ml-auto text-xs font-semibold text-red-600 hover:text-red-700 disabled:text-slate-400">{removing ? "Removing..." : "Remove"}</button>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="bg-white p-5"><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">{value}</p></div>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <label className="grid gap-2 text-xs font-bold text-slate-700"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}

function MediaEmptyState({ status, filtered }: { status: AdminMediaData["status"]; filtered: boolean }) {
  const title = status === "unconfigured" ? "The database is not connected." : status === "error" ? "Media records could not be loaded." : filtered ? "No media matches these filters." : "No catalog media has been added.";
  const copy = status === "unconfigured" ? "Connect Supabase and apply the migrations before reviewing persistent media." : status === "error" ? "The workspace hides partial records until the media response can be verified." : filtered ? "Adjust the search or filters to review another asset." : "Open a system record to upload its first image or add a verified demo link.";
  return <div className="mt-5 grid min-h-80 place-items-center rounded-2xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-xs"><div className="max-w-md"><span className="mx-auto grid size-12 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-blue-600 shadow-2xs" aria-hidden="true">{status === "error" ? "!" : "0"}</span><h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500 font-medium">{copy}</p>{!filtered && <Link href="/admin/systems" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 font-semibold text-slate-900 hover:bg-slate-50 shadow-2xs">Choose a system</Link>}</div></div>;
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
