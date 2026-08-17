# WebSystemBuilders

WebSystemBuilders helps students and business owners access ready-made software systems and request custom development through one professional platform.

The repository contains a single Next.js application for the public website, systems catalog, administrator workspace, checkout, customer accounts, and protected digital delivery. Student services are limited to ethical technical support; the platform does not promote ghostwriting, plagiarism, deceptive authorship, or guaranteed academic outcomes.

## Project status

The application is under active development and is **not ready for production commerce**.

- The public website, audience pages, catalog, inquiry forms, authentication screens, and administrator interfaces are implemented locally.
- Authenticated purchases use PayPal Checkout through Web SDK v6 and server-side Orders v2 capture. Signed webhooks reconcile payment; administrators explicitly prepare delivery. Authenticated GCash / QRPH proof submission remains available when configured.
- Customer order, support, and protected-download interfaces exist locally.
- Supabase migrations and provider adapters are present, but live authentication, Row Level Security, Storage policies, database mutations, email delivery, and end-to-end payment verification have not been confirmed against a configured production project.
- Production remains blocked by provider setup, real catalog content and deliverables, business and legal readiness, deployment checks, and an authorized end-to-end smoke purchase.

The detailed source of truth is [docs/WEBSITE_BLUEPRINT.md](docs/WEBSITE_BLUEPRINT.md). Phase documents record local implementation and remaining verification gates; an unchecked production gate must not be treated as complete.

## Product scope

### Audiences

- **Students:** capstone and thesis-related technical support, templates, UI/UX work, debugging, deployment help, documentation guidance, and mentoring within ethical academic boundaries.
- **Business owners:** point-of-sale, inventory, warehouse, payroll, booking, customer-management, school-management, and other custom systems.

### Product models

| Model | Purpose | Release direction |
| --- | --- | --- |
| Ready-made systems | Administrator-managed systems with source code and documented package details | Initial release |
| Custom development | Requirements review and quotation before development | Initial release |
| Hosted SaaS | Recurring access to selected hosted products | Later |

## Local capabilities

- Responsive public marketing pages with separate student and business journeys
- Database-backed systems catalog, filters, product details, media, pricing, and publication states
- Quote and contact inquiry workflows with server validation and abuse controls
- Administrator workspaces for systems, categories, media, content, inquiries, orders, support, settings, and audit history
- Supabase email authentication and server-side role checks
- Authenticated PayPal Web SDK v6 Checkout with server-issued browser tokens and Orders v2 capture
- Signed, idempotent PayPal webhook recovery and lifecycle reconciliation
- Legacy manual GCash/QRPh proof preservation and administrator review
- Order snapshots using integer minor-unit pricing and authoritative PHP catalog amounts
- Private product files with expiring, revocable download access
- Customer order, download, and support views
- Resend-backed transactional delivery module with explicit unconfigured states
- Security headers, private-route indexing controls, health checks, and launch-readiness validation

These capabilities describe checked-in local software, not verified live-provider operation.

## Architecture and stack

WebSystemBuilders is a modular monolith: one deployable application with domain modules for catalog, content, inquiries, orders, delivery, customer access, and administration.

| Area | Technology |
| --- | --- |
| Application | Next.js 16 App Router, React 19, TypeScript 6 |
| Styling and UI | Tailwind CSS 4, custom accessible primitives, Lucide React |
| Interaction | Framer Motion, GSAP, Lenis |
| Data, authentication, storage | Supabase PostgreSQL, Auth, Row Level Security, private Storage |
| Forms and validation | React Hook Form, Zod |
| Email | Resend behind a server-only adapter |
| Abuse protection | Cloudflare Turnstile and hashed request fingerprints |
| Testing | Vitest, ESLint, TypeScript compiler |
| Hosting target | Vercel |

Provider access is isolated from catalog, order, and delivery rules so integrations can change without rewriting the surrounding domains.

## Getting started

### Prerequisites

- Node.js 20 or later
- npm 10 or later

### Install and run

