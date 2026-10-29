import type { CSSProperties } from "react";
import type { ResolvedImage } from "@/lib/content";
import { coverImageSizes, imagePositions, responsiveImageProps, type ImageFrameRatios, type ImageRole } from "@/lib/images";

type ImageStyle = CSSProperties & {
  "--image-position"?: string;
  "--image-position-mobile"?: string;
  "--image-preview"?: string;
  "--image-preview-mobile"?: string;
};

export function ResponsiveImage({
  image,
  sizes,
  priority = false,
  role = "preview",
  frame,
  className = "",
}: {
  image: ResolvedImage;
  sizes: string;
  priority?: boolean;
  role?: ImageRole;
  frame?: ImageFrameRatios;
  className?: string;
}) {
  const positions = imagePositions(image);
  const style: ImageStyle = { "--image-position": positions.desktop, "--image-position-mobile": positions.mobile };
  const resolvedSizes = frame ? coverImageSizes(image, sizes, frame) : sizes;
  const { desktop, mobile } = responsiveImageProps(image, resolvedSizes, role, priority);
  const preview = image.lqip;
  const mobilePreview = image.mobile || image.mobileSrc ? image.mobile?.lqip : preview;
  const previewStyle: ImageStyle = { ...style, "--image-preview": preview ? `url("${preview}")` : "none", "--image-preview-mobile": mobilePreview ? `url("${mobilePreview}")` : "none" };
  return (
    <picture>
      {(preview || mobilePreview) && <span aria-hidden="true" className={`image-preview ${className.includes("object-contain") ? "image-preview-contain" : className.includes("product-preview-image") ? "image-preview-product" : ""}`} style={previewStyle} />}
      {mobile && <source media="(max-width: 767px)" srcSet={mobile.srcSet || mobile.src} sizes={resolvedSizes} />}
      <img {...desktop} alt={image.alt} className={`responsive-content-image object-cover ${className}`} style={{ ...desktop.style, ...style, ...(preview || mobilePreview ? { background: "transparent" } : {}) }} />
    </picture>
  );
}
