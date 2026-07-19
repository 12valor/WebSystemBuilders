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
| Student-service boundary | Ethical technical support is allowed; deceptive authorship, impersonation, fabricated research, guaranteed grades, and school-policy violations are prohibited |
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
| Customer portal | Customer accounts and the full portal are included in the initial launch |
| Checkout access | Customers may purchase as guests and access linked orders after verifying the purchase email |

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

### Approved launch catalog structure

| Audience | Launch category or service |
|---|---|
| Business | Point of Sale |
| Business | Inventory Management |
| Business | Warehouse Management |
| Student | Capstone Systems |
| Student | Thesis-Related Systems |
| Both | Custom System Development |

Categories remain administrator-managed database records. This is the approved starting structure, not a permanent hardcoded list. Actual launch products and files must still be selected and prepared separately.

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
- Customer accounts and portal for orders, downloads, receipts, updates, and support
- Private ZIP or protected-link delivery
- Purchase email and verified success page
- Legal, delivery, refund, and license pages
- SEO, accessibility, security, and responsive QA

### Proposed for later

- Hosted SaaS subscriptions and recurring billing
- License-key generation
- Automatic update distribution
- Multi-currency pricing
- Affiliate program
- Multiple payment providers

Customer accounts and the full customer portal are confirmed for the initial launch. Customers may complete checkout without signing in. The order is associated with the submitted purchase email, and portal access is granted only after that email is verified through a secure sign-in or account-activation flow. Every purchase must retain durable customer, payment, delivery, receipt, and support records.

### Approved account-linking behavior

1. Collect and normalize the customer email before checkout.
2. Store the email and customer reference on the pending order.
3. Complete payment without requiring an existing account.
4. After verified payment, send delivery and secure account-access instructions to the purchase email.
5. Require email verification before exposing orders, receipts, downloads, or support records in the portal.
6. Link only orders whose normalized email matches the verified identity.
7. Never expose whether another email has purchases through public account-recovery responses.
8. Allow signed-in customers to check out normally and attach the order directly to their verified account.

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

### Customer portal

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

## 7. Pricing and currency definition

### Confirmed pricing modes

| Offering | Approved behavior |
|---|---|
| Ready-made system | Fixed price or visible starting price |
| Customizable template | Starting price plus separate customization quote |
| Custom development | Request a quote |
| Hosted SaaS | Monthly or annual subscription in a future phase |

The server is authoritative for checkout prices. Orders preserve the purchased name, version, base price, displayed estimate, actual charge amount, currency, and license. Product pages must distinguish the product price from optional customization, deployment, hosting, and extended support.

### Confirmed localized display behavior

1. Infer the visitor's likely currency from coarse country information supplied by the hosting layer.
2. Fall back to PHP when the country or currency cannot be determined.
3. Always provide a visible manual currency selector.
4. Remember the customer's selection without storing precise location.
5. Convert prices on the server through a replaceable exchange-rate provider.
6. Cache exchange rates and retain the rate timestamp used for the estimate.
7. Show converted prices with an approximation label such as `≈` and state that the checkout amount controls.
8. Show the actual charge currency and final amount before the customer opens or confirms payment.
9. Never authorize payment from a browser-calculated conversion.

### Approved settlement behavior

- Store catalog prices canonically in PHP.
- Charge PHP for Philippine e-wallets, QR, banking, and standard local checkout flows.
- Offer USD charging only for eligible card payments after PayMongo enables USD Card Acceptance for the merchant account.
- Show other local currencies as display estimates while the checkout clearly states the supported charge currency.
- Add another payment provider later if the business requires actual charging in currencies that PayMongo does not support.

PayMongo's current documentation describes PHP payment acceptance and separately activated USD card acceptance. It does not establish arbitrary local-currency charging for every visitor country. Therefore, automatic localization and actual settlement currency must remain separate concepts.

**Owner decisions still required:** Define taxes and invoices, approve sale behavior, and determine treatment of payment-processing fees.
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

### Approved download-access model

| Control | Approved behavior |
|---|---|
| Purchase entitlement | Permanent access in the portal to the purchased product version |
| Total download count | Unlimited re-downloads for the entitled version |
| Generated signed URL | Expires one hour after issuance |
| Authorization | Recheck verified identity, order, entitlement, and revocation before every URL |
| Delivery email | Receipt, order number, system, license, instructions, and secure portal or order link |
| Success page | Verified order status and available delivery action |
| Revocation | Allowed after refund, chargeback, confirmed fraud, legal requirement, or invalidated order |
| Audit | Record signed-link issuance and download activity |

Email should link to the verified portal or order page instead of attaching the ZIP or exposing a permanent raw storage URL. Access to future versions remains a separate support-and-update decision.

## 9. Approved commercial source license

Ready-made systems include source code and are sold with a broad, perpetual, non-exclusive commercial license.

### Buyer permissions

The purchaser may:

- Use the system for personal, academic, organizational, or business purposes
- Copy and modify the source code
- Deploy the system multiple times
- Create derivative systems
- Resell the original or modified system
- Redistribute the original or modified source package
- Choose their own pricing and commercial model for redistributed copies

