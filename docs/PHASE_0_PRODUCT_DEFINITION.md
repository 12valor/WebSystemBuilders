# Phase 0: Product Definition

## Status

**Active phase:** Phase 0 — Product definition
**Started:** July 20, 2026
**Target output:** An approved product scope, sitemap, product model, commercial rules, delivery rules, and readiness decision for Phase 1.

This document separates confirmed owner decisions from proposed defaults and unresolved decisions. A proposal is not an approved business policy until the owner confirms it.

## 1. Objective

Define what WebSystemBuilders will sell, who it will serve, how customers will evaluate and purchase systems, what administrators will control, and which business policies must exist before design and implementation.

Phase 0 prevents development from embedding unapproved assumptions about pricing, source-code access, licensing, refunds, support, delivery, or academic services.

## 2. Confirmed direction

| Decision | Confirmed direction |
|---|---|
| Domain and brand | `websystembuilders.com`, branded as WebSystemBuilders |
| Primary audiences | Students and business owners |
| Platform purpose | Sell ready-made systems and offer custom system-development services |
| Student offering | Capstone, thesis-related technical support, templates, development, and related services |
| Business offering | POS, inventory, warehouse, management, and other business systems |
| Catalog ownership | Administrators add and manage the systems shown publicly |
| Product presentation | Systems include descriptions, features, media, price or quotation rules, and delivery details |
| Purchase entry | Eligible products provide a **Buy System** action |
| Payment | A secure hosted payment gateway handles payment details |
| Fulfillment | Files are delivered only after payment is verified server-side |
| Delivery | ZIP download, protected file link, or administrator-provided delivery link sent by email |
| Administration | Admin manages systems, prices, media, files, orders, content, and delivery |
| Visual direction | Dark, minimal, modern, restrained, seamless, and professional |
| Trust priority | The complete browsing and purchasing experience must feel legitimate and reliable |
| Platform shape | Public site, catalog, checkout, customer area, and admin area form one coherent platform |

## 3. Customer definitions

### Students

Students need to browse relevant systems, see real features and demonstrations, understand inclusions, request customization, purchase eligible products, receive setup instructions, and obtain ethical technical support.

Student services must be positioned as software development, mentoring, UI/UX, debugging, deployment, and documentation guidance. The website must not advertise guaranteed grades, deceptive authorship, impersonation, fabricated research, or services intended to violate school policies.

### Business owners

Business owners need to browse systems by operational need, compare packages, evaluate real demonstrations, understand licensing and support, purchase ready-made products, request custom development, and obtain deployment or maintenance assistance.

### Administrators

Administrators need to manage the public catalog without editing code. They must control product information, categories, audiences, pricing, media, versions, delivery files, publishing, orders, inquiries, emails, and download access.

## 4. Product models

| Model | Meaning | Phase 0 recommendation |
|---|---|---|
| Ready-made system | A defined system sold as a digital product | Include in MVP |
| Customizable template | A base product with separately scoped changes | Include in MVP |
| Custom development | A service requiring requirements review and quotation | Include in MVP |
| Hosted SaaS | Online software sold as a recurring subscription | Defer until demand is validated |

### Initial category seeds

**Business:** Point of Sale, Inventory, Warehouse, Payroll and Attendance, Booking, Customer Management, School Management, and other management systems.

**Student:** Capstone, thesis-related systems, attendance, enrollment, library, reservation, inventory, POS, and custom academic systems.

Categories remain database-managed. These names are seeds, not a hardcoded permanent list.

## 5. MVP scope

### Included

- Responsive public website
- Separate student and business entry paths
- Database-driven systems catalog
- Search and audience or category filters
- Individual system pages
- Quote and contact forms
- Portfolio and trust content
- Admin authentication
- Admin system, category, media, file, price, version, and publication management
- Admin inquiry and order management
- Hosted checkout
- Verified payment webhooks
- Durable order and payment records
- Private ZIP or protected-link delivery
- Purchase email and verified success page
- Legal, delivery, refund, and license pages
- SEO, accessibility, security, and responsive QA

### Proposed for later

- Full customer portal
- Hosted SaaS subscriptions and recurring billing
- License-key generation
- Automatic update distribution
- Multi-currency pricing
- Affiliate program
- Multiple payment providers

Guest checkout can support the MVP, but every purchase still requires durable order, customer-email, payment, and delivery records.

**Owner decision:** Confirm whether the customer portal is postponed or included in the initial launch.

