# Phase 8 - Customer portal

## 1. Outcome

Phase 8 replaces the signed-in account preview with a database-backed customer workspace for claimed orders, payment and fulfillment status, purchased and current version context, fresh protected downloads, receipt guidance, and order-linked support. It also adds an administrator support queue.

The local implementation is complete. Live account and ownership verification remain blocked until Supabase Auth, the commerce migrations, and provider test flows are configured.

## 2. Identity and order claiming

1. Customers sign in through Supabase passwordless email authentication.
2. The database reads the authenticated user directly and requires `email_confirmed_at`.
3. Only orders with no existing `profile_user_id` and a normalized checkout email matching the confirmed authentication email are claimed.
4. An already claimed order is never reassigned through email matching.
5. Customer portal reads use `auth.uid()` and return only orders owned by that profile.

Knowing an order number or email address does not grant account access.

## 3. Customer capabilities

| Capability | Behavior |
|---|---|
| Orders | Shows durable order number, paid state, amount, purchased version, and fulfillment status |
| Receipts | Identifies whether the PayMongo email receipt is expected; it does not invent a tax invoice or PDF receipt |
| Version context | Compares the purchased snapshot with the current published label without promising update entitlement |
| Downloads | Creates a new one-hour hashed grant only for an owned, paid, delivered, non-revoked order |
| Support | Creates a validated request linked to an owned order and shows its current status |

Creating fresh portal download access revokes the prior email or portal grant for that fulfillment. The new link retains the bounded file-download limit.

## 4. Support operations

- Customers may create a request only for an order whose `profile_user_id` is their authenticated user ID.
- Subject and message length are validated on the server and constrained in the database.
- Customer messages are visible only to that customer and authorized administrators.
- Administrators may update the durable status through `/admin/support`.
- Resolved and closed requests require a resolution timestamp; reopening clears it.
- Audit events include request identity, order identity, and status only—not the private subject or message.

The first release tracks request status but does not claim real-time chat, response-time guarantees, or email replies.

## 5. Authorization rules

- Customer order and item policies require `profile_user_id = auth.uid()`.
- Payment records, provider events, raw fulfillment records, grant hashes, and Storage paths are not exposed through the customer tables.
- Portal data and grant functions verify the current authenticated user inside PostgreSQL.
- Admin visibility continues through the existing server-verified admin role.
- UI visibility is never treated as authorization.

## 6. External gates

Before customer accounts can launch:

- Configure Supabase Auth redirect URLs for local, preview, and production origins.
- Verify passwordless sign-in, callback exchange, session refresh, and sign-out in a real project.
- Test confirmed and unconfirmed emails, wrong-email order isolation, already-claimed orders, and two concurrent claim attempts.
- Test customer-versus-customer and customer-versus-admin RLS with real identities.
- Confirm the support operating process, privacy retention period, and response expectations.
- Decide whether production invoices require a separate compliant document workflow.
- Decide product-specific update entitlement before offering newer files to previous buyers.

## 7. Exit and next action

Phase 8 is locally complete when schema tests, migration contracts, lint, TypeScript, the full suite, production build, and account/admin-support route smoke checks pass. Phase 9 then hardens accessibility, security headers, SEO, performance, failure states, and cross-route regression coverage.
