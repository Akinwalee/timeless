# Verification record and remaining risks

## Scope and method

Source reviewed: commit `60655c89a1a46e0d79cb0c470705b518f73eb378`, initially clean. Source routes, layouts, shared components, content adapters/queries/schemas, bag helpers/tests, image helpers/tests, configuration, README, image-performance documentation, local brand PDF and retained static website were inspected. The entire source-visible public route structure is inventoried; unpublished/current remote CMS records were not enumerated.

Two disposable source copies under `/private/tmp/` used the existing installed dependency tree. `.env.local`, Git metadata and authenticated sessions were not copied. The builds ran without Sanity configuration; one also had the explicit dummy WhatsApp number `15555550123`. Local runtime servers listened only on 127.0.0.1 ports 3107/3108 with an empty, allowlisted environment. No dependency install, CMS seed, external form submission, WhatsApp navigation, production order, data mutation or deployment occurred. Advisory registry queries sent dependency names/versions.

The local execution sandbox initially denied binding a listening port; the loopback server was subsequently approved and ran successfully. The registry initially failed DNS access; an approved retry completed and its final successful response is retained. Neither initial environment failure is treated as an application defect. The security component is source/advisory/local-response review, not penetration testing or independent exploit validation.

The browser's ordinary `/_next/image` requests stalled even though the Playwright request client returned the same URLs successfully. For visual and journey tests, a page-level route fetched each optimizer URL with the request client and fulfilled the browser request from its actual response. Application HTML, CSS, JS and image content were not replaced with mocks. This workaround changes request transport/cache/format negotiation and cannot validate normal production image delivery. The anomaly is recorded as a validation limitation, not an established defect.

Axe 4.11.4 was injected only into the audit browser; no axe code was added to the application. A copy in disposable audit public assets was not used by the shipped repository. Browser automation used Chromium; it does not establish any other browser's behavior. Viewports are CSS sizes, not physical devices. Screenshots were visually inspected, including full scrolled captures and contact sheets. Full-page screenshots freeze scroll-pinned animation state; blank pin-spacer areas or fixed elements composited near the current scroll position are not independently reported as layout defects.

## Executed checks

