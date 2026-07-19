# WebSystemBuilders Agent Instructions

## Start here

Before planning or changing application code, read [`docs/WEBSITE_BLUEPRINT.md`](docs/WEBSITE_BLUEPRINT.md). Treat it as the project's product and technical source of truth.

If the requested work conflicts with the blueprint, identify the conflict and ask for an owner decision before changing architecture, business rules, payment behavior, licensing, or delivery policy.

## Current project state

The repository begins in the planning stage. Do not assume that the application, database, providers, or environment configuration already exist. Inspect the repository before every task and build on the actual current state.

## Product boundaries

- Serve students and business owners through clear audience paths.
- Keep student services ethical and avoid features or copy that promote academic dishonesty.
- Keep the public website, catalog, checkout, customer area, and admin dashboard in one Next.js application.
- Make the systems catalog database-driven and administrator-controlled.
- Treat ready-made products, custom development, and future SaaS subscriptions as distinct product models.
- Do not invent pricing, licensing, refunds, support promises, testimonials, customers, or company claims.

## Required architecture

- Use Next.js App Router, React, and TypeScript.
- Use Tailwind CSS and customized accessible UI primitives.
- Use Supabase PostgreSQL, Auth, and private Storage.
- Use PayMongo behind a server-only payment module.
- Use Resend behind a server-only email module.
- Keep the initial architecture a modular monolith.
- Keep domain logic out of page and presentation components.
- Use migrations for every database schema change.
- Validate inputs on the server with shared schemas.
- Never expose secrets or privileged Supabase credentials to client code.

Provider integrations must be isolated so they can be replaced without rewriting catalog, order, or fulfillment logic.

## Non-negotiable commerce rules

- Calculate authoritative prices on the server.
- Create a pending order before opening hosted checkout.
- Never treat the payment return URL as proof of payment.
- Verify payment webhooks and expected payment values.
- Make payment-event processing and fulfillment idempotent.
- Fulfill each paid order at most once.
- Store ZIP files privately.
- Deliver files through expiring, revocable access.
- Snapshot product name, version, price, currency, and license into order items.
- Store monetary values as integer minor units.
- Record payment, fulfillment, email, and download events.

## Authorization and data rules

- Check authorization on the server for every protected read and mutation.
- Apply Row Level Security to exposed Supabase tables.
- A customer may access only their own orders, downloads, and support records.
- An administrator may manage routine catalog and commerce data.
- Only a super administrator may manage administrator access and sensitive integration settings.
- Hiding a button is never sufficient authorization.
- Store timestamps in UTC.
- Avoid destructive data removal when an archive or status transition preserves history.

## Design rules

- Follow the dark, minimal, restrained design direction in the blueprint.
- Use hierarchy, typography, spacing, borders, and real product media before decorative effects.
- Avoid neon gradients, glowing cards, heavy shadows, excessive glass effects, and needless animation.
- Use accessible contrast, visible focus, semantic HTML, and reduced-motion support.
- Keep public pages spacious and editorial.
- Keep admin pages efficient, dense, and predictable.
- Verify primary interfaces at desktop and multiple mobile widths.

## Recommended source structure

- `src/app`: routes, layouts, route handlers, and page composition
- `src/components/ui`: shared primitives
- `src/components`: presentation grouped by surface
- `src/features`: domain-oriented catalog, orders, payments, delivery, inquiries, and content modules
- `src/lib`: provider clients, security, and validation foundations
- `src/emails`: transactional email components
- `supabase/migrations`: versioned database changes
- `tests`: unit, integration, and browser coverage as the project grows

Follow the real repository structure once the application is scaffolded. Do not create parallel implementations when an established module already owns the behavior.

## Working process

For every implementation task:

1. Inspect the current repository, route, data flow, and nearby tests.
2. Identify the smallest complete user-facing outcome.
3. State assumptions only when they are necessary and safe.
4. Preserve unrelated user changes in a dirty worktree.
5. Implement through existing modules and shared components.
6. Add or update validation, authorization, migrations, and tests as required.
7. Run the narrowest relevant checks before broader verification.
8. Perform a real browser smoke test for changed user journeys when runtime testing is available.
9. Check desktop, mobile, browser errors, empty states, loading states, and failures proportional to the change.
10. Report the outcome, verification, files changed, and any remaining risk.

Do not stop at a successful build when the request concerns visible behavior, checkout, delivery, or an admin workflow.

## Verification expectations

Once project scripts exist, use the repository's declared commands rather than inventing replacements. A typical change may require:

- Formatting or linting
- Type checking
- Relevant unit or integration tests
- Production build for high-risk or cross-cutting changes
- Browser smoke testing for user-facing flows
- Payment-provider test mode for checkout changes
- Email sandbox or safe test recipients for email changes
- Authorization checks for customer and administrator changes

Never trigger a real payment or send real customer data during automated verification.

## Documentation responsibilities

Update the blueprint when an approved decision materially changes:

- Product scope
- Architecture or providers
- Data ownership
- Routes or major modules
- Payment and delivery behavior
- Authorization roles
- Design direction
- Development phases or launch scope

Keep detailed product knowledge in the blueprint. Keep this file concise and procedural so agents can load it on every task.

## Git conventions

Use focused commits. Write commit messages in present tense with this format:

```text
<type>: <specific summary under 72 characters>

- Main change
- Main verification or supporting change
```

Common types: `feat`, `fix`, `refactor`, `style`, `docs`, and `chore`.

## Definition of done

Work is complete only when:

- The requested user-visible or operational outcome exists.
- The implementation follows the blueprint or records an approved change.
- Relevant authorization, validation, and error handling exist.
- Appropriate checks pass.
- Important runtime behavior is verified when possible.
- No secrets, fake trust claims, or public delivery URLs were introduced.
- The handoff clearly states what changed and what remains.
