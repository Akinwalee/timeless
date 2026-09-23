"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/content";
import { formatMoney } from "@/lib/money";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

export function ProductCard({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id || "");
  const variant = product.variants.find((item) => item.id === variantId) || product.variants[0];
  if (!variant) return null;

  return (
    <article className="group">
      <Link href={`/shop/${product.slug}`} className="image-frame relative block h-[min(58svh,38rem)] min-h-[26rem] bg-[#ecebe7]" aria-label={`View ${product.name} in ${variant.name}`}>
        <ResponsiveImage key={variant.id} image={variant.primaryImage} sizes="(max-width: 767px) 100vw, 54vw" className="variant-image-enter transition-transform duration-700 group-hover:scale-[1.015]" />
        <span className="absolute bottom-5 right-5 bg-white px-3 py-2 text-[.6rem] uppercase tracking-[.14em] opacity-0 transition-opacity group-hover:opacity-100">View</span>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div><h3 className="text-base">{product.name}</h3><p className="mt-1 text-sm text-black/55">{formatMoney(product.price, product.currency)}</p></div>
        <div className="flex gap-3" aria-label={`Selected colour: ${variant.name}`}>
          {product.variants.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setVariantId(item.id)}
              aria-label={`Select ${item.name}`}
              aria-pressed={variant.id === item.id}
              title={item.name}
              className={`h-5 w-5 rounded-full border border-black/25 p-[2px] transition-transform ${variant.id === item.id ? "ring-1 ring-black ring-offset-2" : "hover:scale-110"}`}
              style={{ backgroundColor: item.colorValue }}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-[.64rem] uppercase tracking-[.12em] text-black/45">{variant.name} · {product.variants.length} {product.variants.length === 1 ? "colour" : "colours"}</p>
    </article>
  );
}
