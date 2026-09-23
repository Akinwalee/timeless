import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";
import {
  fallbackInTheWild,
  fallbackJournal,
  fallbackProduct,
  fallbackSettings,
} from "../lib/content/fallback";
import type {
  InTheWildEntry,
  JournalBlock,
  ResolvedImage,
} from "../lib/content/types";

const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-18";
const PRODUCT_ID = "product-essential-tee";
const SETTINGS_ID = "globalSettings";
const EXPECTED_DOCUMENTS = 9;
const EXPECTED_IMAGE_REFERENCES = 26;
const EXPECTED_UNIQUE_ASSETS = 24;
const EXPECTED_DOCUMENT_REFERENCES = 12;

type SeedDocument = Record<string, unknown> & {
  _id: string;
  _type: string;
};

type LocalAsset = {
  absolutePath: string;
  hash: string;
  src: string;
};

type SanityAsset = {
  _id: string;
  sha1hash?: string;
};

const lateLight: InTheWildEntry = {
  id: "late-light",
  slug: "late-light",
  title: "Late Light",
  location: "Akure, Nigeria",
  date: "August 2026",
  pieceWorn: "The Essential Tee",
  images: [
    {
      src: "/images/timeless/in-the-wild/late-light-01.jpg",
      alt: "Friends in Timeless tees gathered in late afternoon light",
      width: 2200,
      height: 1466,
    },
    {
      src: "/images/timeless/in-the-wild/late-light-02.jpg",
      alt: "Portrait in the Timeless Essential Tee beneath an open evening sky",
      width: 2200,
      height: 1466,
    },
    {
      src: "/images/timeless/in-the-wild/late-light-03.jpg",
      alt: "Candid portrait in the Timeless Essential Tee at golden hour",
      width: 1466,
      height: 2200,
    },
  ],
  note: "Late afternoon light loosens the edges of the frame.",
  homepageFeatured: false,
  order: 4,
};

const inTheWildEntries = [...fallbackInTheWild, lateLight];

function documentId(type: "journal" | "in-the-wild", slug: string) {
  return `${type}-${slug}`;
}

function monthStart(value: string) {
  const match = value.match(/^([A-Za-z]+) (\d{4})$/);
  if (!match) return value;

  const months: Record<string, string> = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };
  const month = months[match[1]];
  if (!month) throw new Error(`Unsupported editorial month: ${value}`);
  return `${match[2]}-${month}-01`;
}

function allContentImages() {
  const images: ResolvedImage[] = [];
  const add = (image: ResolvedImage | undefined) => {
    if (image) images.push(image);
  };

  for (const variant of fallbackProduct.variants) {
    add(variant.primaryImage);
    variant.gallery.forEach(add);
  }
  fallbackProduct.gallery.forEach(add);

  for (const entry of fallbackJournal) {
    add(entry.coverImage);
    for (const block of entry.body) {
      if (block._type === "image") add(block.image);
      if (block._type === "imagePair") {
        add(block.left);
        add(block.right);
      }
      if (block._type === "video") add(block.poster);
    }
  }

  for (const entry of inTheWildEntries) entry.images.forEach(add);
  return images;
}

async function localAssets() {
  const sources = [...new Set(allContentImages().map((image) => image.src))];
  return Promise.all(
    sources.map(async (src): Promise<LocalAsset> => {
      const absolutePath = join(process.cwd(), "public", src.replace(/^\//, ""));
      await access(absolutePath);
      const bytes = await readFile(absolutePath);
      return {
        absolutePath,
        hash: createHash("sha1").update(bytes).digest("hex"),
        src,
      };
    }),
  );
}

function imageValue(
  image: ResolvedImage,
  assetIdBySource: Map<string, string>,
  key?: string,
) {
  const assetId = assetIdBySource.get(image.src);
  if (!assetId) throw new Error(`No Sanity asset was resolved for ${image.src}`);

  return {
    ...(key ? { _key: key } : {}),
    _type: "responsiveImage",
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: assetId },
      alt: image.alt,
      ...(image.caption ? { caption: image.caption } : {}),
    },
  };
}

