"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/content";
import { formatMoney } from "@/lib/money";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

export function FeaturedProduct({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id || "");
  const variant = product.variants.find((item) => item.id === variantId) || product.variants[0];
  if (!variant) return null;

  return (
    <section className="site-shell grid gap-9 py-[clamp(4.5rem,8vw,7rem)] md:grid-cols-[1.4fr_.8fr] md:items-center">
      <div className="image-frame h-[min(68svh,46rem)] min-h-[32rem] md:min-h-0">
        <ResponsiveImage
          key={variant.id}
          image={variant.primaryImage}
          sizes="(max-width: 767px) 100vw, 62vw"
          priority
          className="variant-image-enter"
        />
      </div>
      <div className="md:pl-[3vw]">
        <p className="eyebrow text-black/50">{product.drop} / 001</p>
        <h2 className="display mt-6 text-[clamp(4rem,7vw,8rem)]">The {product.shortName}.</h2>
        <p className="mt-7 text-xl">{formatMoney(product.price, product.currency)}</p>
        <p className="mt-8 max-w-xs text-sm leading-relaxed text-black/55">One deliberate piece, made to begin where your styling takes over.</p>
        <fieldset className="mt-7">
          <legend className="sr-only">Select colour</legend>
          <div className="flex flex-wrap gap-2" aria-label={`Selected colour: ${variant.name}`}>
            {product.variants.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setVariantId(item.id)}
                aria-pressed={variant.id === item.id}
                className={`min-h-10 border px-3 text-[.62rem] uppercase tracking-[.12em] transition-colors ${variant.id === item.id ? "border-black bg-black text-white" : "border-black/20 hover:border-black"}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </fieldset>
        <Link href={`/shop/${product.slug}`} className="text-link mt-10">View the piece <ArrowRight size={15} strokeWidth={1.3} /></Link>
      </div>
    </section>
  );
}