```powershell
git clone https://github.com/12valor/WebSystemBuilders.git
cd WebSystemBuilders
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The public preview can render explicit unconfigured or unavailable states without live providers. Database-backed authentication, mutations, uploads, checkout submission, delivery, and email require valid provider configuration and applied migrations.

## Environment configuration

Use [.env.example](.env.example) as the local template. Never commit `.env.local` or expose server-only values to browser code.

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Publishable or anonymous key protected by RLS |
| `SITE_URL` | Server | Canonical application origin; defaults to local development in the example |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Privileged database operations; never expose to clients |
| `PAYPAL_CLIENT_ID` | Server only | PayPal REST application client ID |
| `PAYPAL_CLIENT_SECRET` | Server only | PayPal REST application client secret |
| `PAYPAL_ENVIRONMENT` | Server only | `sandbox` locally; `live` only after production approval |
| `PAYPAL_WEBHOOK_ID` | Server only | ID of the registered PayPal webhook used for signature verification |
| `INQUIRY_FINGERPRINT_SALT` | Server only | Salt of at least 32 characters for abuse-control hashes |
| `RESEND_API_KEY` | Server only | Resend transactional email API key |
| `RESEND_FROM_EMAIL` | Server only | Verified sender address |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | Cloudflare Turnstile widget key |
| `TURNSTILE_SECRET` | Server only | Cloudflare Turnstile verification secret |

For production, `SITE_URL` must use the canonical HTTPS domain. Passing the environment check does not replace manual provider, legal, content, backup, deployment, or smoke-test gates.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint across the repository |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm test` | Run the Vitest suite once |
| `npm run launch:check` | Validate required production environment names without printing secret values |

A typical local verification pass is:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

Run `npm run launch:check` only as a readiness check for a production-like environment. It is expected to fail when required provider variables are intentionally absent.

## Repository structure

```text
websystembuilders/
|-- assets/                 # Brand assets and usage guidance
|-- docs/                   # Blueprint, phase specifications, and launch runbook
|-- public/                 # Static public assets
|-- scripts/                # Operational and launch-readiness scripts
|-- src/
|   |-- app/                # App Router pages, layouts, and route handlers
|   |-- components/         # Shared and surface-specific UI
|   |-- features/           # Domain modules and server actions
|   `-- lib/                # Provider, environment, auth, and security foundations
|-- supabase/
|   `-- migrations/         # Versioned PostgreSQL schema changes
|-- tests/                  # Unit, integration, and migration-contract tests
|-- .env.example
`-- package.json
```

## Documentation

- [Website blueprint](docs/WEBSITE_BLUEPRINT.md) - product, architecture, design, and delivery source of truth
- [Phase 0: Product definition](docs/PHASE_0_PRODUCT_DEFINITION.md)
- [Phase 1: Design foundation](docs/PHASE_1_DESIGN_FOUNDATION.md)
- [Phase 2: Technical foundation](docs/PHASE_2_TECHNICAL_FOUNDATION.md)
- [Phase 3: Public website](docs/PHASE_3_PUBLIC_WEBSITE.md)
- [Phase 4: Systems catalog](docs/PHASE_4_SYSTEMS_CATALOG.md)
- [Phase 5: Admin dashboard](docs/PHASE_5_ADMIN_DASHBOARD.md)
- [Phase 6: Payment and ordering](docs/PHASE_6_PAYMENT_AND_ORDERING.md)
- [PayPal Checkout setup](docs/PAYPAL_CHECKOUT_SETUP.md)
- [Phase 7: Automated delivery](docs/PHASE_7_AUTOMATED_DELIVERY.md)
- [Phase 8: Customer portal](docs/PHASE_8_CUSTOMER_PORTAL.md)
- [Phase 9: Quality hardening](docs/PHASE_9_QUALITY_HARDENING.md)
- [Phase 10: Production launch](docs/PHASE_10_PRODUCTION_LAUNCH.md)
- [Brand guidelines](assets/brand/BRAND_GUIDELINES.md)

## Non-negotiable engineering rules

- Calculate authoritative prices on the server and store money as integer minor units.
- Never treat a browser return, screenshot, or transaction reference as proof of payment by itself.
- Mark PayPal payments paid only after validated server capture or verified webhook reconciliation, then require explicit administrator fulfillment.
- Keep deliverables private and issue expiring, revocable access after server-side authorization.
- Check authorization on the server and enforce RLS for exposed tables.
- Validate untrusted input on the server and keep secrets out of client bundles.
- Preserve order, payment, delivery, download, email, support, and administrator audit history.
- Publish only authentic systems, media, testimonials, policies, and company claims.

## License

No repository-level open-source license is currently declared. Product licenses for systems sold through the platform are separate commercial terms and must not be inferred from access to this source repository.
