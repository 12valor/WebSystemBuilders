# WebSystemBuilders

WebSystemBuilders is a marketplace and custom-development platform for students and business owners.

## Application

The application uses Next.js App Router, React, TypeScript, and Tailwind CSS.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Supabase clients load configuration only when a database-backed feature calls them, so the Phase 1 previews can still build before local credentials are added.

The email sign-in interface is available at /auth/sign-in. Without Supabase credentials it shows an explicit unavailable state and sends no email. Local development keeps the approved admin preview visible; a production environment without authentication configuration keeps /admin closed.

The public systems catalog and published-system routes now read through server repositories. The admin editor creates and edits validated private records, manages features and media, creates versions, and uploads ZIP deliverables directly to private Storage through short-lived signed tokens. Publication remains a separate server-side readiness gate.

Phase 3 adds administrator-driven homepage catalog sections plus dedicated public routes for students, business owners, custom development, process, about, and portfolio. Sitemap and robots metadata include only implemented public pages and published systems.

Contact and quotation forms use shared server validation, hashed rate-limit identifiers, and a private administrator-only inquiry table. Without complete server configuration, the forms remain visibly unavailable and do not send or store information. FAQ and pre-launch policy summaries expose approved product direction without presenting pending legal text as production-ready.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Project documentation

- [`docs/WEBSITE_BLUEPRINT.md`](docs/WEBSITE_BLUEPRINT.md) - product and technical source of truth
- [`docs/PHASE_0_PRODUCT_DEFINITION.md`](docs/PHASE_0_PRODUCT_DEFINITION.md) - approved product decisions and production gates
- [`docs/PHASE_1_DESIGN_FOUNDATION.md`](docs/PHASE_1_DESIGN_FOUNDATION.md) - approved design foundation and responsive wireframes
- [`docs/PHASE_2_TECHNICAL_FOUNDATION.md`](docs/PHASE_2_TECHNICAL_FOUNDATION.md) - technical foundation, schema boundary, and setup gates
- [`docs/PHASE_3_PUBLIC_WEBSITE.md`](docs/PHASE_3_PUBLIC_WEBSITE.md) - active public website routes, content rules, and remaining work
- [`assets/brand/BRAND_GUIDELINES.md`](assets/brand/BRAND_GUIDELINES.md) - approved logo and brand usage
- [`supabase/migrations`](supabase/migrations) - versioned database changes
- [src/app/account/page.tsx](src/app/account/page.tsx) - configuration-aware customer account direction
- [src/app/auth/sign-in/page.tsx](src/app/auth/sign-in/page.tsx) - passwordless email sign-in interface

**Current phase:** Phase 3 - Public website (Phase 2 provider verification remains pending)
