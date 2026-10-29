import type { Metadata } from "next";
import { getSiteUrl } from "./site";

export function pageMetadata(title: string, description: string, path: string, image = "/opengraph-image", type: "website" | "article" = "website"): Metadata {
  const url = new URL(path, getSiteUrl()).href;
  const shareImage = new URL(image, getSiteUrl()).href;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Timeless", type, locale: "en_NG", images: [{ url: shareImage, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [shareImage] },
  };
}
