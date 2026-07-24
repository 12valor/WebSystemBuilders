import "server-only";
import { z } from "zod";
import { publicSupabaseEnvSchema } from "@/lib/env/public";

const inquiryEnvSchema = publicSupabaseEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  INQUIRY_FINGERPRINT_SALT: z.string().min(32),
});

export type InquiryEnv = z.infer<typeof inquiryEnvSchema>;

export function getInquiryEnv(): InquiryEnv {
  const result = inquiryEnvSchema.safeParse(readInquiryEnv());

  if (!result.success) {
    throw new Error("Invalid inquiry configuration: " + z.prettifyError(result.error));
  }

  return result.data;
}

export function isInquirySubmissionConfigured(): boolean {
  return inquiryEnvSchema.safeParse(readInquiryEnv()).success;
}

function readInquiryEnv() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    INQUIRY_FINGERPRINT_SALT: process.env.INQUIRY_FINGERPRINT_SALT,
  };
}
