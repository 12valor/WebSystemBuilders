import "server-only";
import type { AdminRole } from "@/lib/auth/roles";
import { hasRequiredAdminRole } from "@/lib/auth/roles";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export class AuthorizationError extends Error {
  constructor(
    public readonly code: "unauthenticated" | "forbidden",
    message = "You are not authorized to access this resource.",
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function requireAdmin(requiredRole: AdminRole = "admin") {
  const identity = await getCurrentIdentity();
  if (!identity) {
    throw new AuthorizationError("unauthenticated", "Authentication is required.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", identity.id)
    .maybeSingle<{ role: AdminRole }>();

  const role = data?.role ?? null;

  if (error || !role || !hasRequiredAdminRole(role, requiredRole)) {
    throw new AuthorizationError("forbidden");
  }

  return { identity, role };
}
