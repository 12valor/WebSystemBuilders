import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import type { PublicCompanyProfile } from "@/features/content/company-profile-types";
import type { PublicFaqItem } from "@/features/content/faq-public-types";

const purchaseSteps = [
  {
    id: "01",
    title: "Review the exact listing",
    description: "Check the authoritative price, requirements, inclusions, exclusions, support coverage, license, and delivery notes before ordering.",
    icon: FileText,
  },
  {
    id: "02",
    title: "Create a recorded order",
    description: "The server records the selected product and authoritative PHP amount before payment instructions are presented.",
    icon: CheckCircle2,
  },
  {
    id: "03",
    title: "Submit GCash or QRPh proof",
    description: "Use the administrator-provided QR details, then submit the transaction reference and required payment proof for review.",
    icon: MessageSquareText,
  },
  {
    id: "04",
    title: "Receive protected delivery",
    description: "Delivery becomes eligible only after payment review. Customer files remain behind expiring, revocable account access.",
    icon: LockKeyhole,
  },
];

const policyLinks = [
  ["Delivery policy", "/legal/delivery"],
  ["Commercial license", "/legal/license"],
  ["Refund policy", "/legal/refunds"],
  ["Privacy policy", "/legal/privacy"],
  ["Terms", "/legal/terms"],
] as const;

export function PurchaseTransparencySection() {
  return (
    <section aria-labelledby="purchase-transparency-title" className="bg-slate-950 py-20 text-white sm:py-28">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-blue-200">
              <ShieldCheck className="size-4" /> Before you purchase
            </div>
            <h2 id="purchase-transparency-title" className="mt-5 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">
              Know the price, package, and delivery path first.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              Product-specific details remain authoritative. No browser return, screenshot, or transaction reference is treated as confirmed payment by itself.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
              {policyLinks.map(([label, href]) => <Link key={href} href={href} className="text-sm font-semibold text-slate-300 underline decoration-white/30 underline-offset-4 hover:text-white">{label}</Link>)}
            </div>
          </div>

          <ol className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {purchaseSteps.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.id} className="bg-slate-950 p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-500">{step.id}</span>
                    <Icon className="size-5 text-blue-300" aria-hidden="true" />
                  </div>
                  <h3 className="mt-8 text-lg font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function HomepageFaqPreview({ items }: { items: PublicFaqItem[] }) {
  const selected = selectTrustQuestions(items);
  if (selected.length === 0) return null;

  return (
    <section aria-labelledby="homepage-faq-title" className="border-y border-slate-200 bg-white py-20 sm:py-28">
      <div className="mx-auto grid w-[min(calc(100%-32px),1180px)] gap-10 md:w-[min(calc(100%-64px),1180px)] lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Purchase questions</p>
          <h2 id="homepage-faq-title" className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-4xl">Clear answers before commitment.</h2>
          <p className="mt-4 leading-7 text-slate-600">Review the most common product, pricing, delivery, and policy questions before opening checkout or requesting a quotation.</p>
          <Link href="/faq" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">Read every FAQ <ArrowRight className="size-4" /></Link>
        </div>
        <div className="border-t border-slate-200">
          {selected.map((item, index) => (
            <details key={item.id} className="group border-b border-slate-200 py-5">
              <summary className="grid cursor-pointer list-none grid-cols-[32px_1fr_auto] gap-3 font-bold text-slate-950 marker:hidden">
                <span className="font-mono text-xs font-normal text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.question}</span>
                <span className="text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="ml-[44px] mt-4 max-w-3xl text-sm leading-7 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .7a11.3 11.3 0 00-3.6 22c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.1 1.9 3 1.4 3.7 1.1.1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.6.8.5A11.3 11.3 0 0012 .7z" />
    </svg>
  );
}
export function FounderIdentitySection({ profile }: { profile: PublicCompanyProfile }) {
  const githubProfile = {
    handle: "12valor",
    url: "https://github.com/12valor",
    avatarUrl: "https://avatars.githubusercontent.com/u/171469818?v=4",
  } as const;
  const portfolioUrl = "https://12valor.vercel.app/";

  return (
    <section aria-labelledby="founder-identity-title" className="bg-[#FAFAFC] py-20 sm:py-28">
      <div className="mx-auto grid w-[min(calc(100%-32px),1080px)] gap-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.25)] sm:p-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14 lg:p-12">
        <div className="self-start">
          <a
            href={githubProfile.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${profile.founderName} on GitHub`}
            className="group block w-fit rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
          >
            <span className="relative block size-32 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm lg:size-44">
              <Image
                src={githubProfile.avatarUrl}
                alt={`${profile.founderName} GitHub profile photo`}
                fill
                sizes="(min-width: 1024px) 176px, 128px"
                className="object-cover transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </span>
          </a>
          <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700">
            <GitHubMark className="size-4 text-slate-950" />
            <span>@{githubProfile.handle}</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
            Founder and web developer
          </p>
          <h2
            id="founder-identity-title"
            className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            {profile.founderName}
          </h2>
          <p className="mt-2 font-semibold text-blue-700">{profile.founderTitle}</p>
          <p className="mt-5 max-w-3xl leading-7 text-slate-600">{profile.founderBio}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={githubProfile.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-bold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <GitHubMark className="size-4" />
              View GitHub Profile
            </a>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              View Portfolio
            </a>
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50"
            >
              About WebSystemBuilders <ArrowRight className="size-4" />
            </Link>
            {profile.publicEmail ? (
              <a
                href={`mailto:${profile.publicEmail}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50"
              >
                {profile.publicEmail}
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50"
              >
                Contact WebSystemBuilders
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
function selectTrustQuestions(items: PublicFaqItem[]) {
  const preferredCategories = ["Products and services", "License and package", "Pricing", "Delivery", "Policies"];
  const selected = preferredCategories.flatMap((category) => items.filter((item) => item.category === category).slice(0, 1));
  if (selected.length >= 5) return selected.slice(0, 5);
  const selectedIds = new Set(selected.map((item) => item.id));
  return [...selected, ...items.filter((item) => !selectedIds.has(item.id))].slice(0, 5);
}
