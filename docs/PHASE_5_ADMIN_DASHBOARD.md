# Phase 5: Admin Dashboard

## Status

**Active workstream:** Phase 5 - Admin dashboard  
**Started:** July 25, 2026  
**Dependency note:** Administrator operations can be implemented locally, but live authentication, Row Level Security, Storage, and audit verification remain pending owner-provided Supabase configuration. Order, payment, and fulfillment operations must not be simulated before Phases 6 and 7 create their durable records.

## 1. Target outcome

Deliver a secure, database-driven workspace where authorized administrators can understand operational state and manage routine catalog data without editing code. The workspace must show honest empty, unavailable, and dependency states instead of invented sales, customers, or delivery activity.

## 2. Operating rules

- Authorize every protected read and mutation on the server and retain RLS as the database enforcement layer.
- Allow routine administrators to manage catalog and operational records; reserve administrator access and sensitive integration settings for super administrators.
- Archive or change status instead of deleting records when history or references must be preserved.
- Validate every mutation through shared server schemas.
- Record administrator changes in the audit trail without storing secrets or unrestricted form payloads.
- Use real database counts only. Never seed or display fake sales, orders, customers, inquiries, failures, or testimonials.
- Keep unfinished commerce and delivery modules visibly unavailable until their owning phases exist.
- Keep admin layouts dense, predictable, keyboard accessible, and responsive at the approved breakpoints.

## 3. Phase checklist

### Operational foundation

- [x] Authenticated administrator shell with truthful implemented navigation
- [x] Database-backed overview for catalog and inquiry state
- [x] Recent administrator activity summary
- [x] Explicit order, payment, and delivery dependency states
- [x] Loading, empty, unconfigured, and query-failure states

### Catalog operations

- [x] Existing system list, editor, resources, publication checks, media, versions, and private files
- [x] Category list with active and archived records
- [x] Validated category creation and editing
- [x] Safe category archiving that preserves linked catalog records
- [x] Category and system database audit events
- [ ] System duplication and explicit archive or unpublish controls
- [ ] Cross-catalog media workspace

### Operational records

- [x] Inquiry queue, assignment, status changes, and operational history
- [ ] Outbound response delivery and message history after Resend and domain email are configured
- [ ] Order and payment operations after Phase 6 creates the commerce workflow
- [ ] Delivery, resend, revocation, and event operations after Phase 7 creates fulfillment
- [ ] Customer history after durable orders and verified account linking exist

### Content and administration

- [ ] Portfolio, FAQ, featured-content, announcement, company, and contact management
- [ ] Super-administrator access management
- [ ] Super-administrator settings and integration-health views
- [x] Read-only searchable audit-log view with safe metadata summaries

## 4. Initial implemented routes

| Route | Capability |
|---|---|
| `/admin` | Real catalog and inquiry overview, recent activity, and dependency state |
| `/admin/systems` | System records, filters, status totals, and editor entry |
| `/admin/systems/new` | Validated private system draft creation |
| `/admin/systems/[id]/edit` | Catalog, pricing, media, versions, files, and publication management |
| `/admin/categories` | Category creation, editing, ordering, activation, and safe archiving |
| `/admin/inquiries` | Searchable request queue, complete request review, assignment, status, and history |
| `/admin/audit-log` | Read-only recent administrator activity |

Routes listed in the overall sitemap but not present in this table remain planned. They must not be linked as completed operations.

## 5. Category integrity rules

1. Category slugs remain unique and URL-safe.
2. Sort order is a non-negative integer.
3. A category audience may change only when all linked systems remain compatible.
4. A category cannot be archived while it is assigned to a non-archived system; administrators must move or archive those systems first.
5. Category removal is a status change through `is_active`, not a destructive delete.
6. Creation and update events record only the category identity and operational state needed for audit review.

## 6. Dependency boundary

Phase 5 may summarize existing inquiry and catalog records. It does not create placeholder order, payment, customer, fulfillment, email, or download records. Those modules become actionable only after their owning schemas and idempotent workflows are implemented and tested.

## 7. Verification

Each completed operation requires schema validation tests, migration-contract tests when the database changes, lint, type checking, the full unit suite, a production build, and route-level smoke checks. Live mutation, RLS, and audit verification remain a named provider gate until the Supabase projects are configured.

## 8. Exit criteria

Phase 5 exits when all applicable checklist items are complete, administrator and super-administrator boundaries are verified in a configured project, routine operational mutations produce safe audit events, primary desktop and mobile workflows are verified, and no route presents an unfinished commerce dependency as functional.

## 9. Next action

Continue with remaining catalog controls, content management, and super-administrator settings. Add outbound inquiry email only after Resend and the domain mailbox are configured. Add order and delivery administration only through the durable workflows created in Phases 6 and 7.
