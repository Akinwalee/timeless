# Live launch persona QA — 29 October 2026

Target: https://www.weartimeless.xyz/. Baseline: published site after `ce09563`. Five isolated Chromium contexts represent the requested personas. The first subagent dispatch failed with `no rollout found`; initial baseline and local reruns used five isolated scripted persona scenarios. Fresh-context dispatch subsequently worked. Five independent agents completed public-site persona checks, with their own reports under `independent/`. After the final corrections, the QA lead repeated all five scenarios in fresh browser contexts against final production `a8235e2`; the literal-reader agent also confirmed that final build directly. These remain simulated personas, not human usability participants.

## Ranked findings

Rank reflects observed affected scenarios, not a prevalence estimate for real visitors.

| Rank | Finding | Scenarios affected | Severity | Current disposition |
|---|---|---|---|---|
| 1 | LQ-001: Newsletter cannot request confirmation | 3/5: skeptic, literal, breaker | P1 | Origin handling fixed and regression-tested. **Production Brevo configuration remains missing/invalid; real subscription is blocked.** |
| 2 | LQ-002: Mobile consent prompt covers the hero CTA | 2/5: mobile, literal | P2 | Fixed in source; both narrow-screen reruns retain visible CTA and shopping controls |
| 3 | LQ-003: Double-clicking Add immediately dismisses the bag | 1/5: breaker | P2 | Fixed; drawer remains open and regression confirms one item per initial double-click |
| 4 | LQ-004: WhatsApp calls an item-only amount ORDER TOTAL | 1/5: independent skeptic | P2 | Changed to ITEMS SUBTOTAL; arithmetic and shipping caveat retained |
| 5 | LQ-005: Product title is not a navigation link | 1/5: independent literal reader | P3 | Title now links to the same product as its photograph |
| 6 | LQ-006: Consent startup causes layout shift in intermediate fix | 0/5 persona observations; additional lab probe | P2 | Corrected and measured on final live build; fresh CLS 0 |

Confirmed findings in this scoped QA: **P0 0 · P1 1 · P2 4 · P3 1**. All identified code issues are corrected; LQ-001’s remaining Brevo setup is explicitly deferred by the owner. LQ-006 was a regression introduced and caught during remediation, rather than a defect in the initial baseline.

### LQ-001 — Signup rejects the actual site and masks missing setup

The three signup scenarios received `403` and “Please submit the form from the Timeless website” while already on `www.weartimeless.xyz`. An invalid-only probe with the configured apex Origin reached `503` instead, confirming a second, configuration-level barrier behind the first. Both checks occur before provider processing; no contact was created.

- Evidence: [production preflight](newsletter-production-preflight.json), [literal signup screenshot](baseline/literal/03-newsletter-result.png), [skeptic report](baseline/skeptic/report.json), [breaker report](baseline/breaker/report.json).
- Reproduce safely: POST `{ "email": "invalid", "consent": false }` to `/api/newsletter` from the `www` page; compare with the same invalid request using the apex Origin. Before the fix: `403` / `503`. With configured credentials and the fix: both reach validation and return `400` without provider calls.
- Expected: genuine requests from the two owned HTTPS origins reach validation; valid opted-in requests use Brevo and show success only after acceptance. Foreign origins remain rejected.
- Change: `app/api/newsletter/route.ts:14` accepts the exact canonical/owned alias origins. No suffix wildcard, arbitrary Host trust or forwarded-origin bypass. `lib/site.ts:2`, `.env.example` and root README now default to the actual `www` production origin. Untrusted-origin recovery copy is actionable.
- Validation: three new unit tests exercise the production branch, both alias directions, accepted provider request and foreign/missing/insecure/lookalike/alternate-port origins. Existing provider rejection, input and consent tests still pass.
- **Owner action:** add valid `BREVO_API_KEY`, positive `BREVO_LIST_ID`, positive `BREVO_DOI_TEMPLATE_ID` and `NEXT_PUBLIC_SITE_URL=https://www.weartimeless.xyz` in production hosting, redeploy, then verify DOI delivery/list membership/unsubscribe with a controlled inbox. No keys were supplied or invented. Mocked UI success does not close this launch blocker.

### LQ-002 — Consent obscures the first mobile action

At 375×812, the initial 242px fixed consent panel overlaps the hero headline and “Explore the first drop” link. A first-time visitor must resolve measurement before seeing the page's primary next action clearly.

