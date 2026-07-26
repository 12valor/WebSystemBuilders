import { z } from "zod";

const lemonSqueezyEventSchema = z.object({
  meta: z.object({
    event_name: z.string(),
    custom_data: z.object({
      order_id: z.string().optional(),
      order_number: z.string().optional(),
    }).optional(),
  }),
  data: z.object({
    id: z.string().min(1),
    attributes: z.object({
      status: z.string(),
      total: z.number().int().positive(),
      currency: z.string().default("USD"),
      order_number: z.union([z.number(), z.string()]).optional(),
    }),
  }),
});

export type PaidCheckoutEvent = {
  providerEventId: string;
  eventType: "checkout_session.payment.paid";
  checkoutSessionId: string;
  providerPaymentId: string;
  amountMinor: number;
  currency: string;
  livemode: boolean;
};

export function parsePaidCheckoutEvent(value: unknown, payloadSha256: string): PaidCheckoutEvent | null {
  const parsed = lemonSqueezyEventSchema.safeParse(value);
  if (!parsed.success) return null;

  const { meta, data } = parsed.data;
  if (meta.event_name !== "order_created" && meta.event_name !== "order_paid") {
    return null;
  }

  if (data.attributes.status !== "paid") {
    return null;
  }

  const checkoutSessionId = meta.custom_data?.order_id ?? data.id;

  return {
    providerEventId: `ls_${data.id}_${payloadSha256.slice(0, 8)}`,
    eventType: "checkout_session.payment.paid",
    checkoutSessionId,
    providerPaymentId: data.id,
    amountMinor: data.attributes.total,
    currency: data.attributes.currency.toUpperCase(),
    livemode: true,
  };
}
