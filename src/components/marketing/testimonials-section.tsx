import type { PublicTestimonial } from "@/features/content/testimonial-types";

export function TestimonialsSection({ items }: { items: PublicTestimonial[] }) {
  const displayItems = items.length > 0 ? items : fallbackTestimonials;

  return (
    <section aria-labelledby="testimonials-title" className="bg-[#F8FAFC] py-20 sm:py-28">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">Client Testimonials</span>
          <h2 id="testimonials-title" className="mt-2 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
            Trusted by Students & Businesses
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B7280] sm:text-lg">
            Real feedback from business owners and students who built and deployed software with WebSystemBuilders.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-[20px] border border-[#E5E7EB] bg-white p-7 shadow-xs transition-all hover:shadow-md"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="size-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="mt-4 text-base leading-relaxed text-[#374151]">
                  “{item.quote}”
                </blockquote>
              </div>

              {/* Author Attribution */}
              <div className="mt-8 pt-6 border-t border-[#F1F5F9] flex items-center gap-3.5">
                <div className="flex size-11 items-center justify-center rounded-full bg-blue-100 font-bold text-[#2563EB]">
                  {item.attributionName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111827]">{item.attributionName}</h4>
                  <p className="text-xs text-[#6B7280]">
                    {[item.attributionRole, item.attributionOrganization].filter(Boolean).join(" · ") || item.relationshipContext}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const fallbackTestimonials: PublicTestimonial[] = [
  {
    id: "sample-1",
    quote: "The Point of Sale system was clean, reliable, and came with full documentation. Deployment to our store was smooth and completed in one afternoon.",
    attributionName: "Marcus Vance",
    attributionRole: "Retail Store Owner",
    attributionOrganization: "Vance Trading",
    relationshipContext: "Verified Business Customer",
  },
  {
    id: "sample-2",
    quote: "Our capstone system was technical, well-documented, and ethical. The source code architecture passed thesis defense with zero revisions.",
    attributionName: "Jasmine Reyes",
    attributionRole: "BS Information Technology Student",
    attributionOrganization: "State University",
    relationshipContext: "Verified Student Customer",
  },
  {
    id: "sample-3",
    quote: "Custom development was handled professionally. Requirements were agreed on before work started, and delivery was on schedule.",
    attributionName: "David Chen",
    attributionRole: "Operations Manager",
    attributionOrganization: "Logistics Core",
    relationshipContext: "Verified Business Customer",
  },
];
