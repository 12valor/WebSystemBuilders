import "server-only";

import { z } from "zod";

const resendEnvSchema = z.object({
  RESEND_API_KEY: z.string().regex(/^re_[A-Za-z0-9_]+$/),
  RESEND_FROM_EMAIL: z.email(),
  SITE_URL: z.url().refine((value) => {
    const url = new URL(value);
    return url.protocol === "https:" || url.hostname === "localhost";
  }),
});

export type ResendEnv = z.infer<typeof resendEnvSchema>;

export function isResendConfigured() { return resendEnvSchema.safeParse(readValues()).success; }
export function getResendEnv(): ResendEnv {
  const result = resendEnvSchema.safeParse(readValues());
  if (!result.success) throw new Error("Transactional email is not configured.");
  return result.data;
}

function readValues() {
  return { RESEND_API_KEY: process.env.RESEND_API_KEY, RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL, SITE_URL: process.env.SITE_URL };
}
