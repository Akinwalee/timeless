"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/content";
import { resolveProductGallery } from "@/lib/product";
import { GalleryViewer } from "./GalleryViewer";
import { ProductPurchase } from "./ProductPurchase";
import { ProductColourSelector } from "./ProductColourSelector";
import { useImageWarming } from "@/components/media/useImageWarming";
import { IMAGE_SIZES } from "@/lib/images";

export function ProductConfigurator({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id || "");
  const variant = product.variants.find((item) => item.id === variantId) || product.variants[0];
  const images = useMemo(() => resolveProductGallery(product, variantId), [product, variantId]);
  const primaryImages = useMemo(() => product.variants.map((item) => item.primaryImage), [product.variants]);
  const { ref, warm } = useImageWarming(primaryImages, IMAGE_SIZES.product, true);
  const onIntent = (id: string) => { const image = product.variants.find((item) => item.id === id)?.primaryImage; if (image) warm(image); };

  if (!variant) return null;
  return (
    <section className="grid items-start md:grid-cols-2">
      <div ref={ref} className="min-w-0">
        <GalleryViewer images={images} selection={variant.name} />
        <ProductColourSelector variants={product.variants} selectedId={variant.id} onChange={setVariantId} onIntent={onIntent} className="mx-[var(--gutter)] mt-4 md:hidden" />
      </div>
      <ProductPurchase product={product} variant={variant} onVariantChange={setVariantId} onVariantIntent={onIntent} />
    </section>
  );
}
