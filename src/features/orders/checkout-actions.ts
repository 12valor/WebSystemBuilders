"use server";

import { z } from "zod";
import { scanToPayFormSchema, scanToPayOrderRowSchema, type ScanToPayField } from "@/features/orders/checkout-schema";
import { createOrderReturnToken } from "@/features/orders/token";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createAdminClient } from "@/lib/supabase/admin";

export type ScanToPayState = {
  status: "idle" | "error" | "unavailable" | "submitted";
  message?: string;
  orderNumber?: string;
  returnToken?: string;
  values?: {
    customerName?: string;
    customerEmail?: string;
    contactNumber?: string;
    referenceNumber?: string;
    proofOfPaymentUrl?: string;
  };
  fieldErrors?: Partial<Record<ScanToPayField, string[]>>;
};

export async function submitScanToPayOrder(_previousState: ScanToPayState, formData: FormData): Promise<ScanToPayState> {
  const values = {
    systemSlug: String(formData.get("systemSlug") ?? ""),
    customerName: String(formData.get("customerName") ?? ""),
    customerEmail: String(formData.get("customerEmail") ?? ""),
    contactNumber: String(formData.get("contactNumber") ?? ""),
    referenceNumber: String(formData.get("referenceNumber") ?? ""),
    proofOfPaymentUrl: String(formData.get("proofOfPaymentUrl") ?? ""),
    termsAccepted: String(formData.get("termsAccepted") ?? ""),
    licenseAccepted: String(formData.get("licenseAccepted") ?? ""),
    refundAccepted: String(formData.get("refundAccepted") ?? ""),
    deliveryAccepted: String(formData.get("deliveryAccepted") ?? ""),
  };

  const parsed = scanToPayFormSchema.safeParse(values);
  const retained = {
    customerName: values.customerName,
    customerEmail: values.customerEmail,
    contactNumber: values.contactNumber,
    referenceNumber: values.referenceNumber,
    proofOfPaymentUrl: values.proofOfPaymentUrl,
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
  const returnToken = createOrderReturnToken();

  const orderResult = await supabase.rpc("create_scan_to_pay_order", {
    p_system_slug: parsed.data.systemSlug,
    p_customer_name: parsed.data.customerName,
    p_customer_email: parsed.data.customerEmail,
    p_contact_number: parsed.data.contactNumber || null,
    p_reference_number: parsed.data.referenceNumber,
    p_proof_of_payment_url: parsed.data.proofOfPaymentUrl,
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
    returnToken: returnToken.token,
    message: `Your payment for order ${order.order_number} has been submitted! Our team will verify your transaction reference within 24 hours.`,
  };
}
