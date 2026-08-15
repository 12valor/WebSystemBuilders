# Phase 6 - Payment and ordering

## Outcome and status

Phase 6 provides authenticated PayMongo Hosted Checkout v2 in enforced test mode. It creates or reuses an internal order before provider checkout, snapshots authoritative catalog data, verifies signed provider events, and records payment separately from fulfillment.

The implementation and mocked contracts are local. Provider-backed checkout and webhook verification remain blocked until the migration is applied to an intended Supabase test project, test credentials are configured, merchant methods are enabled, and a public HTTPS test webhook is registered. Production commerce is not ready.

## Checkout flow

1. A signed-in buyer opens `/checkout/[slug]` and accepts the displayed policies.
2. The browser sends only `{ systemId }` to `POST /api/payments/paymongo/checkout`.
3. The server revalidates the verified Supabase identity and resolves the profile name and email.
4. A service-role RPC locks the user/system checkout pair, reads the published fixed PHP price and current private deliverable, and creates or reuses one recent pending order.
5. The order item snapshots product, version, price, currency, license, support, delivery, and inclusions.
6. The server creates a PayMongo v2 Checkout Session with `Idempotency-Key: checkout-{paymentAttemptId}` and only the configured merchant method subset.
7. The trusted hosted URL is stored and returned. Failed session creation marks that attempt failed; a retry creates another payment attempt under the same order.

The adapter accepts only `sk_test_...`, uses Basic authentication, has a bounded timeout, sends no pass-on fee, requests an email receipt, and exposes safe errors. It logs only `[PayMongo] Running in TEST MODE`.

## Webhook authority

`POST /api/webhooks/paymongo` is the only authority that marks a PayMongo payment paid.

- Bodies over 256 KiB are rejected before JSON processing.
- The route verifies `Paymongo-Signature` by calculating HMAC-SHA256 over `timestamp.rawBody`, comparing the test slot in constant time, and enforcing a five-minute tolerance.
- Live signatures and live-mode payloads are rejected.
- Current Hosted Checkout and documented legacy event envelopes are parsed.
- Only `checkout_session.payment.paid` is reconciled; valid unsupported test events are acknowledged and ignored.
- Reconciliation verifies provider event uniqueness, checkout-session ID, metadata order ID, order number, paid payment status, amount, PHP currency, and test mode.
- Payment and payment-intent identifiers are retained; raw webhook bodies are not stored.
- Duplicate and durably rejected events return success-class acknowledgements. Transient persistence errors return `5xx`.

The browser success/cancel query never changes payment state. A returned pending page refreshes briefly while waiting for the webhook; a cancel return leaves the order pending and offers retry.

## Legacy compatibility

Existing Scan-to-Pay orders, references, proof URLs, storage configuration, and history remain intact. The migration backfills one `manual` payment record where legacy proof/reference data exists. Manual verification updates that payment record but no longer calls automatic delivery. New checkout does not create proof uploads.

Email-based order claiming remains for legacy records. New PayMongo orders are bound immediately to the authenticated `profile_user_id`.

## Fulfillment boundary

Payment and delivery are separate states. A verified webhook produces `Payment confirmed` and `Awaiting delivery`; it does not create fulfillment. An administrator explicitly selects `Prepare & send delivery`, which reuses private Storage, expiring/revocable grants, and the Resend adapter. Existing resend and revoke controls remain.

## Security and data rules

- Authoritative pricing is calculated inside the database from the published system.
- Commerce mutations and reconciliation RPCs are service-role-only.
- Customer portal reads remain authenticated and owned by `profile_user_id`.
- Existing RLS policies remain active.
- Payment-event and fulfillment operations are idempotent.
- Secrets, raw webhook bodies, and sensitive provider details are not logged or returned to clients.

## Required configuration

- `PAYMONGO_SECRET_KEY`: required `sk_test_...` server key
- `PAYMONGO_WEBHOOK_SECRET`: required test endpoint signing secret
- `PAYMONGO_PAYMENT_METHODS`: required comma-separated subset of `qrph,gcash,card`
- `SITE_URL`: existing canonical server origin

See [PAYMONGO_TEST_SETUP.md](PAYMONGO_TEST_SETUP.md) for the dashboard and deployment sequence.

## Remaining gates

- Link the intended Supabase test project, apply migrations, and validate RPC/RLS behavior with real roles.
- Configure PayMongo test credentials and enabled methods.
- Deploy to public HTTPS and register a separate test webhook subscribed to `checkout_session.payment.paid`.
- Run authorized test-mode success, cancellation, retry, duplicate, mismatch, outage, and delayed-webhook journeys.
- Verify Resend delivery with safe test recipients and private test files.
- Complete all Phase 10 business, legal, content, security, monitoring, and production gates.

**READY FOR LIVE? NO.**
