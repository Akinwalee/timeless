import type {
  GlobalSettings,
  HomepageContent,
  InTheWildEntry,
  JournalBlock,
  JournalEntry,
  Product,
  ProductVariant,
} from "@/lib/content";
import {
  fallbackInTheWild,
  fallbackJournal,
  fallbackProduct,
  fallbackSettings,
} from "@/lib/content";
import { getSanityClient } from "./client";
import { resolveSanityImage, type RawResponsiveImage } from "./image";
import {
  IN_THE_WILD_QUERY,
  JOURNAL_ENTRY_QUERY,
  JOURNAL_QUERY,
  PRODUCT_QUERY,
  PRODUCTS_QUERY,
  SETTINGS_QUERY,
} from "./queries";

type RawVariant = Omit<ProductVariant, "primaryImage" | "gallery"> & {
  primaryImage?: RawResponsiveImage;
  gallery?: RawResponsiveImage[];
};

type RawProduct = Omit<Product, "variants" | "gallery"> & {
  variants?: RawVariant[];
  gallery?: RawResponsiveImage[];
};

type RawJournal = Omit<JournalEntry, "coverImage" | "body"> & {
  coverImage?: RawResponsiveImage;
  body?: Array<Record<string, unknown> & { _key: string; _type: string }>;
};

type RawInTheWild = Omit<InTheWildEntry, "images"> & {
  images?: RawResponsiveImage[];
};

async function fetchPublished<T>(
  query: string,
  params: Record<string, string> = {},
  tags: string[] = [],
) {
  const client = getSanityClient();
  if (!client) return { configured: false as const, data: null as T | null };

  try {
    const data = await client.fetch<T>(query, params, {
      next: { revalidate: 60, tags },
    });
    return { configured: true as const, data };
  } catch (error) {
    console.warn("Sanity content fetch failed; using local fallback content.", error);
    return { configured: false as const, data: null as T | null };
  }
}

function mapProduct(raw: RawProduct): Product | null {
  const variants = (raw.variants || []).flatMap((variant) => {
    const primaryImage = resolveSanityImage(variant.primaryImage, `${raw.name} in ${variant.name}`);
    if (!primaryImage) return [];
    return [{
      ...variant,
      primaryImage,
      gallery: (variant.gallery || []).flatMap((item) => {
        const resolved = resolveSanityImage(item, `${raw.name} in ${variant.name}`);
        return resolved ? [resolved] : [];
      }),
    }];
  });

  if (!raw.id || !raw.slug || !raw.name || variants.length === 0) return null;
  return {
    ...raw,
    shortName: raw.shortName || raw.name,
    status: raw.status || "available",
    drop: raw.drop || "",
    description: raw.description || "",
    price: Number(raw.price || 0),
    currency: raw.currency || "NGN",
    sizes: raw.sizes || [],
    variants,
    gallery: (raw.gallery || []).flatMap((item) => {
      const resolved = resolveSanityImage(item, raw.name);
      return resolved ? [resolved] : [];
    }),
    materials: raw.materials || "",
    fit: raw.fit || "",
    construction: raw.construction || "",
    care: raw.care || "",
    featured: Boolean(raw.featured),
    order: Number(raw.order || 0),
  };
}

function mapJournalBody(body: RawJournal["body"]): JournalBlock[] {
  return (body || []).flatMap((block) => {
    if (block._type === "block") return [block as JournalBlock];
    if (block._type === "responsiveImage") {
      const image = resolveSanityImage(block as RawResponsiveImage);
      return image ? [{ _key: block._key, _type: "image" as const, image }] : [];
    }
    if (block._type === "imagePair") {
      const left = resolveSanityImage(block.left as RawResponsiveImage | undefined);
      const right = resolveSanityImage(block.right as RawResponsiveImage | undefined);
      return left && right ? [{ _key: block._key, _type: "imagePair" as const, left, right }] : [];
    }
    if (block._type === "editorialQuote" && typeof block.quote === "string") {
      return [{ _key: block._key, _type: "quote" as const, quote: block.quote, attribution: typeof block.attribution === "string" ? block.attribution : undefined }];
    }
    if (block._type === "editorialVideo" && typeof block.url === "string") {
      return [{
        _key: block._key,
        _type: "video" as const,
        url: block.url,
        caption: typeof block.caption === "string" ? block.caption : undefined,
        poster: resolveSanityImage(block.poster as RawResponsiveImage | undefined) || undefined,
      }];
    }
    return [];
  });
}