| Check | Result | Evidence / limitation |
|---|---|---|
| `npm test` | PASS, 4 files / 19 tests | [tests.txt](evidence/tests.txt); bag/product/images/loading helpers |
| `npm run lint` | PASS, exit 0 | [lint.txt](evidence/lint.txt) |
| `npm run typecheck` | PASS, exit 0 | [typecheck.txt](evidence/typecheck.txt); disposable-copy generated types |
| `npm run build` without CMS/checkout | PASS | [build.txt](evidence/build.txt), all fallback content prerendered |
| `NEXT_PUBLIC_WHATSAPP_NUMBER=15555550123 npm run build` without CMS | PASS | [build-dummy-checkout.txt](evidence/build-dummy-checkout.txt) |
| `next start` on both builds | PASS | Routes and journeys exercised against production runtime |
| Nine public content URLs, direct arrival | PASS HTTP/render; a11y failures | [routes-375.json](evidence/routes-375.json); no pageerrors per route |
| 375/768/1440/1920 representative layouts | MIXED | [responsive.json](evidence/responsive.json); tablet overflow confirmed |
| 320px product reflow | PASS spot check | [product-320.png](evidence/product-320.png); scrollWidth=innerWidth=320; not full zoom certification |
| Newsletter invalid email | PASS | Native validity=false; no success; [newsletter.json](evidence/newsletter.json) |
| Newsletter valid email | FAIL | False success, no subscription write; same evidence |
| Product selection and bag | PASS tested path | Cream/M; increment to 2; reload restores ₦30,000; [journeys.json](evidence/journeys.json) |
| Empty bag / removal / clear confirmation / keep | PASS | [additional-journeys.json](evidence/additional-journeys.json) |
| Checkout not configured | PASS intentional guard | Disabled CTA and truthful status; [bag-unconfigured-375.png](evidence/bag-unconfigured-375.png) |
| Configured checkout handoff | PASS URL generation only | White/L/1/₦15,000 in URL; [dummy-checkout.json](evidence/dummy-checkout.json); no WhatsApp opening/receipt |
| Product gallery | PASS tested controls | Initial close focus, ArrowRight=02/03, three Tabs cycle, Escape restores trigger |
| Mobile menu | PASS tested controls | Close focus on open; Escape restores Open menu; full screen-reader isolation not tested |
| Carousel keyboard and Next control | PASS | Focused region ArrowRight changes scrollLeft 0→321 and 02/03; Next→03/03; [carousel-and-navigation.json](evidence/carousel-and-navigation.json) |
| Client navigation and Back/Forward | PASS | Home→Shop→Back Home→Forward Shop after waiting for URL; same evidence |
| Reduced motion | FAIL | Persistent full-screen black overlay; [failure-scenarios.json](evidence/failure-scenarios.json) |
| JavaScript disabled | FAIL visual fallback | Persistent black overlay; browsing content cannot be read visually |
| Blocked bag storage | FAIL | Injected SecurityError crashes page; same evidence |
| Header focus after downward scroll | FAIL | Focused home link entirely above viewport; [hidden-header-focus.json](evidence/hidden-header-focus.json) |
| Axe on nine routes | FAIL | Verified contrast; prohibited home paragraph ARIA; incomplete checks retained |
| Legacy Journal URL | PASS | 308 to `/in-the-wild`; [http-probes.json](evidence/http-probes.json) |
| Unknown top-level URL | PASS | 404 + noindex; same evidence |
| Unknown content slugs | OBSERVED 200 + noindex | Framework streamed not-found response; see R-05 |
| Robots/sitemap | FAIL | Both 404 |
| Rendered metadata | INCOMPLETE | Titles/descriptions present; canonical/OG/Twitter absent |
| Current tracked source secret patterns | No matches | [source-security-scan.json](evidence/source-security-scan.json); not a history/secret-store audit |
| Local `.env.local` and representative source-map request | 404 | Disposable runtime only; [http-probes.json](evidence/http-probes.json) |
| Local response headers / compression | OBSERVED | HTML gzip/cache headers present; app-level CSP/frame/nosniff/referrer headers absent; edge unknown |
| Registry dependency audit | FAIL dependency gate | 25 package entries, not 25 proven exploits; [dependency-audit.json](evidence/dependency-audit.json) |

The first broad interaction script had a stale scroll position and attempted to click the auto-hidden header. It was rerun with a real upward scroll, without forced clicks. A first carousel/history observation read state too early. [carousel-and-navigation.json](evidence/carousel-and-navigation.json) is the settled result and supersedes those early timing fields in `additional-journeys.json`. Header keyboard-focus hiding was separately reproduced and retained as TL-013. Fault-injection errors are expected failures, not unexplained clean-route console errors.

### Accessibility interpretation

Automated scans use WCAG 2 A/AA, 2.1 AA and 2.2 AA rule tags. They identify 42 contrast nodes across the nine mobile route snapshots, grouped into one systemic finding rather than 42 tickets. Counts may omit animated/offscreen text and do not establish the total number of failures. The home scan also warns that a nested scroll track is not focusable. Manual testing demonstrated the focusable parent region's ArrowRight and visible next control work, so that warning was not promoted to a confirmed keyboard barrier. Assistive-technology semantics still need human validation.

Shared `lang=en`, main landmarks, skip link, labelled email inputs, button names, pressed state, native bag dialog, and gallery/menu focus behavior are positive source/runtime observations. They do not offset reduced-motion blackout, verified contrast failures or offscreen header focus. Target-size coverage, text-only 200% resizing, 400% zoom/reflow across every route, text-spacing overrides, video captions and a full screen-reader audit remain incomplete.

