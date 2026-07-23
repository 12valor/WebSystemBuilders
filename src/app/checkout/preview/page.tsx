import type { Metadata } from "next";
import { CheckoutPreview } from "@/components/checkout/checkout-preview";

export const metadata: Metadata = {
  title: "Checkout layout preview",
  description: "Phase 1 checkout direction for a verified digital-system purchase.",
  robots: { index: false, follow: false },
};

export default function CheckoutPreviewPage() {
  return <CheckoutPreview />;
}
