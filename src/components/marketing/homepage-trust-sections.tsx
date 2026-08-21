"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import type { PublicCompanyProfile } from "@/features/content/company-profile-types";
import type { PublicFaqItem } from "@/features/content/faq-public-types";

const purchaseSteps = [
  {
    id: "01",
    title: "Review the exact listing",
    description:
      "Check the authoritative price, requirements, inclusions, exclusions, support coverage, license, and delivery notes before ordering.",
    icon: FileText,
  },
  {
    id: "02",
    title: "Create a recorded order",
    description:
      "The server records the selected product and authoritative PHP amount before payment instructions are presented.",
    icon: CheckCircle2,
  },
  {
    id: "03",
    title: "Pay securely with PayPal",
    description:
      "Approve PayPal Checkout while the server keeps the published PHP price and order snapshot authoritative.",
    icon: ShieldCheck,
  },
  {
    id: "04",
    title: "Receive protected delivery",
    description:
      "Delivery becomes eligible only after verified server capture. Customer files remain behind expiring, revocable account access.",
    icon: LockKeyhole,
  },
] as const;

const policyLinks = [
  ["Delivery policy", "/legal/delivery"],
  ["Commercial license", "/legal/license"],
  ["Refund policy", "/legal/refunds"],
  ["Privacy policy", "/legal/privacy"],
  ["Terms of Service", "/legal/terms"],
] as const;

export function PurchaseTransparencySection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="purchase-transparency-title"
      className="border-b border-slate-800/80 bg-[#0B0F19] py-12 text-white sm:py-16 lg:py-24"
    >
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 items-start">
          {/* Left Column */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="will-change-transform"
          >
            <h2
              id="purchase-transparency-title"
              className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl leading-[1.15]"
            >
              Know the price, package, and delivery path first.
            </h2>
            <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-slate-300 sm:mt-4 sm:text-base">
              Product-specific details remain authoritative. No browser return, screenshot, or transaction reference is treated as confirmed payment by itself.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-2.5">
              {policyLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="group inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-300 transition-all duration-150 hover:border-blue-500/40 hover:bg-blue-950/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <span>{label}</span>
                  <ArrowUpRight className="size-3 text-slate-400 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-300" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Right Column: 4 Clean Step Cards */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
            {purchaseSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: reduceMotion ? 0 : (index % 2) * 0.1,
                  }}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4.5 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] sm:p-6 will-change-transform"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-slate-500">
                        {step.id}
                      </span>
                      <Icon className="size-5 text-blue-400" aria-hidden="true" />
                    </div>

                    <h3 className="mt-4 font-heading text-base font-bold text-white sm:mt-5 sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:mt-2 sm:text-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomepageFaqPreview({ items }: { items: PublicFaqItem[] }) {
  const reduceMotion = useReducedMotion();
  const selected = selectTrustQuestions(items);
  if (selected.length === 0) return null;

  return (
    <section aria-labelledby="homepage-faq-title" className="border-y border-slate-200 bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto grid w-[min(calc(100%-32px),1180px)] gap-8 md:w-[min(calc(100%-64px),1180px)] lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="will-change-transform"
        >
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Purchase questions</p>
          <h2 id="homepage-faq-title" className="mt-3 font-heading text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:mt-4 sm:text-3xl lg:text-4xl">Clear answers before commitment.</h2>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base sm:leading-7">Review the most common product, pricing, delivery, and policy questions before opening checkout or requesting a quotation.</p>
          <Link href="/faq" className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 sm:mt-6">Read every FAQ <ArrowRight className="size-4" /></Link>
        </motion.div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.15 }}
          className="border-t border-slate-200 will-change-transform"
        >
          {selected.map((item, index) => (
            <details key={item.id} className="group border-b border-slate-200 py-4 sm:py-5">
              <summary className="grid cursor-pointer list-none grid-cols-[28px_1fr_auto] gap-2.5 font-bold text-slate-950 marker:hidden sm:grid-cols-[32px_1fr_auto] sm:gap-3 text-sm sm:text-base">
                <span className="font-mono text-xs font-normal text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.question}</span>
                <span className="text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="pl-7 pr-1 mt-2.5 max-w-3xl text-xs leading-relaxed text-slate-600 sm:pl-11 sm:mt-3 sm:text-sm sm:leading-7">{item.answer}</p>
            </details>
          ))}
        </motion.div>
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
  const reduceMotion = useReducedMotion();
  const githubProfile = {
    handle: "12valor",
    url: "https://github.com/12valor",
    avatarUrl: "https://avatars.githubusercontent.com/u/171469818?v=4",
  } as const;
  const portfolioUrl = "https://12valor.vercel.app/";

  return (
    <section aria-labelledby="founder-identity-title" className="bg-[#FAFAFC] py-12 sm:py-16 lg:py-24">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid w-[min(calc(100%-32px),1080px)] gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.25)] sm:gap-8 sm:p-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12 lg:p-12 will-change-transform"
      >
        <div className="self-start flex flex-row items-center gap-4 sm:flex-col sm:items-start sm:gap-0">
          <a
            href={githubProfile.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${profile.founderName} on GitHub`}
            className="group block w-fit shrink-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 sm:rounded-3xl"
          >
            <span className="relative block size-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm sm:size-32 sm:rounded-3xl lg:size-44">
              <Image
                src={githubProfile.avatarUrl}
                alt={`${profile.founderName} GitHub profile photo`}
                fill
                sizes="(min-width: 1024px) 176px, 128px"
                className="object-cover transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </span>
          </a>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 sm:mt-4">
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
            className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-slate-950 sm:mt-3 sm:text-3xl lg:text-4xl"
          >
            {profile.founderName}
          </h2>
          <p className="mt-1 text-sm font-semibold text-blue-700 sm:mt-1.5">{profile.founderTitle}</p>
          <p className="mt-3.5 max-w-3xl text-sm leading-relaxed text-slate-600 sm:mt-4 sm:leading-7">{profile.founderBio}</p>
          <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:flex lg:flex-wrap sm:gap-3 sm:mt-7">
            <a
              href={githubProfile.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <GitHubMark className="size-4" />
              View GitHub Profile
            </a>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-slate-300 px-5 text-xs sm:text-sm font-bold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              View Portfolio
            </a>
            <Link
              href="/about"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-slate-300 px-5 text-xs sm:text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50"
            >
              About WebSystemBuilders <ArrowRight className="size-4" />
            </Link>
            {profile.publicEmail ? (
              <a
                href={`mailto:${profile.publicEmail}`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-300 px-5 text-xs sm:text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50"
              >
                {profile.publicEmail}
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-300 px-5 text-xs sm:text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50"
              >
                Contact WebSystemBuilders
              </Link>
            )}
          </div>
        </div>
      </motion.div>
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
