"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export function Reveal({ children, className = "", as = "div", delay = 0 }: { children: ReactNode; className?: string; as?: "div" | "section" | "article"; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(ref.current, { y: 44, opacity: 0, duration: 1.05, delay, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 88%", once: true } });
  }, { scope: ref });
  return <Tag ref={ref as never} className={className}>{children}</Tag>;
}

export function ImageReveal({ children, className = "", parallax = false }: { children: ReactNode; className?: string; parallax?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const image = ref.current?.querySelector("img");
    gsap.fromTo(ref.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.35, ease: "power4.inOut", scrollTrigger: { trigger: ref.current, start: "top 88%", once: true } });
    if (image) gsap.fromTo(image, { scale: 1.08, yPercent: parallax ? -3 : 0 }, { scale: 1, yPercent: parallax ? 3 : 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: parallax ? 1 : false } });
  }, { scope: ref });
  return <div ref={ref} className={`image-frame ${className}`}>{children}</div>;
}

export function SplitReveal({ children, className = "", start = "top 85%" }: { children: ReactNode; className?: string; start?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(() => {
    if (!ref.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const split = SplitText.create(ref.current, { type: "lines", mask: "lines" });
    gsap.from(split.lines, { yPercent: 110, stagger: .12, duration: 1, ease: "power4.out", scrollTrigger: { trigger: ref.current, start, once: true } });
    return () => split.revert();
  }, { scope: ref });
  return <h2 ref={ref} className={className}>{children}</h2>;
}
