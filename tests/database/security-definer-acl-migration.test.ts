import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260817114414_harden_security_definer_function_acl.sql"),
  "utf8",
);
const eventTriggerMigration = readFileSync(
  resolve("supabase/migrations/20260817114642_restrict_rls_auto_enable_acl.sql"),
  "utf8",
);

describe("security definer function ACL hardening", () => {
  it("removes anonymous execution from authenticated customer and admin RPCs", () => {
    expect(migration).toContain(
      "revoke all on function public.claim_customer_orders() from public, anon, authenticated",
    );
    expect(migration).toContain(
      "revoke all on function public.complete_user_onboarding(text, text, text, text[]) from public, anon, authenticated",
    );
    expect(migration).toContain(
      "grant execute on function public.get_admin_access() to authenticated, service_role",
    );
    expect(migration).not.toMatch(/grant execute on function public\..* to anon/);
  });

  it("keeps payment status and delivery RPCs service-role-only", () => {
    expect(migration).toContain(
      "revoke all on function public.get_order_status_by_token(text, text) from public, anon, authenticated",
    );
    expect(migration).toContain(
      "grant execute on function public.get_order_status_by_token(text, text) to service_role",
    );
    expect(migration).toContain(
      "grant execute on function public.create_delivery_for_order(uuid, text, timestamptz) to service_role",
    );
    expect(migration).toContain(
      "grant execute on function public.consume_download_grant(text, uuid) to service_role",
    );
  });

  it("removes API-role grants from the optional RLS event-trigger helper", () => {
    expect(eventTriggerMigration).toContain(
      "if to_regprocedure('public.rls_auto_enable()') is not null",
    );
    expect(eventTriggerMigration).toContain(
      "revoke all on function public.rls_auto_enable() from public, anon, authenticated",
    );
    expect(eventTriggerMigration).toContain(
      "grant execute on function public.rls_auto_enable() to service_role",
    );
  });
});