function mapJournal(raw: RawJournal): JournalEntry | null {
  const coverImage = resolveSanityImage(raw.coverImage, raw.title);
  if (!raw.id || !raw.slug || !raw.title || !coverImage) return null;
  return {
    ...raw,
    issue: raw.issue || "Journal",
    category: raw.category || "Notes",
    date: raw.date || "",
    excerpt: raw.excerpt || "",
    coverImage,
    body: mapJournalBody(raw.body),
    featured: Boolean(raw.featured),
    order: Number(raw.order || 0),
  };
}

function mapInTheWild(raw: RawInTheWild): InTheWildEntry | null {
  const images = (raw.images || []).flatMap((item) => {
    const resolved = resolveSanityImage(item, raw.title);
    return resolved ? [resolved] : [];
  });
  if (!raw.id || !raw.slug || !raw.title || images.length === 0) return null;
  return {
    ...raw,
    location: raw.location || "",
    date: raw.date || "",
    pieceWorn: raw.pieceWorn || "",
    images,
    homepageFeatured: Boolean(raw.homepageFeatured),
    order: Number(raw.order || 0),
  };
}

export async function getProducts(): Promise<Product[]> {
  const result = await fetchPublished<RawProduct[]>(PRODUCTS_QUERY, {}, ["product"]);
  if (!result.configured) return [fallbackProduct];
  return (result.data || []).flatMap((item) => {
    const mapped = mapProduct(item);
    return mapped ? [mapped] : [];
  });
}

export async function getProduct(slug: string): Promise<Product | null> {
  const result = await fetchPublished<RawProduct | null>(PRODUCT_QUERY, { slug }, [`product:${slug}`]);
  if (!result.configured) return slug === fallbackProduct.slug ? fallbackProduct : null;
  return result.data ? mapProduct(result.data) : null;
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const result = await fetchPublished<RawJournal[]>(JOURNAL_QUERY, {}, ["journal"]);
  if (!result.configured) return fallbackJournal;
  return (result.data || []).flatMap((item) => {
    const mapped = mapJournal(item);
    return mapped ? [mapped] : [];
  });
}

export async function getJournalEntry(slug: string): Promise<JournalEntry | null> {
  const result = await fetchPublished<RawJournal | null>(JOURNAL_ENTRY_QUERY, { slug }, [`journal:${slug}`]);
  if (!result.configured) return fallbackJournal.find((entry) => entry.slug === slug) || null;
  return result.data ? mapJournal(result.data) : null;
}

export async function getInTheWildEntries(): Promise<InTheWildEntry[]> {
  const result = await fetchPublished<RawInTheWild[]>(IN_THE_WILD_QUERY, {}, ["inTheWild"]);
  if (!result.configured) return fallbackInTheWild;
  return (result.data || []).flatMap((item) => {
    const mapped = mapInTheWild(item);
    return mapped ? [mapped] : [];
  });
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  const result = await fetchPublished<GlobalSettings | null>(SETTINGS_QUERY, {}, ["globalSettings"]);
  return result.configured && result.data
    ? {
        ...fallbackSettings,
        ...result.data,
        navigation: result.data.navigation || fallbackSettings.navigation,
        socialLinks: result.data.socialLinks || fallbackSettings.socialLinks,
        contactEmail: result.data.contactEmail || fallbackSettings.contactEmail,
        homepageInTheWildSlugs: result.data.homepageInTheWildSlugs || [],
        homepageJournalSlugs: result.data.homepageJournalSlugs || [],
      }
    : fallbackSettings;
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const [products, inTheWild, journal, settings] = await Promise.all([
    getProducts(),
    getInTheWildEntries(),
    getJournalEntries(),
    getGlobalSettings(),
  ]);

  const product = products.find((item) => item.slug === settings.homepageProductSlug)
    || products.find((item) => item.featured)
    || products[0]
    || null;
  const orderedWild = settings.homepageInTheWildSlugs.length
    ? settings.homepageInTheWildSlugs.flatMap((slug) => {
        const entry = inTheWild.find((item) => item.slug === slug);
        return entry ? [entry] : [];
      })
    : inTheWild.filter((entry) => entry.homepageFeatured);
  const featuredJournal = settings.homepageJournalSlugs
    .map((slug) => journal.find((entry) => entry.slug === slug))
    .find(Boolean)
    || journal.find((entry) => entry.featured)
    || journal[0]
    || null;

  return { product, inTheWild: orderedWild, journal: featuredJournal, settings };
}
