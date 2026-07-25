import { z } from "zod";

const optionalDescription = z
  .string()
  .trim()
  .max(500, "Keep the description within 500 characters.")
  .transform((value) => value || null);

export const categoryInputSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters.").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Enter a category slug.")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  audience: z.enum(["students", "business", "both"]),
  description: optionalDescription,
  sortOrder: z.coerce.number().int().min(0).max(10_000),
  isActive: z.boolean(),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;

export function isCategoryAudienceCompatible(
  categoryAudience: CategoryInput["audience"],
  systemAudience: CategoryInput["audience"],
) {
  return categoryAudience === "both" || categoryAudience === systemAudience;
}
