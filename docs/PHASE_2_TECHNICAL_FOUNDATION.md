# Phase 2: Technical Foundation

## Status

**Active phase:** Phase 2 - Technical foundation  
**Started:** July 24, 2026  
**Target output:** A secure, migration-driven foundation for authentication, roles, the administrator-controlled catalog, and later commerce modules.

Phase 1 received owner approval on July 24, 2026. The existing public and admin pages remain interface previews until Phase 2 connects them to authenticated, database-backed workflows.

## 1. Confirmed technical direction

| Area | Phase 2 direction |
|---|---|
| Application | One Next.js App Router modular monolith using React and TypeScript |
| Styling | Tailwind CSS with the approved Phase 1 tokens and accessible primitives |
| Database and Auth | Supabase PostgreSQL and Auth |
| Data changes | Versioned SQL migrations only |
| Authorization | Server checks plus Row Level Security on every exposed table |
| Storage | Supabase private Storage with versioned bucket and object policies ready to apply |
| Payments | PayMongo behind a server-only adapter; no live integration until merchant onboarding |
| Email | Resend behind a server-only adapter; no production sending until domain configuration |
| Validation | Shared Zod schemas with authoritative validation on the server |
| Deployment | Vercel preview and production environments after provider setup |

## 2. Foundation now in the repository

- Validated public and server-only environment boundaries.
- Separate Supabase browser, server-cookie, and service-role clients.
- Verified-user authentication helper using Supabase Auth.
- Passwordless email sign-in UI, sanitized callback redirects, and a code-exchange route.
- Next.js session-refresh proxy using verified JWT claims.
- Server-side administrator layout protection with a fail-closed production state.
- Administrator and super-administrator role hierarchy.
- Initial identity and catalog migration with RLS-first access policies.
- Administrator-managed launch categories seeded from the approved Phase 0 structure.
- Catalog prices represented as integer minor units in canonical currency.
- Private deliverable-file metadata with no public read policy.
- Unit tests for environment validation, roles, catalog money, draft validation, and migration security invariants.
- Database-backed public catalog, dynamic published-system pages, and explicit unavailable/error states.
- Administrator catalog list, validated private system-draft creation, and existing-record editing.
- A second migration for manual sale state, private Storage buckets, object policies, and system audit triggers.
- A fail-closed publication action that checks product copy, features, media, and deliverable readiness before exposing a record.

## 3. Initial schema boundary

The migrations currently own identity, catalog, and private Storage foundations:

- Customer profiles
- Administrator roles
- Categories
- Systems, prices, publishing states, and content
- Features and product media
- Versions and private file metadata
- Audit-log foundation

Orders, payments, fulfillment, emails, downloads, inquiries, and support receive separate migrations in the phases that implement their complete workflows. This avoids a partial commerce schema being mistaken for working checkout or delivery.

## 4. Security rules

- Browser code receives only the Supabase project URL and publishable key.
- The service-role key is imported through a server-only module.
- Protected application operations must call server authorization helpers.
- Proxy refreshes authentication cookies but never replaces server or RLS authorization.
- Authentication redirects accept internal application paths only.
- RLS remains the database enforcement layer for exposed tables.
- Public users may read only active categories and published catalog records.
- Routine administrators may manage catalog data.
- Only super administrators may grant or revoke administrator access.
- Deliverable file rows are not publicly readable.
- Product media and deliverable buckets remain private; only administrators receive direct object-management policies.
- Customer delivery will use a later server eligibility check before creating a short-lived signed URL.
- The first super administrator must be bootstrapped through a trusted server or Supabase administrative workflow.

## 5. External setup gates

The owner has not created the Supabase, PayMongo, or Resend production configuration yet. Local interface work can continue, but these actions require the relevant accounts and credentials:

- Create separate Supabase development and production projects.
- Copy the Supabase URL and publishable key into local/host environment settings.
- Set the canonical SITE_URL and allow its /auth/callback URL in Supabase Auth redirects.
- Keep the service-role key in server-only secret storage.
- Link the Supabase CLI and apply migrations.
- Generate database types after the migration is applied.
- Apply the private Storage bucket and policy migration to the configured projects.
- Complete PayMongo merchant onboarding before live checkout.
- Configure a verified Resend sending domain before production email.

Never commit real credentials. Use [`.env.example`](../.env.example) only as a key-name reference.

## 6. Phase 2 checklist

- [x] Receive final Phase 1 owner approval
- [x] Add Supabase SSR, database-client, validation, and test dependencies
- [x] Add validated public and server-only environment modules
- [x] Separate browser, server-session, and service-role clients
- [x] Add verified-user and role-authorization helpers
- [x] Add the initial identity/catalog migration
- [x] Enable RLS and define public, administrator, and super-administrator policies
- [x] Seed the approved administrator-managed launch categories
- [x] Add focused environment, role, and migration-contract tests
- [ ] Create and link Supabase development and production projects
- [ ] Apply the migration and generate database types
- [x] Add session-refresh proxy and authentication pages
- [x] Protect administrator routes on the server
- [x] Replace preview catalog data with repository-backed queries
- [x] Connect initial system-draft creation to a validated, authorized server mutation
- [x] Connect existing-system editing and guarded publication mutations
- [ ] Connect feature, media, version, and private-file management mutations
- [x] Add private Storage buckets and administrator object policies through a migration
- [ ] Apply and verify the private Storage migration in configured projects
- [ ] Add integration tests against a configured test project

## 7. Phase 2 exit criteria

Phase 2 is complete when:

- Supabase development and production projects are configured separately.
- All migrations apply cleanly from an empty database.
- Generated database types are committed and used by the data layer.
- Authentication refresh works through secure cookies.
- Admin routes reject unauthenticated and unauthorized users on the server.
- A super administrator can grant routine administrator access.
- Public catalog reads return only published data.
- Admin catalog mutations validate input and pass RLS.
- Private file objects cannot be read without an authorized server flow.
- Automated checks and real browser smoke tests cover authentication and catalog access.

## 8. Next action

Create the Supabase development project, configure its allowed callback URL, and add local credentials. Then apply the migration, generate database types, bootstrap the first super administrator through a trusted workflow, and run live authentication/RLS integration tests.
