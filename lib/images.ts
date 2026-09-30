import { createImageUrlBuilder } from "@sanity/image-url";
import { getImageProps } from "next/image";
import type { ImageSource, ResolvedImage } from "./content/types";

// The measured migration gate retains Next's optimizer. Sanity supplies the
// original editorial crop, rather than a precompressed 2,400px intermediary.
export const IMAGE_QUALITY = { thumbnail: 75, preview: 75, viewer: 85 } as const;
export type ImageRole = keyof typeof IMAGE_QUALITY;
export const CONTENT_WIDTH = "calc(100vw - 2 * clamp(1.25rem, 3vw, 3.5rem))";
const gutter = "clamp(1.25rem, 3vw, 3.5rem)";
export const IMAGE_SIZES = {
  full: CONTENT_WIDTH,
  featuredProduct: `(max-width: 767px) ${CONTENT_WIDTH}, calc(63.636vw - 1.273 * ${gutter} - 22.91px)`,
  shopProduct: `(max-width: 767px) ${CONTENT_WIDTH}, calc(54.545vw - 1.091 * ${gutter} - 26.18px)`,
  product: "(max-width: 767px) 100vw, 50vw",
  aboutPreview: `(max-width: 767px) ${CONTENT_WIDTH}, calc(45vw - .9 * ${gutter} - 21.6px)`,
  aboutGlobal: `(max-width: 767px) ${CONTENT_WIDTH}, calc(57.5vw - 1.15 * ${gutter} - 36.8px)`,
  homepageJournal: `(max-width: 767px) ${CONTENT_WIDTH}, calc(70vw - 1.4 * ${gutter} - 16.8px)`,
  journalFeatured: `(max-width: 767px) ${CONTENT_WIDTH}, calc(67.5vw - 1.35 * ${gutter} - 18.9px)`,
  half: `(max-width: 767px) ${CONTENT_WIDTH}, calc(50vw - ${gutter} - 12px)`,
  identity: `(max-width: 767px) ${CONTENT_WIDTH}, 62vw`,
  pairLeft: `(max-width: 767px) ${CONTENT_WIDTH}, calc(55vw - 1.1 * ${gutter} - 8.8px)`,
  pairRight: `(max-width: 767px) ${CONTENT_WIDTH}, calc(45vw - .9 * ${gutter} - 7.2px)`,
} as const;

export function columnImageSizes(columns: number, total = 12, gap = 16) {
  const share = columns / total;
  return `(max-width: 767px) ${CONTENT_WIDTH}, calc(${100 * share}vw - ${2 * share} * ${gutter} - ${(1 - share) * gap}px)`;
}

export function resolveImageSource(image: ResolvedImage, mobile = false): ImageSource {
  if (mobile && image.mobile) return image.mobile;
  if (mobile && image.mobileSrc) return { src: image.mobileSrc };
  return image;
}

export function sanityImageUrl(source: ImageSource, width?: number, quality = 75, aspectRatio?: number) {
  const metadata = source.sanity;
  if (!metadata) return source.src;
  let builder = createImageUrlBuilder({ projectId: metadata.projectId, dataset: metadata.dataset })
    .image({ asset: { _ref: metadata.assetId }, crop: metadata.crop, hotspot: metadata.hotspot });
  if (width) {
    const cropWidth = (source.width || width) * (1 - (metadata.crop?.left || 0) - (metadata.crop?.right || 0));
    const target = Math.max(1, Math.round(Math.min(width, cropWidth)));
    builder = builder.width(target).quality(quality).fit("max").auto("format");
    if (aspectRatio) builder = builder.height(Math.max(1, Math.round(target / aspectRatio)));
  }
  return builder.url();
}

function sourcePosition(source: ImageSource) {
  const hotspot = source.sanity?.hotspot;
  if (!hotspot) return "center";
  const crop = source.sanity?.crop;
  const x = (hotspot.x - (crop?.left || 0)) / (1 - (crop?.left || 0) - (crop?.right || 0));
  const y = (hotspot.y - (crop?.top || 0)) / (1 - (crop?.top || 0) - (crop?.bottom || 0));
  return `${Math.max(0, Math.min(1, x)) * 100}% ${Math.max(0, Math.min(1, y)) * 100}%`;
}

export function imagePositions(image: ResolvedImage) {
  return {
    desktop: image.position || sourcePosition(image),
    mobile: image.mobilePosition || image.position || sourcePosition(resolveImageSource(image, true)),
  };
}

export function responsiveImageProps(image: ResolvedImage, sizes: string, role: ImageRole = "preview", eager = false) {
  const props = (source: ImageSource) => getImageProps({
    src: sanityImageUrl(source), alt: image.alt, fill: true, sizes,
    quality: IMAGE_QUALITY[role], loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : "auto",
  }).props;
  return { desktop: props(image), mobile: image.mobile || image.mobileSrc ? props(resolveImageSource(image, true)) : undefined };
}

export function productPreviewSizes(image: ResolvedImage, sizes: string) {
  const source = resolveImageSource(image, true);
  if (!source.width || !source.height) return sizes;
  const crop = source.sanity?.crop;
  const ratio = source.width * (1 - (crop?.left || 0) - (crop?.right || 0)) /
    (source.height * (1 - (crop?.top || 0) - (crop?.bottom || 0)));
  const [, desktop] = splitSizes(sizes);
  const mobileWidth = sizes === IMAGE_SIZES.product ? "100vw" : CONTENT_WIDTH;
  return `(max-width: 767px) min(${mobileWidth}, calc(min(52svh, 32rem) * ${ratio.toFixed(5)})), ${desktop}`;
}

function splitSizes(sizes: string) {
  let depth = 0;
  for (let i = 0; i < sizes.length; i++) {
    if (sizes[i] === "(") depth++;
    if (sizes[i] === ")") depth--;
    if (sizes[i] === "," && depth === 0) return [sizes.slice(0, i).replace(/^\(max-width: 767px\)\s*/, ""), sizes.slice(i + 1).trim()];
  }
  return [sizes, sizes];
}

export type ImageFrameRatios = { mobile: number; desktop: number };
export function coverImageSizes(image: ResolvedImage, sizes: string, frame: ImageFrameRatios) {
  const [mobile, desktop] = splitSizes(sizes);
  const effectiveSize = (source: ImageSource, size: string, frameRatio: number) => {
    if (!source.width || !source.height) return size;
    const crop = source.sanity?.crop;
    const ratio = source.width * (1 - (crop?.left || 0) - (crop?.right || 0)) /
      (source.height * (1 - (crop?.top || 0) - (crop?.bottom || 0)));
    // Cover can scale a wide photograph by height; retain enough pixels for it.
    const scale = Math.max(1, ratio / frameRatio);
    return scale === 1 ? size : `calc((${size}) * ${scale.toFixed(5)})`;
  };
  return `(max-width: 767px) ${effectiveSize(resolveImageSource(image, true), mobile, frame.mobile)}, ${effectiveSize(image, desktop, frame.desktop)}`;
}

export function videoPosterUrl(image: ResolvedImage) {
  // Native posters have no srcset; the 2x candidate is bounded to 1,200px.
  return getImageProps({ src: sanityImageUrl(image), alt: image.alt, width: 600, height: 340, quality: IMAGE_QUALITY.preview }).props.src;
}
