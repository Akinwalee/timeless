# Detailed findings register

15 confirmed findings: **P0 0 · P1 5 · P2 9 · P3 1**. Counts represent root causes, not individual DOM nodes or scanner advisories. Confirmed dependency versions/advisory matches are distinguished from unproven exploitability. Unverified risks are recorded separately in [VERIFICATION.md](VERIFICATION.md).

Locations are repository-relative with exact reviewed line numbers. Evidence uses the credential-free fallback build unless explicitly marked dummy checkout. Application code was not changed.

## Accessibility and progressive enhancement

### TL-001 — P1 — Reduced-motion and JavaScript-disabled visits are completely black

- **Location:** `components/motion/PageTransition.tsx:11–15`; `app/globals.css:95`; mounted globally at `app/layout.tsx:41`.
- **Confirmed behavior:** The reduced-motion guard returns before hiding the fixed, opaque, black transition overlay. With JavaScript disabled, it also remains in its initial full-screen state. Computed transform is `none`, background is `rgb(0,0,0)`, and dimensions are 375×812. The rendered page is entirely black.
- **Launch impact / likelihood / blast radius:** Every public route uses this overlay. Any visitor with reduced motion enabled loses the visual site and purchase journey. No-JS users and delayed/failed hydration are also exposed to the initial overlay. High impact; preference-dependent incidence. P1 rather than P0 because normal hydrated visits work.
- **Evidence:** [Reduced-motion screenshot](evidence/reduced-motion-black.png), [no-JS screenshot](evidence/no-javascript-black.png), [computed styles](evidence/failure-scenarios.json).
- **Reproduce:** Set `prefers-reduced-motion: reduce` before loading `/shop`; wait beyond animation duration. Repeat with JavaScript disabled. No source alteration is needed.
- **Expected / observed:** Skipping decorative animation should leave content visible; instead it leaves an opaque overlay above it.
- **Remediation:** Make the default/SSR overlay non-obscuring; opt into an active overlay only while a permitted animation runs. Ensure cleanup and motion-preference changes cannot leave it visible.
- **Validation:** Fresh loads and client route changes in normal/reduced motion, JS-disabled rendering, delayed JS and animation cancellation must show readable content. Save before/after screenshots and add a browser regression for the actual overlay state.

### TL-004 — P1 — Low-contrast secondary text is systemic, including purchase guidance

