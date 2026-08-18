import "server-only";

import {
  CheckoutPaymentIntent,
  Client,
  Environment,
  OrderApplicationContextShippingPreference,
  OrderApplicationContextUserAction,
  OrdersController,
  type Order,
} from "@paypal/paypal-server-sdk";
import { z } from "zod";
import {
  getPayPalApiOrigin,
  type PayPalEnvironment,
  type PayPalEnv,
} from "@/lib/env/paypal";

const accessTokenSchema = z.object({ access_token: z.string().min(20), expires_in: z.number().positive() });
const webhookVerificationSchema = z.object({ verification_status: z.literal("SUCCESS") });

export class PayPalProviderError extends Error {
  constructor(
    public readonly code: "provider_rejected" | "provider_unavailable" | "invalid_response",
    public readonly debugId?: string,
  ) {
    super("PayPal could not complete the payment request.");
    this.name = "PayPalProviderError";
  }
}

type PayPalAdapterOptions = {
  fetchImplementation?: typeof fetch;
  timeoutMs?: number;
};

export function createPayPalAdapter(env: PayPalEnv, options: PayPalAdapterOptions = {}) {
  const timeoutMs = options.timeoutMs ?? 10_000;
  const fetchImplementation = options.fetchImplementation ?? fetch;
  const client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: env.PAYPAL_CLIENT_ID,
      oAuthClientSecret: env.PAYPAL_CLIENT_SECRET,
    },
    environment: env.PAYPAL_ENVIRONMENT === "live" ? Environment.Production : Environment.Sandbox,
    timeout: timeoutMs,
  });
  const orders = new OrdersController(client);

  return {
    environment: env.PAYPAL_ENVIRONMENT,

    async createBrowserSafeClientToken(origin: string) {
      const body = new URLSearchParams({
        grant_type: "client_credentials",
        response_type: "client_token",
        intent: "sdk_init",
      });
      if (env.PAYPAL_ENVIRONMENT === "live") {
        body.append("domains[]", getPayPalRootDomain(origin));
      }
      const response = await paypalFetch(
        `${getPayPalApiOrigin(env.PAYPAL_ENVIRONMENT)}/v1/oauth2/token`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: basicAuthorization(env),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        },
        fetchImplementation,
        timeoutMs,
      );
      const parsed = accessTokenSchema.safeParse(await safeJson(response));
      if (!parsed.success) throw new PayPalProviderError("invalid_response", paypalDebugId(response));
      return { clientToken: parsed.data.access_token, expiresIn: parsed.data.expires_in };
    },

    async createOrder(input: {
      requestId: string;
      orderId: string;
      orderNumber: string;
      productName: string;
      versionLabel: string;
      amountMinor: number;
      currency: "PHP";
    }) {
      const response = await callSdk(() =>
        orders.createOrder({
          paypalRequestId: input.requestId,
          prefer: "return=representation",
          body: {
            intent: CheckoutPaymentIntent.Capture,
            purchaseUnits: [
              {
                referenceId: input.orderId,
                customId: input.orderId,
                invoiceId: input.orderNumber,
                description: `${input.productName} ${input.versionLabel}`.slice(0, 127),
                amount: { currencyCode: input.currency, value: formatMinorUnits(input.amountMinor) },
              },
            ],
            applicationContext: {
              shippingPreference: OrderApplicationContextShippingPreference.NoShipping,
              userAction: OrderApplicationContextUserAction.PayNow,
            },
          },
        }),
      );
      return normalizeCreatedOrder(response.result, env.PAYPAL_ENVIRONMENT);
    },

    async captureOrder(providerOrderId: string, requestId: string) {
      const response = await callSdk(() =>
        orders.captureOrder({
          id: providerOrderId,
          paypalRequestId: requestId,
          prefer: "return=representation",
          body: {},
        }),
      );
      return normalizeCapturedOrder(response.result, env.PAYPAL_ENVIRONMENT);
    },

    async verifyWebhook(headers: Headers, event: unknown) {
      const accessToken = await getAccessToken(env, fetchImplementation, timeoutMs);
      const response = await paypalFetch(
        `${getPayPalApiOrigin(env.PAYPAL_ENVIRONMENT)}/v1/notifications/verify-webhook-signature`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auth_algo: requiredHeader(headers, "paypal-auth-algo"),
            cert_url: requiredHeader(headers, "paypal-cert-url"),
            transmission_id: requiredHeader(headers, "paypal-transmission-id"),
            transmission_sig: requiredHeader(headers, "paypal-transmission-sig"),
            transmission_time: requiredHeader(headers, "paypal-transmission-time"),
            webhook_id: env.PAYPAL_WEBHOOK_ID,
            webhook_event: event,
          }),
        },
        fetchImplementation,
        timeoutMs,
      );
      return webhookVerificationSchema.safeParse(await safeJson(response)).success;
    },
  };
}