## 6. Sitemap baseline

### Public

- `/`
- `/for-students`
- `/for-business`
- `/systems`
- `/systems/[slug]`
- `/services/custom-development`
- `/portfolio`
- `/process`
- `/about`
- `/contact`
- `/request-a-quote`
- `/faq`
- `/legal/privacy`
- `/legal/terms`
- `/legal/refunds`
- `/legal/delivery`
- `/legal/license`

### Commerce

- `/checkout/[systemSlug]`
- `/payment/success`
- `/payment/cancelled`

### Customer portal when included

- `/account`
- `/account/orders`
- `/account/orders/[orderNumber]`
- `/account/downloads`
- `/account/support`

### Admin

- `/admin`
- `/admin/systems`
- `/admin/systems/new`
- `/admin/systems/[id]`
- `/admin/categories`
- `/admin/orders`
- `/admin/customers`
- `/admin/inquiries`
- `/admin/content`
- `/admin/media`
- `/admin/settings`
- `/admin/audit-log`

This sitemap is the architecture and design-planning baseline. Labels and navigation grouping may be refined without creating duplicate product areas.

## 7. Pricing definition

Every system can use one pricing mode:

- Fixed price
- Starting price
- Request a quote
- Monthly subscription in a future SaaS phase

| Offering | Proposed behavior |
|---|---|
| Ready-made system | Fixed price or visible starting price |
| Customizable template | Starting price plus separate customization quote |
| Custom development | Request a quote |
| Hosted SaaS | Monthly or annual subscription later |

The server is authoritative for checkout prices. Orders preserve the purchased name, version, price, currency, and license. Product pages must distinguish the product price from optional customization, deployment, hosting, and extended support.

**Owner decisions:** Actual prices, currency, taxes, invoice requirements, sale behavior, and treatment of payment-processing fees.

## 8. Checkout and delivery

### Confirmed workflow

1. Customer selects an eligible system.
2. Website collects the customer's name and email.
3. Server creates a pending order with an authoritative product snapshot.
4. Server creates a hosted payment session.
5. Customer completes or cancels payment.
6. Provider sends a payment event to the website.
7. Server verifies authenticity, amount, currency, and payment state.
8. Server records the event and fulfills the order at most once.
9. Server creates protected delivery access.
10. Server sends the receipt and download link.
11. Website displays the verified order result.

### Supported delivery methods

- Private uploaded ZIP — preferred
- Protected external URL — allowed
- Manual delivery — fallback

### Proposed defaults

| Control | Proposed default | Status |
|---|---|---|
| Link lifetime | 72 hours | Open |
| Download limit | 3 completed downloads | Open |
| Link regeneration | Admin can regenerate with an audit record | Proposed |
| Link revocation | Admin can revoke future access | Proposed |
| Delivery email | Receipt, order number, system, license, instructions, download, and support | Proposed |
| Success page | Verified order status and available delivery action | Proposed |

Email should normally contain a protected link instead of attaching the ZIP.

## 9. License framework

The final license requires owner approval and appropriate legal review.

### Proposed standard license

- Use by one named student project, business, or organization
- Modification for the licensed user's own use when source code is included
- No resale, redistribution, sublicensing, public repository upload, or removal of ownership notices
- Support and updates only for the period shown on the product page

### Proposed extended license

Separately priced rights for agencies, developers, multiple deployments, or commercial redistribution. Rights must be explicit per product.

Every product must disclose whether source code is included, permitted deployments, customization coverage, support period, update entitlement, and separately billed dependencies.

**Owner decisions:** Source-code policy, deployment limits, ownership transfer, resale rules, and update entitlement.

## 10. Refund and cancellation framework

The final refund policy must comply with applicable law and payment-provider requirements and should receive appropriate legal review before production.

Decisions required:

- Refund before delivery
- Effect of opening or downloading a digital product
- Duplicate payments
- Corrupt, missing, or materially misrepresented products
- Failed delivery
- Chargebacks
- Custom-development deposits and milestones
- Review-request time window

Do not publish a strict no-refund promise until the policy has been reviewed.

## 11. Support and customization

| Area | Proposed treatment |
|---|---|
| Product support | Download, installation, and reproducible product defects |
| Customization | Separately quoted feature or branding changes |
| Deployment | Optional hosted or on-premise installation service |
| Maintenance | Separately priced ongoing updates and operational support |

Every product must state support channels, duration, supported environment, what counts as a defect, what is billable customization, and whether hosting or deployment is included.

