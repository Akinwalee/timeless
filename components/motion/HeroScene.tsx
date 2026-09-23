"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, useGSAP);

export function HeroScene() {
  const scene = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seen = sessionStorage.getItem("timeless-intro");
    const split = SplitText.create(".hero-copy", { type: "lines", mask: "lines" });
    const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });
    timeline.fromTo(".hero-image", { clipPath: "inset(100% 0 0 0)", scale: 1.06 }, { clipPath: "inset(0% 0 0 0)", scale: 1, duration: seen ? .75 : 1.35 })
      .from(split.lines, { yPercent: 110, stagger: .12, duration: .9 }, "-=.3")
      .from(".hero-meta", { y: 16, opacity: 0, duration: .7 }, "-=.45");
    sessionStorage.setItem("timeless-intro", "seen");
    return () => split.revert();
  }, { scope: scene });
  return (
    <section ref={scene} className="relative min-h-svh overflow-hidden bg-black text-white">
      <Image src="/images/timeless/site/home-hero.jpg" alt="Two Timeless models photographed from below against a deep blue sky" fill priority sizes="100vw" className="hero-image object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/25" />
      <div className="site-shell absolute inset-x-0 bottom-0 z-10 pb-8 md:pb-12">
        <p className="hero-copy display max-w-[11ch] text-[clamp(4.4rem,11vw,12rem)]">Make your style move without permission.</p>
        <div className="hero-meta mt-7 flex items-end justify-between">
          <Link href="/shop" className="text-link">Explore the first drop <span aria-hidden>↗</span></Link>
          <span className="hidden text-[.62rem] uppercase tracking-[.16em] text-white/65 md:block">Drop 001 — Nigeria, 2026</span>
        </div>
      </div>
    </section>
  );
}
