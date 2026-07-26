# Phase 6 - Payment and ordering

## 1. Outcome

Phase 6 adds the durable commerce boundary for ready-made fixed-price systems. It creates an internal pending order before sending a customer to Lemon Squeezy, records immutable product and policy snapshots, verifies signed payment webhooks, reconciles expected values idempotently, and exposes a private return-status page plus an administrator order ledger.

The local implementation is complete. Test-mode and production provider verification remain blocked until the owner configures Lemon Squeezy account credentials.

## Completed phase architecture

- Internal checkout action creating `pending_orders` records before provider session creation
- `/api/webhooks/lemonsqueezy` route handler for raw signed payment reconciliation
- Verification of Lemon Squeezy signatures and events
- Idempotent `record_paid_checkout_event` procedure handling duplicated webhooks
- Private `/checkout/status/[orderNumber]` outcome page backed by return-token validation
- Admin order ledger at `/admin/orders` displaying payment details, fulfillment state, and retry options

## Key technical flows

### 1. Checkout initiation

1. Buyer submits checkout form at `/checkout/[systemSlug]`.
2. Server action validates input, terms, and environment presence.
3. The server creates a Lemon Squeezy checkout session using API `POST /v1/checkouts`.
4. The database attaches the returned checkout-session identifier and checkout URL.
5. The customer is redirected to Lemon Squeezy.

### 2. Webhook verification and fulfillment

1. `/api/webhooks/lemonsqueezy` receives a `POST` request.
2. Parse the `X-Signature` header and verify HMAC-SHA256 digest against `LEMON_SQUEEZY_WEBHOOK_SECRET`.
3. Ensure the event type is `order_created` or `subscription_payment_success`.
4. Update the order status to paid and flag as ready for fulfillment.

## 3. Purchase eligibility

Immediate checkout is allowed only when all of the following remain true inside the order-creation database transaction:

1. The system is published.
2. The pricing mode is `fixed`.
3. The product is ready-made or a customizable template, not a custom service.
4. The authoritative currency is PHP.
5. A current system version exists.
6. The current version has at least one private deliverable file.
7. The server-calculated price is a positive integer minor-unit amount.

Starting-price and quotation products continue through the quotation workflow. Localized catalog currencies remain estimates; checkout and payment verification use the authoritative PHP snapshot.

## 4. Order boundary

The `create_pending_order` service-role-only database function calculates the price from the saved product record and atomically creates:

- An order with normalized buyer identity and an opaque return-token hash
- A single immutable order-item snapshot of product name, slug, version, price, currency, license, support, delivery, and inclusions
- A pending PayMongo payment record with the expected amount and currency
- Timestamped acceptance records for terms, license, refund, and delivery policies

No client-submitted amount, currency, version, license, or delivery copy is authoritative.

## 5. Hosted payment flow

1. The server validates the buyer form and all required acknowledgements.
2. The database creates the pending order and payment.
3. The server creates a PayMongo Checkout v2 session using a unique idempotency key.
4. The database attaches the returned checkout-session identifier and trusted `https://checkout.paymongo.com` URL.
5. The customer is redirected to PayMongo.
6. The browser return page reads only the order referenced by its high-entropy token and never marks an order paid.

Provider errors produce a safe customer message and never expose provider response details or secrets.

## 6. Webhook and reconciliation rules

1. Read the request as raw text before JSON parsing.
2. Parse the `Paymongo-Signature` timestamp, test signature, and live signature slots.
3. Compute HMAC-SHA256 over `timestamp.rawBody` with the endpoint signing secret.
4. Use timing-safe comparison and reject requests outside the five-minute tolerance.
5. Confirm that the signature mode matches the event `livemode` value.
6. Accept only `checkout_session.payment.paid` for the implemented flow.
7. Match the stored checkout-session identifier.
8. Compare amount, currency, and mode against both the payment and order records.
9. Store only the payload hash and reconciliation fields, not the raw payment payload.
10. Use a unique provider event identifier so duplicate deliveries cannot repeat the paid transition.

Fulfillment is intentionally not performed inside the payment webhook. Phase 7 owns delivery and may process each paid order at most once.

## 7. Data protection and authorization

- Order, item, payment, and event tables use Row Level Security.
- Authenticated administrators receive read-only policies for reconciliation.
- Public visitors cannot query commerce tables directly.
- Order creation, checkout attachment, event processing, and token-protected status reads are service-role-only RPCs.
- Customer status links use a random token whose SHA-256 hash is stored; an order number alone reveals nothing.
- Provider secrets remain server-only and checkout pages never handle card or wallet credentials.

## 8. Verification

Automated coverage includes buyer validation, mandatory acknowledgements, signature modes and replay tolerance, paid-event parsing, price and license snapshots, private-deliverable eligibility, RLS, expected-value matching, and idempotency migration contracts. Completion also requires lint, TypeScript, the full unit suite, a production build, and route-level HTTP smoke checks.

## 9. External gates

The following cannot be completed locally and remain launch blockers:

- Create and migrate the Supabase project; verify RLS and every RPC with real roles
- Create and complete PayMongo merchant/KYC onboarding
- Add separate test and live API keys
- Register separate HTTPS test and live webhook endpoints for `checkout_session.payment.paid`
- Store each endpoint signing secret in the correct environment
- Confirm enabled payment methods and execute test-mode success, failure, retry, duplicate-webhook, and mismatch scenarios
- Complete business registration, tax, invoicing, provider, dependency-license, and legal review gates
- Add monitoring and reconciliation for provider outages and missed events

No real payment should be accepted until every production gate is complete.

## 10. Exit and next action

Phase 6 is locally complete when its automated and route checks pass. Live provider verification remains pending. Phase 7 may now implement private, expiring, revocable delivery and transactional email triggered from verified paid orders.