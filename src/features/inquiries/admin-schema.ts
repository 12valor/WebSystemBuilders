import { z } from "zod";
import { inquiryStatuses } from "@/features/inquiries/admin-types";

export const adminInquiryUpdateSchema = z.object({
  status: z.enum(inquiryStatuses),
  assignment: z.enum(["keep", "assign_to_me", "unassign"]),
});

export type AdminInquiryUpdate = z.infer<typeof adminInquiryUpdateSchema>;