function portableTextBlocks(block: Extract<JournalBlock, { _type: "text" }>) {
  const values: Array<Record<string, unknown>> = [];
  if (block.heading) {
    values.push({
      _key: `${block._key}-heading`,
      _type: "block",
      style: "h2",
      markDefs: [],
      children: [{
        _key: `${block._key}-heading-span`,
        _type: "span",
        marks: [],
        text: block.heading,
      }],
    });
  }
  block.paragraphs.forEach((paragraph, index) => {
    values.push({
      _key: `${block._key}-${index + 1}`,
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{
        _key: `${block._key}-${index + 1}-span`,
        _type: "span",
        marks: [],
        text: paragraph,
      }],
    });
  });
  return values;
}

function journalBody(
  body: JournalBlock[],
  assetIdBySource: Map<string, string>,
) {
  return body.flatMap((block) => {
    if (block._type === "text") return portableTextBlocks(block);
    if (block._type === "image") {
      return [imageValue(block.image, assetIdBySource, block._key)];
    }
    if (block._type === "imagePair") {
      return [{
        _key: block._key,
        _type: "imagePair",
        left: imageValue(block.left, assetIdBySource),
        right: imageValue(block.right, assetIdBySource),
      }];
    }
    if (block._type === "quote") {
      return [{
        _key: block._key,
        _type: "editorialQuote",
        quote: block.quote,
        ...(block.attribution ? { attribution: block.attribution } : {}),
      }];
    }
    if (block._type === "video") {
      return [{
        _key: block._key,
        _type: "editorialVideo",
        url: block.url,
        ...(block.caption ? { caption: block.caption } : {}),
        ...(block.poster
          ? { poster: imageValue(block.poster, assetIdBySource) }
          : {}),
      }];
    }
    return [block];
  });
}

function createDocuments(assetIdBySource: Map<string, string>): SeedDocument[] {
  const product: SeedDocument = {
    _id: PRODUCT_ID,
    _type: "product",
    name: fallbackProduct.name,
    shortName: fallbackProduct.shortName,
    slug: { _type: "slug", current: fallbackProduct.slug },
    status: fallbackProduct.status,
    drop: fallbackProduct.drop,
    description: fallbackProduct.description,
    price: fallbackProduct.price,
    currency: fallbackProduct.currency,
    sizes: fallbackProduct.sizes,
    variants: fallbackProduct.variants.map((variant) => ({
      _key: variant.id,
      _type: "colourVariant",
      name: variant.name,
      colorValue: variant.colorValue,
      primaryImage: imageValue(variant.primaryImage, assetIdBySource),
      gallery: variant.gallery.map((image, index) =>
        imageValue(image, assetIdBySource, `${variant.id}-gallery-${index + 1}`),
      ),
    })),
    gallery: fallbackProduct.gallery.map((image, index) =>
      imageValue(image, assetIdBySource, `product-gallery-${index + 1}`),
    ),
    materials: fallbackProduct.materials,
    fit: fallbackProduct.fit,
    construction: fallbackProduct.construction,
    care: fallbackProduct.care,
    featured: fallbackProduct.featured,
    order: fallbackProduct.order,
  };

  const journal: SeedDocument[] = fallbackJournal.map((entry) => ({
    _id: documentId("journal", entry.slug),
    _type: "journal",
    title: entry.title,
    slug: { _type: "slug", current: entry.slug },
    issue: entry.issue,
    category: entry.category,
    date: monthStart(entry.date),
    excerpt: entry.excerpt,
    coverImage: imageValue(entry.coverImage, assetIdBySource),
    body: journalBody(entry.body, assetIdBySource),
    featured: entry.featured,
    order: entry.order,
    ...(entry.nextSlug
      ? {
          nextStory: {
            _type: "reference",
            _ref: documentId("journal", entry.nextSlug),
          },
        }
      : {}),
  }));

  const wild: SeedDocument[] = inTheWildEntries.map((entry) => ({
    _id: documentId("in-the-wild", entry.slug),
    _type: "inTheWild",
    title: entry.title,
    slug: { _type: "slug", current: entry.slug },
    location: entry.location,
    date: monthStart(entry.date),
    pieceWorn: entry.pieceWorn,
    product: { _type: "reference", _ref: PRODUCT_ID },
    images: entry.images.map((image, index) =>
      imageValue(image, assetIdBySource, `${entry.slug}-${index + 1}`),
    ),
    ...(entry.note ? { note: entry.note } : {}),
    homepageFeatured: entry.homepageFeatured,
    order: entry.order,
  }));

  const inTheWildIdBySlug = new Map(
    inTheWildEntries.map((entry) => [
      entry.slug,
      documentId("in-the-wild", entry.slug),
    ]),
  );

  const settings: SeedDocument = {
    _id: SETTINGS_ID,
    _type: "globalSettings",
    navigation: fallbackSettings.navigation.map((link, index) => ({
      _key: `navigation-${index + 1}`,
      _type: "navigationLink",
      ...link,
    })),
    socialLinks: fallbackSettings.socialLinks.map((link, index) => ({
      _key: `social-${index + 1}`,
      _type: "navigationLink",
      ...link,
    })),
    contactEmail: fallbackSettings.contactEmail,
    homepageProduct: { _type: "reference", _ref: PRODUCT_ID },
    homepageInTheWild: fallbackSettings.homepageInTheWildSlugs.map(
      (slug, index) => {
        const id = inTheWildIdBySlug.get(slug);
        if (!id) throw new Error(`Unknown homepage In the Wild slug: ${slug}`);
        return {
          _key: `homepage-wild-${index + 1}`,
          _type: "reference",
          _ref: id,
        };
      },
    ),
    homepageJournal: fallbackSettings.homepageJournalSlugs.map(
      (slug, index) => ({
        _key: `homepage-journal-${index + 1}`,
        _type: "reference",
        _ref: documentId("journal", slug),
      }),
    ),
  };

  return [product, ...journal, ...wild, settings];
}