- Evidence: [before](baseline/mobile/02-consent-covers-cta.png), [literal overlap report](baseline/literal/report.json), [after](after-local/mobile/01-landing.png).
- Reproduce: fresh browser storage, 375×812 viewport, initial home load with GA4 configured. Compare panel and CTA bounding boxes before making a choice.
- Expected: optional measurement never hides shopping navigation or purchasing controls.
- Change: `components/site/Measurement.tsx` places a shorter equal-choice prompt in page flow. Resize/scroll observations reserve the visible header offset; `SiteHeader.tsx` follows it and `HeroScene.tsx` fits the remaining initial viewport. The footer preference action scrolls/focuses the panel when reopened.
- Validation: production browser regression checks non-overlap, CTA inside the initial viewport, navigation without deciding first, decline and keyboard focus on reopening. Both 375px persona screenshots were inspected. The local slow-network run uses actual CDP throttling, not mocked image delivery.

### LQ-003 — Second Add click closes the new drawer

The breaker prepares an item, closes/reopens the saved bag across back/forward navigation, then double-clicks Add. Click one opens the drawer; click two lands on its backdrop and invokes close. The bag count changes but the confirmation disappears.

- Evidence: [closed drawer after double-click](baseline/breaker/07-stuck.png), [baseline report](baseline/breaker/report.json), [after report](after-local/breaker/report.json).
- Reproduce: product → select M → double-click Add. Check that the dialog remains open. A prior added item is not necessary for the regression test.
- Expected: a rapid Add double-click leaves the confirmation visible and adds one item. Deliberate later additions and quantity controls remain available.
- Change: `components/bag/BagDrawer.tsx:41` ignores the second click of a double-click on the backdrop. Ordinary backdrop click, close button and Escape behavior remain available.
- Validation: a production browser regression checks open dialog and quantity `1` after an initial double-click; the breaker rerun checks saved bag/history and another deliberate addition.

### LQ-004 — WhatsApp amount wording

The independent skeptic found that the bag correctly says “Items subtotal”, but its generated WhatsApp draft still said “ORDER TOTAL”. Shipping was already explicitly additional, so the arithmetic was correct; the label was ambiguous. `lib/bag.ts:135` now says “ITEMS SUBTOTAL”; `lib/bag.test.ts` checks both the expected subtotal and absence of “ORDER TOTAL”. See [skeptic evidence](independent/skeptic/report.md). No actual message was sent.

### LQ-005 — Catalogue title click does nothing

The independent literal reader clicked the product title and had to locate the separate image/View link. `components/product/ProductCard.tsx` now makes the title a real product link. The browser regression navigates via that title on mobile. This is minor discovery friction, not a broken product route. See [literal evidence](independent/literal/report.md).

### LQ-006 — Regression guard: consent startup layout shift

An extra fresh-visit performance probe found CLS `0.2128` from late insertion of the new in-flow prompt. It was caught during verification and corrected before final sign-off: the configured banner is rendered in the initial HTML, with a small static, trusted bootstrap before hero parsing to read the existing preference and establish the initial layout. Returning/DNT visitors are hidden before layout; no-JS visitors do not get nonfunctional consent controls. The original consent/script gate remains intact. The eight-browser suite now includes CLS below `0.1`, visible mobile CTA and the no-JS path. This was a technical regression check, not a counted persona encounter or a field performance claim. [Before measurement](layout-shift-before.json) and [final live measurements](final-layout-shift.json) retain the evidence. Fresh and allowed-state CLS measured 0; denied-state CLS measured 0.000029. These are individual lab navigations, not field distributions.

## Scenario outcomes after the source fixes

| Persona | Executed path | Patched production build |
|---|---|---|
| Impatient | Landing → first CTA → product → M → bag → inspect handoff | Order request prepared |
| Skeptic | Shipping, returns, privacy, terms → consented signup UI → product/bag | Policies work; mocked confirmation UI passes; real Brevo still unavailable |
| Mobile | Same shopping path at 375×812; 500kbps down/up, 400ms latency, 4× CPU slowdown | Request prepared; no CTA overlap or horizontal overflow |
| Literal | French browser locale, follow literal labels → consented signup UI → colour/size/bag | Request prepared; signup error no longer reproduced in mocked UI; actual provider setup remains required |
| Breaker | Invalid email, recovery, signup UI, bag, back/forward, double-click Add | Native invalid-email rejection, retained bag and double-click confirmation pass |