### Rights retained by WebSystemBuilders

- WebSystemBuilders retains ownership of its original code and materials.
- WebSystemBuilders may continue using, modifying, selling, and licensing the same system.
- A purchase is non-exclusive and does not transfer exclusive ownership.
- Buyers may not claim ownership of the WebSystemBuilders name, logo, website, or trademarks.
- The license cannot grant rights that WebSystemBuilders does not own.

### Third-party materials

Libraries, frameworks, fonts, icons, images, media, sample data, and external services remain subject to their original licenses and terms. A buyer's broad license applies only to material WebSystemBuilders has the legal right to license that way.

Before a system is sold:

- Audit distributed dependencies and assets.
- Include required notices and source-license files.
- Remove assets that cannot legally be redistributed.
- Disclose separately billed external services.
- State whether bundled credentials, data, or hosted services are excluded.

### Separate commercial terms

Source-code permission does not automatically define:

- Support duration or transferability
- Future updates
- Warranties
- Refunds
- Liability
- Hosted services
- Custom development
- Trademark use

These require separate public terms. The final license wording should receive appropriate legal review before production.

### Business implication

Because buyers may redistribute or resell the unchanged source package, the same product may become available elsewhere, including at a lower price or for free. The owner has explicitly accepted this broad redistribution model.
## 10. Approved refund-policy direction

### Owner's commercial intent

Completed digital-system sales are final. WebSystemBuilders will not offer discretionary refunds because a customer changed their mind, found a different product, no longer needs the system, failed to review disclosed requirements, or mishandled the delivered files.

### Mandatory exceptions and remedies

The public policy must not state or imply that mandatory consumer rights are waived. Applicable remedies must remain available for circumstances such as:

- Duplicate or unauthorized charges
- Failure to deliver the purchased system
- A materially defective or nonconforming system
- Material misrepresentation of the system or its inclusions
- Breach of an applicable express or implied warranty
- Other remedies that cannot legally be excluded

### Resolution workflow

1. Verify the order, payment, delivery, product version, and reported problem.
2. Determine whether the issue is buyer configuration, a disclosed limitation, delivery failure, defect, or misrepresentation.
3. Attempt redelivery, setup guidance, correction, repair, or replacement when appropriate.
4. Issue a full or partial refund when required by law, provider rules, duplicate payment, or an approved exceptional resolution.
5. Record the reason, evidence, amount, provider reference, and administrator responsible.
6. Revoke future download access when appropriate, recognizing that already downloaded source code cannot be technically recovered.

### Required public wording

Use language such as “Digital sales are final for change-of-mind purchases, subject to applicable consumer rights and legally required remedies.” Do not publish a blanket “No Return, No Exchange” or “No Refunds Under Any Circumstances” notice.

The final policy requires appropriate Philippine legal review before production. Payment-provider refund and dispute capabilities must remain implemented even when discretionary refunds are not offered.
## 11. Approved support and update policy

### Included support

The original purchaser receives 30 calendar days of support beginning when the paid order is fulfilled.

Included support covers:

- Accessing and downloading the purchased files
- Installation using the supplied documentation
- Clarification of documented system requirements
- Reproducible defects in the unmodified delivered version
- Eligible corrective patches released for the purchased version during the support period

### Excluded from free support

- New features or design changes
- Custom branding or business-rule changes
- Problems introduced by purchaser modifications
- Unsupported environments or ignored system requirements
- Hosting, domain, deployment, data migration, or server administration unless the product explicitly includes them
- Training beyond supplied documentation
- Third-party service outages, fees, policy changes, or account issues
- Support for customers of a buyer who resells or redistributes the system

### Version entitlement

- The purchaser has permanent portal access to the version purchased.
- The purchaser retains access to eligible patches attached to that purchased version.
- Future major versions are separate products or purchases unless the product page explicitly includes an upgrade.
- Automatic update distribution is not required for the initial launch.

### Transferability

The broad source license allows resale and redistribution, but the 30-day support entitlement remains tied to the original WebSystemBuilders order and customer. Downstream sellers are responsible for their own customer support.

### Approved product-package boundary

The listed ready-made system price includes:

- The purchased source-code package
- Supplied installation and usage documentation
- Thirty calendar days of included support
- Other inclusions explicitly stated on the product page

The listed price excludes the following unless a product page explicitly includes them:

- Feature customization
- Business-rule changes
- Branding and white-label work
- Deployment or installation performed by WebSystemBuilders
- Hosting, domain, database, storage, or other infrastructure fees
- Data migration or data entry
- Training
- Ongoing maintenance after included support
- Third-party accounts, subscriptions, licenses, or transaction fees

Excluded services require a separate requirements review, scope, quotation, and acceptance. Product pages and checkout must present inclusions and exclusions before payment.

### Product disclosure

Every product page must state the support start event, duration, included tasks, system requirements, purchased version, update entitlement, support channel, and whether customization, hosting, or deployment is separately quoted.

