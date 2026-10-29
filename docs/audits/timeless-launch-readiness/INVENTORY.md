# System and audit inventory

Audit date: 28 October 2026 (Africa/Lagos). Reviewed commit: `60655c89a1a46e0d79cb0c470705b518f73eb378`. The application worktree was clean at discovery. Only audit documentation and tool-generated evidence were added.

## Product and conversion model

Timeless is an independent Nigerian fashion label. The brand guidelines describe identity, creative freedom, minimal expression, and a cinematic editorial direction. The redesign combines product discovery with campaign/editorial storytelling. The current local catalogue contains one Essential Tee at ₦15,000, three colours, and six sizes. These are fallback content facts, not assertions about current published inventory or approved prices.

Primary journey: campaign/social/search arrival → Shop or home featured product → product colour and size → persistent bag → itemized WhatsApp order request → merchant confirmation outside this application. The handoff is not a completed purchase. Secondary journey: newsletter signup. Supporting journeys: About, Journal, In the Wild, social/contact, shipping and returns information.

## Architecture and boundaries

| Layer | Actual implementation | Boundary / audit implication |
|---|---|---|
| Runtime | Node 22.x; tested Node 22.23.3 | Server-capable deployment required |
| Framework | Installed Next 16.2.6, React/React DOM 19.3.0, App Router | Static prerendering, streamed routes, RSC navigation, image optimizer |
| UI | Tailwind 4, GSAP/ScrollTrigger/SplitText, Lucide, local fonts | Animation and modal/keyboard behavior require runtime checks |
| Content | Sanity 6.15.0 / next-sanity; public published reads, CDN, nominal 60-second revalidation | CMS availability, editor permissions and edge cache behavior remain external |
| Fallback | `lib/content/fallback.ts`; fetch errors are treated like absent configuration | Can replace live catalogue/settings with independent fallback data |
| State | React context/reducer; `timeless:bag:v1` in localStorage; storage event sync | Client-controlled order request, not authoritative pricing or inventory |
| Checkout | `lib/bag.ts` constructs encoded `https://wa.me/…?text=…` | Merchant must validate price, stock, delivery and payment independently |
| Newsletter | React local state only | No subscription backend or actual email delivery |
| Admin | Embedded `/studio/[[...tool]]`; Sanity-hosted identity and authorization | Public Studio bundle is not itself proof of unauthorized CMS access |
| Media | `next/image`, local photography, optional Sanity image/mobile/crop metadata, optional hosted video | Local optimization verified; connected CMS/video not exercised |
| APIs/auth/payments | No application route handlers, account/session system, upload endpoint, or payment processor found | CSRF/payment/session tests are not applicable to absent flows |

The root layout mounts the bag provider, skip link, shared header, page transition, page content and footer. The CMS read client uses `perspective: published` and no server token. GROQ slug values use parameters rather than query concatenation. No unsafe raw HTML sink was found in the inspected application source. These observations do not establish complete security assurance.

## Route inventory and verification

All nine content URLs below were directly loaded and checked at 375×812, including axe scans, title/metadata extraction, console errors and document width. Seven representative URLs were also captured at 768×1024, 1440×900 and 1920×900. Full scrolled captures cover those seven at 375 and 1440. Deep linking to the size guide was exercised separately.

| URL / pattern | Source | Local fallback result | Visual scope |
|---|---|---|---|
| `/` | `app/page.tsx` | 200; no H1; hero/product/editorial/carousel/newsletter | Four widths + full scrolled mobile/desktop |
| `/shop` | `app/shop/page.tsx` | 200; catalogue and product card | Four widths + full scrolled |
| `/shop/essential-tee` | `app/shop/[slug]/page.tsx` | 200; product, gallery, size guide, final purchase | Four widths + full scrolled; 320px reflow spot check |
| `/about` | `app/about/page.tsx` | 200; brand story/values | Four widths + full scrolled |
| `/journal` | `app/journal/page.tsx` | 200; three local stories; static category labels | Four widths + full scrolled |
| `/journal/the-making-of-drop-001` | `app/journal/[slug]/page.tsx` | 200; “The weight of a simple thing” | Four widths + full scrolled |
| `/journal/identity-is-not-static` | Same template | 200; “Identity is not static” | Mobile screenshot/axe/DOM |
| `/journal/first-frame` | Same template | 200; “The first frame” | Mobile screenshot/axe/DOM |
| `/in-the-wild` | `app/in-the-wild/page.tsx` | 200; Court Assembly, At the Steps, Between Frames | Four widths + full scrolled |
| `/shop/[slug]`, `/journal/[slug]` | Dynamic content templates | Current fallback slugs above; actual CMS may add others | Connected inventory not enumerated |
| `/in-the-wild#court-assembly`, `#at-the-steps`, `#between-frames` | Article IDs | Fragment targets exist in source | Fragment existence inspected; individual arrivals not all exercised |
| `/journal/in-the-wild-akure` | `next.config.ts:10` | 308 → `/in-the-wild` | HTTP redirect verified |
| `/not-a-real-route` | `app/not-found.tsx` | 404 and noindex | HTTP verified |
| `/shop/not-a-product`, `/journal/not-a-story` | `notFound()` in content templates | 200 with noindex and not-found UI | Streamed response behavior; see residual risks |
| `/studio` and descendants | `app/studio/[[...tool]]` | 200, noindex; unconfigured setup state | HTTP and source; authenticated editor flow untested |
| `/robots.txt`, `/sitemap.xml` | No implementations | Both 404 | Confirmed missing discovery resources |
| Shipping / Returns / Privacy / Terms | Shared footer | All `href="#"`; no corresponding pages | DOM/source verified |

