# Image performance — 30 September 2026

## Outcome

Photography, layout, typography, mobile containment, closing-image inscription and GSAP choreography are unchanged. Initial image payloads fell on every measured route. This is not a claim of uniformly faster LCP: most local LCP elements were text, and some timings regressed within the small sample.

The migration gate retains **Next.js optimization for both Sanity and local photographs**. Sanity now supplies the original asset/editorial crop rather than a precompressed 2,400px intermediary. There is no global custom loader, production A/B machinery, new CDN, cache package, asset replacement or CMS reseed.

## Method and limits

- Production builds, not development mode. Connected `production` Sanity content remained the same across measurements.
- Three visits per route at 390×844 and 1440×900. The browser reported DPR 1. Additional 3× derivative probes are documented below; they are not real-device emulation.
- Temporary local HTTP instrumentation recorded buffered LCP, layout-shift sums excluding recent input, image Resource Timing, `currentSrc`, dimensions and request order. Samples were read after 4.5 seconds on mobile and 3.5 seconds on desktop. The layout-shift sum is diagnostic, not a full web-vitals session-window implementation.
- Browser-cache-bypassed responses used `Cache-Control: no-store`. This approximates uncached visits but is **not a freshly cleared browser profile**. Optimizer/CDN caches were retained, and no network/CPU throttling was available. Normal-cache visits were measured separately. Do not describe the bypassed figures as cold edge-cache measurements.
- `encodedBodySize` below is image response payload, not repository disk size. In bypassed samples it was transferred; repeat visits can report those same payload sizes with **zero network transfer**. Request counts include image preloads. Native lazy-loading heuristics and reuse of larger cached candidates can change counts.
- Local measurements include the same instrumentation overhead before/after. The supplied deployment was also inspected directly and measured through a separately instrumented proxy; that proxy adds overhead and cannot represent deployment RUM.

Raw sample summaries, representative waterfalls/current sources, HTTP format/dimension probes and delivery benchmarks are in [image-performance-results.json](./image-performance-results.json).

## Before / after

Medians of three browser-cache-bypassed visits. KB uses decimal units. `Article` is `/journal/the-making-of-drop-001`; `Product` is `/shop/essential-tee`.

| Route | Mobile image KB | Mobile LCP ms | Desktop image KB | Desktop LCP ms |
|---|---:|---:|---:|---:|
| Home | 283.1 → 153.8 | 112 → 120 | 743.0 → 416.3 | 128 → 112 |
| Shop | 234.7 → 176.3 | 152 → 100 | 886.3 → 552.0 | 96 → 104 |
| Product | 141.4 → 30.1 | 96 → 112 | 586.1 → 165.2 | 124 → 104 |
| Journal | 208.5 → 53.6 | 112 → 100 | 995.5 → 296.4 | 148 → 116 |
| Article | 190.3 → 37.8 | 100 → 88 | 950.2 → 623.5 | 104 → 92 |
| In the Wild | 289.9 → 172.4 | 100 → 100 | 704.5 → 318.6 | 116 → 112 |
| About | 214.7 → 188.2 | 100 → 76 | 887.2 → 560.5 | 120 → 96 |

All sampled initial-route CLS values were zero and no document horizontal overflow was detected. Desktop median request counts fell from 7→6, 5→4, 6→4, 5→4, 3→2, 8→7 and 4→3 respectively. Mobile medians were unchanged; Home ranged from three to six requests because native lazy-loading sometimes prepared the below-fold Identity photographs. Those photographs now have one shared responsive DOM branch, not hidden duplicate branches.

Normal-cache Home/Product image-transfer medians were zero before and after at both widths. Their LCP medians were mobile Home 124→92ms, Product 104→104ms; desktop Home 120→120ms, Product 100→108ms. One desktop repeat requested additional derivatives: browser caching is not a guarantee that every visit transfers zero bytes.

### Quality-driven tradeoffs

The final measurements include larger, more appropriate derivatives where a wide photograph covers a tall mobile frame. They are deliberately not the smallest intermediate results:

- Mobile hero: 640×426 / 15,914 bytes → 1920×1279 / 63,504 bytes. Same photo/crop/choreography, sufficient height for the cover presentation.
- Wordmark: 3840×1327 / 94,248 bytes → 256×88 / 4,506 bytes at the observed 180px/DPR-1 display. Both responses retain alpha transparency. At 3×, the 640×221 candidate is 13,228 bytes.
- Mobile product: 640×966 / 47,150 bytes → 384×580 / 25,550 bytes for the contained photograph, approximately 291 CSS pixels wide. At 3× the 1080×1631 candidate is 87,674 bytes.
- Full-screen product viewing uses quality 85. The probed derivative returns the original 1457×2200 dimensions / 200,172 bytes rather than upscaling to its requested 1920px width. No quality-85 request was present before opening the viewer.
- The 3× mobile hero probe returns the original 2200×1466 / 77,820 bytes at the largest requested candidate: native source resolution remains its limit. No universal 2× cap was introduced.

These local optimized responses were WebP. Preview/thumbnail quality stays 75; viewing quality is 85 and both are explicitly allowlisted. Direct Sanity quality-80 trials increased bytes without an established viewing-size benefit. Fabric, embroidery, skin and gradients were inspected in rendered pages and the larger product derivative. Original sources were not recompressed or replaced.

## Delivery gate and caching

