import { z } from "zod";
import { getSafeNextPath } from "@/lib/auth/redirects";

export const signInLinkSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  next: z
    .string()
    .optional()
    .transform((value) => getSafeNextPath(value)),
});

export type SignInLinkInput = z.infer<typeof signInLinkSchema>;
