# Phase 3: Public Website

## Status

**Local implementation:** Core public routes complete; production gates remain
**Started:** July 24, 2026  
**Dependency note:** Phase 2 code foundations are implemented, but live Supabase migration, authentication, RLS, and Storage verification remain pending owner-provided projects and credentials.

Phase 4 catalog work is active. Phase 3 production inquiry persistence, email, business contact details, and final legal wording remain gated by provider configuration and owner or legal review.

## 1. Target outcome

Deliver a trustworthy, responsive public website that gives students and business owners distinct paths, explains ready-made and custom-development services, and routes visitors into administrator-controlled catalog content or an honest inquiry path.

## 2. Content rules

- Use only approved company, founder, service, delivery, licensing, refund, and support statements.
- Position student work as ethical technical development and guidance.
- Do not invent clients, projects, testimonials, metrics, awards, credentials, contact details, or availability.
- Keep unpublished catalog records and private media unavailable to public routes.
- Show explicit empty or configuration states instead of placeholder products.

## 3. Initial public route checklist

- [x] Homepage with two audience paths and approved design foundation
- [x] Administrator-driven featured systems and categories on the homepage
- [x] `/for-students`
- [x] `/for-business`
- [x] `/services/custom-development`
- [x] `/process`
- [x] `/about`
- [x] `/portfolio` with an honest no-published-case-studies state
- [x] `/contact` and `/request-a-quote` inquiry workflows with safe unconfigured states
- [x] `/faq`
- [x] Pre-launch legal summaries with noindex protection
- [ ] Production-approved legal wording and review
- [x] Public sitemap, robots rules, canonical metadata, and website structured data

## 4. Public navigation

Primary navigation follows the blueprint routes:

1. Systems
2. For students
3. For business
4. Custom development
5. Process
6. About
7. Account
8. Request a quote

## 5. Verification

Each completed route must pass lint, type checking, production build, HTTP smoke checks, mobile-safe responsive composition, semantic heading review, keyboard focus behavior, and noindex checks for protected or preview-only routes.

## 6. External dependencies

The homepage catalog can render only after Supabase is configured and an administrator publishes real records. Inquiry persistence and production email require the later inquiry schema plus configured Supabase and Resend services.

## 7. Next action

Apply the inquiry migration and verify persistence after the owner provides Supabase configuration. Finalize production policy wording only after legal review, then continue the remaining catalog and commerce phases.
