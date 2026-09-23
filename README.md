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