function getPayPalRootDomain(origin: string) {
  const hostname = new URL(origin).hostname.toLowerCase();
  return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
}

function normalizeCreatedOrder(order: Order, environment: PayPalEnvironment) {
  if (!order.id || !order.status || !["CREATED", "PAYER_ACTION_REQUIRED"].includes(order.status)) {
    throw new PayPalProviderError("invalid_response");
  }
  return { providerOrderId: order.id, status: order.status, environment };
}

function normalizeCapturedOrder(order: Order, environment: PayPalEnvironment) {
  if (!order.id || !order.status) throw new PayPalProviderError("invalid_response");
  const capture = order.purchaseUnits?.flatMap((unit) => unit.payments?.captures ?? [])[0];
  if (!capture?.id || !capture.status || !capture.amount?.currencyCode || !capture.amount.value) {
    throw new PayPalProviderError("invalid_response");
  }
  return {
    providerOrderId: order.id,
    orderStatus: order.status,
    captureId: capture.id,
    captureStatus: capture.status,
    amountMinor: parseMinorUnits(capture.amount.value),
    currency: capture.amount.currencyCode,
    capturedAt: capture.updateTime ?? capture.createTime ?? new Date().toISOString(),
    environment,
  };
}

async function getAccessToken(env: PayPalEnv, fetchImplementation: typeof fetch, timeoutMs: number) {
  const response = await paypalFetch(
    `${getPayPalApiOrigin(env.PAYPAL_ENVIRONMENT)}/v1/oauth2/token`,
    {
      method: "POST",
      headers: { Authorization: basicAuthorization(env), "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    },
    fetchImplementation,
    timeoutMs,
  );
  const parsed = accessTokenSchema.safeParse(await safeJson(response));
  if (!parsed.success) throw new PayPalProviderError("invalid_response", paypalDebugId(response));
  return parsed.data.access_token;
}

async function paypalFetch(
  url: string,
  init: RequestInit,
  fetchImplementation: typeof fetch,
  timeoutMs: number,
) {
  let response: Response;
  try {
    response = await fetchImplementation(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(timeoutMs) });
  } catch {
    throw new PayPalProviderError("provider_unavailable");
  }
  if (!response.ok) throw new PayPalProviderError("provider_rejected", paypalDebugId(response));
  return response;
}

async function callSdk<T extends { headers: Record<string, string> }>(call: () => Promise<T>) {
  try {
    return await call();
  } catch (error) {
    const response = error as { statusCode?: number; headers?: Record<string, string> };
    const debugId = response.headers?.["paypal-debug-id"];
    if (response.statusCode && response.statusCode >= 400 && response.statusCode < 500) {
      throw new PayPalProviderError("provider_rejected", debugId);
    }
    throw new PayPalProviderError("provider_unavailable", debugId);
  }
}

function basicAuthorization(env: PayPalEnv) {
  return `Basic ${Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`;
}

function paypalDebugId(response: Response) {
  return response.headers.get("paypal-debug-id") ?? undefined;
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    throw new PayPalProviderError("invalid_response", paypalDebugId(response));
  }
}

function requiredHeader(headers: Headers, name: string) {
  const value = headers.get(name);
  if (!value) throw new PayPalProviderError("provider_rejected");
  return value;
}

export function formatMinorUnits(amountMinor: number) {
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) throw new PayPalProviderError("invalid_response");
  return (amountMinor / 100).toFixed(2);
}

export function parseMinorUnits(value: string) {
  if (!/^\d+\.\d{2}$/.test(value)) throw new PayPalProviderError("invalid_response");
  const minor = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(minor) || minor <= 0) throw new PayPalProviderError("invalid_response");
  return minor;
}