**Owner decisions still required:** Support channel and response target.
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
| PayMongo onboarding | Owner will complete later; required before production checkout, live credentials, and payment-method activation |
| Legal policies | Obtain qualified review before publishing production terms |
| Missing product content | Define minimum publishable product content |
| Large or unsafe ZIP files | Private storage, upload restrictions, and production scanning plan |
| Link sharing | Expiring, revocable links and download records |
| Unclear source-code rights | Explicit per-product field and approved license |
| Mixed audiences | Separate audience paths and filters |
| Fake trust signals | Never invent testimonials, customers, metrics, or urgency |
| Scope expansion | Keep subscriptions and nonessential post-launch features outside the approved initial scope |

## 15. Decision log

| ID | Decision | Status |
|---|---|---|
| D-001 | Brand and domain | Confirmed |
| D-002 | Students and business owners are primary audiences | Confirmed |
| D-003 | Catalog is administered through the website | Confirmed |
| D-004 | Ready-made systems and custom development launch first | Confirmed |
| D-005 | Hosted SaaS subscriptions follow proven demand | Proposed |
| D-006 | PayMongo is the selected initial payment integration; onboarding is deferred and required before production | Confirmed provider, onboarding pending |
| D-007 | Resend is the initial email provider | Proposed |
| D-008 | Supabase provides database, authentication, and storage | Proposed |
| D-009 | Allow guest checkout and link purchases after purchase-email verification | Confirmed |
| D-010 | Customer accounts and full portal are included in the initial launch | Confirmed |
| D-011 | Generate a new one-hour signed URL for every authorized download | Confirmed |
| D-012 | Permanent portal entitlement and unlimited re-downloads for the purchased version | Confirmed |
| D-013 | Broad, perpetual, non-exclusive commercial source license permits use, modification, resale, and redistribution | Confirmed |
| D-014 | No discretionary or change-of-mind refunds; mandatory consumer remedies remain available | Confirmed intent, legal wording pending |
| D-015 | Ready-made systems include source code | Confirmed |
| D-016 | Original purchaser receives 30 days of installation and defect support; permanent purchased-version access; major versions sold separately | Confirmed |
| D-017 | Ethical student-service boundary as defined in this document | Confirmed |
| D-018 | Initial launch catalog structure: POS, Inventory, Warehouse, Capstone, Thesis-Related, and Custom Development | Confirmed |
| D-019 | Ready-made systems use fixed or starting prices; custom development uses quotation | Confirmed |
| D-020 | Suggest local display currency by visitor country and allow manual override | Confirmed |
| D-021 | PHP is canonical and default charge currency; localized displays are estimates; eligible USD cards require provider approval | Confirmed |
| D-022 | WebSystemBuilders retains original ownership and may continue selling the same non-exclusive systems | Confirmed |
| D-023 | Free support belongs to the original order and does not transfer to downstream resale customers | Confirmed |
| D-024 | Listed price includes source package, documentation, and 30-day support; customization and operational services are quoted separately | Confirmed |

## 16. Owner approval checklist

- [x] Confirm domain and brand
- [x] Confirm primary audiences
- [x] Confirm ready-made systems and custom development
- [x] Confirm admin-managed catalog
- [x] Confirm hosted payment and automated delivery goal
- [x] Confirm dark, minimal, professional design
- [x] Confirm ethical student-service boundary
- [x] Include customer accounts and the full portal in the initial launch
- [x] Allow guest checkout with verified-email account linking
- [x] Confirm initial launch catalog categories
- [ ] Select and prepare the actual systems available at launch
- [x] Confirm fixed or starting prices for ready-made systems
- [x] Confirm automatic localized currency display with manual override
- [x] Confirm PHP base pricing and actual settlement policy
- [ ] Confirm tax, invoice, sale, and processing-fee presentation
- [x] Select PayMongo as the initial payment provider
- [ ] Create and verify the PayMongo merchant account
- [ ] Activate required PayMongo payment methods and production webhooks
- [x] Confirm broad commercial source license
- [x] Include source code with ready-made systems
- [ ] Complete legal wording and third-party license audit
- [x] Confirm no discretionary or change-of-mind refunds
- [ ] Complete legal review and final refund-policy wording
- [x] Confirm permanent entitlement, unlimited re-downloads, and one-hour signed URLs
- [x] Confirm 30-day support and purchased-version update policy
- [x] Confirm product inclusions and separately quoted customization or operational services
- [ ] Supply or approve initial brand and company content
- [ ] Confirm legal-review plan for production policies

## 17. Phase 0 exit criteria

Phase 0 is complete when:

- MVP scope and sitemap are approved.
- Initial launch products are selected.
- Pricing and currency presentation are approved.
- Licensing, source-code, refund, delivery, support, and customization rules are approved.
- Payment-provider readiness is confirmed before any live-payment implementation or production launch.
- Required company, product, and trust content has an owner and delivery plan.
- No unresolved decision would materially change Phase 1 information architecture or design.

## 18. Next action

Review and resolve the unchecked approval items. Once decisions that affect page structure and product presentation are confirmed, Phase 1 can begin with the design system, responsive wireframes, and content hierarchy.