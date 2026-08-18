# WebSystemBuilders

WebSystemBuilders is a unified web platform that enables students and business owners to discover, preview, and purchase ready-made software systems, as well as request custom web software development.

The repository is built as a single, modular Next.js application that combines public marketing, a database-driven systems catalog, PayPal digital commerce, customer accounts with tokenized downloads, and an extensive administrator management suite. Student services are strictly framed as ethical technical support; the platform does not promote ghostwriting, plagiarism, deceptive authorship, or guaranteed academic outcomes.

---

## Table of Contents

- [Project Status & Production Readiness](#project-status--production-readiness)
- [Product Scope & Audiences](#product-scope--audiences)
- [Platform Architecture & Stack](#platform-architecture--stack)
- [Core Features & System Capabilities](#core-features--system-capabilities)
- [Complete Site Map & Route Reference](#complete-site-map--route-reference)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Database Migrations](#database-migrations)
- [Available Commands](#available-commands)
- [Repository Structure](#repository-structure)
- [Development Phases & Roadmap](#development-phases--roadmap)
- [Non-Negotiable Engineering & Commerce Rules](#non-negotiable-engineering--commerce-rules)
- [Documentation Index](#documentation-index)
- [License](#license)

---

## Project Status & Production Readiness

The application is under active development. All software modules, administrative tools, and automated tests for Phases 0 through 10 are implemented locally, but the platform is **not yet ready for production commerce**.

- **Local implementation complete:** Public pages, dynamic catalog with live demo preview, PayPal Web SDK v6 checkout, token-protected digital delivery, customer account portal, and admin management workspaces are fully functional in local development.
- **Provider-backed payment & delivery:** Authenticated purchases use PayPal Web SDK v6 popup checkout with server-issued client tokens and server-side Orders v2 capture (`POST /api/payments/paypal/orders/[providerOrderId]/capture`). Webhooks reconcile payment lifecycle events idempotently. Administrators explicitly fulfill orders before digital deliverables are unlocked.
- **Production gates pending:** Live authentication, Row Level Security (RLS) enforcement against real users, private Storage bucket policies, Resend transactional email delivery, live PayPal merchant onboarding, real production deliverables/pricing, and end-to-end production smoke purchases remain blocked until external provider accounts and owner approvals are configured.

The project source of truth is [docs/WEBSITE_BLUEPRINT.md](docs/WEBSITE_BLUEPRINT.md). For detailed status on each phase, consult the [phase specifications](#documentation-index).

---

## Product Scope & Audiences

### 1. Students
- **Capstone & Thesis Systems:** Technical support, starter templates, and foundational architecture.
- **UI/UX & Frontend Development:** Clean, modern interface engineering and responsive layouts.
- **Debugging & Deployment:** Code fixes, performance optimization, environment configuration, and hosting guidance.
- **Documentation & Mentoring:** System architecture diagrams, setup guides, and technical code walkthroughs within ethical academic guidelines.

### 2. Business Owners
- **Ready-Made Systems:** Turnkey platforms including Point of Sale (POS), Inventory & Warehousing, Payroll & Attendance, Booking & Reservations, Customer Relationship Management (CRM), and School Management.
- **Custom Development:** Scoped, bespoke web application engineering based on submitted requirements and formal quotations.

### Product Models

| Model | Description | Release Status |
| :--- | :--- | :--- |
| **Ready-Made Systems** | Administrator-managed systems with source code packages and documented dependencies | Initial release (Local complete) |
| **Custom Development** | Structured intake, quotation, and custom milestone-based engineering | Initial release (Local complete) |
| **Hosted SaaS** | Recurring multi-tenant access to selected cloud-hosted platforms | Planned for future release |

---

## Platform Architecture & Stack

WebSystemBuilders is designed as a **modular monolith** with strong domain boundaries in `src/features/`. Server-only modules isolate database and payment logic, ensuring secrets and elevated credentials never leak into client bundles.

```
+-------------------------------------------------------------------------------+
|                             Next.js 16 App Router                            |
|  +--------------------+  +----------------------+  +-----------------------+  |
|  |   Public Website   |  |   Customer Portal    |  |    Admin Dashboard    |  |
|  |  (Marketing/Pages) |  | (Orders/Downloads)   |  | (Catalog/Orders/Ops)  |  |
|  +--------------------+  +----------------------+  +-----------------------+  |
|                                                                               |
|  +-------------------------------------------------------------------------+  |
|  |                 Feature Domains (src/features/*)                        |  |
|  |  Catalog | Orders | Payments | Delivery | Inquiries | Customer | Admin  |  |
|  +-------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------+
       |                           |                         |
       v                           v                         v
+------------------+     +-------------------+     +------------------+
|     Supabase     |     |   PayPal Orders   |     |      Resend      |
| PostgreSQL + RLS |     |  v2 Server SDK &  |     |  Server-Only     |
| Auth + Storage   |     |  Web SDK v6 Popup |     |  Delivery Email  |
+------------------+     +-------------------+     +------------------+
```

### Technology Matrix

| Area | Technologies |
| :--- | :--- |
| **Framework & Runtime** | Next.js 16 (App Router), React 19, TypeScript 6 |
| **Styling & Design System** | Tailwind CSS 4, Custom Accessible Primitives, Lucide React |
| **Motion & Interactivity** | Framer Motion, GSAP, Lenis Smooth Scroll |
| **Database & Storage** | Supabase PostgreSQL, Row Level Security (RLS), Private Storage |
| **Authentication** | Supabase Auth (Email Magic Links, Passwords, OAuth callbacks) |
| **Payment Gateway** | PayPal Web SDK v6 (Client Token) + PayPal Server SDK (Orders v2 Capture) |
| **Transactional Email** | Resend via server-only adapter with idempotency keys |
| **Validation & Forms** | Zod schemas, React Hook Form, `@hookform/resolvers` |
| **Abuse & Security** | Cloudflare Turnstile, SHA-256 fingerprint throttling, Strict CSP & HSTS |
| **Testing & Tooling** | Vitest, ESLint, TypeScript compiler |
| **Deployment Target** | Vercel (Edge & Serverless Node.js runtime) |

---

## Core Features & System Capabilities

### 1. Public & Marketing Surfaces
- Modern dark-themed design with editorial typography and responsive layouts.
- Dedicated audience landing pages for [Students](file:///c:/Users/evang/Downloads/websystembuilders/src/app/for-students) and [Businesses](file:///c:/Users/evang/Downloads/websystembuilders/src/app/for-business).
- Transparent service breakdown, portfolio showcases, development process milestones, and FAQ accordion.
- Structured quote intake (`/request-a-quote`) and general contact form (`/contact`) protected by Cloudflare Turnstile and fingerprint rate-limiting.

### 2. Systems Catalog & Live Preview
- Database-driven catalog with real-time category filtering, search, and pricing display.
- Product detail pages with full architecture breakdowns, included modules, tech stacks, and live demo links.
- Interactive in-app live preview iframe (`/systems/preview`) for evaluating systems before purchase.

### 3. PayPal Digital Commerce
- Server-authoritative pricing stored in integer minor units (PHP centavos).
- Authenticated one-time checkout via PayPal Web SDK v6 popup.
- Short-lived browser client tokens issued via `POST /api/payments/paypal/client-token`.
- Server-side capture via `POST /api/payments/paypal/orders/[providerOrderId]/capture` using idempotent idempotency keys (`capture-{paymentId}`).
- Idempotent webhook reconciliation via `POST /api/webhooks/paypal` with cryptographic signature verification.
- Historical legacy payment records remain preserved as read-only audit entries.

### 4. Protected Digital Delivery
- Deliverable ZIP files stored in private Supabase Storage (`system-deliverables`).
- Automated fulfillment creation with bounded download allowances.
- 256-bit cryptographically hashed delivery tokens (`/downloads/[token]`).
- Time-limited, 60-second presigned download redirects via `GET /api/downloads/[token]/[fileId]`.
- Token rotation and revocation controls for administrators.
- Automated delivery notification emails sent via Resend.

### 5. Customer Portal & Account Hub
- Supabase passwordless authentication with automatic order claiming based on confirmed email.
- Complete customer dashboard (`/dashboard`) and profile management (`/account`).
- Order history with itemized line items and license snapshots (`/account/orders`).
- Centralized downloads repository (`/account/downloads`) with on-demand fresh grant generation.
- Order-linked technical support ticket submission and tracking (`/account/support`).

### 6. Comprehensive Administrator Workspace
- **Overview (`/admin`):** Real-time sales metrics, revenue analytics, and system health status.
- **Systems (`/admin/systems`):** Product authoring, versioning, deliverable uploads, pricing, and publishing lifecycle.
- **Categories (`/admin/categories`):** Catalog taxonomies and display order management.
- **Media (`/admin/media`):** Asset library for product screenshots and marketing graphics.
- **Content (`/admin/content`):** Marketing copy, site announcements, FAQs, testimonials, and company profile.
- **Inquiries (`/admin/inquiries`):** Lead triage for custom quote requests and contact messages.
- **Orders (`/admin/orders`):** Commercial transaction ledger, manual fulfillment triggers, and refund management.
- **Support (`/admin/support`):** Customer ticket queue, triage, and resolution timestamps.
- **Audit Log (`/admin/audit-log`):** Chronological log of administrative actions, data changes, and authentication events.
- **Settings (`/admin/settings`):** Role-based access control (Super Admin vs Admin) and integration health diagnostics.
- **Sellers (`/admin/sellers`):** Registered vendor management and payout configuration.

---

## Complete Site Map & Route Reference

### Public & Marketing Routes
| Route | Description |
| :--- | :--- |
| [`/`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/page.tsx) | Homepage with hero messaging, audience pathways, and featured systems |
| [`/about`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/about) | Company background, mission, and software development standards |
| [`/process`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/process) | Step-by-step engineering, scoping, testing, and delivery workflow |
| [`/portfolio`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/portfolio) | Showcase of past builds, tech stacks, and live demo links |
| [`/faq`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/faq) | Frequently asked questions on licensing, support, and payments |
| [`/contact`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/contact) | General contact and support inquiry form |
| [`/get-started`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/get-started) | High-level launchpad directing users to catalog or custom quotes |
| [`/for-students`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/for-students) | Dedicated academic support, capstone assistance, and mentorship |
| [`/for-business`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/for-business) | Enterprise business systems, automation, and custom solutions |
| [`/services/custom-development`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/services/custom-development) | Custom web engineering services and contract scope outline |
| [`/request-a-quote`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/request-a-quote) | Structured custom development project intake form |

### Catalog & Commerce Routes
| Route | Description |
| :--- | :--- |
| [`/systems`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/systems) | Searchable and filterable ready-made software systems catalog |
| [`/systems/[slug]`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/systems/[slug]) | Detailed system specification, inclusions, and purchase CTA |
| [`/systems/preview`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/systems/preview) | Interactive live demo preview container |
| [`/checkout/[slug]`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/checkout/[slug]) | Authenticated checkout page with PayPal Web SDK v6 popup |
| [`/checkout/preview`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/checkout/preview) | Layout inspection preview for checkout interface |
| [`/checkout/status/[orderNumber]`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/checkout/status/[orderNumber]) | Real-time payment verification and fulfillment status |
| [`/downloads/[token]`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/downloads/[token]) | Token-authenticated secure file download portal |

### Authentication & Customer Portal Routes
| Route | Description |
| :--- | :--- |
| [`/auth/sign-in`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/auth/sign-in) | Magic link, password, and Google OAuth sign-in portal |
| [`/auth/sign-up`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/auth/sign-up) | New account registration |
| [`/auth/forgot-password`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/auth/forgot-password) | Self-service password recovery request |
| [`/auth/reset-password`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/auth/reset-password) | Tokenized password reset form |
| [`/auth/verify-email`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/auth/verify-email) | Post-registration email confirmation notice |
| [`/auth/unauthorized`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/auth/unauthorized) | Access restriction notice for unauthorized roles |
| [`/onboarding`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/onboarding) | Post-registration profile setup wizard |
| [`/dashboard`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/dashboard) | Customer overview hub with quick links and recent activity |
| [`/account`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/account) | Customer profile and account security settings |
| [`/account/orders`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/account/orders) | Purchased systems order history and itemized receipts |
| [`/account/orders/[orderNumber]`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/account/orders/[orderNumber]) | Detailed receipt with line items and active download link |
| [`/account/downloads`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/account/downloads) | Repository of owned software packages with fresh download grants |
| [`/account/support`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/account/support) | Order-linked technical support ticket management |

### Administrator Control Center Routes
| Route | Description |
| :--- | :--- |
| [`/admin`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin) | Business overview dashboard, sales metrics, and health indicators |
| [`/admin/systems`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin/systems) | Systems catalog list, filter, and publication state manager |
| [`/admin/systems/new`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin/systems/new) | Create and publish a new ready-made system package |
| [`/admin/systems/[id]/edit`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin/systems/[id]/edit) | Edit pricing, metadata, screenshots, and version deliverables |
| [`/admin/categories`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin/categories) | Category taxonomies, slug management, and sorting |
| [`/admin/media`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin/media) | Upload and manage system screenshots and marketing media |
| [`/admin/content`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin/content) | Dynamic site copy, hero text, FAQs, and company profile editor |
| [`/admin/inquiries`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin/inquiries) | Lead management for custom quote and contact submissions |
| [`/admin/orders`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin/orders) | Commercial order ledger, fulfillment trigger, and refund logging |
| [`/admin/support`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin/support) | Customer support ticket queue and resolution management |
| [`/admin/audit-log`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin/audit-log) | Immutable log of administrative mutations and authentication events |
| [`/admin/settings`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin/settings) | Admin role assignment (Super Admin only) and provider diagnostics |
| [`/admin/sellers`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/admin/sellers) | Vendor registration and third-party seller oversight |

### Legal & Policy Routes
| Route | Description |
| :--- | :--- |
| [`/legal/terms`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/legal/terms) | Terms of Service governing platform usage and user obligations |
| [`/legal/privacy`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/legal/privacy) | Privacy Policy detailing data collection, storage, and customer rights |
| [`/legal/delivery`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/legal/delivery) | Digital delivery policy, download allowances, and link expiration |
| [`/legal/license`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/legal/license) | Commercial source code licensing terms and intellectual property rights |
| [`/legal/refunds`](file:///c:/Users/evang/Downloads/websystembuilders/src/app/legal/refunds) | Refund policy and digital asset return terms |

---

## Getting Started

### Prerequisites

- **Node.js**: `20.x` or later (LTS recommended)
- **npm**: `10.x` or later
- **Git**: `2.x` or later

### Installation

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/12valor/WebSystemBuilders.git
   cd WebSystemBuilders
   ```

2. **Install project dependencies:**
   ```powershell
   npm install
   ```

3. **Initialize local environment variables:**
   ```powershell
   Copy-Item .env.example .env.local
   ```

4. **Start the local Next.js development server:**
   ```powershell
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> The public website and interface previews can run locally without live provider credentials. Database-driven mutations, customer login, PayPal checkout, and Resend delivery emails require valid Supabase, PayPal, and Resend credentials configured in `.env.local`.

---

## Environment Configuration

Configure environment variables in `.env.local` following the template in [.env.example](.env.example). Never commit `.env.local` or expose server-only keys to client code.

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser & Server | Supabase project API URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser & Server | Supabase anonymous / publishable key protected by RLS |
| `SITE_URL` | Server only | Canonical application origin (`http://localhost:3000` locally, HTTPS origin in production) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Privileged Supabase key for service functions; **never expose to clients** |
| `PAYPAL_CLIENT_ID` | Server only | PayPal REST API application client ID |
| `PAYPAL_CLIENT_SECRET` | Server only | PayPal REST API application client secret |
| `PAYPAL_ENVIRONMENT` | Server only | PayPal environment mode (`sandbox` locally, `live` in production) |
| `PAYPAL_WEBHOOK_ID` | Server only | PayPal webhook ID for cryptographic signature verification |
| `INQUIRY_FINGERPRINT_SALT` | Server only | Random salt (32+ chars) for inquiry rate-limiting hashes |
| `RESEND_API_KEY` | Server only | Resend transactional email API key |
| `RESEND_FROM_EMAIL` | Server only | Verified sender mailbox address (e.g., `orders@websystembuilders.com`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Browser & Server | Cloudflare Turnstile public widget site key |
| `TURNSTILE_SECRET` | Server only | Cloudflare Turnstile server-side verification secret |

---

## Database Migrations

Database schemas and Row Level Security policies are managed as versioned SQL migrations in `supabase/migrations/`.

### Migration Execution Order

When bootstrapping a Supabase PostgreSQL database, execute all migration scripts sequentially in filename order:

1. `20260724000000_phase_2_identity_catalog.sql` - Core profiles, catalog tables, versions, deliverables, and base RLS
2. `20260724010000_phase_2_private_storage_and_sales.sql` - Private storage buckets and download tracking
3. `20260724020000_phase_2_catalog_resources.sql` - System specifications and requirements
4. `20260724030000_phase_3_inquiries.sql` - Contact and custom development quote inquiries
5. `20260725000000_phase_4_public_catalog_media.sql` - Catalog media public visibility
6. `20260725010000_phase_4_catalog_metadata.sql` - Tagging, featured flags, and catalog metadata
7. `20260725020000_phase_5_admin_operations.sql` - Admin catalog mutations and audit logging
8. `20260725030000_phase_5_inquiry_operations.sql` - Inquiry triage, status management, and audit
9. `20260725040000_phase_5_system_lifecycle.sql` - System draft, publishing, and archival lifecycle
10. `20260725050000_phase_5_media_audit.sql` - Media library tracking and metadata audit
11. `20260725060000_phase_5_faq_content.sql` - FAQ items and category management
12. `20260725070000_phase_5_portfolio_content.sql` - Portfolio items and showcase entries
13. `20260725080000_phase_5_testimonials.sql` - Testimonials and moderation
14. `20260725090000_phase_5_site_content.sql` - Dynamic website marketing copy
15. `20260725100000_phase_5_company_profile.sql` - Company profile, branding, and contact details
16. `20260725110000_phase_5_super_admin.sql` - Role hierarchy (Super Admin vs Admin)
17. `20260725120000_phase_6_orders_payments.sql` - Orders, line items, snapshots, and payment ledgers
18. `20260725130000_phase_7_delivery.sql` - Fulfillments, download grants, and delivery events
19. `20260725140000_phase_8_customer_portal.sql` - Customer order claiming, downloads, and support tickets
20. `20260727000000_phase_11_auth_onboarding_sellers.sql` - User onboarding and seller registry
21. `20260817072416_add_payment_processing_status.sql` - Payment processing state support
22. `20260817072420_replace_paymongo_with_paypal.sql` - PayPal Orders v2 schema and webhook support
23. `20260817114414_harden_security_definer_function_acl.sql` - Function privilege hardening
24. `20260817114642_restrict_rls_auto_enable_acl.sql` - RLS automation hardening
25. `20260817173523_remove_manual_qr_payments.sql` - Legacy manual payment deprecation

---

## Available Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the local Next.js development server at `http://localhost:3000` |
| `npm run build` | Build the optimized production application bundle |
| `npm run start` | Serve the compiled production build locally |
| `npm run lint` | Run ESLint across all TypeScript and React files |
| `npm run typecheck` | Run the TypeScript compiler (`tsc --noEmit`) to verify types |
| `npm test` | Execute the full Vitest automated test suite |
| `npm run launch:check` | Validate required production environment variables without leaking secrets |

### Standard Verification Pipeline

Before committing changes or preparing releases, execute the full local validation suite:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

---

## Repository Structure

```text
websystembuilders/
|-- assets/                     # Brand identity, logos, marks, and usage guidelines
|   `-- brand/
|-- docs/                       # Blueprint, phase specifications, and setup guides
|   |-- WEBSITE_BLUEPRINT.md    # Central technical & product source of truth
|   |-- PHASE_0_PRODUCT_DEFINITION.md
|   |-- PHASE_1_DESIGN_FOUNDATION.md
|   |-- PHASE_2_TECHNICAL_FOUNDATION.md
|   |-- PHASE_3_PUBLIC_WEBSITE.md
|   |-- PHASE_4_SYSTEMS_CATALOG.md
|   |-- PHASE_5_ADMIN_DASHBOARD.md
|   |-- PHASE_6_PAYMENT_AND_ORDERING.md
|   |-- PAYPAL_CHECKOUT_SETUP.md
|   |-- PHASE_7_AUTOMATED_DELIVERY.md
|   |-- PHASE_8_CUSTOMER_PORTAL.md
|   |-- PHASE_9_QUALITY_HARDENING.md
|   `-- PHASE_10_PRODUCTION_LAUNCH.md
|-- public/                     # Static assets, icons, illustrations, and robots.txt
|-- scripts/                    # Launch readiness and operational verification scripts
|   |-- check-launch-readiness.mjs
|   `-- check-launch-readiness.d.mts
|-- src/
|   |-- app/                    # Next.js App Router pages, layouts, and API routes
|   |   |-- (marketing pages: about, process, portfolio, faq, contact, etc.)
|   |   |-- account/            # Customer account management routes
|   |   |-- admin/              # Administrator control panel routes
|   |   |-- api/                # Protected server route handlers (payments, webhooks, delivery)
|   |   |-- auth/               # Authentication and onboarding routes
|   |   |-- checkout/           # System checkout and payment status routes
|   |   |-- dashboard/          # Customer dashboard overview
|   |   |-- downloads/          # Tokenized secure file download portal
|   |   |-- legal/              # Legal terms, privacy, delivery, and refund policies
|   |   `-- systems/            # Systems catalog and detail pages
|   |-- components/             # Reusable UI primitives and surface-specific components
|   |   |-- ui/                 # Shared accessible UI primitives (buttons, modals, inputs)
|   |   |-- admin/              # Administrator workspace components
|   |   |-- catalog/            # Catalog cards, filters, and detail components
|   |   |-- checkout/           # PayPal button and checkout summary components
|   |   |-- customer/           # Customer portal views and order summaries
|   |   `-- layout/             # Header, footer, and navigation components
|   |-- emails/                 # React-based transactional email templates
|   |-- features/               # Domain-driven feature modules (catalog, orders, payments, delivery, etc.)
|   `-- lib/                    # Provider clients, auth, database, security, and validation schemas
|-- supabase/
|   `-- migrations/             # Sequential PostgreSQL schema changes and RLS policies
|-- tests/                      # Vitest test suite (unit, integration, migration contracts, security)
|-- .env.example                # Template for environment configuration
|-- SITE_AND_ADMIN_SUMMARY.md   # Detailed page and admin panel route breakdown
|-- package.json
|-- tsconfig.json
`-- next.config.ts
```

---

## Development Phases & Roadmap

| Phase | Focus Area | Implementation Status | Production Verification |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Product Definition & Scope | Completed | Blocked on business/tax registration |
| **Phase 1** | Design Foundation & Design System | Completed | Completed locally |
| **Phase 2** | Technical Foundation (Supabase, Auth, RLS) | Completed locally | Blocked on Supabase project linking |
| **Phase 3** | Public Website & Marketing Surfaces | Completed locally | Completed locally |
| **Phase 4** | Database-Driven Systems Catalog | Completed locally | Blocked on production product files |
| **Phase 5** | Admin Control Dashboard & Operations | Completed locally | Blocked on super admin bootstrap |
| **Phase 6** | PayPal Web SDK v6 & Server Capture | Completed locally | Blocked on PayPal business onboarding |
| **Phase 7** | Protected Storage & Automated Delivery | Completed locally | Blocked on Resend domain SPF/DKIM |
| **Phase 8** | Customer Portal & Support Helpdesk | Completed locally | Blocked on live email claiming tests |
| **Phase 9** | Quality Hardening, Security, Accessibility | Completed locally | Completed locally |
| **Phase 10** | Production Launch Readiness & Runbook | Completed locally | Blocked on go/no-go checklist |
| **Phase 11** | Post-Launch Operations & Seller Registry | Scaffolded | Post-launch milestone |

---

## Non-Negotiable Engineering & Commerce Rules

1. **Authoritative Server-Side Pricing:** Product prices are calculated authoritatively on the server and stored as integer minor units (e.g., PHP centavos). Client-provided amounts are never trusted.
2. **No Client-Only Payment Proof:** A browser return URL or popup completion is never treated as proof of payment. Orders transition to paid only after server-side capture verification or verified webhook reconciliation.
3. **Explicit Order Fulfillment:** Paid orders enter an `awaiting_delivery` state. Digital fulfillment is generated through locked database functions and delivered via revocable, expiring tokens.
4. **Private Deliverable Storage:** ZIP files and source deliverables are stored strictly in private Supabase Storage (`system-deliverables`). Download access is issued solely through 60-second presigned redirects after verifying token validity and download quotas.
5. **Strict Server-Side Authorization:** Every protected route and mutation enforces authentication and role verification inside PostgreSQL Row Level Security (RLS) and server actions.
6. **No Secret Leakage:** Server secrets (`SUPABASE_SERVICE_ROLE_KEY`, `PAYPAL_CLIENT_SECRET`, `RESEND_API_KEY`, `TURNSTILE_SECRET`) reside exclusively behind server-only modules and are never exposed in browser bundles.
7. **Immutable Audit & Event History:** All payments, fulfillments, download events, email deliveries, and administrative mutations are immutably logged for compliance and support.
8. **Truthful & Ethical Marketing:** Public systems, media, testimonials, and company claims must reflect authentic, verifiable products. Academic services remain strictly ethical.

---

## Documentation Index

- [Website Blueprint](docs/WEBSITE_BLUEPRINT.md) - Product, architecture, security, and commerce master blueprint
- [Phase 0: Product Definition](docs/PHASE_0_PRODUCT_DEFINITION.md)
- [Phase 1: Design Foundation](docs/PHASE_1_DESIGN_FOUNDATION.md)
- [Phase 2: Technical Foundation](docs/PHASE_2_TECHNICAL_FOUNDATION.md)
- [Phase 3: Public Website](docs/PHASE_3_PUBLIC_WEBSITE.md)
- [Phase 4: Systems Catalog](docs/PHASE_4_SYSTEMS_CATALOG.md)
- [Phase 5: Admin Dashboard](docs/PHASE_5_ADMIN_DASHBOARD.md)
- [Phase 6: Payment and Ordering](docs/PHASE_6_PAYMENT_AND_ORDERING.md)
- [PayPal Checkout Setup Guide](docs/PAYPAL_CHECKOUT_SETUP.md)
- [Phase 7: Automated Delivery](docs/PHASE_7_AUTOMATED_DELIVERY.md)
- [Phase 8: Customer Portal](docs/PHASE_8_CUSTOMER_PORTAL.md)
- [Phase 9: Quality Hardening](docs/PHASE_9_QUALITY_HARDENING.md)
- [Phase 10: Production Launch](docs/PHASE_10_PRODUCTION_LAUNCH.md)
- [Site Pages & Admin Panel Summary](SITE_AND_ADMIN_SUMMARY.md)
- [Brand Guidelines](assets/brand/BRAND_GUIDELINES.md)

---

## License

No repository-level open-source license is currently declared. Commercial software packages sold or distributed through the platform are subject to separate commercial license agreements ([/legal/license](file:///c:/Users/evang/Downloads/websystembuilders/src/app/legal/license)) and must not be inferred from access to this repository.