function collectReferences(value: unknown, references: string[] = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectReferences(item, references));
    return references;
  }
  if (!value || typeof value !== "object") return references;

  const record = value as Record<string, unknown>;
  if (record._type === "reference" && typeof record._ref === "string") {
    references.push(record._ref);
  }
  Object.values(record).forEach((item) => collectReferences(item, references));
  return references;
}

function validateDocuments(
  documents: SeedDocument[],
  assetIds: Set<string>,
  localAssetCount: number,
) {
  const ids = documents.map((document) => document._id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) {
    throw new Error(`Duplicate document IDs: ${duplicateIds.join(", ")}`);
  }

  const references = collectReferences(documents);
  const imageReferences = references.filter((reference) => assetIds.has(reference));
  const documentReferences = references.filter((reference) => !assetIds.has(reference));
  const missingDocumentTargets = documentReferences.filter(
    (reference) => !ids.includes(reference),
  );

  if (documents.length !== EXPECTED_DOCUMENTS) {
    throw new Error(`Expected ${EXPECTED_DOCUMENTS} documents, found ${documents.length}`);
  }
  if (imageReferences.length !== EXPECTED_IMAGE_REFERENCES) {
    throw new Error(
      `Expected ${EXPECTED_IMAGE_REFERENCES} image references, found ${imageReferences.length}`,
    );
  }
  if (assetIds.size !== EXPECTED_UNIQUE_ASSETS) {
    throw new Error(
      `Expected ${EXPECTED_UNIQUE_ASSETS} unique assets, found ${assetIds.size}`,
    );
  }
  if (localAssetCount !== EXPECTED_IMAGE_REFERENCES) {
    throw new Error(
      `Expected ${EXPECTED_IMAGE_REFERENCES} local image paths, found ${localAssetCount}`,
    );
  }
  if (documentReferences.length !== EXPECTED_DOCUMENT_REFERENCES) {
    throw new Error(
      `Expected ${EXPECTED_DOCUMENT_REFERENCES} document references, found ${documentReferences.length}`,
    );
  }
  if (missingDocumentTargets.length) {
    throw new Error(
      `Missing document reference targets: ${missingDocumentTargets.join(", ")}`,
    );
  }

  return {
    documentReferences: documentReferences.length,
    documents: documents.length,
    imageReferences: imageReferences.length,
    localImages: localAssetCount,
    uniqueAssets: assetIds.size,
  };
}

async function prepareDryRun() {
  const assets = await localAssets();
  const assetIdByHash = new Map<string, string>();
  for (const asset of assets) {
    assetIdByHash.set(asset.hash, `dry-image-${asset.hash}`);
  }
  const assetIdBySource = new Map(
    assets.map((asset) => [asset.src, assetIdByHash.get(asset.hash)!]),
  );
  const documents = createDocuments(assetIdBySource);
  const summary = validateDocuments(
    documents,
    new Set(assetIdByHash.values()),
    assets.length,
  );
  return { assets, documents, summary };
}

