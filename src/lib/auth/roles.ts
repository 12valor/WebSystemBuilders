export const adminRoles = ["admin", "super_admin"] as const;

export type AdminRole = (typeof adminRoles)[number];

export function hasRequiredAdminRole(actual: AdminRole | null, required: AdminRole): boolean {
  if (!actual) return false;
  if (actual === "super_admin") return true;
  return actual === required;
}
