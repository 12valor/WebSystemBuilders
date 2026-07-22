# Phase 1: Design Foundation

## Status

**Active phase:** Phase 1 — Design foundation
**Started:** July 22, 2026
**Target output:** Approved visual tokens, component rules, responsive wireframes, content hierarchy, and state behavior ready for Phase 2 implementation.

Phase 0 is complete for design progression. Business registration, legal review, PayMongo activation, actual system uploads, and final production content remain required production gates; they do not authorize placeholder claims or live commerce during design work.

## 1. Objective

Create a cohesive interface foundation for the public website, catalog, checkout, customer portal, and admin dashboard before application scaffolding begins. The design must feel dark, minimal, seamless, modern, and professional while remaining accessible and practical on mobile devices.

## 2. Locked inputs from Phase 0

| Area | Approved direction |
|---|---|
| Brand | WebSystemBuilders with the approved modular W identity |
| Audiences | Students and business owners with distinct entry paths |
| Initial models | Ready-made systems and custom development |
| Catalog | Database-driven and administrator-controlled |
| Customer access | Guest checkout plus verified-email account linking and full portal |
| Pricing | Fixed or starting prices, manual sales, localized display estimates, PHP settlement default |
| Checkout | Hosted provider checkout after server-created pending order |
| Delivery | Private files through verified orders and one-hour signed links |
| Visual direction | Dark, restrained, editorial public pages; efficient and dense admin pages |
| Founder presentation | Brand first, then AG Evangelista — Web Developer, without a photograph |

## 3. Design principles

1. **Clarity before decoration.** Every section must communicate purpose, next action, and important limitations without visual noise.
2. **Trust through evidence.** Prefer real product media, precise inclusions, version details, policies, and process explanations over unsupported claims.
3. **One visual language, different density.** Public, customer, and admin surfaces share tokens while using spacing and information density appropriate to their tasks.
4. **Progressive disclosure.** Show essential decisions first and reveal technical, legal, and operational detail when requested.
5. **Responsive by composition.** Reorder and simplify layouts on small screens instead of shrinking desktop arrangements.
6. **Accessible by default.** Keyboard use, focus visibility, contrast, labels, semantic structure, error recovery, and reduced motion are part of the design.

## 4. Brand usage

Production assets live in [`../assets/brand`](../assets/brand).

- Use `websystembuilders-logo-on-dark.svg` in the primary public header.
- Use the standalone mark for compact navigation and account surfaces.
- Use `favicon.svg` for browser identity.
- Use the cobalt connecting stroke sparingly as the primary accent.
- Do not add glow, gradients, bevels, shadows, or decorative animation to the logo.

## 5. Color tokens

These tokens are design inputs. Phase 2 must implement them as semantic CSS variables and verify contrast in the browser.

| Semantic token | Value | Intended use |
|---|---:|---|
| `background` | `#08090A` | Primary public canvas |
| `surface` | `#111214` | Cards, grouped fields, panels |
| `surface-raised` | `#17181B` | Menus, dialogs, elevated controls |
| `surface-subtle` | `#0D0E10` | Quiet section alternation |
| `text-primary` | `#F5F5F7` | Headings and primary content |
| `text-secondary` | `#A1A1AA` | Supporting content |
| `text-muted` | `#71717A` | Metadata and disabled context |
| `border` | `rgba(255,255,255,0.09)` | Standard separation |
| `border-strong` | `rgba(255,255,255,0.16)` | Active or emphasized separation |
| `accent` | `#3B82F6` | Links, selected states, focused brand moments |
| `accent-hover` | `#60A5FA` | Hover and emphasized accent state |
| `accent-contrast` | `#07111F` | Text placed on light accent fills |
| `success` | `#34D399` | Paid, delivered, published, resolved |
| `warning` | `#FBBF24` | Pending, expiring, attention required |
| `danger` | `#F87171` | Failed, revoked, destructive confirmation |
| `info` | `#60A5FA` | Neutral operational information |

Status colors must always be paired with text and, when useful, an icon.

## 6. Typography

Use Geist with system sans-serif fallbacks.

| Role | Responsive size | Weight | Notes |
|---|---|---:|---|
| Display | `clamp(2.75rem, 7vw, 5.5rem)` | 600 | Homepage hero only; controlled line length |
| H1 | `clamp(2.25rem, 5vw, 4rem)` | 600 | Primary page heading |
| H2 | `clamp(1.75rem, 3.5vw, 3rem)` | 600 | Major section heading |
| H3 | `1.25rem–1.5rem` | 600 | Card and subsection heading |
| Body large | `1.125rem` | 400 | Introductory copy |
| Body | `1rem` | 400 | Default content and forms |
| Small | `0.875rem` | 400–500 | Supporting metadata |
| Label | `0.8125rem` | 500–600 | Form labels and compact admin UI |

