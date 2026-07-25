import { z } from "zod";

const optionalPublicLine = (maximum: number) => z
  .string()
  .trim()
  .max(maximum)
  .transform((value, context) => {
    if (value && value.length < 2) {
      context.addIssue({ code: "custom", message: "Enter at least 2 characters or leave this blank." });
      return z.NEVER;
    }
    return value || null;
  });

export const testimonialIdSchema = z.uuid();
export const testimonialIntentSchema = z.enum(["save", "publish", "archive"]);

export const testimonialInputSchema = z.object({
  quote: z.string().trim().min(20).max(2000),
  attributionName: z.string().trim().min(2).max(120),
  attributionRole: optionalPublicLine(120),
  attributionOrganization: optionalPublicLine(160),
  relationshipContext: z.string().trim().min(5).max(240),
  verificationReference: z.string().trim().min(5, "Record where this testimonial and permission can be verified.").max(500),
  permissionConfirmed: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(10_000),
});

export const testimonialUpdateInputSchema = testimonialInputSchema.extend({
  intent: testimonialIntentSchema,
  updatedAt: z.iso.datetime(),
}).superRefine((value, context) => {
  if (value.intent === "publish" && !value.permissionConfirmed) {
    context.addIssue({ code: "custom", path: ["permissionConfirmed"], message: "Confirm the customer's publication permission before publishing." });
  }
});

export type TestimonialInput = z.infer<typeof testimonialInputSchema>;
