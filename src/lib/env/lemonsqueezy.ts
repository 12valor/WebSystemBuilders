import "server-only";

import { z } from "zod";

const lemonSqueezyEnvSchema = z.object({
  LEMON_SQUEEZY_API_KEY: z.string().min(10, "LEMON_SQUEEZY_API_KEY must be provided"),
  LEMON_SQUEEZY_STORE_ID: z.string().min(1, "LEMON_SQUEEZY_STORE_ID must be provided"),
  LEMON_SQUEEZY_WEBHOOK_SECRET: z.string().min(8, "LEMON_SQUEEZY_WEBHOOK_SECRET must be provided"),
  SITE_URL: z.url().refine((value) => {
    const url = new URL(value);
    return url.protocol === "https:" || url.hostname === "localhost";
  }, "SITE_URL must use HTTPS outside local development."),
});

export type LemonSqueezyEnv = z.infer<typeof lemonSqueezyEnvSchema>;

export function isLemonSqueezyConfigured() {
  return lemonSqueezyEnvSchema.safeParse(readLemonSqueezyValues()).success;
}

export function getLemonSqueezyEnv(): LemonSqueezyEnv {
  const result = lemonSqueezyEnvSchema.safeParse(readLemonSqueezyValues());
  if (!result.success) throw new Error("Lemon Squeezy checkout is not configured.");
  return result.data;
}

function readLemonSqueezyValues() {
  return {
    LEMON_SQUEEZY_API_KEY: process.env.LEMON_SQUEEZY_API_KEY,
    LEMON_SQUEEZY_STORE_ID: process.env.LEMON_SQUEEZY_STORE_ID,
    LEMON_SQUEEZY_WEBHOOK_SECRET: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET,
    SITE_URL: process.env.SITE_URL,
  };
}
