import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve("supabase/migrations/20260725140000_phase_8_customer_portal.sql"), "utf8");

describe("Phase 8 customer portal migration", () => {
  it("claims only unclaimed orders matching the confirmed authentication email", () => {
    const claim = migration.slice(migration.indexOf("public.claim_customer_orders"), migration.indexOf("public.get_customer_portal"));
    expect(claim).toContain("email_confirmed_at is not null");
    expect(claim).toContain("profile_user_id is null and customer_email = verified_email");
    expect(claim).not.toContain("profile_user_id is not null");
  });

  it("returns only orders owned by the current authenticated user", () => {
    const portal = migration.slice(migration.indexOf("public.get_customer_portal"), migration.indexOf("public.create_portal_download_grant"));
    expect(portal).toContain("o.profile_user_id = (select auth.uid())");
    expect(migration).toContain("orders_select_own_or_admin");
    expect(migration).toContain("order_items_select_own_or_admin");
  });

  it("issues one-hour portal access only for owned paid delivered orders", () => {
    const access = migration.slice(migration.indexOf("public.create_portal_download_grant"), migration.indexOf("private.audit_support_request"));
    expect(access).toContain("o.profile_user_id = (select auth.uid()) and o.status = 'paid'");
    expect(access).toContain("f.status = 'delivered' and f.revoked_at is null");
    expect(access).toContain("now() + interval '1 hour'");
    expect(access).toContain("update public.download_grants set revoked_at");
  });

  it("restricts support creation to a customer's own order and keeps audit metadata message-free", () => {
    expect(migration).toContain("support_requests_insert_own_order");
    expect(migration).toContain("orders.profile_user_id = (select auth.uid())");
    const audit = migration.slice(migration.indexOf("private.audit_support_request"));
    expect(audit).not.toContain("new.message");
    expect(audit).not.toContain("new.subject");
  });
});
