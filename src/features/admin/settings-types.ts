export type AdminAccessRecord = {
  userId: string;
  email: string;
  displayName: string | null;
  role: "admin" | "super_admin";
  grantedBy: string | null;
  grantedAt: string;
};

export type AdminAccessData = {
  status: "ready" | "unconfigured" | "error";
  currentUserId: string | null;
  records: AdminAccessRecord[];
};

export type IntegrationHealthItem = {
  id: "supabase" | "inquiries" | "resend" | "site_url";
  label: string;
  status: "configured" | "not_configured";
  detail: string;
  liveVerified: false;
};