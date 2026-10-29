# Timeless

The Timeless editorial storefront is built with Next.js 16, React 19, Tailwind CSS 4, GSAP and Sanity. The public site remains fully functional with curated local content when Sanity is not configured.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Sanity Studio is mounted at `/studio`.

## Configuration

The supported variables are documented in `.env.example`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: public Sanity project ID.
- `NEXT_PUBLIC_SANITY_DATASET`: dataset name, normally `production`.
- `NEXT_PUBLIC_SANITY_API_VERSION`: pinned API version.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp Business number as digits with its country code.

No Sanity token is needed for published reads from a public dataset. Global Settings can provide a WhatsApp number override. Checkout is deliberately disabled when neither value is present, and a customer’s bag remains saved.

## Content architecture

Schemas live in `sanity/schemaTypes`, GROQ in `sanity/lib/queries.ts`, fetch/adaptation logic in `sanity/lib/fetch.ts`, and presentation components outside the Sanity directory. The Studio supports:

- Products with ordered colour variants, colour-specific primary/gallery images, minor-unit prices, sizes and construction details.
- Journal stories with Portable Text, responsive images, image pairs, quotations and optional hosted video.
- In the Wild entries as an independent archive.
- Singleton-style Global Settings for navigation, contact details, WhatsApp and homepage selections.

When Sanity is absent or unreachable, `lib/content/fallback.ts` supplies the curated local catalogue and editorial material. If a configured dataset is empty, the UI displays its intentional empty states instead of silently mixing in fallback records.

## Image mapping

Purposeful web exports are stored under `public/images/timeless`. The retained source masters stay outside the repository. Fallback product variants map Black, White and Cream to authentic Timeless primary and gallery photographs; no unsupported Navy fallback was fabricated. Sanity editors can add any ordered set of colour variants, each with a primary image, gallery, alt text, optional mobile image, crop and hotspot.

The source-to-role shortlist is recorded in `docs/image-audit.md`.

The Sanity seed includes Court Assembly, At the Steps, Between Frames, and the archive-only Late Light story. The local fallback retains the first three homepage stories. Journal imagery uses the selected campaign, detail and packaging frames. Hero and Identity in Motion imagery remain on their existing assets.

## Seed Sanity

The idempotent seed uses deterministic document IDs and reuses matching image assets by SHA-1 hash. It publishes one product, three Journal stories, four In the Wild entries, and Global Settings.

```bash
npm run sanity -- login
npm run sanity:seed:dry
npm run sanity:seed
```

The dry run does not contact or change Sanity. The authenticated seed refuses to continue when a matching draft exists, uploads only missing assets, and verifies the published document and asset totals after committing.

## Bag and checkout

The client-side bag is stored under `timeless:bag:v1`, synchronizes between tabs, and retains the product, colour, size, quantity, minor-unit price and representative image. Checkout generates a deterministic, itemized `wa.me` message. Opening WhatsApp never clears the bag.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Connect a Sanity project

1. Create a Sanity project on the free plan with a public `production` dataset.
2. Copy `.env.example` to `.env.local` and add the project ID.
3. Add the local origin you use (`http://localhost:3000` or `http://127.0.0.1:3000`) and the deployed site origin to Sanity CORS with credentials enabled so Studio sign-in works.
4. Restart the site, open `/studio`, and sign in.
5. Run the dry seed and authenticated seed commands above.
6. Review the published records in Studio, then smoke-test the connected site.

## Brevo newsletter setup

Add these values to `.env.local` for development and to the hosting environment for production, then restart/redeploy:

```dotenv
BREVO_API_KEY=your-server-api-key
BREVO_LIST_ID=your-numeric-list-id
BREVO_DOI_TEMPLATE_ID=your-numeric-double-opt-in-template-id
NEXT_PUBLIC_SITE_URL=https://www.weartimeless.xyz
```

Use the actual production HTTPS origin if different. **Never use a `NEXT_PUBLIC_` prefix for the Brevo API key.** Do not commit it or paste it into a chat. `BREVO_LIST_ID` is the destination Contacts list ID, not a folder ID. `BREVO_DOI_TEMPLATE_ID` is an active transactional double-opt-in template, using a verified sender and a confirmation link with `{{ params.DOIurl }}`. The website supplies `/newsletter/confirmed` as its post-confirmation redirect.

