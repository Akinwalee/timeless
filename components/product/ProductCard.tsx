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
    <article className="group grid min-w-0 grid-cols-1 md:grid-cols-[1fr_auto]">
      <Link href={`/shop/${product.slug}`} className="image-frame relative order-1 col-span-full block h-[min(52svh,32rem)] bg-[#ecebe7] md:h-[min(58svh,38rem)] md:min-h-[26rem]" aria-label={`View ${product.name} in ${variant.name}`}>
        <ResponsiveImage key={variant.id} image={variant.primaryImage} sizes="(max-width: 767px) 100vw, 54vw" className="variant-image-enter product-preview-image transition-transform duration-700 group-hover:scale-[1.015]" />
        <span className="absolute bottom-5 right-5 bg-white px-3 py-2 text-[.6rem] uppercase tracking-[.14em] opacity-0 transition-opacity group-hover:opacity-100">View</span>
      </Link>
      <div className="order-3 mt-5 md:order-2">
        <h3 className="text-base">{product.name}</h3><p className="mt-1 text-sm text-black/55">{formatMoney(product.price, product.currency)}</p>
      </div>
      <fieldset className="order-2 mt-4 min-w-0 md:order-3 md:mt-5">
        <legend className="mb-2 text-xs uppercase tracking-[.12em] md:sr-only">Colour <span className="ml-3 normal-case tracking-normal text-black/50">{variant.name}</span></legend>
        <div className="flex flex-wrap gap-2 md:gap-3" aria-label={`Selected colour: ${variant.name}`}>
          {product.variants.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setVariantId(item.id)}
              aria-label={`Select ${item.name}`}
              aria-pressed={variant.id === item.id}
              title={item.name}
              className={`grid h-11 w-11 place-items-center md:h-5 md:w-5 ${variant.id === item.id ? "outline outline-1 outline-black outline-offset-1" : "hover:opacity-60"}`}
            >
              <span className="h-6 w-6 rounded-full border border-black/25 md:h-5 md:w-5" style={{ backgroundColor: item.colorValue }} />
            </button>
          ))}
        </div>
      </fieldset>
      <p className="order-4 col-span-full mt-2 text-[.64rem] uppercase tracking-[.12em] text-black/45">{variant.name} · {product.variants.length} {product.variants.length === 1 ? "colour" : "colours"}</p>
    </article>
  );
}
