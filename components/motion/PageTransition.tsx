"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function PageTransition() {
  const path = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(overlay.current, { scaleY: 1 }, { scaleY: 0, duration: .7, ease: "power4.inOut" });
    });
    return () => media.revert();
  }, { dependencies: [path] });
  return <div ref={overlay} className="route-transition pointer-events-none fixed inset-0 z-[110] origin-top bg-black" aria-hidden="true" />;
}
