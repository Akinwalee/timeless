# Launch remediation plan

This is proposed work, not implementation performed by the audit. Effort ranges are hands-on estimates for someone familiar with this repository; vendor setup, business/legal approval, dependency incompatibilities and device access are separate elapsed-time dependencies.

## Ordered work and acceptance

| Order / gate | Findings / risks | Owner and estimated effort | Consolidated work | Acceptance / verification |
|---|---|---|---|---|
| 1 — mandatory | TL-001 | Frontend; 2–4h plus regression | Make SSR/default transition state visible-safe, then opt into allowed animation; correct preference and cleanup behavior | Fresh and client navigations remain readable with reduce-motion, no JS, delayed JS and cancelled animation. Browser assertions and screenshots show no opaque leftover overlay |
| 2 — mandatory | TL-015, R-09 | Frontend/security; 0.5–2d initial triage/update, longer if ecosystem migration needed | Update Next/lint and patched image dependencies; trace severe transitive matches into runtime/Studio/build contexts; review compatibility instead of forcing suggested changes | Lockfile install and new advisory scan retained; every remaining severe entry resolved or excluded with source/platform evidence; build/type/lint/unit and image/Studio smoke pass on actual runtime |
| 3 — mandatory | TL-002, TL-003, R-07 | Business/legal + frontend/backend; 1–2d engineering after decisions | Choose newsletter processor, consent/disclosure and retention responsibilities; publish policies; connect accepted subscription→success or remove signup until ready | Controlled test record appears once at backend; errors/offline/retry do not show success; policy URLs return approved readable 200 documents. No email in analytics/logging URLs |
| 4 — mandatory | TL-004; also TL-012/TL-013 | Frontend/accessibility; 0.5–1d | Accessible text tokens across all templates; semantic home heading/SplitText behavior; focus-aware header visibility | All retained contrast failures cleared; manual photo-overlay checks; home heading accessible; focused header controls visible after scrolling. Keyboard and AT journey results retained |
| 5 — strongly pre-launch | TL-005, TL-011 | Frontend; 0.5–1d | Resolve image min-height/aspect-ratio sizing centrally where possible; storage guards and in-memory fallback independent of motion | Widths 320/375/767/768/820/1024/1440/1920 tested; no out-of-container frames; storage SecurityError/quota/malformed data do not crash or block checkout |
| 6 — strongly pre-launch | TL-009/TL-010, R-01/R-04/R-07 | Business/catalogue + frontend; 2–6h engineering after approved facts | Supply actual size measurements or rename fit guidance; align fallback/CMS social and support links; choose explicit commerce-outage/stale-bag policy | M vs L can be compared using approved data; owned contact destinations verified; sold-out/price-change/outage fixture cannot silently offer an unapproved fallback order |
| 7 — pre-launch discovery | TL-007/TL-008, R-10 | Frontend/SEO; 0.5–1d after origin/URL decisions | Shared metadata, route descriptions, canonicals, share images; sitemap and robots; legacy URL mapping | Rendered URLs use verified production origin; sitemap resolves and excludes admin/error URLs; social images load; legacy redirects and preview noindex verified |
| 8 — pre-launch measurement | TL-006, R-10 | Analytics/privacy + frontend; 0.5–1d plus destination access | Minimal coherent funnel contract below, client route views, campaign retention, consent behavior, test-traffic exclusion and error reporting | Browser and collector agree on exact event counts/properties; no duplicate route/conversion events; no email/message/phone sent; denial behavior verified |
| 9 — mandatory operational verification | R-02/R-03/R-06/R-08/R-10 | Release/platform/security/QA; 0.5–1d hands-on after access | Verify real target configuration, TLS/headers/cache/CMS/WhatsApp; browsers/devices/AT; ordinary-image lab performance; alert and rollback rehearsal | Every mandatory checkbox in [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) has evidence and owner; unverified controls are not marked pass |
| 10 — post-launch or brand-approved pre-launch | TL-014; optional category/pacing/font opportunities | Design/brand + frontend; 2–6h after signoff | Approve stable typography/font licensing and wrapping; assess informational category presentation and font preload | Brand signoff retained; real platform visual regression passes; changes do not regress accessibility/performance |

Steps 1–2 should start first. Business/privacy approval for step 3 and origin/hosting discovery for steps 7–9 can proceed independently. Instrumentation must follow the consent/data decisions; final privacy wording must match the selected processors. Recheck all critical journeys after dependency or shared layout changes. The existing 19 helper tests remain useful but do not replace browser regressions for the demonstrated failures.

