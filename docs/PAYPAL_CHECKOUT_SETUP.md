# PayPal Checkout setup

This application uses PayPal Web SDK v6 in the browser and Orders v2 on the server. Keep sandbox and live applications, credentials, accounts, and webhooks separate. Never place the PayPal client secret in a public variable.

## Sandbox configuration

1. Create or select a PayPal REST application in the PayPal Developer Dashboard.
2. Create separate sandbox business and personal accounts. The business account receives the payment; the personal account completes checkout.
3. Register a public HTTPS webhook at `/api/webhooks/paypal` with these events:
   - `CHECKOUT.ORDER.APPROVED`
   - `CHECKOUT.PAYMENT-APPROVAL.REVERSED`
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.PENDING`
   - `PAYMENT.CAPTURE.DECLINED`
   - `PAYMENT.CAPTURE.REFUNDED`
   - `PAYMENT.CAPTURE.REVERSED`
4. Configure server-only values:

```dotenv
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_WEBHOOK_ID=...
SITE_URL=https://your-preview-host.example
```

No `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is used. The authenticated browser requests a short-lived browser-safe token from `/api/payments/paypal/client-token`.

## Database and verification sequence

1. Link the intended Supabase project and review the pending migrations.
2. Apply `add_payment_processing_status` before `replace_paymongo_with_paypal`.
3. Run database lint/advisors and confirm the `payment-proofs` bucket is private.
4. Complete a sandbox purchase with the separate personal account.
5. Verify the internal order is created before PayPal approval, capture is server-side, amount and currency are PHP and match the snapshot, and duplicate capture/webhook delivery does not duplicate paid state or fulfillment.
6. Interrupt the browser after approval and confirm `CHECKOUT.ORDER.APPROVED` recovers capture.
7. Verify paid PayPal orders show “Awaiting delivery” until an administrator explicitly prepares private delivery.
8. If manual payment is configured for the product, verify the signed-in customer upload path begins with their user ID and the administrator receives only a short-lived signed proof URL.

## Live enablement

Do not change `PAYPAL_ENVIRONMENT` to `live` until PayPal business onboarding, legal review, deployment security review, production webhook registration, backup/recovery, monitoring, and an authorized live smoke-purchase plan are approved. Replace every sandbox credential and webhook ID with its live counterpart; never reuse sandbox values.
