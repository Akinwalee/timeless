"use client";

import { Check } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { ProductColourSelector } from "./ProductColourSelector";
import { useProductSelection } from "./ProductSelection";

export function ProductFinalPurchase() {
  const { product, variant, size, added, selectVariant, selectSize, add } = useProductSelection();
  if (!variant) return null;
  const purchasable = product.status === "available";

  return (
    <section aria-labelledby="final-purchase-title" className="site-shell grid gap-12 border-t border-black/15 py-[clamp(4rem,8vw,8rem)] md:grid-cols-2 md:items-center">
      <div>
        <h2 id="final-purchase-title" className="display text-[clamp(3.5rem,7vw,7rem)]">Make it yours.</h2>
        <p className="mt-6 text-lg">{product.name}</p>
        <p className="mt-3 text-lg">{formatMoney(product.price, product.currency)}</p>
      </div>
      <div className="w-full max-w-xl md:justify-self-end">
        <ProductColourSelector variants={product.variants} selectedId={variant.id} onChange={selectVariant} />
        <fieldset className="product-size-selector mt-8">
          <legend className="mb-4 text-xs uppercase tracking-[.12em]">Size</legend>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((value) => <button key={value} type="button" aria-pressed={size === value} onClick={() => selectSize(value)} className={`min-h-11 min-w-11 border px-4 text-xs ${size === value ? "border-black bg-black text-white" : "border-black/25"}`}>{value}</button>)}
          </div>
        </fieldset>
        <p className="mt-4 text-sm text-black/65" role="status">{!purchasable ? `This piece is currently ${product.status.replace("-", " ")}.` : size ? `${variant.name} · ${size}` : "Choose a size before adding this piece."}</p>
        <button type="button" onClick={add} disabled={!size || !purchasable} className="solid-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-35">{added ? <><Check size={16} className="mr-2" /> Added to bag</> : "Add to Bag"}</button>
      </div>
    </section>
  );
}
