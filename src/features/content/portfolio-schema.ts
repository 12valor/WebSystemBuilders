import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const technologyStackSchema = z
  .string()
  .trim()
  .max(2500)
  .transform((value) => [...new Set(value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean))])
  .pipe(z.array(z.string().max(80)).max(30));

const optionalOutcome = z.string().trim().max(2000).transform((value, context) => {
  if (value && value.length < 5) {
    context.addIssue({ code: "custom", message: "Enter at least 5 characters or leave this blank." });
    return z.NEVER;
  }
  return value || null;
});

const optionalProjectUrl = z.string().trim().transform((value) => value || null).pipe(
  z.url("Enter a valid HTTPS URL.").refine((value) => value.startsWith("https://"), "Use an HTTPS URL.").nullable(),
);

export const portfolioIdSchema = z.uuid();
export const portfolioIntentSchema = z.enum(["save", "publish", "archive"]);

export const portfolioInputSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().trim().toLowerCase().min(2).max(160).regex(slugPattern, "Use lowercase letters, numbers, and hyphens."),
  audience: z.enum(["students", "business", "both"]),
  summary: z.string().trim().min(10).max(500),
  description: z.string().trim().min(20).max(20_000),
  outcome: optionalOutcome,
  technologyStack: technologyStackSchema,
  projectUrl: optionalProjectUrl,
  isFeatured: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(10_000),
});

export const portfolioUpdateInputSchema = portfolioInputSchema.extend({
  intent: portfolioIntentSchema,
  updatedAt: z.iso.datetime(),
});

export type PortfolioInput = z.infer<typeof portfolioInputSchema>;
