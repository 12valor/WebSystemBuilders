import { createHmac, timingSafeEqual } from "node:crypto";

export type LemonSqueezySignatureResult =
  | { valid: true }
  | { valid: false };

export function verifyLemonSqueezySignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): LemonSqueezySignatureResult {
  if (!signatureHeader || !secret || !rawBody) return { valid: false };

  const hmac = createHmac("sha256", secret).update(rawBody).digest("hex");

  if (safeHexEqual(hmac, signatureHeader)) {
    return { valid: true };
  }

  return { valid: false };
}

function safeHexEqual(expected: string, received: string) {
  if (!/^[a-f0-9]{64}$/i.test(received)) return false;
  return timingSafeEqual(Buffer.from(expected.toLowerCase(), "hex"), Buffer.from(received.toLowerCase(), "hex"));
}