- Keep public copy between 55 and 72 characters per line where practical.
- Use sentence case for headings and controls.
- Avoid all-caps body labels; reserve uppercase for short metadata only.
- Use tabular numerals for prices, order values, and admin metrics.

## 7. Layout and spacing

### Breakpoint verification set

| Name | Width | Design purpose |
|---|---:|---|
| Small mobile | `360px` | Minimum supported composition |
| Standard mobile | `390px` | Primary phone design |
| Tablet | `768px` | Stacked-to-split transition |
| Small desktop | `1024px` | Compact desktop navigation and grids |
| Desktop | `1280px` | Primary desktop canvas |
| Wide desktop | `1440px` | Maximum-content and whitespace check |

### Containers and spacing

- Public content max-width: `1280px`; reading content: `720px`; checkout: `1080px`.
- Admin pages use the viewport with stable navigation and constrained form columns.
- Horizontal gutters: `20px` mobile, `32px` tablet, `48px` desktop.
- Use a 4px spacing base with `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.
- Public section spacing: `72–128px` desktop and `48–80px` mobile.
- Card padding: `24–32px` public and `16–24px` admin.
- Form controls are at least `44px`; primary mobile actions generally use `48px`.

### Shape and elevation

- Small radius: `8px`; standard: `12px`; large editorial: `16px`.
- Reserve full pills for compact statuses or filter chips.
- Use borders and surface contrast before shadows.
- Dialogs and menus may use one restrained shadow for separation.

## 8. Component rules

| Component | Required behavior |
|---|---|
| Header | Persistent brand and primary navigation; compact mobile menu; no oversized floating capsule |
| Audience switch | Clear Student and Business routes without treating either as secondary |
| Button | Primary, secondary, ghost, and destructive variants; visible focus; loading state; no layout shift |
| Link | Descriptive text, visible focus, non-color affordance in body copy |
| Input | Persistent label, hint/error region, server-compatible errors, autofill-safe styling |
| Select/combobox | Keyboard operation, selected value, loading and empty states |
| Product card | Real media area, audience/category, title, pricing mode, concise features, one primary action |
| Price display | Regular/starting/quotation state, localized estimate marker, actual charge-currency context |
| Sale price | Manual active state; sale prominent and regular price visibly marked as comparison |
| Status badge | Text plus color; consistent status vocabulary |
| Data table | Sort, filters, pagination, row actions, mobile fallback, empty/loading/error states |
| Dialog | Explicit title and consequence; focus trap; Escape behavior; destructive confirmation when needed |
| Toast | Short feedback only; never the sole location of critical error recovery |
| Skeleton | Match final layout and respect reduced motion |
| Empty state | Explain why empty, next action, and one primary action when appropriate |
| Error state | Plain-language cause when safe, recovery action, preserved inputs, support reference when needed |

## 9. Content hierarchy

### Public navigation

1. Systems
2. For Students
3. For Business
4. Custom Development
5. Process
6. About
7. Contact
8. Account

On mobile, keep Systems and Request a Quote easy to reach. Legal and secondary routes remain in the footer or contextual navigation.

### Homepage hierarchy

1. Brand promise and two audience paths
2. Featured systems populated by admin data
3. Ready-made systems versus custom development
4. Student and business use cases
5. Purchase and development process
6. Evidence and trust disclosures
7. Final catalog and quote calls to action

### System detail hierarchy

1. Product identity, audience, pricing mode, and primary action
2. Screenshots or demo
3. Outcomes and core features
4. Package inclusions and exclusions
5. Technology, requirements, version, and update date
6. License, support, delivery, and refund summary
7. Related systems or custom-development alternative

## 10. Responsive wireframes

These wireframes establish structure and order, not final styling.

### Homepage

```text
DESKTOP
[Logo] [Systems] [Students] [Business] [Process] [About]    [Account] [Request quote]

[Eyebrow]
[Primary value statement................]  [Real product/interface visual]
[Supporting copy........................]  [or featured-system media]
[Browse systems] [Request custom system]
[Student path] [Business path]

[Featured systems: 3-column data-driven grid]
[Ready-made vs custom development: split explanation]
[Student use cases] [Business use cases]
[How it works: discover -> evaluate -> purchase/request -> receive]
[Trust and policy links]
[Final CTA]
[Footer]

MOBILE
[Logo]                                      [Menu]
[Eyebrow]
[Primary value statement]
[Supporting copy]
[Browse systems]
[Request custom system]
[Student path]
[Business path]
[Featured systems: stacked cards]
[Remaining sections in the same semantic order]
[Footer]
```

### Systems catalog

```text
DESKTOP
[Page title and catalog explanation]
[Search...................................] [Audience] [Category] [Pricing] [Sort]
[Active filter chips]                                     [Result count]
[Filter sidebar] [System grid: 3 columns.................................]
[Pagination or explicit load more]