async function seed() {
  const dryRun = await prepareDryRun();
  const shouldApply = process.argv.includes("--apply");

  console.log("Timeless Sanity seed validation");
  console.table(dryRun.summary);
  console.log(`Document IDs: ${dryRun.documents.map(({ _id }) => _id).join(", ")}`);

  if (!shouldApply) {
    console.log("Dry run complete. No Sanity content or assets were changed.");
    return;
  }

  const client = getCliClient({ apiVersion: API_VERSION });
  const config = client.config();
  const expectedProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const expectedDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  if (!config.projectId || config.projectId !== expectedProjectId) {
    throw new Error("The authenticated Sanity CLI project does not match .env.local.");
  }
  if (!config.dataset || config.dataset !== expectedDataset) {
    throw new Error("The authenticated Sanity CLI dataset does not match .env.local.");
  }

  const documentIds = dryRun.documents.map(({ _id }) => _id);
  const draftIds = documentIds.map((id) => `drafts.${id}`);
  const existingDrafts = await client.fetch<string[]>(
    `*[_id in $ids]._id`,
    { ids: draftIds },
    { perspective: "raw" },
  );
  if (existingDrafts.length) {
    throw new Error(
      `Seed stopped because matching drafts already exist: ${existingDrafts.join(", ")}`,
    );
  }

  const uniqueHashes = [...new Set(dryRun.assets.map(({ hash }) => hash))];
  const existingAssets = await client.fetch<SanityAsset[]>(
    `*[_type == "sanity.imageAsset" && sha1hash in $hashes]{_id, sha1hash}`,
    { hashes: uniqueHashes },
  );
  const assetIdByHash = new Map(
    existingAssets.flatMap((asset) =>
      asset.sha1hash ? [[asset.sha1hash, asset._id] as const] : [],
    ),
  );

  for (const asset of dryRun.assets) {
    if (assetIdByHash.has(asset.hash)) continue;
    console.log(`Uploading ${basename(asset.absolutePath)}...`);
    const uploaded = await client.assets.upload(
      "image",
      createReadStream(asset.absolutePath),
      { filename: basename(asset.absolutePath) },
    );
    assetIdByHash.set(asset.hash, uploaded._id);
  }

  const assetIdBySource = new Map(
    dryRun.assets.map((asset) => {
      const id = assetIdByHash.get(asset.hash);
      if (!id) throw new Error(`Upload did not return an asset for ${asset.src}`);
      return [asset.src, id] as const;
    }),
  );
  const documents = createDocuments(assetIdBySource);
  const summary = validateDocuments(
    documents,
    new Set(assetIdByHash.values()),
    dryRun.assets.length,
  );

  let transaction = client.transaction();
  for (const document of documents) transaction = transaction.createOrReplace(document);
  await transaction.commit({ visibility: "sync" });

  const [publishedIds, remainingDrafts, referencedAssetCount] = await Promise.all([
    client.fetch<string[]>(`*[_id in $ids]._id`, { ids: documentIds }),
    client.fetch<string[]>(
      `*[_id in $ids]._id`,
      { ids: draftIds },
      { perspective: "raw" },
    ),
    client.fetch<number>(`count(*[_id in $ids])`, {
      ids: [...new Set(assetIdByHash.values())],
    }),
  ]);

  if (publishedIds.length !== EXPECTED_DOCUMENTS) {
    throw new Error(
      `Expected ${EXPECTED_DOCUMENTS} published documents, found ${publishedIds.length}`,
    );
  }
  if (remainingDrafts.length) {
    throw new Error(`Unexpected drafts remain: ${remainingDrafts.join(", ")}`);
  }
  if (referencedAssetCount !== EXPECTED_UNIQUE_ASSETS) {
    throw new Error(
      `Expected ${EXPECTED_UNIQUE_ASSETS} referenced assets, found ${referencedAssetCount}`,
    );
  }

  console.log("Published Timeless content to Sanity.");
  console.table({
    ...summary,
    reusedAssets: existingAssets.length,
    uploadedAssets: EXPECTED_UNIQUE_ASSETS - existingAssets.length,
  });
}

seed().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
