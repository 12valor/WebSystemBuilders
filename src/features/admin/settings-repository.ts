import "server-only";

import { z } from "zod";
import type { AdminAccessData, AdminAccessRecord } from "@/features/admin/settings-types";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const rowSchema = z.object({ user_id: z.uuid(), email: z.email(), display_name: z.string().nullable(), role: z.enum(["admin", "super_admin"]), granted_by: z.uuid().nullable(), granted_at: z.string() });

export async function getAdminAccessData(): Promise<AdminAccessData> {
  if (!isSupabasePubliclyConfigured()) return { status: "unconfigured", currentUserId: null, records: [] };
  let currentUserId: string;
  try { currentUserId = (await requireAdmin("super_admin")).identity.id; }
  catch (error) { if (error instanceof AuthorizationError) throw error; throw error; }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_admin_access");
  if (error) return { status: "error", currentUserId, records: [] };
  const rows = z.array(rowSchema).safeParse(data);
  if (!rows.success) return { status: "error", currentUserId, records: [] };
  return { status: "ready", currentUserId, records: rows.data.map(mapRecord) };
}

function mapRecord(row: z.infer<typeof rowSchema>): AdminAccessRecord {
  return { userId: row.user_id, email: row.email, displayName: row.display_name, role: row.role, grantedBy: row.granted_by, grantedAt: row.granted_at };
}