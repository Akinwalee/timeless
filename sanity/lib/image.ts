import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import type { ImageCrop, ImageHotspot, ImageSource, ResolvedImage } from "@/lib/content/types";
import { isSanityConfigured, sanityEnv } from "../env";

type RawImage = {
  alt?: string;
  caption?: string;
  crop?: ImageCrop;
  hotspot?: ImageHotspot;
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
  const assetId = source.asset._id || source.asset._ref;
  const src = builder && assetId ? builder.image(source as SanityImageSource).url() : source.asset.url;
  if (!src) return undefined;
  const dimensions = source.asset.metadata?.dimensions;
  return {
    src,
    width: dimensions?.width,
    height: dimensions?.height,
    lqip: source.asset.metadata?.lqip,
    sanity: assetId && isSanityConfigured ? {
      assetId,
      projectId: sanityEnv.projectId,
      dataset: sanityEnv.dataset,
      crop: source.crop,
      hotspot: source.hotspot,
    } : undefined,
  } satisfies ImageSource;
}

export function resolveSanityImage(
  value: RawResponsiveImage | undefined,
  fallbackAlt = "Timeless editorial image",
): ResolvedImage | null {
  const desktop = resolveSource(value?.image);
  if (!desktop) return null;
  const mobile = resolveSource(value?.mobileImage);

  return {
    ...desktop,
    mobile,
    mobileSrc: mobile?.src,
    alt: value?.image?.alt || fallbackAlt,
    caption: value?.image?.caption,
  };
}
