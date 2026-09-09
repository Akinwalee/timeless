"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { product } from "@/lib/content";

const swatches: Record<string, string> = { Black: "#080808", White: "#f5f5f1", Cream: "#d8d0ba", Navy: "#101b32" };

export function ProductCard() {
  const [color, setColor] = useState("Cream");
  return (
    <article className="group">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#ecebe7]" aria-label={`View ${product.name}`}>
        <Image src="/images/brand/asset-008.jpg" alt="Timeless Essential Tee product view" fill sizes="(max-width: 767px) 100vw, 54vw" className="object-cover transition-opacity duration-700 group-hover:opacity-0" />
        <Image src="/images/brand/asset-014.jpg" alt="Timeless Essential Tee lifestyle view" fill sizes="(max-width: 767px) 100vw, 54vw" className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <span className="absolute bottom-5 right-5 bg-white px-3 py-2 text-[.6rem] uppercase tracking-[.14em] opacity-0 transition-opacity group-hover:opacity-100">View</span>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div><h3 className="text-base">{product.name}</h3><p className="mt-1 text-sm text-black/55">{product.price}</p></div>
        <div className="flex gap-2" aria-label={`Selected colour: ${color}`}>
          {product.colors.map((item) => <button key={item} type="button" onClick={() => setColor(item)} aria-label={`Select ${item}`} title={item} className={`h-4 w-4 rounded-full border border-black/25 p-[2px] ${color === item ? "ring-1 ring-black ring-offset-2" : ""}`} style={{ backgroundColor: swatches[item] }} />)}
        </div>
      </div>
      <p className="mt-2 text-[.64rem] uppercase tracking-[.12em] text-black/45">{color} · {product.colors.length} colours</p>
    </article>
  );
}
