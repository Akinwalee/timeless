import type { MetadataRoute } from "next";
import { getProducts, getJournalEntries } from "@/sanity/lib/fetch";
import { getSiteUrl, policyLinks } from "@/lib/site";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, stories] = await Promise.all([getProducts(), getJournalEntries()]);
  return ["/", "/shop", "/about", "/journal", "/in-the-wild", ...policyLinks.map(link => link.href), ...products.map(p => `/shop/${p.slug}`), ...stories.map(s => `/journal/${s.slug}`)].map(path => ({ url: new URL(path, getSiteUrl()).href }));
}
