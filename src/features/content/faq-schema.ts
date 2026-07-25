import { z } from "zod";

export const faqIdSchema = z.uuid();
export const faqIntentSchema = z.enum(["save", "publish", "archive"]);

export const faqInputSchema = z.object({
  question: z.string().trim().min(5, "Enter at least 5 characters.").max(240),
  answer: z.string().trim().min(10, "Enter at least 10 characters.").max(5000),
  category: z.string().trim().min(2, "Enter at least 2 characters.").max(80),
  sortOrder: z.coerce.number().int().min(0).max(10_000),
});

export const faqUpdateInputSchema = faqInputSchema.extend({
  intent: faqIntentSchema,
  updatedAt: z.iso.datetime(),
});