## Required regression coverage

Add focused behavioral tests for the root causes, not copies of implementation details:

- Readable content with reduced motion and no JavaScript; motion preference changed during navigation.
- Real newsletter success, duplicate submit prevention and recoverable backend failure, using a local/test processor fixture.
- Product choice → correct bag data → refresh → quantity/remove → WhatsApp URL; keep dummy destination and never send a message in CI.
- Storage unavailable, quota denied, malformed/version-mismatched stored data; stale price/status policy; cross-tab update behavior.
- Tablet image bounds and actual screenshots at the failing portrait breakpoint.
- Heading semantics, contrast scans, offscreen focus, bag/gallery/menu keyboard behavior and focus restoration.
- Correct rendered metadata, discovery resources and legacy redirect/noindex behavior on the final deployment artifact.

Retain a small, fast browser smoke suite in CI for these cases and save failed screenshots/logs. No CI pipeline was present in the reviewed source; provider-managed checks must be connected and evidenced rather than assumed absent or sufficient.

## Measurement contract

Use one pageview integration and a small event vocabulary. This is a proposed contract; **none is currently implemented or collection-verified**.

| Event | Trigger | Allowed useful properties | Completion semantics |
|---|---|---|---|
| `page_view` | Initial arrival and completed client pathname navigation, once each | Sanitized canonical path, page type, permitted campaign/referral fields, release | No duplicate SDK automatic + custom pageviews; exclude Studio and marked test traffic |
| `view_item` | Product detail view | Product/variant ID, currency, displayed value, availability | Distinct from merely prefetching an RSC route |
| `select_variant` | Explicit colour/size change | Product ID, colour ID, size, placement | User intent, not image warm/hover/render |
| `add_to_bag` | Accepted bag addition | Product/variant/size IDs, quantity, currency, value, placement | Emit after accepted action, once per action |
| `view_bag` | Bag opened | Item count, total value, currency | Do not emit every context rerender |
| `update_bag` | Quantity/removal/explicit clear action | Action type, affected IDs, new quantity, currency/value | No unnecessary full cart payload or free text |
| `checkout_handoff` | User activates the valid WhatsApp CTA | Item count, currency, value, handoff provider, placement | **Not `purchase`**: opening WhatsApp does not prove payment or merchant acceptance |
| `checkout_unavailable` | User encounters unavailable checkout | Non-sensitive reason/config category, route | Operational funnel loss signal, deduplicated per encounter |
| `newsletter_start` | First user interaction with signup | Placement | No email, name or input text |
| `newsletter_submit` | Valid submission attempt | Placement | An attempt, not confirmed subscription |
| `newsletter_success` | Processor confirms acceptance | Placement, non-identifying result category | Only after real destination acceptance |
| `newsletter_error` | Submission fails | Placement, stable error category | No raw response, email or entered data |
| Error reporting | Unhandled client/server error and important service failure | Release, route template, sanitized category/stack, correlation ID | No request secrets, email, WhatsApp message or full URL query |

Persist only the attribution needed for the chosen measurement purpose and applicable consent policy. UTM handling needs an explicit allowlist and expiration; avoid transmitting arbitrary query strings. Pageview and business-event collection must follow the privacy/consent decision, including the refusal state. Separate development/staging/internal traffic from production and verify the filter at the collector.

For the actual order completion objective, reconcile merchant-confirmed orders with an appropriate non-PII order identifier in a later approved integration. Do not infer revenue or purchase conversion from a WhatsApp link click. Verify collector receipt rather than treating `console.log`, a dataLayer push or a successful SDK initialization as event delivery.

## Safe release sequencing

1. Close the P1 defects and obtain the missing business/platform facts. Review all P2 findings and assign explicit owners for any accepted deferral.
2. Build a fresh immutable candidate from the reviewed lockfile and exact environment. Never reuse the audit's dummy build or test artifacts for production.
3. Run unit/static checks and focused browser regressions; test the actual CMS-backed candidate and ordinary image path.
4. Verify approved destination configuration, disclosures, real-browser/device behavior, collector events, alerts and rollback in staging.
5. Deploy to the verified production target, then run the immediate smoke gate before promotion or paid traffic.
6. Watch conversion availability/errors and early RUM. Roll back on the objective conditions in the checklist; preserve evidence and fix forward only through the same gate.

The audit has not implemented any of these steps. Closing a finding requires new evidence against the changed candidate; this report's build passes do not transfer automatically to a later dependency/configuration revision.
