import { describe, expect, it } from "vitest";
import { coverImageSizes, IMAGE_QUALITY, IMAGE_SIZES, imagePositions, productPreviewSizes, resolveImageSource, responsiveImageProps, sanityImageUrl, videoPosterUrl } from "./images";
import type { ResolvedImage } from "./content/types";
import nextConfig from "../next.config";

const image: ResolvedImage = {
  src: "https://cdn.sanity.io/images/project/production/example-2000x3000.jpg",
  alt: "Timeless cotton detail", width: 2000, height: 3000,
  sanity: { assetId: "image-example-2000x3000-jpg", projectId: "project", dataset: "production",
    crop: { left: .1, right: .1, top: .1, bottom: 0 },
    hotspot: { x: .6, y: .5, width: .2, height: .2 } },
};

describe("image delivery", () => {
  it("accounts for landscape photographs covering tall frames without oversizing portraits", () => {
    const landscape = { src: "/court.jpg", alt: "Court", width: 1500, height: 1000 };
    expect(coverImageSizes(landscape, IMAGE_SIZES.half, { mobile: .8, desktop: 16 / 9 })).toContain("* 1.87500");
    expect(coverImageSizes(image, IMAGE_SIZES.half, { mobile: .8, desktop: 16 / 9 })).not.toContain("* 1.");
  });
  it("preserves crop and generates deterministic bounded Sanity transforms", () => {
    const url = sanityImageUrl(image, 4000, 80);
    expect(url).toBe(sanityImageUrl(image, 4000, 80));
    const params = new URL(url).searchParams;
    expect(params.get("rect")).toBe("200,300,1600,2700");
    expect(params.get("w")).toBe("1600");
    expect(params.get("q")).toBe("80");
    expect(params.get("auto")).toBe("format");
    expect(sanityImageUrl(image, 800, 80, 1)).toContain("h=800");
    expect(sanityImageUrl(image)).not.toContain("w=2400");
  });

  it("retains hotspot positions and intentional overrides", () => {
    expect(imagePositions(image).desktop).toBe("62.5% 44.44444444444445%");
    expect(imagePositions({ ...image, position: "20% 30%", mobilePosition: "40% 50%" })).toEqual({ desktop: "20% 30%", mobile: "40% 50%" });
  });

  it("supports mobile metadata and legacy local/mobile URLs", () => {
    const mobile = { src: "/mobile.jpg", width: 600, height: 900 };
    expect(resolveImageSource({ ...image, mobile }, true)).toBe(mobile);
    expect(resolveImageSource({ src: "/desktop.jpg", mobileSrc: "/mobile.jpg", alt: "Tee" }, true).src).toBe("/mobile.jpg");
    const local = { src: "/tee.jpg", alt: "Tee" };
    expect(sanityImageUrl(local, 640)).toBe("/tee.jpg");
    expect(responsiveImageProps(local, "350px").desktop.src).toContain("/_next/image?");
    expect(responsiveImageProps({ ...image, mobile }, "350px").mobile?.srcSet).toContain("mobile.jpg");
    const legacy = { src: image.src + "?w=2400&auto=format", alt: "Saved tee" };
    expect(responsiveImageProps(legacy, "104px", "thumbnail").desktop.src).toContain("_next/image");
  });

  it("keeps role quality and eager loading explicit without blanket preloads", () => {
    expect(IMAGE_QUALITY).toEqual({ thumbnail: 75, preview: 75, viewer: 85 });
    expect(responsiveImageProps(image, "100vw").desktop.loading).toBe("lazy");
    expect(responsiveImageProps(image, "100vw").desktop.style).toMatchObject({ position: "absolute", width: "100%", height: "100%" });
    expect(responsiveImageProps(image, "100vw", "preview", true).desktop.fetchPriority).toBe("high");
    expect(nextConfig.images?.qualities).toContain(IMAGE_QUALITY.viewer);
    expect(videoPosterUrl(image)).toContain("w=1200");
  });

  it("sizes contained mobile previews without corrupting nested desktop calc expressions", () => {
    const sizes = productPreviewSizes(image, IMAGE_SIZES.featuredProduct);
    expect(sizes).toContain("min(52svh, 32rem)");
    expect(sizes).toContain(")), calc(63.636vw - 1.273 * clamp(1.25rem, 3vw, 3.5rem) - 22.91px)");
    expect(productPreviewSizes({ src: "/tee.jpg", alt: "Tee" }, IMAGE_SIZES.product)).toBe(IMAGE_SIZES.product);
    const props = responsiveImageProps(image, "390px").desktop;
    const widths = [...(props.srcSet || "").matchAll(/ (\d+)w/g)].map((match) => Number(match[1]));
    expect(widths.some((width) => width >= 390 * 3)).toBe(true);
  });
});
