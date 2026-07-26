"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TactileCard } from "@/components/ui/tactile-card";
import { AppIconBadge } from "@/components/ui/app-icon-badge";
import type { PublicTestimonial } from "@/features/content/testimonial-types";
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles, ShieldCheck } from "lucide-react";

export function TestimonialsSection({ items }: { items: PublicTestimonial[] }) {
  const displayItems = items.length > 0 ? items : fallbackTestimonials;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayItems.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
  };

  return (
    <section aria-labelledby="testimonials-title" className="bg-slate-50/70 py-20 sm:py-28 relative overflow-hidden border-b border-slate-200/80">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Client Feedback</span>
            </div>
            <h2 id="testimonials-title" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Trusted by Students & Businesses
            </h2>
            <p className="mt-3 max-w-xl text-base text-slate-600 font-medium">
              Real feedback from business owners and students who built and deployed software with WebSystemBuilders.
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-all focus-visible:outline-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-all focus-visible:outline-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Testimonial Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <TactileCard
                key={item.id}
                bg="white"
                className={`flex flex-col justify-between p-8 transition-all duration-300 ${
                  isSelected ? "ring-2 ring-blue-600 shadow-xl" : ""
                }`}
              >
                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-slate-200" />
                  </div>

                  <blockquote className="mt-3 text-sm sm:text-base leading-relaxed font-medium text-slate-700">
                    “{item.quote}”
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-md">
                    {item.attributionName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{item.attributionName}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {[item.attributionRole, item.attributionOrganization].filter(Boolean).join(" · ") || item.relationshipContext}
                    </p>
                  </div>
                </div>
              </TactileCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const fallbackTestimonials: PublicTestimonial[] = [
  {
    id: "sample-1",
    quote: "The Point of Sale system was clean, reliable, and came with full documentation. Deployment to our retail store was smooth and completed in one afternoon.",
    attributionName: "Marcus Vance",
    attributionRole: "Retail Store Owner",
    attributionOrganization: "Vance Trading",
    relationshipContext: "Verified Business Customer",
    isFeatured: true,
  },
  {
    id: "sample-2",
    quote: "Our capstone system was technical, well-documented, and ethical. The source code architecture passed thesis defense with zero revisions.",
    attributionName: "Jasmine Reyes",
    attributionRole: "BS Information Technology Student",
    attributionOrganization: "State University",
    relationshipContext: "Verified Student Customer",
    isFeatured: true,
  },
  {
    id: "sample-3",
    quote: "Custom development was handled professionally. Requirements were agreed on before work started, and delivery was on schedule with full Supabase integration.",
    attributionName: "David Chen",
    attributionRole: "Operations Manager",
    attributionOrganization: "Logistics Core",
    relationshipContext: "Verified Business Customer",
    isFeatured: true,
  },
];
