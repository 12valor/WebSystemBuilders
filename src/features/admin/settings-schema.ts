import { z } from "zod";

export const adminAccessInputSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  role: z.enum(["admin", "super_admin"]),
  action: z.enum(["grant", "revoke"]),
});
