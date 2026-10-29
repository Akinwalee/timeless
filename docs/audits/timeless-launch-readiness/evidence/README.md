# Audit evidence index and provenance

Collected 28 October 2026 from credential-free disposable copies of commit `60655c89a1a46e0d79cb0c470705b518f73eb378`. No production data or credentials are retained. The number `15555550123` is an explicit dummy test destination; it was never opened or messaged. `audit@example.invalid` is a local synthetic form input; the form did not submit it.

## Test/build/scanner outputs

| File | What it proves / limit |
|---|---|
| [tests.txt](tests.txt) | Existing Vitest run: 4 files / 19 tests passed |
| [lint.txt](lint.txt) | ESLint invocation completed exit 0; no diagnostics |
| [typecheck.txt](typecheck.txt) | TypeScript noEmit completed exit 0; no diagnostics |
| [build.txt](build.txt) | Fallback, unconfigured checkout production build and route table |
| [build-dummy-checkout.txt](build-dummy-checkout.txt) | Separate fallback production build with dummy WhatsApp number |
| [dependency-audit.json](dependency-audit.json) | Final successful registry audit; 25 package entries, not proven application exploits |
| [dependency-audit-stderr.txt](dependency-audit-stderr.txt) | Final registry invocation stderr (empty); initial DNS failure was superseded by approved successful retry |
| [dependency-paths.json](dependency-paths.json) | `npm ls next sharp dompurify undici --all --json` against installed dependency tree |
| [source-security-scan.json](source-security-scan.json) | Bounded current tracked-source pattern scan, no values recorded; not a Git-history audit |
| [bundles.json](bundles.json) | Largest on-disk JS chunks including Studio; not storefront transfer attribution |

Build logs refer to temporary copy paths, not application changes. No install or remediation was performed. Application source was checked unchanged with Git after the audit.

## Browser and HTTP observations

| File | Associated findings / verification |
|---|---|
| [routes-375.json](routes-375.json) | All nine content routes: status, headings, metadata, links, pageerrors, width, axe findings/incomplete rules; TL-004/006/007/010/012 |
| [axe-home.json](axe-home.json) | Focused home scan with exact affected HTML/selectors; TL-004/012 |
| [responsive.json](responsive.json) | Seven routes × three larger viewports; width and visible-image state. Snapshot timing predates final settled recaptures; hidden/lazy images are not counted as broken assets |
| [tablet-overflow.json](tablet-overflow.json) | Frame/element geometry at 768×1024, repeated after settling; TL-005 |
| [journeys.json](journeys.json) | Product choice, bag refresh persistence/totals, disabled checkout, gallery and menu focus checks |
| [dummy-checkout.json](dummy-checkout.json) | Decoded configured checkout URL, non-sending boundary and actual size-guide copy; TL-009 |
| [newsletter.json](newsletter.json) | Native invalid input rejection, valid false success, observed requests and footer destinations; TL-002/003/010 |
| [failure-scenarios.json](failure-scenarios.json) | Reduced-motion/no-JS overlay styles and controlled denied-storage crash; TL-001/011 |
| [hidden-header-focus.json](hidden-header-focus.json) | Entirely offscreen focused link after downward scroll; TL-013 |
| [additional-journeys.json](additional-journeys.json) | Clear confirmation/Keep/remove/empty and 320px width check. Early carousel/history fields were read too soon and are superseded by next record |
| [carousel-and-navigation.json](carousel-and-navigation.json) | Settled carousel keyboard/Next changes and Home→Shop→Back→Forward verification |
| [http-probes.json](http-probes.json) | Local headers, robots/sitemap 404, redirect 308, unknown routes, Studio noindex, representative source-map/environment-path 404; TL-008 |
| [browser-console.txt](browser-console.txt) | Selected normal browser context: no warnings/errors at capture time; isolated fault-test errors are in failure-scenarios.json |
| [browser-network.txt](browser-network.txt) | Non-static request log, including RSC navigation/prefetch; not an analytics destination log |
| [performance.json](performance.json) | Six fresh-context CDP-throttled diagnostic runs and full resource/observer observations |
| [performance-probe.js](performance-probe.js) | Reproducible browser-tool probe; pass as Playwright run-code function/file with a live credential-free local server |

## Screenshots

Seven page keys are `home`, `shop`, `shop-essential-tee`, `about`, `journal`, `journal-the-making-of-drop-001`, and `in-the-wild`.

- `{page-key}-{375|768|1440|1920}.png` — actual viewport captures at 375×812, 768×1024, 1440×900 and 1920×900. Larger-view final captures waited 2.6 seconds on Home / 1.8 seconds on other routes to avoid reporting animation-in-progress as clipping.
- `{page-key}-{375|1440}-full.jpg` — full scrolled captures, retained as quality-86 JPEGs to limit repository size. The production page itself was not edited or recompressed. Frozen scroll-pinned state and fixed-element placement in full-page screenshots are capture limitations, not separate defects.
- `journal-identity-is-not-static-375.png` and `journal-first-frame-375.png` — other current fallback article routes.
- `contact-sheet-{375|768|1440|1920}.jpg` — final viewport overview sheets. Review thumbnails are for comparison; original viewport files retain detail.
- `review-{page-key}-{375|1440}.jpg` — sliced full-page visual-review sheets for selected pages. They preserve the scrolled capture state, including pinned-sequence limitations.
- [reduced-motion-black.png](reduced-motion-black.png) and [no-javascript-black.png](no-javascript-black.png) — TL-001.
- [newsletter-false-success.png](newsletter-false-success.png) — TL-002; [size-guide.png](size-guide.png) — TL-009.
- [storage-blocked.png](storage-blocked.png) — TL-011; [hidden-header-focus.png](hidden-header-focus.png) — TL-013.
- [bag-unconfigured-375.png](bag-unconfigured-375.png), [bag-dummy-checkout-375.png](bag-dummy-checkout-375.png), [carousel-keyboard.png](carousel-keyboard.png), [product-320.png](product-320.png) — journey/reflow support.

## Interpretation rules

All visual/journey captures used actual optimized-image response bodies fetched through the request client because ordinary browser image loads stalled in this harness. This changes transport/cache/format negotiation. It supports layout/content inspection but cannot establish normal delivery performance or a production Core Web Vitals pass. No replacement stock images or design mocks were used.

No screenshot establishes a pixel-perfect match to approved designs: none were available. Brand comparison uses the supplied PDF, retained in the repository root rather than duplicated here. No screenshot, axe pass, secret-pattern scan or dependency advisory match is treated as proof of whole-site compliance, security or exploitable impact. Refer to [../VERIFICATION.md](../VERIFICATION.md) for exact limits and follow-up plans.
