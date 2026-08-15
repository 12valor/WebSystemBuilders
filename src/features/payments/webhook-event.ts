import { z } from "zod";

const paymentSchema = z.object({
  id: z.string().regex(/^pay_[A-Za-z0-9]+$/),
  attributes: z.object({
    amount: z.number().int().positive(),
    currency: z.string().length(3),
    status: z.string(),
  }),
});

const checkoutSessionSchema = z.object({
  id: z.string().regex(/^cs_[A-Za-z0-9]+$/),
  type: z.literal("checkout_session"),
  attributes: z.object({
    reference_number: z.string().min(1),
    metadata: z.object({
      order_id: z.uuid(),
      system_id: z.uuid().optional(),
      user_id: z.uuid().optional(),
    }),
    payment_intent: z.object({ id: z.string().regex(/^pi_[A-Za-z0-9]+$/) }).nullable().optional(),
    payments: z.array(paymentSchema).min(1),
  }),
});

const hostedEnvelopeSchema = z.object({
  event_type: z.string().optional(),
  data: z.object({
    id: z.string().optional(),
    type: z.string(),
    resource: z.string().optional(),
    livemode: z.boolean(),
    data: z.unknown(),
  }),
});

const legacyEnvelopeSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.literal("event").optional(),
    attributes: z.object({
      type: z.string(),
      livemode: z.boolean(),
      data: z.unknown(),
    }),
  }),
});

export type PaidCheckoutEvent = {
  providerEventId: string;
  eventType: "checkout_session.payment.paid";
  checkoutSessionId: string;
  orderId: string;
  orderNumber: string;
  providerPaymentIntentId: string | null;
  providerPaymentId: string;
  paymentStatus: "paid";
  amountMinor: number;
  currency: string;
  livemode: boolean;
};

export type ParsedPaymongoWebhook =
  | { kind: "paid"; event: PaidCheckoutEvent }
  | { kind: "ignored"; eventType: string; livemode: boolean };

export function parsePaymongoWebhook(value: unknown, payloadSha256: string): ParsedPaymongoWebhook | null {
  const hosted = hostedEnvelopeSchema.safeParse(value);
  if (hosted.success) {
    return buildEvent(
      hosted.data.data.id ?? `sha256:${payloadSha256}`,
      hosted.data.data.type,
      hosted.data.data.livemode,
      hosted.data.data.data,
    );
  }

  const legacy = legacyEnvelopeSchema.safeParse(value);
  if (legacy.success) {
    return buildEvent(
      legacy.data.data.id,
      legacy.data.data.attributes.type,
      legacy.data.data.attributes.livemode,
      legacy.data.data.attributes.data,
    );
  }

  return null;
}

function buildEvent(
  providerEventId: string,
  eventType: string,
  livemode: boolean,
  checkoutValue: unknown,
): ParsedPaymongoWebhook | null {
  if (eventType !== "checkout_session.payment.paid") {
    return { kind: "ignored", eventType, livemode };
  }

  const parsedCheckout = checkoutSessionSchema.safeParse(checkoutValue);
  if (!parsedCheckout.success) return null;
  const checkoutSession = parsedCheckout.data;

  const payment = checkoutSession.attributes.payments.find((candidate) => candidate.attributes.status === "paid");
  if (!payment) return null;

  return {
    kind: "paid",
    event: {
      providerEventId,
      eventType,
      checkoutSessionId: checkoutSession.id,
      orderId: checkoutSession.attributes.metadata.order_id,
      orderNumber: checkoutSession.attributes.reference_number,
      providerPaymentIntentId: checkoutSession.attributes.payment_intent?.id ?? null,
      providerPaymentId: payment.id,
      paymentStatus: "paid",
      amountMinor: payment.attributes.amount,
      currency: payment.attributes.currency.toUpperCase(),
      livemode,
    },
  };
}
