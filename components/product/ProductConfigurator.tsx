"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/content";
import { resolveProductGallery } from "@/lib/product";
import { GalleryViewer } from "./GalleryViewer";
import { ProductPurchase } from "./ProductPurchase";

export function ProductConfigurator({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id || "");
  const variant = product.variants.find((item) => item.id === variantId) || product.variants[0];
  const images = useMemo(() => resolveProductGallery(product, variantId), [product, variantId]);

  if (!variant) return null;
  return (
    <section className="grid items-start md:grid-cols-2">
      <GalleryViewer key={images[0]?.src} images={images} />
      <ProductPurchase product={product} variant={variant} onVariantChange={setVariantId} />
    </section>
  );
}
