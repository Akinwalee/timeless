import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import type { ResolvedImage } from "@/lib/content";
import { isSanityConfigured, sanityEnv } from "../env";

type RawImage = {
  alt?: string;
  caption?: string;
  crop?: unknown;
  hotspot?: unknown;
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: {
      dimensions?: { width?: number; height?: number };
      lqip?: string;
    };
  };
};

export type RawResponsiveImage = {
  image?: RawImage;
  mobileImage?: RawImage;
};

const builder = isSanityConfigured
  ? createImageUrlBuilder({
      projectId: sanityEnv.projectId,
      dataset: sanityEnv.dataset,
    })
  : null;

function resolveSource(source?: RawImage) {
  if (!source?.asset) return undefined;
  if (builder) return builder.image(source as SanityImageSource).width(2400).fit("max").auto("format").url();
  return source.asset.url;
}

export function resolveSanityImage(
  value: RawResponsiveImage | undefined,
  fallbackAlt = "Timeless editorial image",
): ResolvedImage | null {
  const src = resolveSource(value?.image);
  if (!src) return null;

  const dimensions = value?.image?.asset?.metadata?.dimensions;
  return {
    src,
    mobileSrc: resolveSource(value?.mobileImage),
    alt: value?.image?.alt || fallbackAlt,
    caption: value?.image?.caption,
    width: dimensions?.width,
    height: dimensions?.height,
  };
}
