"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { InTheWildEntry } from "@/lib/content";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

gsap.registerPlugin(useGSAP);

export function InTheWildCarousel({ entries }: { entries: InTheWildEntry[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const slides = useRef<Array<HTMLElement | null>>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const root = track.current;
    if (!root) return;
    let frame = 0;
    const updateIndex = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = root.scrollLeft + root.clientWidth / 2;
        const closest = slides.current.reduce(
          (best, slide, slideIndex) => {
            if (!slide) return best;
            const distance = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center);
            return distance < best.distance ? { index: slideIndex, distance } : best;
          },
          { index: 0, distance: Number.POSITIVE_INFINITY },
        );
        setIndex(closest.index);
      });
    };
    root.addEventListener("scroll", updateIndex, { passive: true });
    updateIndex();
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("scroll", updateIndex);
    };
  }, [entries.length]);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const slide = slides.current[index];
    if (!slide) return;
    gsap.fromTo(slide.querySelector("img"), { scale: 1.035 }, { scale: 1, duration: 1.1, ease: "power3.out" });
    gsap.fromTo(slide.querySelector("[data-caption]"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .65, ease: "power3.out" });
  }, { scope: section, dependencies: [index] });

  const goTo = (next: number) => {
    if (!entries.length) return;
    const resolved = (next + entries.length) % entries.length;
    slides.current[resolved]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
    setIndex(resolved);
  };

  if (!entries.length) return null;
  return (
    <section
      ref={section}
      className="bg-black py-[var(--section)] text-white"
      aria-roledescription="carousel"
      aria-label="Timeless in the Wild"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); goTo(index - 1); }
        if (event.key === "ArrowRight") { event.preventDefault(); goTo(index + 1); }
      }}
    >
      <div className="site-shell flex items-end justify-between gap-8">
        <div><p className="eyebrow text-white/45">Field archive</p><h2 className="display mt-5 text-[clamp(4.5rem,10vw,11rem)]">Timeless In the Wild</h2></div>
        <Link href="/in-the-wild" className="text-link hidden md:inline-flex">Enter the archive <ArrowRight size={15} /></Link>
      </div>
      <div ref={track} className="editorial-carousel mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pl-[var(--gutter)] pr-[12vw] md:gap-7 md:pr-[18vw]">
        {entries.map((entry, slideIndex) => (
          <article
            key={entry.id}
            ref={(node) => { slides.current[slideIndex] = node; }}
            data-index={slideIndex}
            className="w-[84vw] shrink-0 snap-center md:w-[64vw]"
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${entries.length}: ${entry.title}`}
          >
            <div className={`image-frame ${slideIndex % 2 ? "aspect-[4/5] md:aspect-[16/10]" : "aspect-[3/4] md:aspect-[16/9]"}`}>
              <ResponsiveImage image={entry.images[0]} sizes="(max-width: 767px) 84vw, 64vw" />
            </div>
            <div data-caption className="mt-5 grid gap-4 border-t border-white/25 pt-4 md:grid-cols-[1fr_auto]">
              <div><h3 className="text-[clamp(1.7rem,3vw,3.4rem)] leading-none tracking-[-.045em]">{entry.title}</h3><p className="mt-3 text-xs uppercase tracking-[.13em] text-white/50">{entry.location} · {entry.date}</p></div>
              <p className="max-w-xs text-sm leading-relaxed text-white/55 md:text-right">{entry.note}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="site-shell mt-8 flex items-center justify-between">
        <p className="text-xs tracking-[.16em] text-white/55" aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(entries.length).padStart(2, "0")}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => goTo(index - 1)} className="grid h-12 w-12 place-items-center border border-white/35 transition-colors hover:bg-white hover:text-black" aria-label="Previous story"><ArrowLeft size={17} /></button>
          <button type="button" onClick={() => goTo(index + 1)} className="grid h-12 w-12 place-items-center border border-white/35 transition-colors hover:bg-white hover:text-black" aria-label="Next story"><ArrowRight size={17} /></button>
        </div>
      </div>
      <Link href="/in-the-wild" className="text-link mx-[var(--gutter)] mt-10 md:hidden">Enter the archive <ArrowRight size={15} /></Link>
    </section>
  );
}
