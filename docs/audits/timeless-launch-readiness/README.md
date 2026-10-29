# Timeless pre-launch readiness audit

> Historical audit snapshot. Implementation was subsequently authorized and completed in the working tree. Read the [remediation status and remaining launch conditions](REMEDIATION-STATUS.md) for the current disposition; the findings and counts below preserve the original audit evidence.

**Decision: NO-GO.** Reviewed 28 October 2026 against commit `60655c89a1a46e0d79cb0c470705b518f73eb378`.

**15 confirmed findings: P0 0 · P1 5 · P2 9 · P3 1.** Application code was not modified. The repository initially had no application changes; audit documents and evidence are the only additions.

## 1. Executive summary

The redesign has a coherent editorial identity, authentic campaign imagery, reusable responsive media components, and a working local bag/WhatsApp handoff model. Both credential-free production builds pass, as do lint, TypeScript and all 19 unit tests. All nine fallback content URLs return 200 and have no recorded JavaScript page errors during normal route scans. Colour/size selection, bag persistence and totals, gallery controls, menu Escape/focus return, carousel keyboard controls and client history navigation work in the tested browser.

These strengths do not establish launch readiness. Reduced-motion visitors receive a completely black page; the newsletter reports success without collecting subscriptions; commerce/privacy links are placeholders; faint text fails contrast checks throughout the site; and the release dependency graph matches severe published advisories. Tablet imagery overflows, sizing support is incomplete, analytics are absent, and SEO/social discovery resources are unfinished.

Production hosting, published CMS data, the owned WhatsApp destination, actual subscription processing, consent decisions, real devices, assistive technology, monitoring and rollback remain unverified. This is a broad, evidence-backed local audit with explicit external gaps—not certification of production security, WCAG compliance, legal compliance or field Core Web Vitals.

## 2. Launch decision and mandatory blockers

Public launch is not acceptable until all five P1 findings are closed and the deployment verification gates are evidenced:

| Blocker | Required outcome |
|---|---|
| **TL-001** | Reduced-motion and no-JS visits show readable content; the transition overlay cannot remain opaque |
| **TL-002** | Newsletter success follows real backend acceptance, or the signup offer is removed until functional |
| **TL-003** | Shipping, Returns, Privacy and Terms resolve to approved, accurate documents |
| **TL-004** | Verified contrast failures across templates and purchase guidance are corrected and rechecked |
| **TL-015** | Applicable severe dependency advisories are resolved; remaining matches receive documented platform/source triage |

TL-015 confirms affected dependency versions and scanner matches, not successful exploitation. The registry reports 25 package entries (2 critical, 10 high, 13 moderate); these are grouped into one release finding and are not counted as 25 site vulnerabilities.

## 3. Audit coverage

