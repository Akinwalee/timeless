"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ResolvedImage } from "@/lib/content";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

export function GalleryViewer({ images }: { images: ResolvedImage[] }) {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowRight") setIndex((index + 1) % images.length);
      if (event.key === "ArrowLeft") setIndex((index - 1 + images.length) % images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [images.length, index]);

  return (
    <>
      <div className="grid gap-1 bg-white">
        {images.slice(0, 4).map((image, i) => (
          <button
            key={`${image.src}-${i}`}
            onClick={() => setIndex(i)}
            className={`group image-frame relative w-full bg-bone ${i > 0 ? "hidden md:block" : "block"} ${i === 0 ? "aspect-[4/5]" : i === 1 ? "aspect-[5/6]" : "aspect-square"}`}
            aria-label={`View image ${i + 1} full screen`}
          >
            <ResponsiveImage image={image} priority={i === 0} sizes="(max-width: 767px) 100vw, 50vw" className="transition-transform duration-700 group-hover:scale-[1.015]" />
          </button>
        ))}
      </div>
      {index !== null && images[index] && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-black text-white" role="dialog" aria-modal="true" aria-label="Product gallery viewer">
          <div className="absolute inset-4 md:inset-10"><ResponsiveImage image={images[index]} sizes="100vw" priority className="object-contain" /></div>
          <button autoFocus onClick={() => setIndex(null)} className="absolute right-5 top-5 grid h-12 w-12 place-items-center bg-black/50" aria-label="Close image viewer"><X /></button>
          <button onClick={() => setIndex((index - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-black/50" aria-label="Previous image"><ChevronLeft /></button>
          <button onClick={() => setIndex((index + 1) % images.length)} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-black/50" aria-label="Next image"><ChevronRight /></button>
          <p className="absolute bottom-5 left-5 text-xs tracking-[.14em]">{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</p>
        </div>
      )}
    </>
  );
}