The signup endpoint uses Brevo's [double-opt-in API](https://developers.brevo.com/reference/create-doi-contact), so no Brevo SDK or browser key is needed. The first success message means a confirmation email was requested, not that a subscription is already confirmed. Validate the full confirmation/list/unsubscribe path with a controlled address after adding configuration. Automated tests mock Brevo and do not send emails. Missing configuration returns a truthful unavailable state.

The endpoint validates consent/email/origin, bounds JSON input, rejects a honeypot, times out provider calls and applies a bounded per-process burst guard. Production proxies must overwrite forwarding headers. Configure a distributed host/firewall rate limit for `POST /api/newsletter`; process-local state does not coordinate serverless instances. Do not log request bodies or provider error bodies.

## Shipping, returns and policies

Customer pages are `/shipping`, `/returns`, `/privacy` and `/terms`; their minimal draft content is maintained in `lib/policies.ts`. Shipping is additional to item subtotals and is quoted on WhatsApp after the delivery address is shared. The previous free-delivery threshold and unconfirmed seven-day returns claim were removed.

The return draft does not invent a voluntary return window, restocking fee, refund timeline or shipping allocation. Confirm business conditions before launch. Statutory rights are preserved. Review the legal business identity, contact address, support email, data processors/retention and policy wording before public release. `NEXT_PUBLIC_SUPPORT_EMAIL` can override the fallback support mailbox; Sanity Global Settings remain the source for configured contact details.

Product sizing links are labelled “Fit & sizing help”, with a real contact path for measurements, rather than presenting an unpopulated size chart. Publish approved measurements when available. Catalogue/settings CMS read failures no longer turn a configured data source into independently priced/available fallback products. Saved WhatsApp requests remain estimates to confirm with the merchant, not proof of price, stock or payment.

## Optional analytics and error monitoring

GA4 stays disabled unless both `NEXT_PUBLIC_ANALYTICS_ENABLED=true` and a valid `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-…` are configured. Its tag waits for an explicit measurement choice; Decline and Do Not Track prevent measurement. The footer provides preference changes. Only allowlisted funnel fields and permitted campaign labels are sent; email input and WhatsApp message contents are excluded. Handoff events are not purchases.

Disable GA4 Enhanced Measurement automatic page/form/click tracking in the web stream to keep the explicit event contract authoritative. Exclude internal/staging traffic in the collector. Verify emitted events and collector receipt with a marked test visit before using campaign reports; configuration alone is not verification. Vercel preview deployments disable indexing and GA4; use `SITE_INDEXABLE=false` on other staging hosts.

Optional error-only Sentry monitoring uses `SENTRY_DSN` for server errors and `NEXT_PUBLIC_SENTRY_DSN` for browser errors. Leave both blank to disable. `SENTRY_RELEASE` can identify the immutable release (server defaults to Vercel commit SHA). Collection disables user/header/body/cookie/query/local-variable data and drops error text, requests, arbitrary context and breadcrumbs before sending; it retains error type/source locations and release. No session replay or performance tracing is enabled. Verify event receipt and alert routing with a controlled error before launch; no Sentry account/alert was created by this change.

## Release checks and operations

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm audit --audit-level=high
npx playwright install chromium
npm run test:e2e
npm run check:launch
```

The browser suite builds a separate **test configuration** from the source, then starts it on loopback port 3110: local fallback content, dummy WhatsApp number, no Brevo key, no GA4/Sentry destinations. Do not deploy that `.next` output. Make a fresh `npm run build` with the real deployment environment for release. Local test reuse is available with `PLAYWRIGHT_SKIP_BUILD=1` only when the existing build was made with these same test settings.

The GitHub quality workflow runs static/unit/dependency/browser gates without production credentials. Narrow transitive overrides patch the Sanity CLI's framework parser dependencies, the module-federation Undici dependency, and TypeID's UUID dependency. TypeID's buffer-based v7 generation was smoke-tested after the UUID update; remove overrides when upstream ranges include equivalent fixes.

`GET /api/health` is a non-sensitive liveness check, not a CMS/Brevo dependency check. Configure external Home/Product/checkout-availability checks and alerts in the actual hosting account. TLS/canonical redirects/HSTS, CDN behavior, deploy permissions and rollback remain platform responsibilities. Keep the previous immutable deployment, rehearse restoring it in staging, and complete `docs/audits/timeless-launch-readiness/LAUNCH-CHECKLIST.md`. No deployment or rollback was executed here.

`npm run check:launch` validates the required production/Brevo values without printing secrets or contacting providers. It deliberately fails until the missing real configuration is added. The Node runtime requirement is 22.12 or newer within Node 22, matching the installed SDK engines.