## Performance

Six diagnostic visits: three Home and three Product, fresh browser contexts at 375×812, DPR 1, browser cache disabled, 4× CPU slowdown, 150ms CDP network latency and 200,000 bytes/s download (approximately 1.6Mb/s). Measurements were read 6.5 seconds after DOMContentLoaded. The Next optimizer cache was retained/warm. Image requests used the transport workaround described above and bypass a normal end-to-end throttled image path.

| Route | FCP samples (ms) | Last observed LCP samples (ms) | Sum of non-input layout shifts | Largest long task (ms) | Initial loaded JS encoded body |
|---|---|---|---|---|---|
| Home | 980, 832, 832 | 980, 832, 832 | ≈0.0000294 each | 217, 159, 158 | 213,893 bytes / 14 files |
| Product | 784, 764, 776 | 784, 764, 776 | ≈0.004466 each | 164, 163, 159 | 209,905 bytes / 14 files |

Source and raw observations: [performance-probe.js](evidence/performance-probe.js), [performance.json](evidence/performance.json). Encoded JS is Resource Timing data, not total route transfer; it excludes document/RSC/inline script and fonts/images. [bundles.json](evidence/bundles.json) inventories the largest on-disk chunks, including Studio code. The largest chunk is approximately 2.4MB raw / 804KB gzip on disk; that is **not** evidence that it is loaded on the storefront. The observed storefront resource set is the relevant initial sample.

These samples show relatively low observed paint/shift numbers in this setup, but **do not pass the production performance gate**. The final LCP entry was a paragraph on Home; an animation's reveal completion is not necessarily captured by LCP. Long tasks justify further interaction profiling, but they are not field INP. The layout-shift sum is not the official session-window CLS computation. No Lighthouse score or formal TBT was produced. No failed requests were recorded within these six instrumented samples; that does not eliminate the separate ordinary-image-transport anomaly.

No CrUX, RUM, production p75 INP, field LCP/CLS, cold CDN/optimizer runs, actual mobile device thermal/CPU behavior, or deployment compression/CDN waterfall was available. Re-run on the actual production candidate using ordinary image transport and standard Lighthouse/Web Vitals tooling. Target good field p75 LCP≤2.5s, INP≤200ms and CLS≤0.1; lab measures are pre-release guardrails, not substitutes for those field statistics. Historical results in `docs/image-performance.md` are prior work, not rerun evidence or a deployed-after baseline.

## Scenario results

| Requested scenario | Result and practical limit |
|---|---|
| First-time mobile social visitor | Mobile landing and responsive captures exercised; reduced-motion variant fails. Actual social referrer/UTM attribution and preview destination unverified |
| First-time desktop search visitor | Desktop pages render; titles/descriptions exist; canonical/social/discovery gaps remain; real search index arrival untested |
| Multi-page understanding | Home/Shop/About/Journal/Wild loaded; CTA→Shop and history verified; content review finds coherent narrative but weak sizing/policies |
| Primary conversion | Colour/size→bag→itemized dummy WhatsApp URL verified; real recipient/app/merchant completion excluded |
| Validation/server error | Invalid email rejected; valid-email false success; storage failure reproduced. Real subscription server error cannot be tested because no backend exists |
| Keyboard-only visitor | Gallery/menu/carousel tested; hidden-header focus defect. Screen-reader and full end-to-end keyboard coverage incomplete |
| Slow mobile network | Controlled diagnostic observations collected with explicit image transport limitation; no deployment signoff |
| Direct deep link | Product and article direct loads plus size-guide hash verified; invalid routes probed |
| Tracking denied | No nonessential analytics SDK or consent mechanism exists in inspected app. This is absence of instrumentation, not proof of a compliant consent implementation |
| Returning after new deployment | Bag survives reload; existing versioned parser tests pass. Cross-release deployment/browser-cache coexistence and rollback were not exercised |

