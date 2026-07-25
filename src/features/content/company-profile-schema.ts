import { z } from "zod";

const optionalEmail = z.string().trim().max(254).transform((value) => value ? value.toLowerCase() : null).refine((value) => value === null || z.email().safeParse(value).success, "Enter a valid public email or leave this blank.");
const optionalPhone = z.string().trim().max(30).transform((value) => value || null).refine((value) => value === null || (value.length >= 7 && /^[+0-9() .-]+$/.test(value)), "Enter a valid public phone number or leave this blank.");

export const companyProfileIntentSchema = z.enum(["save", "publish", "archive"]);
export const companyProfileInputSchema = z.object({
  companySummary: z.string().trim().min(20).max(600),
  founderBio: z.string().trim().min(20).max(600),
  publicEmail: optionalEmail,
  publicPhone: optionalPhone,
  intent: companyProfileIntentSchema,
  updatedAt: z.iso.datetime(),
});

export type CompanyProfileInput = z.infer<typeof companyProfileInputSchema>;
