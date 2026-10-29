import { describe, expect, it } from "vitest";
import { fallbackProduct } from "./content/fallback";
import { resolveProductGallery } from "./product";

describe("resolveProductGallery", () => {
  it("places the selected colour image first", () => {
    const images = resolveProductGallery(fallbackProduct, "white");
    expect(images[0].src).toContain("white-primary");
    expect(images.map((image) => image.src)).toContain("/images/timeless/product/essential-tee-white-lifestyle.jpg");
  });

  it("falls back to the first ordered variant", () => {
    expect(resolveProductGallery(fallbackProduct, "missing")[0].src).toContain("black-primary");
  });
});
