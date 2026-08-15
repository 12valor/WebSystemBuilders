# PayMongo test setup

This application accepts PayMongo **test mode only**. Do not add live credentials or attempt a live payment.

## Dashboard setup

1. Complete the PayMongo account steps required to access test developers settings.
2. In the test-mode merchant dashboard, enable only the methods the project will exercise: `qrph`, `gcash`, and/or `card`.
3. Create a separate **test-mode** webhook subscribed only to `checkout_session.payment.paid`.
4. Set its endpoint to `https://websystembuilders.com/api/webhooks/paymongo` after the reviewed build is deployed over HTTPS.
5. Copy the test API secret and that endpoint's signing secret into the protected deployment environment. Never commit either value.

## Required server variables

```text
PAYMONGO_SECRET_KEY=sk_test_...
PAYMONGO_WEBHOOK_SECRET=...
PAYMONGO_PAYMENT_METHODS=qrph,gcash
SITE_URL=https://websystembuilders.com
```

`PAYMONGO_PAYMENT_METHODS` is required and must be a comma-separated subset of `qrph,gcash,card`. It must match methods enabled for the test merchant. Unknown, duplicate, or empty method lists fail closed; the application never silently sends every method.

## Deployment and verification sequence

1. Apply all Supabase migrations to the intended test project and verify RLS/RPC grants.
2. Add the four server variables to the Preview or authorized test deployment.
3. Redeploy so the server runtime receives the new variables.
4. Register or update the separate test webhook URL and its `checkout_session.payment.paid` subscription.
5. Run a PayMongo test checkout and verify the internal order remains pending until the signed webhook arrives.
6. Verify duplicate, mismatched amount/currency/reference/session, stale signature, cancelled return, provider failure, and retry behavior.
7. Confirm a paid order shows `Payment confirmed` and `Awaiting delivery`, then use the administrator's `Prepare & send delivery` action.

Provider-backed verification requires valid test credentials and a reachable public HTTPS webhook. Mocked tests do not satisfy this gate. Live credentials, live webhook settings, live charges, and production launch remain prohibited until separately approved.
