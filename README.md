# WebSystemBuilders

> A modular marketplace and custom web system development platform tailored for students, entrepreneurs, and business owners.

WebSystemBuilders connects students and business owners with ready-made software systems, modular codebases, and custom web development services. Built as a single Next.js application, it combines a high-performance public catalog, hosted payment processing, secure expiring file fulfillment, customer order management, and a rich administrator control workspace.

---

## Table of Contents

- [Overview & Product Boundaries](#overview--product-boundaries)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Key Platform Capabilities](#key-platform-capabilities)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Quality & Testing](#quality--testing)
- [Directory Structure](#directory-structure)
- [Implementation Phases & Status](#implementation-phases--status)
- [Documentation Index](#documentation-index)
- [Ethical Standards & Governance](#ethical-standards--governance)

---

## Overview & Product Boundaries

WebSystemBuilders operates across two distinct target audiences and product delivery models:

- **Students**: Ethical academic assistance, capstone project baseline architecture, portfolio starter kits, and learning resources. *(Strictly zero academic dishonesty or ghostwriting services)*.
- **Business Owners**: Ready-to-deploy web systems, e-commerce templates, inventory & management systems, custom software development, and future SaaS subscriptions.

### Product Models
1. **Ready-Made Systems**: Database-driven catalog featuring source code deliverables, documentation, versions, screenshots, and automated digital fulfillment.
2. **Custom Development**: Direct inquiry, scope builder, quotation request, and bespoke technical execution.
3. **Subscriptions / SaaS**: Modular design pattern prepared for recurring cloud services and platform tier upgrades.

---

## Tech Stack & Architecture

Built as a Next.js App Router **modular monolith** emphasizing server-side security, strict data contracts, and isolated provider adapters:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **UI & Styling**: [React 19](https://react.dev/), [TypeScript 6](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/), [Lenis Smooth Scroll](https://lenis.darkroom.engineering/), [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Supabase PostgreSQL](https://supabase.com/) with Row Level Security (RLS), Supabase Auth, and Private Storage buckets
- **E-Commerce & Payments**: [PayMongo Checkout v2](https://www.paymongo.com/) (server-authoritative pricing, hosted checkout, signed idempotent webhooks)
- **Email & Delivery**: [Resend](https://resend.com/) transactional email adapter for order receipts and download notifications
- **Security & Bot Protection**: [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) CAPTCHA, hashed rate-limit fingerprints, HTTP security headers (`CSP`, `HSTS`, `X-Frame-Options`)
- **Forms & Validation**: [Zod](https://zod.dev/), [React Hook Form](https://react-hook-form.com/), `@hookform/resolvers`
- **Testing & Tooling**: [Vitest](https://vitest.dev/), ESLint 9

---

## Key Platform Capabilities

### 🛒 Public Systems Catalog & Storefront
- Server-rendered catalog views with category filters, dynamic sorting, search, feature matrices, demo links, and screenshot galleries.
- Time-limited signed URLs for private product media assets.
- Integrated quotation forms for custom systems and starting-price tiers.

### 💳 Secure E-Commerce & Payment Engine
- Server-calculated, authoritative minor-unit pricing (integer precision) to prevent client-side tampered transactions.
- Idempotent pending order creation prior to hosted PayMongo payment session initialization.
- Webhook reconciliation verifying cryptographic signature header and transaction totals before fulfillment.

### 🔐 Expiring Digital Deliverable Fulfillment
- Paid order deliverables stored in private Supabase Storage buckets.
- File downloads served strictly via revocable, short-lived (60-second) signed URLs.
- One-time fulfillment processing and transaction logging preventing double-delivery.

### 💼 Operational Administrator Workspace
- Real-time performance metrics, system catalog CRUD, dynamic category taxonomy, cross-catalog media manager.
- Inquiry queue with rate-limit hashing, response tracking, durable status state machine, and full audit trail.
- Multi-tier administrative role enforcement: Standard Admin vs. Super Administrator (access & settings management).

### 🧑‍💻 Customer Portal & Support
- Passwordless email sign-in (`/auth/sign-in`) with token-based order claiming.
- Verified ownership dashboard (`/account`, `/downloads`) for accessing order history, versions, and protected downloads.
- Integrated order-linked customer support ticket submission.

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/12valor/WebSystemBuilders.git
   cd websystembuilders
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment configuration:
   ```bash
   copy .env.example .env.local
   ```
   *Note: Client modules handle unconfigured state gracefully for Phase 1–5 previews. Complete credentials when running against a live Supabase instance.*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Configuration

Key environment variables specified in `.env.example`:

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public / Client | Safe publishable/anon API key with RLS |
| `SITE_URL` | Server | Application base canonical URL (`http://localhost:3000` in dev) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | Privileged admin Supabase key (*Never expose to client*) |
| `INQUIRY_FINGERPRINT_SALT` | Server-Only | Random 32+ character salt for rate-limit identifier hashing |
| `RESEND_API_KEY` | Server-Only | Resend transactional email API key |
| `RESEND_FROM_EMAIL` | Server-Only | Verified email sender address for transactional delivery |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public / Client | Cloudflare Turnstile CAPTCHA site key |
| `TURNSTILE_SECRET` | Server-Only | Cloudflare Turnstile secret key for verification |

---

## Quality & Testing

Run verification commands prior to committing changes:

```bash
# Type check TypeScript files
npm run typecheck

# Lint source code
npm run lint

# Run Unit & Integration tests with Vitest
npm test

# Verify production build
npm run build

# Validate launch readiness & environment configuration
npm run launch:check
```

---

## Directory Structure

```text
websystembuilders/
├── assets/                  # Brand guidelines and design assets
├── docs/                    # Product blueprint & phase specifications
├── scripts/                 # Operational & launch check scripts
├── src/
│   ├── app/                 # Next.js App Router pages, layouts, and API routes
│   │   ├── (public)         # Public marketing & catalog routes
│   │   ├── account/         # Customer account portal
│   │   ├── admin/           # Administrator control dashboard
│   │   ├── api/             # Webhook handlers, API endpoints, downloads
│   │   ├── auth/            # Passwordless authentication routes
│   │   └── checkout/        # Checkout flow & order return handlers
│   ├── components/          # React components (ui/, catalog/, admin/, email/)
│   ├── features/            # Domain modules (catalog, orders, payments, delivery)
│   ├── lib/                 # Provider clients, security, DB repositories, validation
│   └── proxy.ts             # Server-side proxy and API adapters
├── supabase/
│   └── migrations/          # Versioned PostgreSQL migration scripts
└── tests/                   # Unit, integration, and contract tests
```

---

## Implementation Phases & Status

The platform architecture was designed across 10 progressive phases:

- [x] **Phase 1: Design Foundation**: UI primitives, responsive design system, dark minimal theme.
- [x] **Phase 2: Technical Foundation**: Supabase schema, TypeScript definitions, RLS rules, repository pattern.
- [x] **Phase 3: Public Website**: Audience landing pages (Students, Business), services, portfolio, contact forms.
- [x] **Phase 4: Systems Catalog**: Complete catalog backend, product media management, feature tagging, versioning.
- [x] **Phase 5: Admin Dashboard**: Multi-tier admin operations, inquiry state machine, audit logs, category management.
- [x] **Phase 6: Payment & Ordering**: Server pricing validation, pending order creation, PayMongo integration.
- [x] **Phase 7: Automated Delivery**: Expiring download URLs, Resend transactional emails, idempotent fulfillment.
- [x] **Phase 8: Customer Portal**: Email verification, claimed order history, support ticket interface.
- [x] **Phase 9: Quality Hardening**: Security headers, rate limiting, anti-abuse throttles, accessibility polish.
- [x] **Phase 10: Production Launch Prep**: Launch validator, production health checks, backup & runbook documentation.

**Current Project Status**: `Phase 10 software preparation complete - production launch externally blocked` *(Awaiting live provider setup: Supabase production instance, PayMongo live keys, Resend domain validation).*

---

## Documentation Index

Detailed specifications and architectural decisions are maintained in the [`docs/`](docs/) directory:

- 📘 [`docs/WEBSITE_BLUEPRINT.md`](docs/WEBSITE_BLUEPRINT.md) - Product and technical source of truth
- 📋 [`docs/PHASE_0_PRODUCT_DEFINITION.md`](docs/PHASE_0_PRODUCT_DEFINITION.md) - Approved product decisions & production gates
- 🎨 [`docs/PHASE_1_DESIGN_FOUNDATION.md`](docs/PHASE_1_DESIGN_FOUNDATION.md) - UI design system, tokens, and wireframes
- 🗄️ [`docs/PHASE_2_TECHNICAL_FOUNDATION.md`](docs/PHASE_2_TECHNICAL_FOUNDATION.md) - Database schema, authentication & RLS foundation
- 🌐 [`docs/PHASE_3_PUBLIC_WEBSITE.md`](docs/PHASE_3_PUBLIC_WEBSITE.md) - Public marketing routes & inquiry handling
- 🛍️ [`docs/PHASE_4_SYSTEMS_CATALOG.md`](docs/PHASE_4_SYSTEMS_CATALOG.md) - Catalog structure, product detail views & media
- 🛠️ [`docs/PHASE_5_ADMIN_DASHBOARD.md`](docs/PHASE_5_ADMIN_DASHBOARD.md) - Administrator workspace & governance checklist
- 💳 [`docs/PHASE_6_PAYMENT_AND_ORDERING.md`](docs/PHASE_6_PAYMENT_AND_ORDERING.md) - Server payment engine & PayMongo integration contract
- 📦 [`docs/PHASE_7_AUTOMATED_DELIVERY.md`](docs/PHASE_7_AUTOMATED_DELIVERY.md) - Private digital delivery & Resend email system
- 👤 [`docs/PHASE_8_CUSTOMER_PORTAL.md`](docs/PHASE_8_CUSTOMER_PORTAL.md) - Customer access, order claiming & support ticket system
- 🛡️ [`docs/PHASE_9_QUALITY_HARDENING.md`](docs/PHASE_9_QUALITY_HARDENING.md) - Security headers, abuse prevention & accessibility standard
- 🚀 [`docs/PHASE_10_PRODUCTION_LAUNCH.md`](docs/PHASE_10_PRODUCTION_LAUNCH.md) - Deployment checklist, launch runner & operational runbook
- 🎨 [`assets/brand/BRAND_GUIDELINES.md`](assets/brand/BRAND_GUIDELINES.md) - Official logo, typography, and brand usage guidelines

---

## Ethical Standards & Governance

WebSystemBuilders strictly prohibits features, copy, or services that facilitate academic dishonesty, plagiarism, or exam cheating. Student offerings are strictly limited to legitimate starter code, architectural guides, capstone baseline tools, and educational material.