All five reach the shopping site's safe first success: an itemized WhatsApp request URL with size and shipping disclosure. The WhatsApp application was not opened and no message/order/payment was sent. Three newsletter UIs use intercepted responses after a separate invalid-only server probe; this verifies display behavior, **not actual email delivery**. GA requests are blocked to prevent polluting production analytics.

## Final deployed confirmation

Final code commit **a8235e2** is live on `main`. [Deployment/CI status](final-ci-status.json) shows Vercel, build, deploy and quality success. [Final five-scenario results](after-live-final/results.json) confirm all five prepared an unsent WhatsApp request with size, additional-shipping disclosure, **ITEMS SUBTOTAL** and no **ORDER TOTAL** label. The three signup scenarios correctly retain the owner-deferred missing-Brevo issue; their successful UI confirmations are explicitly mocked. No actual email was delivered.

| Independent persona | Agent evidence | Final consolidated rerun |
|---|---|---|
| Impatient | [Report](independent/impatient/report.md) | [Final](after-live-final/impatient/report.json) |
| Skeptic | [Report](independent/skeptic/report.md) | [Final](after-live-final/skeptic/report.json) |
| Mobile | [Report and slow-3G measurements](independent/mobile/report.md) | [Final slow-3G run](after-live-final/mobile/report.json) |
| Literal reader | [Report, including final-build confirmation](independent/literal/report.md) | [Final](after-live-final/literal/report.json) |
| Breaker | [Report, including double-submit and copy confirmation](independent/breaker/report.md) | [Final](after-live-final/breaker/report.json) |

Independent reports reflect the production phase each agent actually checked. Resuming an expired mobile agent for the last build was unavailable; a replacement could not launch under its interpretation of side-conversation permissions. It established no new findings. The lead therefore performed the final five fresh real-browser runs, including actual 375px/CDP throttling, and separately measured fresh/returning CLS. We do not claim five independent agents each re-executed every final code revision.

Business content still worth supplying: actual garment measurements and explicit voluntary-return arrangements. Current wording accurately labels fit help and asks buyers to confirm terms before payment. Those facts were not invented. One independent navigation timeout was an undiagnosed timing outlier and succeeded on retry; it is not claimed as a fixed application defect. Physical devices, field performance and real delivery/fulfilment remain outside this scoped sign-off.

## Verification and evidence

- [38 unit tests](unit-tests.txt), [eight production-browser regressions](browser-regressions.txt), [lint](lint.txt), [TypeScript](typecheck.txt), [connected production build](production-build.txt): pass.
- [Baseline scenario reports](baseline/results.json) and [after-build scenario reports](after-local/results.json), with screenshots in each persona folder. No page exceptions or document overflow in the final local journeys.
- The after-build runs use the existing public Sanity catalogue (₦15,000 item) in a real local production server. Server newsletter configuration is deliberately not supplied. The loopback safe probe uses the configured production Origin; production aliases are also covered in unit tests.
- Initial harness runs included premature hydration clicks, case-sensitive policy selectors, a hidden-header click and a server-not-started run. They were corrected and are excluded from findings; compact raw diagnostics remain in `harness-diagnostics/` for traceability. Actual policy-link navigation was independently verified with captured click targets.
- No field Core Web Vitals, real devices, assistive-technology certification, collector receipt or real Brevo delivery is established by this test.

Reproduce against a safe local production build using `QA_BASE=http://127.0.0.1:3111 QA_PHASE=after-local node docs/audits/live-persona-qa/run.cjs`. Default target is the live domain; valid newsletter submissions are always intercepted. `QA_PERSONAS=breaker` selects one scenario. The script requires the installed Playwright Chromium runtime.

**Deployment:** the owner confirmed `main` is the production branch. Source fixes `b563eff` were merged with existing main history as `17702e5`; subtotal copy followed as `8c9e1b4`, and final title/startup corrections as `a8235e2`. All were pushed normally to main and redesign. The public API now accepts the www origin and returns the expected missing-Brevo `503`, replacing its prior erroneous `403`. The owner explicitly deferred Brevo configuration; no email delivery is claimed.

**Release gate: do not call signup launch-ready until the actual Brevo setup and a controlled end-to-end confirmation test pass.** See the independent public rerun reports for deployed UI verification.

Final evidence is committed on `redesign`; production `main` remains at the verified application commit `a8235e2`. No code changes follow that verification.
