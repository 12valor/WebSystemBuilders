"use server";

import { z } from "zod";
import { scanToPayFormSchema, scanToPayOrderRowSchema, type ScanToPayField } from "@/features/orders/checkout-schema";
import { createOrderReturnToken } from "@/features/orders/token";
import { getCurrentIdentity, getCurrentUser } from "@/lib/auth/current-user";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createAdminClient } from "@/lib/supabase/admin";

export type ScanToPayState = {
  status: "idle" | "error" | "unavailable" | "submitted";
  message?: string;
  orderNumber?: string;
  returnToken?: string;
  values?: {
    contactNumber?: string;
    referenceNumber?: string;
    proofStoragePath?: string;
  };
  fieldErrors?: Partial<Record<ScanToPayField, string[]>>;
};

export async function submitScanToPayOrder(_previousState: ScanToPayState, formData: FormData): Promise<ScanToPayState> {
  const values = {
    systemId: String(formData.get("systemId") ?? ""),
    contactNumber: String(formData.get("contactNumber") ?? ""),
    referenceNumber: String(formData.get("referenceNumber") ?? ""),
    proofStoragePath: String(formData.get("proofStoragePath") ?? ""),
    termsAccepted: String(formData.get("termsAccepted") ?? ""),
    licenseAccepted: String(formData.get("licenseAccepted") ?? ""),
    refundAccepted: String(formData.get("refundAccepted") ?? ""),
    deliveryAccepted: String(formData.get("deliveryAccepted") ?? ""),
  };

  const parsed = scanToPayFormSchema.safeParse(values);
  const retained = {
    contactNumber: values.contactNumber,
    referenceNumber: values.referenceNumber,
    proofStoragePath: values.proofStoragePath,
  };

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please complete all required fields, upload proof of payment, and confirm required acknowledgements.",
      values: retained,
      fieldErrors: parsed.error.flatten().fieldErrors as Partial<Record<ScanToPayField, string[]>>,
    };
  }

  if (!isSupabasePubliclyConfigured()) {
    return {
      status: "unavailable",
      message: "Database connection is not configured. Purchase submission could not be processed.",
      values: retained,
    };
  }

  const supabase = createAdminClient();
  const identity = await getCurrentIdentity();
  const user = await getCurrentUser();
  if (!identity || !user || user.id !== identity.id || !user.email || !user.email_confirmed_at) {
    return { status: "error", message: "Sign in with a verified account before submitting payment proof.", values: retained };
  }
  const profileResult = await supabase.from("profiles").select("full_name,display_name").eq("user_id", identity.id).maybeSingle();
  const customerName = profileResult.data?.full_name?.trim()
    || profileResult.data?.display_name?.trim()
    || user.email.split("@")[0]?.replace(/[._-]+/g, " ").trim()
    || "Customer";
  const returnToken = createOrderReturnToken();

  const orderResult = await supabase.rpc("create_authenticated_manual_order", {
    p_system_id: parsed.data.systemId,
    p_profile_user_id: identity.id,
    p_customer_name: customerName,
    p_customer_email: user.email.toLowerCase(),
    p_contact_number: parsed.data.contactNumber || null,
    p_reference_number: parsed.data.referenceNumber,
    p_proof_storage_path: parsed.data.proofStoragePath,
    p_return_token_hash: returnToken.hash,
  });

  const orderRows = z.array(scanToPayOrderRowSchema).safeParse(orderResult.data);
  if (orderResult.error || !orderRows.success || orderRows.data.length !== 1) {
    return {
      status: "error",
      message: "This system is currently unavailable for purchase submission.",
      values: retained,
    };
  }

  const order = orderRows.data[0];

  return {
    status: "submitted",
    orderNumber: order.order_number,
    message: `Your payment proof for order ${order.order_number} is awaiting administrator verification.`,
  };
}