**Owner decisions:** Default support duration, channels, response expectations, included setup assistance, and customization quotation process.

## 12. Trust and content requirements

Required trust content:

- Professional domain email
- Authentic company and team information
- Real system screenshots and demos
- Transparent features, exclusions, and pricing mode
- License, delivery, refund, privacy, and terms pages
- Order numbers, receipts, and delivery confirmations
- Visible support channels
- Authentic portfolio and testimonials only
- Product version and last-update information

Content needed from the owner:

- Logo or approval to start with a text wordmark
- Company description
- Public team or founder information
- Business contact information
- Professional email addresses
- Social links
- Initial systems, screenshots, demos, and files
- Portfolio entries
- Authentic testimonials if available
- Legal business details intended for display

## 13. Success measures

### Funnel

- System detail views
- Demo interactions
- Checkout starts
- Successful payments
- Quote submissions
- Completed downloads

### Reliability

- Payment webhook success
- Fulfillment success
- Transactional email delivery
- Download success
- Failed or manually recovered orders

### Service

- Inquiry response time
- Support resolution
- Refund and dispute reasons
- Customer feedback
- Repeat customers

Targets should be set after baseline production data exists.

## 14. Dependencies and risks

| Dependency or risk | Required treatment |
|---|---|
| PayMongo onboarding | Confirm merchant account, KYC, test access, and approved payment methods |
| Legal policies | Obtain qualified review before publishing production terms |
| Missing product content | Define minimum publishable product content |
| Large or unsafe ZIP files | Private storage, upload restrictions, and production scanning plan |
| Link sharing | Expiring, revocable links and download records |
| Unclear source-code rights | Explicit per-product field and approved license |
| Mixed audiences | Separate audience paths and filters |
| Fake trust signals | Never invent testimonials, customers, metrics, or urgency |
| Scope expansion | Keep subscriptions and advanced portal features outside MVP until approved |

## 15. Decision log

| ID | Decision | Status |
|---|---|---|
| D-001 | Brand and domain | Confirmed |
| D-002 | Students and business owners are primary audiences | Confirmed |
| D-003 | Catalog is administered through the website | Confirmed |
| D-004 | Ready-made systems and custom development launch first | Confirmed |
| D-005 | Hosted SaaS subscriptions follow proven demand | Proposed |
| D-006 | PayMongo is the initial payment integration | Proposed pending merchant verification |
| D-007 | Resend is the initial email provider | Proposed |
| D-008 | Supabase provides database, authentication, and storage | Proposed |
| D-009 | Guest checkout supports the MVP | Proposed |
| D-010 | Customer portal timing | Open |
| D-011 | Default link lifetime of 72 hours | Open |
| D-012 | Default limit of 3 downloads | Open |
| D-013 | Standard and extended licenses | Open |
| D-014 | Refund policy | Open |
| D-015 | Source-code inclusion policy | Open |
| D-016 | Support and update duration | Open |

## 16. Owner approval checklist

- [x] Confirm domain and brand
- [x] Confirm primary audiences
- [x] Confirm ready-made systems and custom development
- [x] Confirm admin-managed catalog
- [x] Confirm hosted payment and automated delivery goal
- [x] Confirm dark, minimal, professional design
- [ ] Confirm ethical student-service wording
- [ ] Confirm customer portal timing
- [ ] Confirm initial categories and launch systems
- [ ] Confirm currency, tax, invoice, and pricing presentation
- [ ] Confirm payment provider and merchant readiness
- [ ] Confirm standard and extended licenses
- [ ] Confirm source-code rules
- [ ] Confirm refund and cancellation rules
- [ ] Confirm download expiration and limit
- [ ] Confirm support and update duration
- [ ] Confirm customization and deployment inclusions
- [ ] Supply or approve initial brand and company content
- [ ] Confirm legal-review plan for production policies

## 17. Phase 0 exit criteria

Phase 0 is complete when:

- MVP scope and sitemap are approved.
- Initial launch products are selected.
- Pricing and currency presentation are approved.
- Licensing, source-code, refund, delivery, support, and customization rules are approved.
- Payment-provider readiness is confirmed.
- Required company, product, and trust content has an owner and delivery plan.
- No unresolved decision would materially change Phase 1 information architecture or design.

## 18. Next action

Review and resolve the unchecked approval items. Once decisions that affect page structure and product presentation are confirmed, Phase 1 can begin with the design system, responsive wireframes, and content hierarchy.