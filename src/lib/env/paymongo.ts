import "server-only";

import { z } from "zod";

export const paymongoPaymentMethodSchema = z.enum(["qrph", "gcash", "card"]);
export type PaymongoPaymentMethod = z.infer<typeof paymongoPaymentMethodSchema>;

const testSecretKeySchema = z.string().regex(/^sk_test_[A-Za-z0-9_]+$/).min(16);
const webhookSecretSchema = z.string().min(16);
const siteUrlSchema = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" || url.hostname === "localhost";
});

export type PaymongoCheckoutEnv = {
  PAYMONGO_SECRET_KEY: string;
  PAYMONGO_PAYMENT_METHODS: PaymongoPaymentMethod[];
  SITE_URL: string;
};

export type PaymongoWebhookEnv = { PAYMONGO_WEBHOOK_SECRET: string };

export function getPaymongoCheckoutEnv(): PaymongoCheckoutEnv {
  const secretKey = testSecretKeySchema.safeParse(process.env.PAYMONGO_SECRET_KEY?.trim());
  const siteUrl = siteUrlSchema.safeParse(process.env.SITE_URL?.trim());
  const methods = parsePaymentMethods(process.env.PAYMONGO_PAYMENT_METHODS);

  if (!secretKey.success || !siteUrl.success || !methods.success) {
    throw new Error("PayMongo test checkout is not configured.");
  }

  return {
    PAYMONGO_SECRET_KEY: secretKey.data,
    PAYMONGO_PAYMENT_METHODS: methods.data,
    SITE_URL: siteUrl.data,
  };
}

export function getPaymongoWebhookEnv(): PaymongoWebhookEnv {
  const secret = webhookSecretSchema.safeParse(process.env.PAYMONGO_WEBHOOK_SECRET?.trim());
  if (!secret.success) throw new Error("PayMongo webhook verification is not configured.");
  return { PAYMONGO_WEBHOOK_SECRET: secret.data };
}

export function isPaymongoCheckoutConfigured() {
  try {
    getPaymongoCheckoutEnv();
    return true;
  } catch {
    return false;
  }
}

export function parsePaymentMethods(value: string | undefined) {
  const methods = (value ?? "")
    .split(",")
    .map((method) => method.trim().toLowerCase())
    .filter(Boolean);

  if (methods.length === 0 || new Set(methods).size !== methods.length) {
    return z.array(paymongoPaymentMethodSchema).min(1).safeParse([]);
  }

  return z.array(paymongoPaymentMethodSchema).min(1).safeParse(methods);
}
