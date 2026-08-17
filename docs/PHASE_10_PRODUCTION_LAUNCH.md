# Phase 10 - Production launch

## Current status

**Launch preparation is complete locally. Production launch is blocked.**

The repository contains the application, migrations, provider boundaries, hardening, automated checks, environment validator, health endpoint, CI workflow, and this runbook. It does not have the owner's provider accounts, live credentials, business registration, legal approval, tax/invoice process, real catalog files, or production deployment authorization.

Do not accept a live payment until every required gate is completed and evidenced.

## Automated controls

| Control | Location | Behavior |
|---|---|---|
| Quality pipeline | .github/workflows/quality.yml | Runs install, lint, type checking, tests, and build |
| Environment validator | npm run launch:check | Requires production-scoped provider values without printing secrets |
| Health endpoint | /api/health | Returns 503 blocked on the canonical production origin when configuration is incomplete |
| Browser hardening | next.config.ts | Applies security, private-cache, and indexing controls |
| Database rollout | supabase/migrations | Applies all versioned schemas in order |

Passing the environment check validates shape only. It does not prove connectivity, correct credentials, content quality, or legal readiness.

## Required owner inputs

- Legal business identity, registration, tax setup, invoice/receipt process, and legal approval
- Separate Supabase test and production projects
- PayPal business account, onboarding, separate sandbox/live applications, and webhook IDs
- Resend account, restricted key, verified sending domain, and sender mailbox
- Vercel account and authorization to connect this repository and domain
- At least one complete, tested, licensed system with real media, version, ZIP, price, scope, requirements, support, and delivery copy
- Public contact channel and decisions for retention, backups, incidents, compromised links, monitoring, and support

## Deployment order

### Repository and CI

1. Push without .env.local or credentials.
2. Require the Quality workflow on protected main.
3. Restrict repository/deployment access and review dependency alerts.

### Supabase

1. Create separate test and production projects in an approved region.
2. Store URL, publishable key, and service-role key only in matching Vercel environments.
3. Apply every migration in filename order and record the applied version.
4. Confirm system-media and system-deliverables are private.
5. Sign in once with the owner email, find its Auth user ID, and bootstrap the first super_admin through the protected SQL console. Never expose a bootstrap endpoint.
6. Test RLS as anonymous, customer A, customer B, admin, and super admin.
7. Configure backups and rehearse a restore before storing real customer data.

### Authentication

1. Set the canonical origin to https://websystembuilders.com.
2. Add only required local, preview, and production callbacks.
3. Verify email-link expiry, sign-in, callback, claiming, refresh, sign-out, wrong-email isolation, and admin authorization.

### PayPal

1. Complete PayPal business onboarding and create separate sandbox and live REST applications.
2. In Preview, configure sandbox `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENVIRONMENT=sandbox`, and the sandbox `PAYPAL_WEBHOOK_ID`.
3. Register the sandbox webhook at `/api/webhooks/paypal` for order approval, capture lifecycle, refund, and reversal events; complete mismatch, duplicate, interrupted-capture recovery, retry, cancel, and failure verification.
4. Live keys and a separate live-mode webhook require a later reviewed production change; the current application rejects them.

### Resend

1. Verify an owned sending domain with SPF and DKIM and review DMARC.
2. Use an approved WebSystemBuilders sender mailbox.
3. Test delivery, bounce, provider failure, resend rotation, expiry, revoke, and exhausted limits.
4. Never send production delivery from an unverified/shared domain.

### Vercel preview and production

1. Import as a Next.js project and configure test-only Preview values.
2. Verify /api/health, Auth, admin, catalog, inquiries, test checkout, webhook, delivery, portal, and support.
3. Run mobile, desktop, keyboard, screen-reader, console, performance, SEO, and header checks on Preview.
4. Upload, scan, test, version, and hash real ZIPs; audit all distributed dependency and asset licenses.
5. Publish truthful media and complete scope, license, support, requirements, and update-entitlement details.
6. Add production-only variables and run npm run launch:check in a protected environment.
7. Deploy the reviewed commit, attach websystembuilders.com, and use the DNS values Vercel provides.
8. Recheck TLS, callbacks, canonical metadata, sitemap, robots, webhook, email links, CSP, HSTS, and private caching.

## Monitoring, backup, and incidents

- Monitor /api/health, public availability, PayPal capture/webhook failures, failed email and fulfillment, download anomalies, Auth errors, and admin access changes.
- Configure error reporting with redaction; do not capture secrets, raw payment payloads, delivery tokens, or private support messages by default.
- Enable Supabase backups and schedule restore rehearsals.
- Document leaked-credential, compromised-link, duplicate-payment, provider-outage, missed-webhook, data-request, refund-exception, and unauthorized-admin procedures.
- Assign a named alert and customer-communication owner.

## Final go/no-go checklist

- [ ] Business registration, tax, invoice, and legal gates approved
- [ ] Real system and private ZIP published by the owner
- [ ] CI required and passing on the exact production commit
- [ ] Production environment validator passes without printing values
- [ ] Supabase migrations, RLS, Auth, Storage, backup, and restore verified
- [ ] PayPal live account, capture, webhook, reconciliation, refunds, and failures verified
- [ ] Resend domain, delivery, failure, resend, and revoke verified
- [ ] Desktop, mobile, keyboard, screen reader, console, and error states verified
- [ ] Performance and Core Web Vitals measured with real content
- [ ] TLS, headers, CSP, sitemap, robots, canonical URLs, and private noindex verified
- [ ] Monitoring, incident ownership, and customer support active
- [ ] Controlled real production smoke purchase authorized and reconciled end to end
- [ ] Owner gives explicit go-live approval

If any item is unchecked, production commerce remains blocked.

## Phase result

The software-side preparation for Phase 10 is complete. The website is **not launched**, and Phase 10 is **externally blocked** until the checklist is complete. Phase 11 is ongoing post-launch work and cannot be completed before a real monitored launch.
