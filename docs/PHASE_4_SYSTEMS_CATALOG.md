# Phase 4: Systems Catalog

## Status

**Active workstream:** Phase 4 - Systems catalog  
**Started:** July 25, 2026  
**Dependency note:** Catalog code can continue locally, but live database, Storage, RLS, and administrator publishing verification remain pending owner-provided Supabase configuration.

## 1. Target outcome

Deliver a database-driven catalog where visitors can discover published systems, evaluate real product media and boundaries, understand pricing, and continue toward a later secure checkout or a defined quotation request.

## 2. Catalog rules

- Show only administrator-published records.
- Never substitute hardcoded products when the live catalog is empty or unavailable.
- Keep authoritative money in integer minor units and PHP as the launch base currency.
- Show fixed, starting, quotation, and active-sale pricing truthfully.
- Keep private deliverable files inaccessible from public catalog routes.
- Expose published product media only through time-limited access or approved HTTPS links.
- Do not invent demos, screenshots, features, technology stacks, versions, reviews, or availability.

## 3. Phase checklist

- [x] Database-driven `/systems` catalog
- [x] Search, audience, category, pricing, and sort controls
- [x] URL-driven audience and category entry filters
- [x] Published `/systems/[slug]` routes with safe unavailable states
- [x] Administrator-managed features, media, versions, and private deliverables
- [x] Public product gallery using published screenshots and media links
- [x] Public feature list, demo links, and current-version disclosure
- [x] Active-sale and regular-price comparison
- [x] Related published systems
- [x] Dedicated technology-stack, delivery, demo-instruction, and SEO fields
- [x] Localized estimated display currency with manual override
- [ ] Live Supabase and Storage policy verification
- [ ] Checkout entry point, implemented in the payment and ordering phase

## 4. Current limitations

- No real system records have been supplied or published yet.
- Supabase credentials and migrations are not applied in a live project.
- Localized estimates depend on the cached Frankfurter service; provider failures intentionally fall back to authoritative PHP prices.
- Checkout remains intentionally unavailable until the order and PayMongo phases.

## 5. Exit criteria

Phase 4 exits when published systems can be searched, filtered, evaluated through complete product details and real media, and routed to the appropriate purchase or quotation path; automated checks pass; and live database and private/public Storage boundaries are verified.

## 6. Next action

Apply the catalog migrations to the owner-provided Supabase project, publish owner-supplied product records, and verify live database, RLS, signed media, and private deliverable boundaries before Phase 4 exits.