MOBILE
[Page title]
[Search]
[Filters button] [Sort]
[Active filter chips]
[System cards: 1 column]
[Filter drawer with Apply and Clear]
```

### System detail

```text
DESKTOP
[Breadcrumb]
[Media gallery..........................] [Audience / category]
[.......................................] [System title]
[.......................................] [Price / starting / quote]
[.......................................] [Primary action]
[.......................................] [Delivery and support summary]
[Overview and features]
[Inclusions] [Requirements]
[License] [Support] [Delivery] [Refund summary]
[Related systems]

MOBILE
[Breadcrumb]
[Media gallery]
[Audience / category]
[System title]
[Price and charge-currency note]
[Primary action]
[Key trust summary]
[Details sections]
```

### Checkout

```text
DESKTOP
[Checkout header: logo + secure-checkout context]
[Customer and order form................] [Order summary]
[Email / name / consent.................] [System, version, license]
[Payment handoff explanation............] [Authoritative total]
[Continue to secure payment]
[Delivery, refund, and support links]

MOBILE
[Checkout header]
[Order summary disclosure]
[Customer details]
[Required acknowledgements]
[Authoritative total]
[Continue to secure payment]
```

### Customer account

```text
DESKTOP
[Account navigation] [Overview / orders / downloads / support]
[Order status and recent activity]
[Available downloads with version and access action]
[Support cases]

MOBILE
[Compact account header]
[Section tabs or menu]
[Stacked order cards]
[Full-width download and support actions]
```

### Admin systems list

```text
DESKTOP
[Admin sidebar] [Systems title] [Create system]
                [Search] [Status] [Audience] [Category]
                [Dense table: system / price / version / status / updated / actions]
                [Pagination]

MOBILE/TABLET
[Admin top bar] [Menu]
[Systems title] [Create]
[Search]
[Filter drawer]
[Stacked records with status, price, updated date, and actions]
```

### Admin system editor

```text
DESKTOP
[Admin sidebar] [System name] [Save draft] [Preview] [Publish]
                [Section navigation] [Editor form........................]
                [Basic info]        [Persistent validation summary]
                [Media]
                [Features]
                [Pricing and manual sale]
                [Files and versions]
                [License / support / delivery]
                [SEO]

MOBILE/TABLET
[Back] [System status] [Actions]
[Section selector]
[Single-column form]
[Keyboard-safe save action]
```

## 11. Required interface states

Every primary surface must define loading, empty, validation failure, authorization failure, provider or network failure, successful completion, and a retry or recovery path.

Commerce statuses: `pending`, `paid`, `failed`, `expired`, `refunded`, and `disputed`. Delivery statuses: `not started`, `processing`, `available`, `failed`, and `revoked`.

## 12. Motion and interaction

- Standard transitions: `180–240ms`.
- Animate opacity and small position changes only when they clarify state.
- Avoid animated backgrounds, cursor effects, floating decorations, and parallax.
- Respect `prefers-reduced-motion`.
- Never delay navigation, content, checkout, or delivery for animation.

## 13. Accessibility acceptance criteria

- Semantic headings and landmarks.
- Complete keyboard access with visible focus.
- Text alternatives for meaningful media.
- Labels and instructions outside placeholders.
- Errors connected to fields and summarized for long forms.
- Touch targets at least 44 by 44 CSS pixels where practical.
- Color is not the sole state indicator.
- Essential actions remain available at 200% zoom.
- Reduced-motion preferences are honored.
- Contrast is tested on rendered components before approval.

## 14. Phase 1 deliverables

- [x] Approve initial brand identity and variants
- [x] Define semantic color direction
- [x] Define typography scale and usage
- [x] Define layout, spacing, radius, and elevation rules
- [x] Define shared component behavior
- [x] Define public content hierarchy
- [x] Create structural responsive wireframes for primary surfaces
- [x] Define required loading, empty, failure, and success states
- [ ] Create high-fidelity homepage direction
- [ ] Create high-fidelity catalog and system-detail direction
- [ ] Create high-fidelity checkout direction
- [ ] Create high-fidelity admin direction
- [ ] Verify high-fidelity work at 360px, 390px, 768px, 1024px, 1280px, and 1440px
- [ ] Verify contrast, focus, and reduced-motion behavior in an interactive prototype or Phase 2 implementation
- [ ] Obtain owner approval for the final Phase 1 direction

## 15. Phase 1 exit criteria

Phase 1 is complete when:

- The high-fidelity direction reflects the approved dark, minimal brand.
- Public, catalog, checkout, customer, and admin surfaces share a coherent system.
- Primary journeys have approved desktop and mobile compositions.
- Component states and responsive behavior are clear enough for Phase 2.
- Accessibility requirements are part of the design.
- No unresolved design decision would materially restructure Phase 2.

## 16. Next action

Create the high-fidelity homepage direction first using the approved logo, tokens, content hierarchy, and responsive homepage wireframe. Validate desktop and mobile compositions before extending the visual language to catalog, checkout, customer, and admin surfaces.