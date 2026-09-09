"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { product } from "@/lib/content";

export function ProductPurchase() {
  const [color, setColor] = useState("Cream");
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);
  const add = () => { if (size) setAdded(true); };
  return (
    <div className="px-[var(--gutter)] py-10 md:sticky md:top-20 md:min-h-[calc(100svh-5rem)] md:px-[clamp(2rem,5vw,6rem)] md:py-20">
      <p className="eyebrow text-black/50">{product.drop}</p>
      <h1 className="mt-5 text-[clamp(2.3rem,4vw,4.6rem)] leading-[.95] tracking-[-.055em]">{product.name}</h1>
      <p className="mt-5 text-xl">{product.price}</p>
      <p className="mt-7 max-w-md text-sm leading-relaxed text-black/58">{product.description}</p>
      <fieldset className="mt-10"><legend className="mb-4 text-xs uppercase tracking-[.12em]">Colour <span className="ml-3 normal-case tracking-normal text-black/50">{color}</span></legend><div className="flex flex-wrap gap-2">{product.colors.map(item => <button key={item} type="button" onClick={() => setColor(item)} className={`min-h-11 border px-4 text-xs ${color === item ? "border-black bg-black text-white" : "border-black/25"}`}>{item}</button>)}</div></fieldset>
      <fieldset className="mt-8"><legend className="sr-only">Size</legend><div className="mb-4 flex items-center justify-between"><span className="text-xs uppercase tracking-[.12em]">Size</span><Link className="text-xs border-b border-black/50" href="#size-guide">Size guide</Link></div><div className="grid grid-cols-6 gap-2">{product.sizes.map(item => <button key={item} type="button" onClick={() => { setSize(item); setAdded(false); }} className={`aspect-square border text-xs ${size === item ? "border-black bg-black text-white" : "border-black/25"}`}>{item}</button>)}</div></fieldset>
      {!size && <p className="mt-3 text-xs text-black/50">Choose a size to add this piece.</p>}
      <button type="button" disabled={!size} onClick={add} className="solid-button mt-8 w-full disabled:cursor-not-allowed disabled:opacity-35">{added ? <><Check size={16} className="mr-2" /> Added to bag</> : "Add to Bag"}</button>
      <div className="mt-7 grid gap-3 border-t border-black/15 pt-5 text-xs text-black/60"><p>Complimentary delivery in Nigeria on orders over ₦50,000.</p><p>Easy returns within 7 days of delivery.</p></div>
      {size && <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-4 border-t border-black/15 bg-white/95 px-4 py-3 backdrop-blur md:hidden"><div><p className="text-xs">{product.shortName} · {size}</p><p className="text-[.65rem] text-black/50">{color} · {product.price}</p></div><button onClick={add} className="solid-button min-h-11 px-5">{added ? "Added" : "Add to Bag"}</button></div>}
    </div>
  );
}
