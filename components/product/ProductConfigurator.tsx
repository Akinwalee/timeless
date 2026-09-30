"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/content";
import { resolveProductGallery } from "@/lib/product";
import { GalleryViewer } from "./GalleryViewer";
import { ProductPurchase } from "./ProductPurchase";
import { ProductColourSelector } from "./ProductColourSelector";

export function ProductConfigurator({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id || "");
  const variant = product.variants.find((item) => item.id === variantId) || product.variants[0];
  const images = useMemo(() => resolveProductGallery(product, variantId), [product, variantId]);

  if (!variant) return null;
  return (
    <section className="grid items-start md:grid-cols-2">
      <div className="min-w-0">
        <GalleryViewer key={images[0]?.src} images={images} />
        <ProductColourSelector variants={product.variants} selectedId={variant.id} onChange={setVariantId} className="mx-[var(--gutter)] mt-4 md:hidden" />
      </div>
      <ProductPurchase product={product} variant={variant} onVariantChange={setVariantId} />
    </section>
  );
}
