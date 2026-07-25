import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve("supabase/migrations/20260725130000_phase_7_delivery.sql"), "utf8");

describe("Phase 7 delivery migration", () => {
  it("allows at most one fulfillment per paid order", () => {
    expect(migration).toContain("order_id uuid not null unique references public.orders");
    expect(migration).toContain("on conflict (order_id) do nothing");
    expect(migration).toContain("p.status = 'paid' and o.status = 'paid'");
  });

  it("stores hashed expiring grants with bounded atomic consumption", () => {
    expect(migration).toContain("token_hash text not null unique");
    expect(migration).toContain("download_grants_one_active_per_fulfillment");
    const consume = migration.slice(migration.indexOf("public.consume_download_grant"), migration.indexOf("public.revoke_delivery"));
    expect(consume).toContain("for update");
    expect(consume).toContain("selected_grant.expires_at <= now()");
    expect(consume).toContain("selected_grant.download_count >= selected_grant.max_downloads");
    expect(consume).toContain("download_count = download_count + 1");
  });

  it("revokes old links before resend and all active links on administrator revoke", () => {
    const rotate = migration.slice(migration.indexOf("public.rotate_delivery_grant"), migration.indexOf("public.mark_delivery_email_result"));
    expect(rotate).toContain("revoked_at = coalesce(revoked_at, now())");
    expect(rotate.indexOf("update public.download_grants")).toBeLessThan(rotate.indexOf("insert into public.download_grants"));
    const revoke = migration.slice(migration.indexOf("public.revoke_delivery"));
    expect(revoke).toContain("status = 'revoked'");
    expect(revoke).toContain("where fulfillment_id = selected_fulfillment_id and revoked_at is null");
  });

  it("keeps delivery reads administrator-only and mutations service-role-only", () => {
    expect(migration).toContain("alter table public.download_grants enable row level security");
    expect(migration).toContain("download_grants_select_admin");
    expect(migration).toContain("grant execute on function public.consume_download_grant(text, uuid) to service_role");
    expect(migration).not.toContain("grant execute on function public.consume_download_grant(text, uuid) to anon");
  });
});
