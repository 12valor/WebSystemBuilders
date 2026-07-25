# Phase 9 - Quality hardening

## 1. Outcome

Phase 9 strengthens the locally implemented application against common browser, indexing, abuse, accessibility, and failure-mode risks. It does not replace configured-provider testing, an independent security review, legal review, or real-device accessibility testing.

## 2. Security headers

All application responses receive:

- A Content Security Policy restricting the default source to the application, blocking objects and framing, constraining forms, and limiting connection origins
- `Strict-Transport-Security` for HTTPS production use
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- A restrictive Permissions Policy
- `Cross-Origin-Opener-Policy: same-origin`
- No framework-identification header

The CSP permits inline scripts and styles required by the current Next.js rendering model. A nonce-based CSP is a future defense-in-depth improvement and requires coordinated Next.js request handling and browser regression testing.

## 3. Private route behavior

Account, admin, API, authentication, checkout, and download routes receive `Cache-Control: private, no-store` plus `X-Robots-Tag: noindex, nofollow, noarchive`. `robots.txt` also disallows these route families. Page metadata already marks account, checkout, download, and admin surfaces non-indexable.

Security does not depend on crawler rules; server authorization, RLS, token hashes, and payment verification remain authoritative.

## 4. Abuse and payload controls

- Checkout creation allows at most five recent orders for the same normalized email within fifteen minutes.
- Customer support allows at most five requests per authenticated account within fifteen minutes.
- The PayMongo webhook rejects declared or actual raw payloads larger than 256 KiB before parsing.
- Existing inquiry fingerprint throttling remains active.
- Provider secrets, raw webhook bodies, delivery tokens, and Storage paths are excluded from user-visible errors and audit metadata.

Production should add infrastructure-level rate limiting, bot controls, alerting, and request-size enforcement at the CDN or hosting boundary.

## 5. Accessibility and failure behavior

- A global keyboard skip link targets a main landmark across primary interfaces.
- Visible focus and reduced-motion rules remain global.
- Forms expose labels, validation text, disabled and pending states, and status announcements.
- Global loading, not-found, and error interfaces avoid blank screens and never imply a transaction succeeded.
- Checkout and delivery pages keep authoritative statuses in text rather than color alone.

WCAG 2.2 AA remains a target pending automated axe checks, keyboard testing, zoom/reflow review, screen-reader review, and real-device verification.

## 6. SEO and performance boundaries

- Public routes retain canonical metadata, sitemap entries, crawlable server-rendered content, and structured data where factual.
- Private and preview routes remain outside the sitemap.
- Server Components remain the default; client components are limited to forms and navigation.
- Catalog media remains lazy-loaded beyond the leading image and private images use expiring URLs.
- No new heavy client runtime or analytics dependency was added.

Production performance budgets and Core Web Vitals require measurement on the deployed domain with real media and catalog records.

## 7. Verification

Local completion requires:

- Security-header and private-cache contract tests
- Main-landmark and skip-navigation contract tests
- Updated checkout throttling migration tests
- Lint and TypeScript with no warnings or errors
- Full unit and migration-contract suite
- Production build
- HTTP checks for private route headers, public route availability, global failure pages, and no-store behavior

## 8. Remaining external quality gates

- Live Supabase migration, RLS, concurrent transaction, Auth, and Storage tests
- PayMongo test-mode checkout and signed webhook exercises
- Resend sandbox delivery, bounce, and verified-domain tests
- Automated browser accessibility testing and manual keyboard/screen-reader review
- Multiple real mobile widths and desktop browsers
- Deployed performance, security-header, TLS, and crawl checks
- Dependency vulnerability and distributed-license audit
- Backup/restore rehearsal and operational incident procedures
- Independent security and legal review before live commerce

## 9. Exit and next action

Phase 9 is locally complete when its full verification passes. Phase 10 can prepare deployment configuration, provider runbooks, monitoring, backups, and the launch checklist, but it cannot be marked production-complete until the owner supplies accounts, approvals, real content, and legal/business readiness.
