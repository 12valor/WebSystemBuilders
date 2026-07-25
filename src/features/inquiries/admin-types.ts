import type { AdminDataStatus } from "@/features/admin/types";

export const inquiryStatuses = ["new", "in_review", "responded", "closed", "spam"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];

export type AdminInquiryRecord = {
  id: string;
  inquiryType: "contact" | "quote";
  audience: "student" | "business" | "general";
  name: string;
  email: string;
  organization: string | null;
  subject: string;
  message: string;
  projectType: string | null;
  requirements: string | null;
  timeline: string | null;
  sourcePath: string;
  status: InquiryStatus;
  assignedTo: string | null;
  assignedLabel: string | null;
  respondedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminInquiryEvent = {
  id: string;
  eventType: "created" | "assigned" | "unassigned" | "status_changed";
  actorLabel: string;
  fromStatus: InquiryStatus | null;
  toStatus: InquiryStatus | null;
  assignedLabel: string | null;
  createdAt: string;
};

export type AdminInquiriesData = {
  status: AdminDataStatus;
  inquiries: AdminInquiryRecord[];
  selectedInquiry: AdminInquiryRecord | null;
  history: AdminInquiryEvent[];
};
