# Phase 7 - Automated delivery

## 1. Outcome

Phase 7 converts a newly verified paid order into one durable fulfillment, one active expiring download grant, and one transactional delivery email. It preserves private Storage, limits every file request, supports safe resend through token rotation, and lets administrators revoke delivery without deleting order history.

The local implementation is complete. Live delivery remains blocked until Supabase Storage, Resend, the sender domain, and real provider flows are configured and verified.

## 2. Implemented routes

| Route | Purpose |
|---|---|
| `/downloads/[token]` | Token-protected delivery page listing only eligible files |
| `/api/downloads/[token]/[fileId]` | Atomically consumes one grant use and redirects to a 60-second Storage URL |
| `/admin/orders` | Reconciles payment and fulfillment status and offers resend/revoke controls |

## 3. Fulfillment lifecycle

1. A verified `checkout_session.payment.paid` event changes the order to paid.
2. Work scheduled after the webhook response calls the delivery service.
3. A service-role-only database function locks and rechecks the paid order and payment.
4. A unique order constraint creates at most one fulfillment for the order.
5. A random 256-bit delivery token is generated; only its SHA-256 hash is stored.
6. The grant expires after seven days and receives a bounded download allowance based on file count.
7. Resend receives a delivery email through the server adapter with a per-attempt idempotency key.
8. Email success or failure is stored as a delivery event and visible to administrators.

The payment webhook never returns a delivery link and never includes Storage access in its response.

## 4. Download authorization

The delivery page returns information only when the token hash matches and all of these conditions remain true:

- The order and payment are still paid.
- The fulfillment is delivered and not revoked.
- The grant has not expired or been revoked.
- The grant has remaining download uses.
- The requested file belongs to the purchased version.

Each file request locks the grant row, rechecks every rule, increments the count, records a safe event, and only then creates a 60-second signed Storage URL. Permanent public object URLs are never created.

## 5. Resend and revoke rules

- Resending requires an administrator session and a still-paid, non-revoked fulfillment.
- The prior active token is revoked before the replacement is inserted.
- A new email attempt receives a new token, expiry, and Resend idempotency key.
- Revocation changes fulfillment state, revokes all active grants, and records an audit event.
- A revoked fulfillment cannot be silently re-enabled by the resend action.
- Email provider errors never expose provider response bodies to customers or administrators.

## 6. Data and privacy rules

- Fulfillment, grant, and delivery-event tables use Row Level Security.
- Administrators receive read-only table policies; delivery mutations are service-role-only functions.
- Raw delivery tokens, Storage paths, email HTML, and raw provider responses are not stored in audit metadata.
- The public page receives safe filenames and sizes only after token validation.
- The server-only download endpoint is the only code path that receives the private bucket and path.

## 7. External gates

Before real delivery can launch:

- Apply migrations to a configured Supabase project and verify RLS and functions with real roles.
- Upload real versioned ZIP deliverables to the private `system-deliverables` bucket.
- Create a Resend account and restricted API key.
- Verify a WebSystemBuilders sending domain with SPF and DKIM, and review DMARC.
- Set an approved sender mailbox in `RESEND_FROM_EMAIL`.
- Execute test-mode paid, duplicate, email-failure, resend, revoke, expiry, exhausted-limit, wrong-file, and concurrent-download scenarios.
- Confirm download limits and seven-day email-link expiry as final production policy during legal and support review.
- Add monitoring for failed delivery attempts, bounces, provider outages, and missed jobs.

No automated verification sends a real email or downloads customer data.

## 8. Exit and next action

Phase 7 is locally complete when its tests, build, and route smoke checks pass. Live provider verification remains pending. Phase 8 may now let authenticated customers claim and view only their own orders and request fresh protected access without exposing the original email token.
