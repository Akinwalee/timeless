# Live launch persona QA — 29 October 2026

Target: https://www.weartimeless.xyz/. Baseline: published site after `ce09563`. Five isolated Chromium contexts represent the requested personas. The requested subagent dispatch failed with `no rollout found` for this side conversation; these are five scripted persona scenarios reviewed by one QA lead, **not five independent agents or human usability participants**.

## Ranked findings

Rank reflects observed affected scenarios, not a prevalence estimate for real visitors.

| Rank | Finding | Scenarios affected | Severity | Current disposition |
|---|---|---|---|---|
| 1 | LQ-001: Newsletter cannot request confirmation | 3/5: skeptic, literal, breaker | P1 | Origin handling fixed and regression-tested. **Production Brevo configuration remains missing/invalid; real subscription is blocked.** |
| 2 | LQ-002: Mobile consent prompt covers the hero CTA | 2/5: mobile, literal | P2 | Fixed in source; both narrow-screen reruns retain visible CTA and shopping controls |
| 3 | LQ-003: Double-clicking Add immediately dismisses the bag | 1/5: breaker | P2 | Fixed in source; drawer remains open and regression confirms one item per initial double-click |

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
- Change: `components/site/Measurement.tsx:92` places a shorter equal-choice prompt in page flow. Resize/scroll observations reserve the visible header offset; `SiteHeader.tsx` follows it and `HeroScene.tsx` fits the remaining initial viewport. The footer preference action scrolls/focuses the panel when reopened.
- Validation: production browser regression checks non-overlap, CTA inside the initial viewport, navigation without deciding first, decline and keyboard focus on reopening. Both 375px persona screenshots were inspected. The local slow-network run uses actual CDP throttling, not mocked image delivery.

### LQ-003 — Second Add click closes the new drawer

The breaker prepares an item, closes/reopens the saved bag across back/forward navigation, then double-clicks Add. Click one opens the drawer; click two lands on its backdrop and invokes close. The bag count changes but the confirmation disappears.

- Evidence: [closed drawer after double-click](baseline/breaker/07-stuck.png), [baseline report](baseline/breaker/report.json), [after report](after-local/breaker/report.json).
- Reproduce: product → select M → double-click Add. Check that the dialog remains open. A prior added item is not necessary for the regression test.
- Expected: a rapid Add double-click leaves the confirmation visible and adds one item. Deliberate later additions and quantity controls remain available.
- Change: `components/bag/BagDrawer.tsx:41` ignores the second click of a double-click on the backdrop. Ordinary backdrop click, close button and Escape behavior remain available.
- Validation: a production browser regression checks open dialog and quantity `1` after an initial double-click; the breaker rerun checks saved bag/history and another deliberate addition.

## Scenario outcomes after the source fixes

| Persona | Executed path | Patched production build |
|---|---|---|
| Impatient | Landing → first CTA → product → M → bag → inspect handoff | Order request prepared |
| Skeptic | Shipping, returns, privacy, terms → consented signup UI → product/bag | Policies work; mocked confirmation UI passes; real Brevo still unavailable |
| Mobile | Same shopping path at 375×812; 500kbps down/up, 400ms latency, 4× CPU slowdown | Request prepared; no CTA overlap or horizontal overflow |
| Literal | French browser locale, follow literal labels → consented signup UI → colour/size/bag | Request prepared; signup error no longer reproduced in mocked UI; actual provider setup remains required |
| Breaker | Invalid email, recovery, signup UI, bag, back/forward, double-click Add | Native invalid-email rejection, retained bag and double-click confirmation pass |

All five reach the shopping site's safe first success: an itemized WhatsApp request URL with size and shipping disclosure. The WhatsApp application was not opened and no message/order/payment was sent. Three newsletter UIs use intercepted responses after a separate invalid-only server probe; this verifies display behavior, **not actual email delivery**. GA requests are blocked to prevent polluting production analytics.

## Verification and evidence

- [38 unit tests](unit-tests.txt), [eight production-browser regressions](browser-regressions.txt), [lint](lint.txt), [TypeScript](typecheck.txt), [connected production build](production-build.txt): pass.
- [Baseline scenario reports](baseline/results.json) and [after-build scenario reports](after-local/results.json), with screenshots in each persona folder. No page exceptions or document overflow in the final local journeys.
- The after-build runs use the existing public Sanity catalogue (₦15,000 item) in a real local production server. Server newsletter configuration is deliberately not supplied. The loopback safe probe uses the configured production Origin; production aliases are also covered in unit tests.
- Initial harness runs included premature hydration clicks, case-sensitive policy selectors, a hidden-header click and a server-not-started run. They were corrected and are excluded from findings; compact raw diagnostics remain in `harness-diagnostics/` for traceability. Actual policy-link navigation was independently verified with captured click targets.
- No field Core Web Vitals, real devices, assistive-technology certification, collector receipt or real Brevo delivery is established by this test.

Reproduce against a safe local production build using `QA_BASE=http://127.0.0.1:3111 QA_PHASE=after-local node docs/audits/live-persona-qa/run.cjs`. Default target is the live domain; valid newsletter submissions are always intercepted. `QA_PERSONAS=breaker` selects one scenario. The script requires the installed Playwright Chromium runtime.

**Release gate: do not call signup launch-ready until the actual Brevo setup and a controlled end-to-end confirmation test pass.** Local source fixes are distinct from deployed verification.