The initial comparable WebP trials at 640/1080/1200px found direct Sanity quality-75 payloads of 44,906 / 85,030 / 100,262 bytes versus the existing local optimizer's 47,150 / 87,674 / 99,816 bytes. Savings were small and inconsistent; direct quality 80 was larger. Removing the upstream transformation produced the same measured local optimizer payloads for this product.

Read-only deployment probes also compared three requests per width. Existing Vercel optimizer medians were 434 / 210 / 217ms; direct Sanity medians were 711 / 338 / 234ms. The deployment responses were verified Vercel cache HITs. Direct Sanity negotiated AVIF in this later run, unlike the initial WebP comparison, so encoder quality values are **not equivalent visual-quality scores**. These small sequential samples do not establish universal CDN superiority, but they do not justify migrating this site to direct delivery now.

No cache TTL changed. HTTP probes observed local-image optimizer responses with `public, max-age=14400, must-revalidate`, Sanity-source optimizer responses with `max-age=2592000`, and direct transformed Sanity responses with long-lived cache headers. Sanity `Age: 0/1` does not prove an edge miss. CMS content revalidation remains separate and unchanged.

The deployment baseline was inspected at the supplied Vercel URL. Through the diagnostic proxy its mobile Home/Product LCP medians were 1,092/772ms and desktop 1,208/716ms. These are **not** comparable to localhost or a deployed after-result. The local changes have not been deployed.

## Colour interactions

Three warm cycles per colour measured decoded replacement readiness, using 16ms polling:

| Colour | Before median ms | After median ms |
|---|---:|---:|
| White | 17.6 | 18.3 |
| Cream | 18.0 | 17.9 |
| Black | 17.6 | 17.5 |

There is no meaningful warm latency gain at this precision. First observed White/Cream requests were approximately 1,301/547ms before versus 1,393/658ms after; their optimizer/CDN cache states were not established, and they are individual observations, not three-sample cold medians. Cold image generation/network time remains a limitation.

The perceptual improvement is readiness coordination: selection and purchase data update immediately, the previous photograph remains until decoding, a subtle status identifies the pending colour, and only the latest request may commit. A deliberately failed White response retained the Black photograph with explanatory status; selecting Cream recovered normally.

Warming uses the visible image's exact responsive props, two concurrent loads, an eight-request queue and a 64-entry request ledger. Initial preparation waits until critical loading settles and the preview is near the viewport. Focus/hover receives queue priority. Save-Data, 2G and clearly slow downlink signals suppress speculative preparation. In product sections only primary colour previews are warmed, not full galleries.

## Verified and outstanding

Verified locally:

- Lint, TypeScript, 19 tests, configured production build and unconfigured production build.
- All seven routes at both requested widths, plus menu, Bag and full-screen viewer.
- Colour switching in Home, Shop and Product, rapid selection, failure recovery and current Bag variant data.
- Bag persistence through navigation/refresh, quantity updates, removal, explicit clear confirmation and legacy string-image compatibility. Closed Bag thumbnails are not mounted; opening requests small thumbnails. Only locally created diagnostic bag items were cleared; test orders were not sent to WhatsApp.
- Gallery arrow keys, Escape, focus containment/restoration and deferred high-resolution delivery.
- Carousel controls/arrow navigation, native scroll-snap layout and photographs covering loading previews.
- Desktop Identity images ready during scrolling, with unchanged GSAP targets/timeline. Hero intro remains 1.35 seconds for a first session and .75 seconds on repeat; editorial reveals remain 1.35 seconds. These choreography durations are separate from resource response/decode timing and were not shortened.
- Mobile colour controls remain immediately below previews; closing inscription remains uncropped. Mobile menu makes no portrait request; the portrait appears when an open menu becomes desktop-sized.
- Sanity crop/hotspot/mobile-source handling in focused tests, and actual CMS image delivery without the redundant intermediary. Local fallback Product, Journal and In the Wild were smoke-tested without modifying `.env.local`.

One connected build encountered two transient Sanity connection timeouts and exercised the existing fallback. The final retry completed cleanly, and the compiled product page was checked against the published four-variant CMS content.

Outstanding: deployed after-measurements require publishing this change; Safari, a physical 3× mobile screen, physical touch/swipe, controlled network/CPU throttling, a genuinely cleared browser profile and OS reduced-motion emulation were unavailable. Reduced-motion CSS/GSAP guards remain intact and were source-checked, not claimed as a real-device run. Optional video poster delivery is bounded and tested but the current published Journal has no video fixture for visual verification.

## Reproduction

Run `npm run build` then `npm run start -- --port 3100`. Use the same viewport, DPR, browser-cache mode, observation interval and published content for each of three visits. Collect buffered LCP/layout-shift observations and image Resource Timing; save `document.images` current sources and `sizes`. Keep optimizer/CDN caches separate from browser-cache observations. Probe selected URLs with the same `Accept` header and inspect returned format/dimensions rather than treating density-corrected `naturalWidth` as downloaded pixel width. Browser-cache-bypassed and normal-cache results must not be merged.

Repeat the deployment gate after publishing and on the intended real devices before interpreting these laboratory numbers as customer-visible speed. [Next.js image documentation](https://nextjs.org/docs/app/api-reference/components/image) and [Sanity transformations](https://www.sanity.io/docs/apis-and-sdks/image-urls) describe the underlying delivery controls.
