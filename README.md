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
- [`docs/PHASE_2_TECHNICAL_FOUNDATION.md`](docs/PHASE_2_TECHNICAL_FOUNDATION.md) - active technical foundation, schema boundary, and setup gates
- [`assets/brand/BRAND_GUIDELINES.md`](assets/brand/BRAND_GUIDELINES.md) - approved logo and brand usage
- [`supabase/migrations`](supabase/migrations) - versioned database changes
- [src/app/account/page.tsx](src/app/account/page.tsx) - non-persistent customer account direction

**Current phase:** Phase 2 - Technical foundation
