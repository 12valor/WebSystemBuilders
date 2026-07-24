import { z } from "zod";

const optionalShortText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().max(160).optional(),
);

const inquiryBaseSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  email: z.email("Enter a valid email address.").max(254),
  audience: z.enum(["student", "business", "general"], { error: "Choose the closest audience." }),
  organization: optionalShortText,
  subject: z.string().trim().min(5, "Add a clear subject.").max(160),
  message: z.string().trim().min(20, "Add enough detail for the request to be reviewed.").max(4000),
  timeline: optionalShortText,
  sourcePath: z.string().trim().startsWith("/").max(200),
  consent: z.string().refine((value) => value === "on", "Confirm how the submitted information may be used."),
});

export const contactInquirySchema = inquiryBaseSchema.extend({
  inquiryType: z.literal("contact"),
});

export const quoteInquirySchema = inquiryBaseSchema.extend({
  inquiryType: z.literal("quote"),
  projectType: z.enum(
    ["custom-system", "ready-made-customization", "student-technical-support", "other"],
    { error: "Choose the type of work to review." },
  ),
  requirements: z.string().trim().min(30, "Describe the users, workflow, and essential requirements.").max(6000),
});

export const inquirySchema = z.discriminatedUnion("inquiryType", [
  contactInquirySchema,
  quoteInquirySchema,
]);

export type InquiryInput = z.infer<typeof inquirySchema>;
