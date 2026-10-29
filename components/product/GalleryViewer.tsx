"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ResolvedImage } from "@/lib/content";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { SwitchableImage } from "@/components/media/SwitchableImage";
import { IMAGE_SIZES, productPreviewSizes } from "@/lib/images";

export function GalleryViewer({ images, selection }: { images: ResolvedImage[]; selection: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const viewer = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const isOpen = index !== null;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowRight") setIndex((current) => ((current || 0) + 1) % images.length);
      if (event.key === "ArrowLeft") setIndex((current) => ((current || 0) - 1 + images.length) % images.length);
      if (event.key === "Tab") {
        const buttons = Array.from(viewer.current?.querySelectorAll<HTMLButtonElement>("button") || []);
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); trigger.current?.focus(); };
  }, [images.length, isOpen]);

  return (
    <>
      <div className="grid gap-1 bg-white">
        {images.slice(0, 4).map((image, i) => (
          <button
            key={i}
            onClick={(event) => { trigger.current = event.currentTarget; setIndex(i); }}
            className={`group image-frame relative w-full bg-bone ${i > 0 ? "hidden md:block" : "block"} ${i === 0 ? "h-[min(52svh,32rem)] md:aspect-[4/5] md:h-auto" : i === 1 ? "aspect-[5/6]" : "aspect-square"}`}
            aria-label={`View image ${i + 1} full screen`}
          >
            {i === 0 ? <SwitchableImage image={image} selection={selection} priority sizes={productPreviewSizes(image, IMAGE_SIZES.product)} className="product-preview-image transition-transform duration-700 group-hover:scale-[1.015]" /> : <ResponsiveImage image={image} sizes={IMAGE_SIZES.product} className="product-preview-image transition-transform duration-700 group-hover:scale-[1.015]" />}
          </button>
        ))}
      </div>
      {index !== null && images[index] && (
        <div ref={viewer} className="fixed inset-0 z-[120] grid place-items-center bg-black text-white" role="dialog" aria-modal="true" aria-label="Product gallery viewer">
          <div className="absolute inset-4 md:inset-10"><ResponsiveImage image={images[index]} sizes="(max-width: 767px) calc(100vw - 32px), calc(100vw - 80px)" priority role="viewer" className="object-contain" /></div>
          <button autoFocus onClick={() => setIndex(null)} className="absolute right-5 top-5 grid h-12 w-12 place-items-center bg-black/50" aria-label="Close image viewer"><X /></button>
          <button onClick={() => setIndex((index - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-black/50" aria-label="Previous image"><ChevronLeft /></button>
          <button onClick={() => setIndex((index + 1) % images.length)} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-black/50" aria-label="Next image"><ChevronRight /></button>
          <p className="absolute bottom-5 left-5 text-xs tracking-[.14em]">{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</p>
        </div>
      )}
    </>
  );
}
