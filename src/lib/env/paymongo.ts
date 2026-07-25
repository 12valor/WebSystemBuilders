import "server-only";

import { z } from "zod";

const payMongoEnvSchema = z.object({
  PAYMONGO_SECRET_KEY: z.string().regex(/^sk_(test|live)_[A-Za-z0-9]+$/),
  PAYMONGO_WEBHOOK_SECRET: z.string().min(16),
  SITE_URL: z.url().refine((value) => {
    const url = new URL(value);
    return url.protocol === "https:" || url.hostname === "localhost";
  }, "SITE_URL must use HTTPS outside local development."),
});

export type PayMongoEnv = z.infer<typeof payMongoEnvSchema>;

export function isPayMongoConfigured() {
  return payMongoEnvSchema.safeParse(readPayMongoValues()).success;
}

export function getPayMongoEnv(): PayMongoEnv {
  const result = payMongoEnvSchema.safeParse(readPayMongoValues());
  if (!result.success) throw new Error("PayMongo checkout is not configured.");
  return result.data;
}

function readPayMongoValues() {
  return {
    PAYMONGO_SECRET_KEY: process.env.PAYMONGO_SECRET_KEY,
    PAYMONGO_WEBHOOK_SECRET: process.env.PAYMONGO_WEBHOOK_SECRET,
    SITE_URL: process.env.SITE_URL,
  };
}
