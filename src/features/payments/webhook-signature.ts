import { createHmac, timingSafeEqual } from "node:crypto";

export type PayMongoSignatureResult =
  | { valid: true; livemode: boolean; timestamp: number }
  | { valid: false };

const DEFAULT_TOLERANCE_SECONDS = 5 * 60;

export function verifyPayMongoSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
): PayMongoSignatureResult {
  if (!signatureHeader) return { valid: false };
  const parts = new Map(signatureHeader.split(",").map((part) => {
    const [key, ...value] = part.trim().split("=");
    return [key, value.join("=")];
  }));
  const timestamp = Number(parts.get("t"));
  if (!Number.isInteger(timestamp) || Math.abs(nowSeconds - timestamp) > toleranceSeconds) return { valid: false };

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  const testSignature = parts.get("te") ?? "";
  const liveSignature = parts.get("li") ?? "";
  if (safeHexEqual(expected, testSignature)) return { valid: true, livemode: false, timestamp };
  if (safeHexEqual(expected, liveSignature)) return { valid: true, livemode: true, timestamp };
  return { valid: false };
}

function safeHexEqual(expected: string, received: string) {
  if (!/^[a-f0-9]{64}$/i.test(received)) return false;
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(received, "hex"));
}
