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
- [x] System duplication and explicit archive or unpublish controls
- [x] Cross-catalog media workspace

### Operational records

- [x] Inquiry queue, assignment, status changes, and operational history
- [ ] Outbound response delivery and message history after Resend and domain email are configured
- [ ] Order and payment operations after Phase 6 creates the commerce workflow
- [ ] Delivery, resend, revocation, and event operations after Phase 7 creates fulfillment
- [ ] Customer history after durable orders and verified account linking exist

### Content and administration

- [x] FAQ creation, editing, publication, archiving, and public rendering
- [x] Portfolio creation, editing, featuring, publication, archiving, and public rendering
- [x] Authentic testimonial creation, private verification, permission-gated publication, featuring, archiving, and homepage rendering
- [x] Draft-first homepage feature and site-wide announcement management
- [ ] Company and contact management
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
| `/admin/media` | Searchable cross-catalog media review, signed previews, ownership links, and safe removal |
| `/admin/content` | FAQ, portfolio, verified testimonials, homepage features, and announcement publication workflows |
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

## 6. System lifecycle rules

1. Duplication creates a new private draft with a unique slug and no publication state.
2. Product copy, pricing, features, and external media references may be copied.
3. Uploaded media objects, versions, and private deliverable files are never shared with a duplicate.
4. Unpublishing changes a published system to Unlisted and immediately removes it from public catalog reads.
5. Archiving changes status without deleting the record, resources, or audit history.
6. Lifecycle mutations use the last saved record and reject stale concurrent updates.

## 7. Cross-catalog media rules

1. The media workspace reads only database-owned catalog metadata and never lists raw Storage objects without a matching media record.
2. Uploaded image previews use short-lived signed URLs and never expose a permanent public object URL.
3. Every media item retains an owning system; uploads, ordering, and metadata edits remain in that system's editor.
4. Global removal uses the same server-authorized ownership and published-system safeguards as the system editor, and media mutations emit safe audit events.
5. Missing alternative text and unavailable signed previews are visible operational issues rather than silently hidden assets.

## 8. FAQ content rules

1. Existing verified FAQ policy copy is preserved as the initial published dataset; no testimonials, clients, or outcome claims are seeded.
2. New FAQ records begin as private drafts and appear publicly only after explicit publication.
3. Archiving removes an FAQ from public reads without deleting its record or audit history.
4. Public FAQ reads are database-driven when Supabase is configured and retain the verified baseline only as an unconfigured or query-failure fallback.
5. Mutations validate content on the server, reject stale concurrent edits, and record status-only audit metadata without storing answer text.

## 9. Portfolio content rules

1. Portfolio records are never seeded; administrators must supply real project scope and approved public details.
2. Every entry begins as a private draft and becomes public only through explicit publication.
3. Outcome text and external project links are optional so missing evidence never pressures administrators to invent claims.
4. Public links must use HTTPS, featured status affects ordering only, and archived records disappear from public reads without deletion.
5. Mutations validate content on the server, reject stale concurrent edits, and audit only safe identity and lifecycle metadata.

## 10. Testimonial content rules

1. Testimonials are never seeded or generated; administrators must enter authentic customer statements from retained source evidence.
2. Public-safe testimonial content is stored separately from the administrator-only verification reference and permission record.
3. Every testimonial begins as a private draft, and database enforcement blocks publication until explicit customer permission is confirmed.
4. Public reads select only published testimonial fields and never read or return the private verification table.
5. Mutations are atomic, server-validated, concurrency-safe, and audited with lifecycle metadata only; archiving preserves the statement and evidence without destructive deletion.

## 11. Homepage feature and announcement rules

1. Content blocks are never seeded; an empty or unconfigured database produces no announcement or editorial feature.
2. Every block begins as a private draft, and only one record per placement may be published at a time.
3. Announcements use a concise message and optional internal action; homepage features require an eyebrow, title, and supporting copy.
4. Calls to action are restricted to internal website paths so administrator content cannot create an external redirect.
5. Archiving removes content from public routes without deletion, stale concurrent edits are rejected, and audit events exclude public copy.

## 12. Dependency boundary

Phase 5 may summarize existing inquiry and catalog records. It does not create placeholder order, payment, customer, fulfillment, email, or download records. Those modules become actionable only after their owning schemas and idempotent workflows are implemented and tested.

## 13. Verification

Each completed operation requires schema validation tests, migration-contract tests when the database changes, lint, type checking, the full unit suite, a production build, and route-level smoke checks. Live mutation, RLS, and audit verification remain a named provider gate until the Supabase projects are configured.

## 14. Exit criteria

Phase 5 exits when all applicable checklist items are complete, administrator and super-administrator boundaries are verified in a configured project, routine operational mutations produce safe audit events, primary desktop and mobile workflows are verified, and no route presents an unfinished commerce dependency as functional.

## 15. Next action

Continue with company, contact, and super-administrator settings. Add outbound inquiry email only after Resend and the domain mailbox are configured. Add order and delivery administration only through the durable workflows created in Phases 6 and 7.