- **Location:** `components/product/ProductPurchase.tsx:26,44,48`; `components/product/ProductColourSelector.tsx:22`; `app/journal/page.tsx:23,28,43`; `app/in-the-wild/page.tsx:15,25`; shared footer and other `text-black/40`, `/45`, `/50` uses.
- **Confirmed behavior:** Axe 4.11.4 flags contrast on all nine content URLs. Examples include a selected colour name and size guidance at 12px using black/50 on white: #808080, approximately **3.94:1**, below 4.5:1. Black/45 editorial text is approximately #8c8c8c, **3.36:1**. This finding excludes inactive controls and uncertain photographic backgrounds.
- **Launch impact / likelihood / blast radius:** Low-vision visitors encounter faint labels and supporting purchase information throughout the site. Shared styling makes recurrence likely across every template. WCAG 2.2 AA 1.4.3 is not met for verified normal-size text.
- **Evidence:** [Per-route axe results with HTML/selectors](evidence/routes-375.json), [home scan](evidence/axe-home.json), [product capture](evidence/shop-essential-tee-375-full.jpg).
- **Reproduce:** Load the product route at 375px and inspect the selected colour, size prompt and supporting copy; run axe or compute contrast from the resolved text/background colours.
- **Expected / observed:** Normal-size meaningful text ≥4.5:1; multiple observed values are lower. [W3C criterion](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- **Remediation:** Introduce accessible secondary/muted text tokens for light and dark surfaces and replace failing opacity styles. Check image overlays separately rather than assuming a token solves them.
- **Validation:** Rerun automated scans on all routes and bag/menu states; manually check overlaid text, focus and disabled-state distinctions. Do not count passing axe alone as complete WCAG compliance.

### TL-012 — P2 — Home lacks an H1 and animated paragraph receives prohibited ARIA

- **Location:** `components/motion/HeroScene.tsx:17,30`; `app/page.tsx:18`.
- **Confirmed behavior:** The home headline is a `<p>`; the whole page has zero H1 elements. GSAP SplitText adds `aria-label` to that paragraph, producing axe `aria-prohibited-attr`. The missing H1 is a document-structure/SEO improvement, not by itself a claim that WCAG mandates exactly one H1.
- **Impact / scope:** The principal message is absent from heading navigation and animation creates invalid accessibility semantics on the busiest landing route. Medium discoverability/accessibility impact, all home visits.
- **Evidence:** [DOM and axe](evidence/routes-375.json), [home scan](evidence/axe-home.json).
- **Reproduce:** Inspect heading elements after the intro animation; inspect `.hero-copy` and run axe.
- **Expected / observed:** A meaningful page heading with valid animation semantics; observed paragraph with invalid ARIA and no H1.
- **Remediation:** Use a semantic heading and configure SplitText accessibility behavior for that element. Preserve intelligible accessible text without duplicate announcements.
- **Validation:** Heading navigation finds the main proposition; axe has no prohibited-ARIA finding; screen-reader output remains correct before/after animation and under reduced motion.

### TL-013 — P2 — Auto-hidden navigation can retain entirely offscreen keyboard focus

- **Location:** `components/site/SiteHeader.tsx:38–49,74–83`.
- **Confirmed behavior:** Scroll `/shop` to y=1800, focus the skip link and Tab to the home link. Focus lands on “Timeless home” while its bounding rectangle is top −70.94px, bottom −9.06px: wholly above the viewport. The header remains `-translate-y-full` because focus does not reveal it.
- **Impact / scope:** Keyboard users can lose sight of focused navigation after scrolling. It affects the shared header, with a recovery by scrolling upward; P2 reflects that recovery and the demonstrated entry sequence.
- **Evidence:** [Focus geometry](evidence/hidden-header-focus.json), [screenshot](evidence/hidden-header-focus.png).
- **Expected / observed:** Focused navigation remains visible; observed focus is entirely offscreen. Relevant criteria include 2.4.7 and [2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum).
- **Remediation:** Reveal/retain the header while it or its descendants have keyboard focus; preserve the intended pointer-scroll behavior.
- **Validation:** Tab and Shift+Tab into every header control after scrolling at mobile/desktop widths. Assert each focused bounding box intersects the viewport and focus indication is visible.

## Conversion, commerce information and privacy

### TL-002 — P1 — Newsletter claims success while discarding every subscription

- **Location:** `components/site/Newsletter.tsx:7–12`; used at `app/page.tsx:60` and `components/site/SiteFooter.tsx:11`.
- **Confirmed behavior:** `onSubmit` prevents default submission and sets `joined=true`; it never reads or persists the email. `audit@example.invalid` produces “Watch your inbox.” No subscription POST or processor request occurs. A valid native input is the only success condition. Invalid email is correctly rejected by the browser.
- **Impact / likelihood / scope:** All apparently successful newsletter conversions are lost. Visitors receive a misleading confirmation. This is especially consequential during launch/drop promotion and regresses the old page's actual submission attempt.
- **Evidence:** [Submission observation](evidence/newsletter.json), [false-success screenshot](evidence/newsletter-false-success.png), previous `index.html:1419–1432` submission code (not invoked).
- **Reproduce:** Submit a valid email on any footer while watching Network; refresh. The status appears without a write and disappears after refresh.
- **Expected / observed:** Confirmation follows accepted subscription at the selected backend; observed local-only success with no submission. No evidence of actual email collection by this component.
- **Remediation:** Connect a real, approved subscription processor with server-confirmed success, validation, failure/retry and abuse controls, or remove the signup offer until functional. Do not blindly reactivate the historical webhook.
- **Validation:** Controlled test address reaches the destination exactly once, failure/offline cases show recoverable errors without false success, and no raw email is sent to analytics. Verify actual destination receipt in a test mode with consent/disclosure decisions complete.

### TL-003 — P1 — Shipping, returns, privacy and terms are dead links

- **Location:** `components/site/SiteFooter.tsx:17`; delivery/returns promises at `components/product/ProductPurchase.tsx:47`; no corresponding public page implementations.
- **Confirmed behavior:** All four footer links point to `#`; they do not open policy information. The product nonetheless promises complimentary Nigerian delivery above ₦50,000 and easy returns within seven days.
- **Impact / scope:** Every shopper lacks actionable fulfilment/returns conditions and privacy information before the WhatsApp handoff. Newsletter and external processor disclosures cannot be reviewed. This is a confirmed content/trust failure; legal noncompliance is not conclusively established by this audit.
- **Evidence:** [Footer destinations](evidence/newsletter.json), [product/footer capture](evidence/shop-essential-tee-375-full.jpg).
- **Reproduce:** Click each footer policy link; inspect its destination. No disclosure document is presented.
- **Expected / observed:** Accessible, approved documents describing the actual business processes; observed same-page fragment destinations.
- **Remediation:** Publish business-approved shipping, returns, privacy and terms content and wire the links. Reconcile promises with actual operations. Describe local bag storage, WhatsApp handoff, CMS/hosting, and any added newsletter/analytics processing. Obtain appropriate legal review without inventing policies or facts.
- **Validation:** Each link returns a readable 200 document; mobile/keyboard users can reach it; business owner verifies policy wording against fulfilment/data practices.

### TL-009 — P2 — “Size guide” offers no measurements or actionable size comparison

- **Location:** `components/product/ProductPurchase.tsx:39`; `app/shop/[slug]/page.tsx:39`.
- **Confirmed behavior:** The link reaches a section containing a fit sentence and the same XS–XXL list already in the selector. It has no garment/body dimensions, measurement instructions or size comparisons.
- **Impact / scope:** First-time shoppers cannot reliably choose a size for the only product, increasing WhatsApp questions, abandonment and return risk. Conversion loss is a plausible consequence, not measured in this audit.
- **Evidence:** [Actual target copy](evidence/dummy-checkout.json), [size guide](evidence/size-guide.png).
- **Reproduce:** Select “Size guide” on the product page and try to distinguish M from L using the supplied information.
- **Expected / observed:** Useful sizing information, or an accurately labelled fit note; observed marketing fit note and duplicate size list.
- **Remediation:** Obtain approved measurements and instructions; label garment/body units clearly. If measurements are unavailable, rename the link and provide a truthful sizing-support route.
- **Validation:** A user can identify the appropriate size from approved dimensions; fragment navigation and keyboard context remain usable.

## Visual design and brand

### TL-005 — P2 — Tablet image frames overflow across three major pages

- **Location:** `app/shop/page.tsx:15`; `app/about/page.tsx:25`; `app/journal/page.tsx:39`.
- **Confirmed behavior:** At 768×1024, aspect ratios combined with viewport minimum heights expand image frames beyond available inline space. Shop document width=1006px (frame≈983px), About=1115px (frame≈1092px), Journal=924px (frame≈901px), for a 768px viewport. The body clips horizontal overflow, so `overflow-x: clip` does not fix the underlying geometry.
- **Impact / scope:** Major imagery is cropped/extends offscreen at the tablet breakpoint. The same frames pass the sampled 375, 1440 and 1920 widths. Likely on tall tablet orientations; medium visual impact.
- **Evidence:** [Overflow element rectangles](evidence/tablet-overflow.json), [responsive matrix](evidence/responsive.json), [Shop](evidence/shop-768.png), [About](evidence/about-768.png), [Journal](evidence/journal-768.png).
- **Reproduce:** Load those routes at exactly 768×1024 and compare `documentElement.scrollWidth` with `innerWidth`; inspect the named frame rectangles.
- **Expected / observed:** Frames stay within their container; observed intrinsic expansion by hundreds of pixels.
- **Remediation:** Resolve minimum block-size/aspect-ratio constraints so width remains bounded; review grid minimum sizing. Avoid treating clipping as the remedy.
- **Validation:** Capture 767, 768, 820 and 1024px portrait/landscape layouts. Assert document width and frame rectangles stay bounded; inspect cropping rather than relying only on the width assertion.

### TL-014 — P3 — Display typography departs from the documented brand system

- **Location:** `app/globals.css:64–69`; `app/layout.tsx:11–23`; `Timeless Brand Guidelines.pdf`, pages 28–32.
- **Confirmed deviation:** The guidelines name Host Grotesk as primary, Dragon Inktrap for secondary expressive headlines, and 0.9 heading leading. `.display` prioritizes Arial Narrow / Helvetica Neue Condensed, has no supplied Dragon font, and uses 0.84 leading. Host and Great Vibes are loaded correctly. System font availability can therefore change display typography across platforms.
- **Impact / scope:** Brand consistency and wrapping may vary across desktop/mobile operating systems. No approved page-specific exemption or browser comparison was available; this is a verified guideline deviation, not proof the visual direction was rejected.
- **Evidence:** [Brand comparison notes](INVENTORY.md#baseline-and-brand-comparison), [rendered home](evidence/home-1440.png); supplied PDF.
- **Reproduce:** Compare computed `.display` font stack/line height with the guideline typography pages; inspect the shipped font directory.
- **Expected / observed:** Brand-approved, deliberate font/leading choices; observed undocumented system-font substitutes and tighter leading.
- **Remediation:** Obtain brand signoff for the current treatment or use an appropriately licensed approved font with stable web fallbacks. Do not acquire or substitute a font without approval/licensing clarity.
- **Validation:** Brand owner approves the treatment; verify wrapping, overlap and fallback rendering on real Safari/Chrome platforms.

## Analytics and measurement

### TL-006 — P2 — No application analytics or conversion instrumentation

- **Location:** `app/layout.tsx:25–44`; `components/product/ProductSelection.tsx:30–38`; `components/bag/BagDrawer.tsx:81–82`; `components/site/Newsletter.tsx:8`; no analytics module/provider found in application source.
- **Confirmed behavior:** No analytics SDK, pageview, CTA, bag or handoff event code exists. Observed local runtime resources contain application/media traffic, with no analytics collection calls. No destination collection was verified. Hosting-level analytics could exist but would not establish these custom business events.
- **Impact / scope:** The team cannot measure the product → bag → WhatsApp funnel or signup failures from the application. All launch campaigns are affected; revenue loss is not directly quantified.
- **Evidence:** [Resource records](evidence/performance.json), [submission network observation](evidence/newsletter.json), inspected locations above.
- **Reproduce:** Inspect code and Network while navigating and adding to bag; verify absence of the expected named business-event emission.
- **Expected / observed:** Defined, privacy-reviewed funnel events reaching a known test destination; observed no instrumentation.
- **Remediation:** Implement the minimal event contract in [REMEDIATION.md](REMEDIATION.md#measurement-contract), including client navigation, attribution and handoff semantics. Record consent/internal-traffic behavior and exception reporting.
- **Validation:** Verify exact event counts/properties both in browser requests and destination debug view; test route changes, rerenders, denied consent, failure paths and PII exclusion. A configured ID alone is insufficient.

## SEO and social sharing

### TL-007 — P2 — Public pages lack canonical and social-sharing metadata

- **Location:** `app/layout.tsx:25–29`; metadata at `app/about/page.tsx:9`, `app/shop/page.tsx:7`, `app/journal/page.tsx:10`, and dynamic route metadata generators.
- **Confirmed behavior:** DOM extraction across all nine routes finds titles/descriptions but no canonical, Open Graph or Twitter card/image metadata. Shop/About inherit the generic brand description. No JSON-LD is rendered by these templates.
- **Impact / scope:** Campaign and product links have no deliberate social preview, canonical host/path is not declared, and route-specific search snippets are under-specified. Missing structured data is an opportunity, not a claimed ranking penalty or eligibility guarantee.
- **Evidence:** [Actual rendered head metadata](evidence/routes-375.json).
- **Reproduce:** Inspect head tags on `/`, `/shop/essential-tee` and a Journal article; search for canonical, `og:*` and `twitter:*`.
- **Expected / observed:** Correct production absolute URLs, route-specific content and approved share image; observed missing tags and inherited descriptions.
- **Remediation:** Establish the verified production origin and shared metadata builder; supply per-template descriptions, canonical and share images. Add accurate Product/Article/Organization data only where appropriate and factually supportable.
- **Validation:** Fetch rendered HTML and check exact canonical/OG URLs and image 200 responses; preview real social shares after deployment and validate any structured data.

### TL-008 — P2 — No sitemap or robots discovery resources

- **Location:** `app/` route inventory and `public/`; `next.config.ts:8–17` contains only the legacy Journal redirect, not discovery resources.
- **Confirmed behavior:** `/robots.txt` and `/sitemap.xml` both return 404. The build route table and filesystem contain no implementation. Public pages remain crawlable through links; absence of robots.txt does not itself block indexing.
- **Impact / scope:** New product/editorial URLs have no explicit sitemap discovery path; intended host/indexing policy is undocumented in the delivered artifact. This is particularly relevant when moving from the single-page waitlist to multiple content routes.
- **Evidence:** [HTTP probes](evidence/http-probes.json), [build routes](evidence/build.txt), [inventory](INVENTORY.md).
- **Reproduce:** Request both resource URLs on the production build.
- **Expected / observed:** Valid resources with correct origin and published URLs; observed 404 pages.
- **Remediation:** Generate a sitemap from the intended published inventory and add an intentional robots policy. Keep Studio non-indexable; do not rely on robots.txt as access control. Audit legacy URLs with real indexed-URL evidence.
- **Validation:** Resources return 200 with valid syntax; sitemap URLs resolve/canonicalize correctly and exclude errors/admin URLs; preview noindex is removed only for the public launch domain.

## Content integrity and resilience

### TL-010 — P2 — Fallback social link is a placeholder and contact identity changes

- **Location:** `lib/content/fallback.ts:235–236`; `components/site/SiteFooter.tsx:16`; prior baseline `index.html:1364–1366`.
- **Confirmed behavior:** Fallback Instagram points to `#` and opens a same-site fragment in a new tab. Fallback contact is `hello@timeless.ng`, whereas the retained baseline uses a different Gmail address and real Instagram/TikTok destinations. The correctness/ownership of either mailbox was not tested.
- **Impact / scope:** Unconfigured content and configured CMS fetch failures can expose a broken trust/contact route site-wide. Incorrect mailbox ownership is a risk, not a confirmed fact.
- **Evidence:** [Rendered footer links](evidence/newsletter.json), [source inventory](INVENTORY.md).
- **Reproduce:** Run without Sanity configuration and inspect/click Instagram; compare the current fallback contact with the retained static baseline.
- **Expected / observed:** Owner-approved, usable social/support destinations in every supported content mode; observed placeholder and unverified changed contact identity.
- **Remediation:** Obtain approved destinations, replace placeholders, and align CMS/fallback contact settings. Do not assume the historical address is still correct.
- **Validation:** Verify public social destinations read-only and mailbox ownership/delivery using a controlled owner-approved test; repeat with fallback enabled.

### TL-011 — P2 — Denied browser storage crashes the page

- **Location:** `components/bag/BagProvider.tsx:51–64`; related unchecked sessionStorage calls at `components/motion/HeroScene.tsx:16,22`.
- **Confirmed behavior:** A controlled local fixture makes `Storage.getItem('timeless:bag:v1')` throw `SecurityError`. The product page crashes to a generic reload/back error instead of continuing with an in-memory bag. The bag provider encloses the site. The read failure was reproduced; quota/write and sessionStorage failures remain source-grounded extensions needing tests.
- **Impact / likelihood / scope:** Visitors subject to restrictive storage policies lose the storefront. Less common than ordinary browsing, but affects the complete page for that visitor; P2 reflects the limited precondition.
- **Evidence:** [Fault injection and error](evidence/failure-scenarios.json), [crash screenshot](evidence/storage-blocked.png).
- **Reproduce:** Before load, override Storage.getItem to throw only for the bag key; open the product route. This fixture does not change site code or production data.
- **Expected / observed:** Shopping remains usable with a clear persistence limitation; observed uncaught exception and generic page failure.
- **Remediation:** Guard storage reads/writes and validate stored payloads; degrade to memory state with honest persistence messaging. Keep intro animation independent of storage availability.
- **Validation:** SecurityError, quota exceeded, malformed/version-mismatched records and normal cross-tab cases must not crash. Verify add/remove/checkout still work without persistence and ordinary saved bags still restore.

## Dependency and application security

### TL-015 — P1 — Release dependency graph matches high/critical published advisories

- **Location:** `package.json:26–30`; `package-lock.json:15056` (Next), `package-lock.json:17131` (Sharp), `package-lock.json:11415` (DOMPurify), and `package-lock.json:18321` (Undici); image optimizer configuration at `next.config.ts:4–6`.
- **Confirmed scope:** Registry audit completed successfully (command exits 1 because it reports findings). It reports **25 package vulnerability entries: 2 critical, 10 high, 13 moderate**. Installed Next is **16.2.6**, Sharp **0.34.5**. These are confirmed version/advisory matches, **not 25 demonstrated application exploits**. One consolidated release dependency finding is counted here.
- **Launch impact / applicability:** The site uses image optimization and allows remote Sanity image URLs. Maintainer-linked advisories include affected image-processing paths. Actual exploitability depends on runtime/platform, input and hosting controls; it was not demonstrated. Other audit entries concern Studio/build/development tooling or configurations absent here and must be triaged rather than assumed reachable. Broad supply-chain blast radius justifies a P1 update/review gate; no P0 RCE finding is asserted.
- **Evidence:** [Registry JSON](evidence/dependency-audit.json), [installed dependency tree](evidence/dependency-paths.json). [Next/Sharp AVIF advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4) lists Next 16 versions before 16.3.3. [SVG/upstream library advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw) identifies platform conditions and a Sharp ≥0.35.5 workaround. Do not apply these descriptions to unsupported deployment conditions.
- **Reproduce safely:** Run `npm audit --omit=dev --json` and inspect `npm ls next sharp dompurify undici --all`; compare installed versions to maintainer advisories. Do not send exploit payloads.
- **Expected / observed:** A reviewed release graph with resolved applicable severe advisories; observed untriaged severe matches in production dependencies. `--omit=dev` still includes build/CLI transitive dependencies shipped under production dependency packages.
- **Remediation:** Upgrade Next and its compatible lint package to a current patched compatible release (registry suggests 16.4.3 at audit time), ensure patched image-processing dependencies, then review the remaining graph by actual runtime reachability. Review Sanity ecosystem upgrades deliberately: audit suggestions include major-version changes/downgrades and are not safe instructions to run `audit fix --force`.
- **Validation:** Clean lockfile install, new registry audit and advisory-by-advisory triage, build/test/type/lint passes, and actual target-platform image/CMS/Studio smoke tests. Every remaining high/critical entry needs a documented source/platform exclusion or remediation signed off before launch.

## Recommendations and unverified risks are not additional confirmed findings

See [VERIFICATION.md](VERIFICATION.md) for CMS outage/stale-commerce risk, production headers/TLS/CORS, operational controls, legal review, browser/device/assistive-technology gaps, streamed not-found responses, analytics destinations and external processor validation. Static Journal category labels, unused accent-font preloading and editorial pacing are optional improvements unless product requirements establish otherwise. The automated carousel warning was not promoted: focused-region ArrowRight and the next control demonstrably advanced the carousel.
