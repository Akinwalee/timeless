import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview" || process.env.SITE_INDEXABLE === "false") return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api/", "/newsletter/confirmed"] }, sitemap: `${getSiteUrl()}/sitemap.xml` };
}
