import { z } from "zod";

const paymentSchema = z.object({
  id: z.string().regex(/^pay_[A-Za-z0-9]+$/),
  attributes: z.object({
    amount: z.number().int().positive(),
    currency: z.string().length(3),
    status: z.literal("paid"),
  }),
});

const checkoutSchema = z.object({
  id: z.string().regex(/^cs_[A-Za-z0-9]+$/),
  attributes: z.object({
    payments: z.array(paymentSchema).min(1),
    reference_number: z.string().min(1),
  }),
});

const currentEventSchema = z.object({
  data: z.object({
    type: z.literal("checkout_session.payment.paid"),
    livemode: z.boolean(),
    data: checkoutSchema,
  }),
});

const legacyEventSchema = z.object({
  data: z.object({
    id: z.string().min(8),
    attributes: z.object({
      type: z.literal("checkout_session.payment.paid"),
      livemode: z.boolean(),
      data: checkoutSchema,
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
  const current = currentEventSchema.safeParse(value);
  if (current.success) {
    return mapEvent(`payload_${payloadSha256}`, current.data.data, current.data.data.data);
  }
  const legacy = legacyEventSchema.safeParse(value);
  if (legacy.success) {
    return mapEvent(legacy.data.data.id, legacy.data.data.attributes, legacy.data.data.attributes.data);
  }
  return null;
}

function mapEvent(
  providerEventId: string,
  event: { type: "checkout_session.payment.paid"; livemode: boolean },
  checkout: z.infer<typeof checkoutSchema>,
): PaidCheckoutEvent {
  const payment = checkout.attributes.payments.at(-1) as z.infer<typeof paymentSchema>;
  return {
    providerEventId,
    eventType: event.type,
    checkoutSessionId: checkout.id,
    providerPaymentId: payment.id,
    amountMinor: payment.attributes.amount,
    currency: payment.attributes.currency.toUpperCase(),
    livemode: event.livemode,
  };
}
