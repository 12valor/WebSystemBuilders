import { z } from "zod";
import { parseMoneyToMinorUnits } from "@/features/catalog/money";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const technologyStackSchema = z
  .string()
  .trim()
  .max(2500)
  .transform((value) =>
    [...new Set(value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean))],
  )
  .pipe(
    z
      .array(z.string().max(80, "Keep each technology name under 80 characters."))
      .max(30, "Add no more than 30 technologies."),
  );

export const systemDraftInputSchema = z
  .object({
    title: z.string().trim().min(2, "Enter a system name.").max(160),
    slug: z.string().trim().toLowerCase().regex(slugPattern, "Use lowercase letters, numbers, and hyphens."),
    audience: z.enum(["students", "business", "both"], { message: "Select an audience." }),
    categoryId: z.uuid("Select a category."),
    productType: z.enum(["ready_made", "customizable_template", "custom_service"], { message: "Select a product type." }),
    summary: z.string().trim().min(10, "Enter at least 10 characters.").max(320),
    description: z.string().trim().max(20000).optional(),
    pricingType: z.enum(["fixed", "starting", "quotation"], { message: "Select a pricing mode." }),
    regularPrice: z.string().trim(),
    salePrice: z.string().trim().optional().default(""),
    saleActive: z.boolean().default(false),
    inclusions: z.string().trim().max(10000).optional(),
    exclusions: z.string().trim().max(10000).optional(),
    requirements: z.string().trim().max(10000).optional(),
    technologyStack: technologyStackSchema,
    deliverySummary: z.string().trim().max(3000).refine((value) => value.length === 0 || value.length >= 2, "Enter at least 2 characters.").optional(),
    demoInstructions: z.string().trim().max(3000).refine((value) => value.length === 0 || value.length >= 2, "Enter at least 2 characters.").optional(),
    licenseSummary: z.string().trim().max(10000).optional(),
    supportSummary: z.string().trim().max(5000).optional(),
    seoTitle: z.string().trim().max(70, "Keep the SEO title under 70 characters.").refine((value) => value.length === 0 || value.length >= 2, "Enter at least 2 characters.").optional(),
    seoDescription: z.string().trim().max(180, "Keep the SEO description under 180 characters.").refine((value) => value.length === 0 || value.length >= 10, "Enter at least 10 characters.").optional(),
  })
  .superRefine((input, context) => {
    const regularMinor = parseMoneyToMinorUnits(input.regularPrice);
    const saleMinor = parseMoneyToMinorUnits(input.salePrice);

    if (input.pricingType === "quotation") {
      if (input.regularPrice) {
        context.addIssue({ code: "custom", path: ["regularPrice"], message: "Quotation products do not use a catalog price." });
      }
    } else if (regularMinor === null) {
      context.addIssue({ code: "custom", path: ["regularPrice"], message: "Enter a valid PHP amount with up to two decimal places." });
    }

    if (input.salePrice && saleMinor === null) {
      context.addIssue({ code: "custom", path: ["salePrice"], message: "Enter a valid sale amount with up to two decimal places." });
    }

    if (input.saleActive && saleMinor === null) {
      context.addIssue({ code: "custom", path: ["salePrice"], message: "Enter a sale price before activating it." });
    }

    if (saleMinor !== null && regularMinor !== null && saleMinor >= regularMinor) {
      context.addIssue({ code: "custom", path: ["salePrice"], message: "Sale price must be lower than the regular price." });
    }
  })
  .transform((input) => ({
    ...input,
    description: input.description || null,
    inclusions: input.inclusions || null,
    exclusions: input.exclusions || null,
    requirements: input.requirements || null,
    deliverySummary: input.deliverySummary || null,
    demoInstructions: input.demoInstructions || null,
    licenseSummary: input.licenseSummary || null,
    supportSummary: input.supportSummary || null,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
    priceMinor: input.pricingType === "quotation" ? null : parseMoneyToMinorUnits(input.regularPrice),
    regularPriceMinor: input.pricingType === "quotation" ? null : parseMoneyToMinorUnits(input.regularPrice),
    salePriceMinor: input.salePrice ? parseMoneyToMinorUnits(input.salePrice) : null,
  }));

export type SystemDraftInput = z.infer<typeof systemDraftInputSchema>;
