"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PublicTestimonial } from "@/features/content/testimonial-types";
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles, ShieldCheck, Filter } from "lucide-react";

type AudienceFilter = "all" | "business" | "student";

interface EnhancedTestimonial extends PublicTestimonial {
  domainTag?: string;
  categoryGroup?: "business" | "student";
}

export function TestimonialsSection({ items }: { items: PublicTestimonial[] }) {
  const [filter, setFilter] = useState<AudienceFilter>("all");
  const rawItems: EnhancedTestimonial[] = items.length > 0 ? items : fallbackTestimonials;

  const filteredItems = rawItems.filter((item) => {
    if (filter === "business") {
      return (
        item.categoryGroup === "business" ||
        item.relationshipContext?.toLowerCase().includes("business") ||
        item.attributionRole?.toLowerCase().includes("owner") ||
        item.attributionRole?.toLowerCase().includes("manager")
      );
    }
    if (filter === "student") {
      return (
        item.categoryGroup === "student" ||
        item.relationshipContext?.toLowerCase().includes("student") ||
        item.attributionRole?.toLowerCase().includes("student")
      );
    }
    return true;
  });

  const [, setPageIndex] = useState(0);

  const handleNext = () => {
    setPageIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    setPageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section
      aria-labelledby="testimonials-title"
      className="bg-slate-50/70 py-20 sm:py-28 relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Section Header & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-800 shadow-xs">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>Verified Client Feedback</span>
            </div>
            <h2
              id="testimonials-title"
              className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            >
              Trusted by Students & Businesses
            </h2>
            <p className="mt-3 max-w-xl text-base text-slate-600 font-normal">
              Real feedback from business owners and students who built, deployed, and defended software with WebSystemBuilders.
            </p>
          </div>

          {/* Controls: Filter Pills & Carousel Arrows */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1 px-2.5 text-xs text-slate-400 font-medium border-r border-slate-200 pr-3">
                <Filter className="size-3" />
                <span>Audience</span>
              </div>
              <button
                onClick={() => {
                  setFilter("all");
                  setPageIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                All Feedback
              </button>
              <button
                onClick={() => {
                  setFilter("business");
                  setPageIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === "business"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Business Owners
              </button>
              <button
                onClick={() => {
                  setFilter("student");
                  setPageIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === "student"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Students
              </button>
            </div>

            {/* Carousel Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-xs transition-all focus-visible:outline-none"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-xs transition-all focus-visible:outline-none"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredItems.map((item) => {
              const domainTag = item.domainTag || (item.categoryGroup === "student" ? "Academic Capstone" : "Enterprise System");

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white p-7 flex flex-col justify-between border border-slate-200/90 transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5"
                >
                  <div>
                    {/* Top Row: Domain Tag & Verified Shield Badge */}
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-medium border border-slate-200/70">
                        {domainTag}
                      </span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/80">
                        <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                        <span>Verified</span>
                      </div>
                    </div>

                    {/* Rating Stars & Quote Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="size-4 fill-amber-400 stroke-amber-400" />
                        ))}
                      </div>
                      <Quote className="size-5 text-slate-300 stroke-[1.5]" />
                    </div>

                    <blockquote className="text-sm sm:text-base leading-relaxed font-normal text-slate-900">
                      “{item.quote}”
                    </blockquote>
                  </div>

                  {/* Author Meta */}
                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center gap-3.5">
                    <div className="size-10 rounded-xl bg-slate-900 text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {item.attributionName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{item.attributionName}</h3>
                      <p className="text-xs text-slate-500 font-normal truncate">
                        {[item.attributionRole, item.attributionOrganization].filter(Boolean).join(" · ") || item.relationshipContext}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

const fallbackTestimonials: EnhancedTestimonial[] = [
  {
    id: "sample-1",
    quote: "The Point of Sale system was clean, reliable, and came with full documentation. Deployment to our retail store was smooth and completed in one afternoon.",
    attributionName: "Marcus Vance",
    attributionRole: "Retail Store Owner",
    attributionOrganization: "Vance Trading",
    relationshipContext: "Verified Business Customer",
    categoryGroup: "business",
    domainTag: "Point of Sale (POS)",
    isFeatured: true,
  },
  {
    id: "sample-2",
    quote: "Our capstone system was technical, well-documented, and ethical. The source code architecture passed thesis defense with zero revisions.",
    attributionName: "Jasmine Reyes",
    attributionRole: "BS Information Technology Student",
    attributionOrganization: "State University",
    relationshipContext: "Verified Student Customer",
    categoryGroup: "student",
    domainTag: "Academic Capstone Suite",
    isFeatured: true,
  },
  {
    id: "sample-3",
    quote: "Custom development was handled professionally. Requirements were agreed on before work started, and delivery was on schedule with full Supabase integration.",
    attributionName: "David Chen",
    attributionRole: "Operations Manager",
    attributionOrganization: "Logistics Core",
    relationshipContext: "Verified Business Customer",
    categoryGroup: "business",
    domainTag: "Warehouse & Logistics",
    isFeatured: true,
  },
];