## Critical component inventory

| Surface | Components | Verified behavior / remaining gap |
|---|---|---|
| Navigation | SiteHeader, Wordmark, BagButton | Client navigation and history; mobile menu focus/Escape; hidden-header focus defect |
| Product discovery | FeaturedProduct, ProductCard, ProductColourSelector | Rendered home/shop; variant selection exercised on product; exhaustive warming races not rerun |
| Purchase selection | ProductSelection, ProductConfigurator, ProductPurchase, ProductFinalPurchase | Size guard, colour/size to bag, totals; sold-out states source-only |
| Product media | GalleryViewer, ResponsiveImage, SwitchableImage, useImageWarming | Gallery arrows/Tab/Escape/restoration; no broken loaded images in full captures; image failure/recovery not exhaustively rerun |
| Bag | BagProvider, BagDrawer | Persistence/refresh, increment, removal, empty state, clear confirmation/keep, unconfigured disabled checkout, dummy configured link |
| Editorial | InTheWildCarousel, JournalBody | Carousel keyboard and next button; story template and images; CMS Portable Text/video not fixture-tested |
| Motion | PageTransition, HeroScene, Reveal, Sequences | Normal and reduced-motion modes; reduced/no-JS blackout confirmed; pinned full-page captures have state limitations |
| Forms | Newsletter in home and footer | Native invalid-email rejection; valid email produces false success |
| Footer/trust | SiteFooter | Dead policies and fallback social destination confirmed |

## Dependencies, configuration and deployment

Supported names are `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_WHATSAPP_NUMBER`. Local configuration has values present for all four; values were not copied into the audit or used to contact services. Presence is not production validation. CMS settings can override WhatsApp. Empty configuration deliberately disables checkout.

Two disposable copies were built with installed dependencies and without `.env.local`: fallback-only and fallback plus dummy `15555550123`. Both builds pass. Only the dummy WhatsApp URL was inspected; no external app was opened and no order was sent. No CMS seeding, publication, authentication or production mutation occurred.

`CNAME` names `weartimeless.xyz`, and the repository retains the older static `index.html` / `404.html`. Prior image-performance documentation refers to Vercel delivery. None proves the current production deployment target, DNS state or which artifact is served. No tracked CI workflow, infrastructure definition, provider deployment configuration, health check, alert routing or rollback runbook was found. Provider-managed controls may exist and need owner evidence.

## Baseline and brand comparison

The old static page is a coming-soon/waitlist experience with `#waitlist` CTAs, Instagram/TikTok/contact destinations and a Google Apps Script submission call. The redesign adds commerce, content routing, a CMS and persistent shopping state, but replaces actual submission code with a local success flag. The previous webhook was not called. Its existence does not establish current backend validity.

The local brand PDF (June 2026, v1.0) supplies positioning, palette, type and photographic direction. Host Grotesk, Great Vibes, authentic photography and minimal monochrome presentation align with it. Display font fallbacks and heading leading differ from the documented system (TL-014). No approved page mockups, Figma file, prior redesign acceptance criteria, production URL inventory, search-console export or field analytics were available. Aesthetic improvements beyond documented deviations are recommendations, not verified design defects.

## Operational prerequisites to obtain

Confirm the actual deployment URL/provider/project, supported runtime, domain redirects and TLS; published CMS catalogue/settings and permissions; owned WhatsApp destination and operating hours; approved price/stock/delivery/returns claims; newsletter processor and data handling; analytics/consent choices; alerts, release owner and previous deploy restoration; indexed legacy URLs; real-browser/device and assistive-technology validation. None can be marked passed from source alone.
