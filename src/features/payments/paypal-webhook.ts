import { z } from "zod";
import { parseMinorUnits } from "@/features/payments/paypal";

const eventSchema = z.object({
  id: z.string().min(8).max(160),
  event_type: z.string().min(3).max(120),
  resource: z.record(z.string(), z.unknown()),
});

const amountSchema = z.object({ currency_code: z.string().length(3), value: z.string() });
const relatedIdsSchema = z.object({
  order_id: z.string().optional(),
  capture_id: z.string().optional(),
}).passthrough();

const supportedEvents = new Set([
  "CHECKOUT.ORDER.APPROVED",
  "CHECKOUT.PAYMENT-APPROVAL.REVERSED",
  "PAYMENT.CAPTURE.COMPLETED",
  "PAYMENT.CAPTURE.PENDING",
  "PAYMENT.CAPTURE.DECLINED",
  "PAYMENT.CAPTURE.DENIED",
  "PAYMENT.CAPTURE.REFUNDED",
  "PAYMENT.CAPTURE.REVERSED",
]);

export type ParsedPayPalWebhook =
  | { kind: "ignored"; eventId: string; eventType: string }
  | { kind: "approved"; eventId: string; eventType: string; providerOrderId: string }
  | {
      kind: "lifecycle";
      eventId: string;
      eventType: string;
      providerOrderId: string | null;
      relatedCaptureId: string | null;
      providerPaymentId: string | null;
      state: "completed" | "pending" | "declined" | "refunded" | "reversed";
      amountMinor: number | null;
      currency: string | null;
    };

export function parsePayPalWebhook(value: unknown): ParsedPayPalWebhook | null {
  const parsed = eventSchema.safeParse(value);
  if (!parsed.success) return null;
  const { id: eventId, event_type: eventType, resource } = parsed.data;
  if (!supportedEvents.has(eventType)) return { kind: "ignored", eventId, eventType };
  const resourceId = typeof resource.id === "string" ? resource.id : null;
  if (eventType === "CHECKOUT.ORDER.APPROVED") {
    return resourceId ? { kind: "approved", eventId, eventType, providerOrderId: resourceId } : null;
  }

  const supplementary = z.object({ related_ids: relatedIdsSchema }).safeParse(resource.supplementary_data);
  const relatedIds = supplementary.success ? supplementary.data.related_ids : {};
  const amount = amountSchema.safeParse(resource.amount);
  const providerOrderId = relatedIds.order_id ?? (eventType.startsWith("CHECKOUT.") ? resourceId : null);
  const relatedCaptureId = relatedIds.capture_id ?? null;
  const providerPaymentId = eventType.startsWith("PAYMENT.CAPTURE.") && !eventType.endsWith("REFUNDED")
    ? resourceId
    : relatedCaptureId;
  const state = eventState(eventType);
  if (!state) return null;
  return {
    kind: "lifecycle",
    eventId,
    eventType,
    providerOrderId,
    relatedCaptureId,
    providerPaymentId,
    state,
    amountMinor: amount.success ? parseMinorUnits(amount.data.value) : null,
    currency: amount.success ? amount.data.currency_code.toUpperCase() : null,
  };
}

function eventState(eventType: string): "completed" | "pending" | "declined" | "refunded" | "reversed" | null {
  if (eventType === "PAYMENT.CAPTURE.COMPLETED") return "completed";
  if (eventType === "PAYMENT.CAPTURE.PENDING") return "pending";
  if (eventType === "PAYMENT.CAPTURE.DECLINED" || eventType === "PAYMENT.CAPTURE.DENIED") return "declined";
  if (eventType === "PAYMENT.CAPTURE.REFUNDED") return "refunded";
  if (eventType === "PAYMENT.CAPTURE.REVERSED" || eventType === "CHECKOUT.PAYMENT-APPROVAL.REVERSED") return "reversed";
  return null;
}
