import { createHash, randomBytes } from "node:crypto";

export function createOrderReturnToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashOrderReturnToken(token) };
}

export function hashOrderReturnToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
