import { createHash, randomBytes } from "node:crypto";

export function createDeliveryToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashDeliveryToken(token) };
}

export function hashDeliveryToken(token: string) { return createHash("sha256").update(token).digest("hex"); }
