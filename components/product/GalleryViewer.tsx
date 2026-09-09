"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { product } from "@/lib/content";

export function GalleryViewer() {
  const [index, setIndex] = useState<number | null>(null);
  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setIndex(null); if (event.key === "ArrowRight") setIndex((index + 1) % product.images.length); if (event.key === "ArrowLeft") setIndex((index - 1 + product.images.length) % product.images.length); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [index]);
  return (
    <>
      <div className="grid gap-1 bg-white">
        {product.images.slice(0, 4).map((image, i) => <button key={image.src} onClick={() => setIndex(i)} className={`group relative w-full overflow-hidden bg-bone ${i > 0 ? "hidden md:block" : "block"} ${i === 0 ? "aspect-[4/5]" : i === 1 ? "aspect-[5/6]" : "aspect-square"}`} aria-label={`View image ${i + 1} full screen`}><Image src={image.src} alt={image.alt} fill priority={i === 0} sizes="(max-width: 767px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.015]" /></button>)}
      </div>
      {index !== null && <div className="fixed inset-0 z-[120] grid place-items-center bg-black text-white" role="dialog" aria-modal="true" aria-label="Product gallery viewer">
        <Image src={product.images[index].src} alt={product.images[index].alt} fill sizes="100vw" className="object-contain" priority />
        <button autoFocus onClick={() => setIndex(null)} className="absolute right-5 top-5 grid h-12 w-12 place-items-center bg-black/50" aria-label="Close image viewer"><X /></button>
        <button onClick={() => setIndex((index - 1 + product.images.length) % product.images.length)} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-black/50" aria-label="Previous image"><ChevronLeft /></button>
        <button onClick={() => setIndex((index + 1) % product.images.length)} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-black/50" aria-label="Next image"><ChevronRight /></button>
        <p className="absolute bottom-5 left-5 text-xs tracking-[.14em]">{String(index + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}</p>
      </div>}
    </>
  );
}
