import type { Metadata } from "next";
import { AccountPreview } from "@/components/customer/account-preview";

export const metadata: Metadata = {
  title: "Customer account preview",
  description: "Phase 1 customer account direction for orders, downloads, and support.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountPreview />;
}
