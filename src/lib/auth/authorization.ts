import "server-only";
import type { AdminRole } from "@/lib/auth/roles";
import { hasRequiredAdminRole } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export class AuthorizationError extends Error {
  constructor(message = "You are not authorized to access this resource.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function requireAdmin(requiredRole: AdminRole = "admin") {
  const user = await getCurrentUser();
  if (!user) throw new AuthorizationError("Authentication is required.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle<{ role: AdminRole }>();

  const role = data?.role ?? null;

  if (error || !role || !hasRequiredAdminRole(role, requiredRole)) {
    throw new AuthorizationError();
  }

  return { user, role };
}
