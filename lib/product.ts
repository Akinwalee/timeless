import type { Product, ResolvedImage } from "./content";

export function resolveProductGallery(product: Product, variantId: string): ResolvedImage[] {
  const variant = product.variants.find((item) => item.id === variantId) || product.variants[0];
  if (!variant) return product.gallery;

  const images = [variant.primaryImage, ...variant.gallery, ...product.gallery];
  return images.filter((image, index) => images.findIndex((candidate) => candidate.src === image.src) === index);
}