| Dimension | Status | Actual verification | Major result |
|---|---|---|---|
| Discovery / architecture | Substantially covered locally | Source, route inventory, README, schemas, legacy HTML, brand PDF, Git history | [Inventory](INVENTORY.md); deployment and live CMS inventory unknown |
| Visual design / UI | Partial, defects found | Screenshots inspected at 375/768/1440/1920; full scrolled views at 375/1440 | TL-005 tablet overflow; TL-014 documented typography deviation |
| UX / conversion | Fails | Product → bag → dummy WhatsApp URL; newsletter validation/submission; policy/sizing review | TL-002, TL-003, TL-009, TL-010 |
| Functionality / QA | Mixed | Two production builds, lint, typecheck, 19 tests, nine route scans, deep links/history, bag/gallery/menu/carousel | Passing normal flows; TL-001/TL-011 failures; one browser engine |
| Accessibility | Fails | Axe 4.11.4 on nine URLs; keyboard focus, dialog/gallery, reduced motion, no JS, 320px product reflow | TL-001, TL-004, TL-012, TL-013; screen-reader/zoom coverage incomplete |
| Performance / CWV | Diagnostic only | Six throttled instrumented visits, resource timings, long tasks, bundle inspection | [Measurements and limits](VERIFICATION.md#performance); no deployment CWV pass asserted |
| Security | Partial, release gate fails | Source boundaries, redacted-pattern scan, local HTTP probes, registry scan, maintainer advisory review | TL-015; actual exploitability/edge controls unverified |
| Analytics | Fails application coverage | Source and local network/resources during journeys | TL-006; no app event instrumentation or destination verification |
| SEO / social | Incomplete | Rendered heads, route HTTP probes, redirect and noindex checks | TL-007/TL-008; indexed migration baseline missing |
| Content / brand | Partial, defects found | Visible page review, product copy, destinations, brand PDF vs CSS, old static site | TL-003/TL-009/TL-010/TL-014; business claims require owner approval |
| Privacy / data handling | Incomplete | Form behavior, localStorage, external handoff, missing policies | TL-003; no live consent/processor review; not a legal determination |
| Infrastructure / operations | Not verified at deployment | Local build/runtime/cache/headers, source/config inventory | No tracked deployment gates or rollback/alert evidence; provider controls may exist |
| Real-world scenarios | Partial, failures found | Mobile/desktop arrival, purchase URL, invalid email, storage fault, keyboard, slow-network diagnostics, deep link/history | [Scenario results](VERIFICATION.md#scenario-results); no real order or production mutation |

## 4. Findings summary

Each finding is counted once under its primary dimension. Cross-cutting impact is described in the register.

| Primary dimension | P0 | P1 | P2 | P3 | IDs |
|---|---:|---:|---:|---:|---|
| Accessibility / enhancement | 0 | 2 | 2 | 0 | 001, 004, 012, 013 |
| Conversion / UX | 0 | 1 | 1 | 0 | 002, 009 |
| Commerce information / privacy | 0 | 1 | 0 | 0 | 003 |
| Visual / brand | 0 | 0 | 1 | 1 | 005, 014 |
| Analytics | 0 | 0 | 1 | 0 | 006 |
| SEO / social | 0 | 0 | 2 | 0 | 007, 008 |
| Content integrity | 0 | 0 | 1 | 0 | 010 |
| Client reliability | 0 | 0 | 1 | 0 | 011 |
| Dependency security | 0 | 1 | 0 | 0 | 015 |
| **Total** | **0** | **5** | **9** | **1** | **15 root causes** |

No independently demonstrated application exploit or P0 exposure is claimed. No missing tool, secret-scan result, successful compilation or absence of console errors is treated as proof of security/compliance.

## 5. Top priorities and shortest credible launch path

1. **Remove the black-screen failure and review severe dependency matches.** These affect access to the site and release safety; perform targeted browser/platform regression after the dependency update.
2. **Make the two conversion offers honest and operable.** Keep the verified bag model, configure/verify the real WhatsApp destination, and connect or remove newsletter signup. Publish approved commerce/privacy information alongside any new data processing.
3. **Correct shared accessibility and layout causes.** Fix muted-text contrast, heading semantics, header focus visibility, tablet frame constraints and storage fallback together, then rescan critical journeys.
4. **Complete launch discoverability and measurement.** Add route metadata/share images, sitemap/robots, approved social/contact links and a minimal privacy-reviewed funnel event contract; verify collection at its destination.
5. **Run the production gate.** Validate published CMS content, real devices, edge security/TLS/caching, genuine mobile performance, alert delivery and rollback before public promotion.

The smallest frontend fixes are likely hours; a credible release also depends on business-approved policies, a subscription processor, dependency compatibility and deployment access. [REMEDIATION.md](REMEDIATION.md) provides task ranges rather than a misleading launch-date promise. P2 items should be completed where feasible; any deferral needs an owner, reason and testable mitigation. Operational unknowns cannot be waived as “passed.”

## 6. Residual risks and testing gaps

- The actual production URL/provider/project, DNS/TLS, secrets, edge headers/WAF/CORS, deploy permissions, cache behavior, uptime alerts and rollback were not inspected. `CNAME` and historical Vercel documentation are context, not live verification.
- Sanity was intentionally not contacted. Connected builds, CMS availability/revalidation, published inventory/prices/stock, authenticated Studio and empty/malformed CMS cases were not tested in this run. The fallback may replace commerce facts after fetch errors.
- The checkout URL was verified only against a dummy number. WhatsApp app opening, merchant receipt, payment, fulfilment, shipping promises and mailbox ownership remain unverified. No real transactions/messages were performed.
- Chromium automation is not Safari, Firefox, Edge, Android Chrome or iOS Safari validation. No physical touch, screen-reader, full zoom/text-spacing suite or screen-reader modal isolation test was performed.
- The browser harness stalled ordinary optimizer image loads. Visual checks fetched the same production optimizer URLs using the Playwright request client and fulfilled browser requests with their actual responses. This allowed rendered inspection but prevents a clean delivery/CWV signoff. Raw production behavior must be retested independently; the harness anomaly was not promoted to a site defect.
- Throttled timing observations are lab diagnostics with that image workaround and warm optimizer caches. No Lighthouse score, field INP, p75 RUM, complete session-window CLS or formal Lighthouse TBT is available.
- No approved page designs, current indexed-URL export, analytics destination, consent specification or recovery drill evidence was available. See [VERIFICATION.md](VERIFICATION.md) for risk-specific validation plans.

## Deliverables

- [FINDINGS.md](FINDINGS.md) — all 15 issues, source locations, evidence, reproduction, remediation and validation.
- [REMEDIATION.md](REMEDIATION.md) — ordered work, dependencies, effort ranges and measurement contract.
- [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) — objective deployment/release/rollback gates.
- [INVENTORY.md](INVENTORY.md) — architecture, routes, components, business flows and baseline.
- [VERIFICATION.md](VERIFICATION.md) — methods, pass/fail results, measurements and unverified risks.
- [evidence/README.md](evidence/README.md) — screenshot, log, scan and data provenance.
