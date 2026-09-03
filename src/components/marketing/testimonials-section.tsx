"use client";

import React from "react";
import type { PublicTestimonial } from "@/features/content/testimonial-types";
import { Testimonial9, type TestimonialBasicGridItem } from "@/components/ui/testimonial9";

export { Testimonial9 };

export function TestimonialsSection({ items }: { items?: PublicTestimonial[] }) {
  if (!items || items.length === 0) {
    return null;
  }

  const testimonials: TestimonialBasicGridItem[] = items.map((item, idx) => ({
    id: item.id,
    name: item.attributionName,
    role:
      [item.attributionRole, item.attributionOrganization].filter(Boolean).join(" · ") ||
      item.relationshipContext,
    content: item.quote,
    avatar: `https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar${(idx % 25) + 1}.jpg`,
  }));

  return (
    <Testimonial9
      heading="Customer Statements"
      description="Verified feedback from students and business owners who deployed our systems."
      testimonials={testimonials}
    />
  );
}