## Unverified risks and required follow-up

These entries are deliberately **not included in confirmed severity counts**.

| Risk ID | Source-grounded concern / missing evidence | Safe validation and acceptance |
|---|---|---|
| R-01 | `sanity/lib/fetch.ts:59–61,163–170` treats a configured CMS fetch error as unconfigured and returns local product data. `lib/content/fallback.ts:17–26` marks the tee available at its independent price. Settings fall back too. Live outage consequences are untested | In an isolated CMS fixture, publish sold-out/different-price content, deny reads and verify the chosen last-known-good or checkout-disabled policy. Owner must approve whether fallback commerce data can ever be offered |
| R-02 | No tracked CI/deployment config, documented alert delivery, health probe or rollback rehearsal; hosting controls could exist elsewhere | Identify provider/project/runtime and release owner; require quality-gate logs, synthetic checks, an alert received by the owner and a recorded staging restore of a previous immutable release |
| R-03 | Local Next HTML omits CSP, frame restrictions, nosniff and explicit referrer policy; local HTTP cannot establish HTTPS/HSTS at the edge | Inspect actual candidate-domain responses and test intended embed policy. Adopt a compatible CSP and headers based on the actual trust model. Verify TLS/redirects/HSTS, cookies if introduced and Studio/CMS CORS. No confirmed XSS/clickjacking exploit is claimed. [OWASP header guidance](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) |
| R-04 | Price, quantities, images and labels in localStorage/WhatsApp text are client-controlled; there is no authoritative checkout server | Merchant must treat messages as order requests and verify current price/stock/payment. Test stale bags against changed prices/status; never use a client message as proof of payment |
| R-05 | Missing dynamic slugs return 200 with noindex after streaming; global unknown paths return 404 | This matches [documented Next behavior](https://nextjs.org/docs/app/api-reference/file-conventions/not-found). Preserve noindex, check CDN caching and Search Console; decide whether strict pre-stream 404 handling is a migration requirement. Not counted as a confirmed indexing defect |
| R-06 | Current production domain/deployment, published records, CMS roles/dataset visibility/CORS, source-map exposure and edge rate controls unobserved | Read-only operator review and staging smoke test; confirm no private documents/tokens reach public payloads and no editor privilege is available anonymously |
| R-07 | Policy promises, product details, social/support ownership and processing contracts not approved in available evidence | Business/legal owner reviews facts and disclosures. Test owned channels only with explicit authorization; do not invent measurements, policies or processor retention claims |
| R-08 | Other browser engines, real mobile devices, assistive technology, full zoom/targets/captions not tested | Execute the device/AT matrix in the release checklist and retain results; no compliance pass until critical journeys are usable |
| R-09 | Dependency advisories have environment/input preconditions and scanner metadata includes development/CLI dependencies | Triage exact installed paths on the production platform against maintainers' conditions; no exploit attempts needed. Resolve applicable high/critical matches, document exclusions, then rerun scans. Registry suggestions involving major upgrades/downgrades require compatibility review |
| R-10 | No migration URL/index inventory, social debug access, analytics collection destination or genuine field performance evidence | Obtain legacy indexed URLs/redirect plan, candidate-domain social previews, test analytics collector access and production RUM; verify after deployment |

## Optional quality opportunities

The Journal displays “All / Process / Notes / Campaign” as spans with an active underline (`app/journal/page.tsx:26–28`). If intended as filters, implement accessible filtering; if informational categories, adjust presentation so it does not imply an interactive tab set. No filter requirement was available, so this is not counted as a broken feature.

The home journey is long and scroll-driven. Review narrative pacing with first-time shoppers after instrumenting the funnel, rather than assuming a long page is inherently defective. Great Vibes is preloaded globally although no current component uses `.script`; consider avoiding unused font preload after verifying the intended brand use. Improve generic image descriptions and verify optional video caption/transcript handling when actual CMS media fixtures exist.
