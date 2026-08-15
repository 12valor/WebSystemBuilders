import { createHmac, timingSafeEqual } from "node:crypto";

export type PaymongoSignatureResult =
  | { valid: true; timestamp: number }
  | { valid: false };

export function verifyPaymongoSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  options: { nowSeconds?: number; toleranceSeconds?: number } = {},
): PaymongoSignatureResult {
  if (!signatureHeader || !secret || !rawBody) return { valid: false };

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, ...rest] = part.trim().split("=");
      return [key, rest.join("=")];
    }),
  );
  const timestamp = Number(parts.t);
  const testSignature = parts.te;
  const nowSeconds = options.nowSeconds ?? Math.floor(Date.now() / 1000);
  const toleranceSeconds = options.toleranceSeconds ?? 300;

  if (!Number.isSafeInteger(timestamp) || Math.abs(nowSeconds - timestamp) > toleranceSeconds) {
    return { valid: false };
  }
  if (!testSignature || !/^[a-f0-9]{64}$/i.test(testSignature)) return { valid: false };

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  if (!safeHexEqual(expected, testSignature)) return { valid: false };
  return { valid: true, timestamp };
}

function safeHexEqual(expected: string, received: string) {
  return timingSafeEqual(
    Buffer.from(expected.toLowerCase(), "hex"),
    Buffer.from(received.toLowerCase(), "hex"),
  );
}
