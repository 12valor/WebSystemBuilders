import "server-only";

import { z } from "zod";
import { getSiteUrl } from "@/lib/env/site";

const paypalEnvironmentSchema = z.enum(["sandbox", "live"]);
const credentialSchema = z.string().trim().min(12);
const webhookIdSchema = z.string().trim().min(8);

export type PayPalEnvironment = z.infer<typeof paypalEnvironmentSchema>;

export type PayPalEnv = {
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_ENVIRONMENT: PayPalEnvironment;
  PAYPAL_WEBHOOK_ID: string;
  SITE_URL: string;
};

export type PayPalConfigurationStatus =
  | { configured: true; environment: PayPalEnvironment }
  | { configured: false; environment: null };

export function getPayPalEnv(): PayPalEnv {
  const clientId = credentialSchema.safeParse(process.env.PAYPAL_CLIENT_ID);
  const clientSecret = credentialSchema.safeParse(process.env.PAYPAL_CLIENT_SECRET);
  const environment = paypalEnvironmentSchema.safeParse(process.env.PAYPAL_ENVIRONMENT);
  const webhookId = webhookIdSchema.safeParse(process.env.PAYPAL_WEBHOOK_ID);

  if (!clientId.success || !clientSecret.success || !environment.success || !webhookId.success) {
    throw new Error("PayPal Checkout is not configured.");
  }

  return {
    PAYPAL_CLIENT_ID: clientId.data,
    PAYPAL_CLIENT_SECRET: clientSecret.data,
    PAYPAL_ENVIRONMENT: environment.data,
    PAYPAL_WEBHOOK_ID: webhookId.data,
    SITE_URL: getSiteUrl(),
  };
}

export function isPayPalConfigured() {
  return getPayPalConfigurationStatus().configured;
}

export function getPayPalConfigurationStatus(): PayPalConfigurationStatus {
  try {
    const env = getPayPalEnv();
    return { configured: true, environment: env.PAYPAL_ENVIRONMENT };
  } catch {
    return { configured: false, environment: null };
  }
}

export function getPayPalApiOrigin(environment: PayPalEnvironment) {
  return environment === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

export function getPayPalWebSdkUrl(environment: PayPalEnvironment) {
  return environment === "live"
    ? "https://www.paypal.com/web-sdk/v6/core"
    : "https://www.sandbox.paypal.com/web-sdk/v6/core";
}
