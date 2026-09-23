/* eslint-disable @next/next/no-img-element */
import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import type { ResolvedImage } from "@/lib/content";

type ImageStyle = CSSProperties & {
  "--image-position"?: string;
  "--image-position-mobile"?: string;
};

export function ResponsiveImage({
  image,
  sizes,
  priority = false,
  className = "",
}: {
  image: ResolvedImage;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const style: ImageStyle = {
    "--image-position": image.position || "center",
    "--image-position-mobile": image.mobilePosition || image.position || "center",
  };
  const common = {
    alt: image.alt,
    fill: true as const,
    sizes,
    priority,
    className: `responsive-content-image object-cover ${className}`,
    style,
  };
  const { props: desktop } = getImageProps({ src: image.src, ...common });

  if (!image.mobileSrc) return <img {...desktop} alt={image.alt} />;
  const { props: mobile } = getImageProps({ src: image.mobileSrc, ...common });
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobile.srcSet} />
      <img {...desktop} alt={image.alt} />
    </picture>
  );
}
