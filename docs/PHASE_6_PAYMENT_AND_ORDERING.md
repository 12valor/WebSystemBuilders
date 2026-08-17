# Phase 6 — Payment and ordering

## Current implementation

Phase 6 provides authenticated one-time PayPal Checkout using Web SDK v6, a server-issued browser-safe token, the official PayPal server SDK, Orders v2, server-side capture, and verified webhooks. GCash / QRPH remains an authenticated manual-verification option only when a product has a real administrator-managed QR image and instructions.

Payment confirmation remains separate from administrator-prepared private delivery.

## PayPal order flow

1. A verified signed-in customer opens `/checkout/[slug]`.
2. The browser sends only `{ systemId }` to `POST /api/payments/paypal/orders`.
3. A service-role database function re-reads the published product, current version, private deliverable, PHP price, currency, and policy snapshots, then creates or safely reuses the internal order and PayPal payment attempt.
4. The server creates a PayPal `CAPTURE` order using `PayPal-Request-Id: create-{paymentId}` and attaches its provider order ID to the internal payment.
5. Web SDK v6 opens PayPal using a short-lived token from `POST /api/payments/paypal/client-token`. The permanent client secret never reaches the browser.
6. Approval is captured only through `POST /api/payments/paypal/orders/[providerOrderId]/capture` using `PayPal-Request-Id: capture-{paymentId}`.
7. Capture reconciliation checks ownership, provider order and capture IDs, environment, amount, currency, and status before atomically updating payment and order state.
8. A paid order becomes “Awaiting delivery.” No fulfillment is created automatically.

Cancellation is recorded through `POST /api/payments/paypal/orders/[providerOrderId]/cancel`. Closing the popup does not record payment.

## Webhook recovery and lifecycle

`POST /api/webhooks/paypal` accepts at most 256 KiB, verifies the transmission through PayPal's webhook-signature verification API using `PAYPAL_WEBHOOK_ID`, hashes the raw payload for audit, and reconciles allowlisted events idempotently.

Supported events cover order approval, approval reversal, completed/pending/declined capture, refund, and reversal. `CHECKOUT.ORDER.APPROVED` may call the same idempotent capture service when the browser loses connectivity after approval. Duplicate provider event IDs are acknowledged without repeated paid state, audit transitions, or fulfillment.

## Manual GCash / QRPH

- The customer must have a verified signed-in account.
- Customer name and email are read from the verified account; the form cannot override them.
- The authoritative product price and current deliverable are re-read on the server.
- A `manual` payment row is created with the order immediately.
- New proof images are limited to PNG, JPG, or WEBP, uploaded to private `payment-proofs` paths beginning with the authenticated user ID, and exposed to administrators only through short-lived signed URLs.
- The manual option is hidden unless both an administrator-managed HTTPS QR image and meaningful instructions exist.
- Historical proof URLs remain readable for audit, but new public proof URLs and data-URL fallbacks are prohibited.

## Configuration

- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_ENVIRONMENT=sandbox|live`
- `PAYPAL_WEBHOOK_ID`
- `SITE_URL`

See [PAYPAL_CHECKOUT_SETUP.md](PAYPAL_CHECKOUT_SETUP.md).

## Verification boundary

The local implementation and automated tests do not prove provider-backed checkout. Sandbox completion requires the intended Supabase project to be linked, both migrations applied, sandbox credentials configured, a public HTTPS webhook registered, and a real sandbox purchase using separate business and personal sandbox accounts. Live remains disabled until PayPal business onboarding and all production gates are approved.
