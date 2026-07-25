import "server-only";

import { z } from "zod";

const responseSchema = z.object({ id: z.string().min(8) });

export type DeliveryEmailInput = {
  apiKey: string; fromEmail: string; to: string; customerName: string; orderNumber: string;
  productName: string; versionLabel: string; deliveryUrl: string; expiresAt: string;
  filenames: string[]; idempotencyKey: string;
};

export async function sendDeliveryEmail(input: DeliveryEmailInput) {
  const subject = `Your WebSystemBuilders files - ${input.orderNumber}`;
  const expiry = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(input.expiresAt));
  const fileList = input.filenames.map((name) => `- ${name}`).join("\n");
  const text = `Hello ${input.customerName},\n\nPayment for ${input.productName} (version ${input.versionLabel}) has been verified.\n\nOpen your private delivery page:\n${input.deliveryUrl}\n\nThe link expires ${expiry} and has a limited number of downloads. Do not forward it.\n\nIncluded files:\n${fileList}\n\nWebSystemBuilders`;
  const htmlFiles = input.filenames.map((name) => `<li>${escapeHtml(name)}</li>`).join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#17181b"><p>Hello ${escapeHtml(input.customerName)},</p><h1 style="font-size:24px">Your files are ready.</h1><p>Payment for <strong>${escapeHtml(input.productName)}</strong> (version ${escapeHtml(input.versionLabel)}) has been verified.</p><p><a href="${escapeHtml(input.deliveryUrl)}" style="display:inline-block;background:#111214;color:#f5f5f7;padding:12px 18px;border-radius:8px;text-decoration:none">Open private delivery</a></p><p>This link expires ${escapeHtml(expiry)} and has a limited number of downloads. Do not forward it.</p><ul>${htmlFiles}</ul><p>WebSystemBuilders</p></div>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${input.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": input.idempotencyKey },
    body: JSON.stringify({ from: `WebSystemBuilders <${input.fromEmail}>`, to: [input.to], subject, html, text, tags: [{ name: "category", value: "system_delivery" }] }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Resend delivery failed with status ${response.status}.`);
  const parsed = responseSchema.safeParse(await response.json());
  if (!parsed.success) throw new Error("Resend returned an unsupported response.");
  return parsed.data.id;
}

function escapeHtml(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
