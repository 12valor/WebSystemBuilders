# WebSystemBuilders

WebSystemBuilders is a marketplace and custom-development platform for students and business owners.

## Application

The application uses Next.js App Router, React, TypeScript, and Tailwind CSS.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Supabase clients load configuration only when a database-backed feature calls them, so the Phase 1 previews can still build before local credentials are added.

The email sign-in interface is available at /auth/sign-in. Without Supabase credentials it shows an explicit unavailable state and sends no email. Local development keeps the approved admin preview visible; a production environment without authentication configuration keeps /admin closed.

The public systems catalog and published-system routes now read through server repositories. The admin editor creates and edits validated private records, manages features and media, creates versions, and uploads ZIP deliverables directly to private Storage through short-lived signed tokens. Publication remains a separate server-side readiness gate.

Phase 3 adds administrator-driven homepage catalog sections plus dedicated public routes for students, business owners, custom development, process, about, and portfolio. Sitemap and robots metadata include only implemented public pages and published systems.

Contact and quotation forms use shared server validation, hashed rate-limit identifiers, and a private administrator-only inquiry table. Without complete server configuration, the forms remain visibly unavailable and do not send or store information. FAQ and pre-launch policy summaries expose approved product direction without presenting pending legal text as production-ready.

Phase 4 now exposes published product features, screenshots, demo or video links, current versions, sale comparisons, and related systems through the public catalog detail route. Uploaded catalog images remain private at rest and receive time-limited signed access only when attached to a published system.

Phase 5 provides an operational administrator workspace with real catalog and inquiry metrics, administrator-managed categories, a cross-catalog media workspace, database-driven FAQ and portfolio content, permission-verified testimonials, administrator-published homepage features and announcements, an approved company and public-contact profile, safe system duplication and lifecycle controls, a searchable inquiry queue with durable status history, a read-only audit trail, and super-administrator access and configuration-health controls.

Phase 6 adds a secure fixed-price purchase path: server-authoritative pending orders, immutable product and policy snapshots, PayMongo Checkout v2, signed and idempotent webhook reconciliation, token-protected return status, and a read-only administrator order ledger. Starting-price and custom systems remain quotation-based.

Phase 7 adds one-time fulfillment creation for verified paid orders, hashed seven-day delivery grants, limited private downloads through 60-second Storage URLs, Resend delivery email behind a server-only adapter, and administrator resend/revoke controls. Live storage and email verification remain provider gates.

Phase 8 replaces the signed-in preview with verified-email order claiming, customer-only order and version views, fresh one-hour protected access, order-linked support, and an administrator support queue. It does not invent invoice documents or update entitlements.

Phase 9 adds restrictive browser headers, private-route no-store/noindex behavior, payload and submission throttles, global failure states, keyboard skip navigation, and security/accessibility regression contracts. Deployed accessibility, performance, provider, and security verification remain launch gates.

Phase 10 software-side preparation adds a production environment validator, non-secret health endpoint, GitHub quality workflow, and a provider/deployment/backup/go-live runbook. The website is not launched; external account, content, business, legal, and production verification gates remain blocking.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Project documentation

- [`docs/WEBSITE_BLUEPRINT.md`](docs/WEBSITE_BLUEPRINT.md) - product and technical source of truth
- [`docs/PHASE_0_PRODUCT_DEFINITION.md`](docs/PHASE_0_PRODUCT_DEFINITION.md) - approved product decisions and production gates
- [`docs/PHASE_1_DESIGN_FOUNDATION.md`](docs/PHASE_1_DESIGN_FOUNDATION.md) - approved design foundation and responsive wireframes
- [`docs/PHASE_2_TECHNICAL_FOUNDATION.md`](docs/PHASE_2_TECHNICAL_FOUNDATION.md) - technical foundation, schema boundary, and setup gates
- [`docs/PHASE_3_PUBLIC_WEBSITE.md`](docs/PHASE_3_PUBLIC_WEBSITE.md) - public website routes, content rules, and remaining production gates
- [`docs/PHASE_4_SYSTEMS_CATALOG.md`](docs/PHASE_4_SYSTEMS_CATALOG.md) - catalog scope, completed capabilities, and remaining provider gaps
- [docs/PHASE_5_ADMIN_DASHBOARD.md](docs/PHASE_5_ADMIN_DASHBOARD.md) - administrator scope, dependency boundaries, and exit criteria
- [docs/PHASE_6_PAYMENT_AND_ORDERING.md](docs/PHASE_6_PAYMENT_AND_ORDERING.md) - secure order, hosted checkout, webhook, and provider-verification contract
- [docs/PHASE_7_AUTOMATED_DELIVERY.md](docs/PHASE_7_AUTOMATED_DELIVERY.md) - expiring private delivery, email, resend, and revoke contract
- [docs/PHASE_8_CUSTOMER_PORTAL.md](docs/PHASE_8_CUSTOMER_PORTAL.md) - verified ownership, customer orders, downloads, and support contract
- [docs/PHASE_9_QUALITY_HARDENING.md](docs/PHASE_9_QUALITY_HARDENING.md) - browser, indexing, abuse, accessibility, and regression hardening
- [docs/PHASE_10_PRODUCTION_LAUNCH.md](docs/PHASE_10_PRODUCTION_LAUNCH.md) - deployment order, provider gates, monitoring, backups, and go/no-go checklist
- [`assets/brand/BRAND_GUIDELINES.md`](assets/brand/BRAND_GUIDELINES.md) - approved logo and brand usage
- [`supabase/migrations`](supabase/migrations) - versioned database changes
- [src/app/account/page.tsx](src/app/account/page.tsx) - configuration-aware customer account direction
- [src/app/auth/sign-in/page.tsx](src/app/auth/sign-in/page.tsx) - passwordless email sign-in interface

**Current phase:** Phase 10 software preparation complete - production launch externally blocked
