import { z } from "zod";

const optionalLine = (maximum: number, minimum = 0) => z.string().trim().max(maximum).transform((value) => value || null).refine(
  (value) => value === null || value.length >= minimum,
  minimum > 0 ? `Enter at least ${minimum} characters or leave this blank.` : "Invalid optional value.",
);
const internalHref = z.string().trim().max(240).transform((value) => value || null).refine(
  (value) => value === null || (/^\/[A-Za-z0-9/_?#=&.%~-]*$/.test(value) && !value.startsWith("//")),
  "Use an internal website path beginning with one slash.",
);

const contentShape = {
  placement: z.enum(["announcement", "homepage_feature"]),
  eyebrow: optionalLine(60),
  title: z.string().trim().min(5).max(180),
  body: optionalLine(800),
  actionLabel: optionalLine(60, 2),
  actionHref: internalHref,
  sortOrder: z.coerce.number().int().min(0).max(10_000),
};

type RefinedContent = {
  placement: "announcement" | "homepage_feature";
  eyebrow: string | null;
  body: string | null;
  actionLabel: string | null;
  actionHref: string | null;
};

function validatePlacement(value: RefinedContent, context: z.core.$RefinementCtx<RefinedContent>) {
  if (value.placement === "announcement" && (value.eyebrow || value.body)) {
    context.addIssue({ code: "custom", path: ["placement"], message: "Announcements use the message and optional action fields only." });
  }
  if (value.placement === "homepage_feature") {
    if (!value.eyebrow || value.eyebrow.length < 2) context.addIssue({ code: "custom", path: ["eyebrow"], message: "Add a short homepage eyebrow." });
    if (!value.body || value.body.length < 10) context.addIssue({ code: "custom", path: ["body"], message: "Add at least 10 characters of supporting copy." });
  }
  if (Boolean(value.actionLabel) !== Boolean(value.actionHref)) {
    context.addIssue({ code: "custom", path: value.actionLabel ? ["actionHref"] : ["actionLabel"], message: "Provide both an action label and internal path, or leave both blank." });
  }
}

export const siteContentIdSchema = z.uuid();
export const siteContentIntentSchema = z.enum(["save", "publish", "archive"]);
export const siteContentInputSchema = z.object(contentShape).superRefine(validatePlacement);
export const siteContentUpdateSchema = z.object({ ...contentShape, intent: siteContentIntentSchema, updatedAt: z.iso.datetime() }).superRefine(validatePlacement);
export type SiteContentInput = z.infer<typeof siteContentInputSchema>;
