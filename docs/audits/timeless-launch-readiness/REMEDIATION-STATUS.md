# Remediation follow-up — 28 October 2026

The original audit is a historical snapshot of commit `60655c89a1a46e0d79cb0c470705b518f73eb378`. The user subsequently authorized implementation. The following changes are in the working tree; no deployment was made.

**Source fixes are implemented. Public launch still requires real Brevo configuration, policy approval and operational/provider verification.** Do not interpret mocked service tests or a local build as destination receipt, legal approval, field performance or a successful deployment.

## Verification completed

- Lint and TypeScript pass.
- **35 unit tests in 10 files pass**, covering stored-bag validation/storage denial, configured CMS failure, Brevo acceptance/rejection/connection failure, input/consent/origin/burst validation, event field/consent filtering and monitoring-data minimization.
- **Six Chromium browser regressions pass**, including production build/start: reduced motion and no JS, tablet frame bounds, storage-denied shopping/handoff, mocked newsletter error/retry/success, policies/discovery/headers, keyboard header/carousel behavior.
- **28 viewport captures**: seven representative routes at 375/768/1440/1920. Axe runs at 375 and 768 report **zero violations** for those sampled states; no document overflow or pageerrors were recorded. Images were fetched normally through Chromium, with visible-image loading/decoding awaited; the original audit's transport workaround was not used.
- The production build passes both without CMS configuration and with the existing public Sanity configuration. The read-only connected smoke test sees four published colours and matching product/bag price, size and shipping disclosure. The actual WhatsApp URL was inspected without opening it; its phone number is not retained in the evidence JSON.
- **npm audit reports zero vulnerabilities** across the installed graph. The installed dependency tree resolves cleanly; TypeID's UUID generation was smoke-tested after its scoped override.
- `npm run check:launch` deliberately reports the four missing real setup values by name, without printing secrets or contacting providers.

See [remediation-evidence](remediation-evidence/) for logs, screenshots, scan observations and connected-flow checks. The browser regression source is `tests/launch.spec.ts`; tests use a dummy number and mocked newsletter responses. Provider credentials were not added to the repository.

## Findings disposition

| Finding | Implemented change | Verification / remaining condition |
|---|---|---|
| TL-001 | Safe CSS-default transition state, reactive preference cleanup; removed root loading boundary that stranded no-JS visitors | Reduced-motion and JS-disabled production browser tests pass |
| TL-002 | Server-only Brevo DOI endpoint, native/server validation, consent, honeypot, bounded input/rate guard, timeout and honest pending/error/success feedback | Mocked request/UI tests pass. **Real key/list/template/origin and confirmation/list/unsubscribe test remain required** |
| TL-003 | Four linked policy pages and review documents; address-based shipping quote; removed unsupported free-delivery and 7-day-return claims | Routes return 200 and mobile draft checked. **Business review remains required** |
| TL-004 | Accessible muted-text tokens, improved dark-surface text and navigation hover opacity | Representative mobile/tablet axe scans show zero violations; full human AT/photographic-overlay review remains a release check |
| TL-005 | Removed conflicting viewport min-heights from aspect-ratio frames; bounded frame width | Four-width rendered matrix and tablet bounds regression pass |
| TL-006 | Consent-controlled GA4, explicit page/item/bag/handoff/signup events, allowlisted fields, DNT/denial, attribution and preference withdrawal; optional sanitized Sentry error capture | Unit event/privacy tests pass. **IDs/DSNs, collector receipt, internal-traffic filters, dashboard and alerts remain unverified** |
| TL-007 | Shared route metadata, canonical origin, Open Graph/Twitter cards and generated brand-font preview image; route descriptions | Local rendered canonicals and preview route verified; real domain/social preview still needs deployment check |
| TL-008 | Sitemap from public catalogue/stories plus policies; robots policy and preview indexing exclusion | Discovery resources return 200; indexed legacy inventory and final host require owner verification |
| TL-009 | “Fit & sizing help” label, explicit fit-note scope and configured WhatsApp/email measurement enquiry | No fabricated measurements; business can supply a real measurement chart later |
| TL-010 | Real historical Instagram/TikTok destinations and configurable fallback support mailbox | Source placeholders removed; support identity/ownership still needs owner confirmation and published CMS settings review |
| TL-011 | Guarded local/session storage, in-memory shopping status, safer stored payload validation | Unit tests and storage-denied browser shopping test pass |
| TL-012 | Semantic home H1, compatible SplitText heading semantics | H1 present and prohibited-ARIA findings absent in current scans |
| TL-013 | Focus-aware header reveal and immediate focus-within transform override | Scrolled keyboard-focus regression passes |
| TL-014 | Bundled approved Host Grotesk used consistently for display type, 0.9 leading and social card; unused accent-font preload removed | Four-width visual review completed; no unlicensed Dragon font substituted |
| TL-015 | Patched Next/React/Sanity/tooling; narrow reviewed parser/Undici/UUID transitive overrides | Final registry scan: 0; dependency tree valid; local and connected builds pass |

Additional work: CMS failures now throw an honest service error instead of caching a false empty/fallback catalogue, with an accessible retry page; a safe liveness route and baseline security headers were added; Journal categories are real keyboard-accessible filter links; the carousel track itself is focusable; CI runs static, unit, dependency and browser gates.

## Brevo handoff

Set these in local/hosting environment and restart or redeploy:

```dotenv
BREVO_API_KEY=server-only-api-key
BREVO_LIST_ID=positive-numeric-list-id
BREVO_DOI_TEMPLATE_ID=positive-numeric-doi-template-id
NEXT_PUBLIC_SITE_URL=https://your-verified-production-origin
```

The active transactional DOI template needs a verified sender and the API confirmation link `{{ params.DOIurl }}`. The site supplies `/newsletter/confirmed` as the redirect. See the root README and `.env.example`. Never add the real API key to `NEXT_PUBLIC_*`, source control or chat. `check:launch` validates presence/shape only; it cannot prove Brevo sender/template validity or delivery.

## Remaining launch conditions

1. Add Brevo configuration, complete a controlled end-to-end DOI/list/unsubscribe verification and configure an edge/distributed form rate limit. The included guard is bounded but process-local; forwarding headers must be overwritten by the trusted proxy.
2. Review the four policy drafts and confirm business identity, support mailbox and voluntary returns arrangements. Confirm the actual production origin and CMS contact/social settings.
3. Choose/enable measurement and monitoring destinations if wanted. GA4 requires its ID plus explicit enable flag and visitor consent; Sentry requires DSNs. Verify collector events and alert delivery. Disable GA4 Enhanced Measurement duplicates and apply internal/staging filters as documented.
4. Verify actual hosting TLS/HSTS, headers/CDN/cache, permissions, uptime alerts and rollback. No provider settings, DNS or deployments were changed.
5. Complete supported-browser/real-device/assistive-technology checks and ordinary deployed mobile performance. Chromium/local scans do not establish Safari/iOS behavior, full WCAG compliance, field INP/CWV or legal compliance.

The original NO-GO audit should not be used as a current count of unfixed source defects. Equally, these source fixes do not authorize public launch while the setup and verification conditions above are unmet.
