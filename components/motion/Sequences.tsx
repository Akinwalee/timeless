"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const identityFrames = [
  { image: "/images/timeless/site/identity-one-piece.jpg", alt: "Two friends styling black Timeless tees against the sky", position: "50% 18%", words: "One piece." },
  { image: "/images/timeless/site/identity-moments.jpg", alt: "Two Timeless models sharing a relaxed court-side portrait", position: "50% 18%", words: "Different moments." },
  { image: "/images/timeless/site/identity-moods.jpg", alt: "Three Timeless models arranged across the stadium steps", position: "50% 22%", words: "Different moods." },
];

export function IdentitySequence() {
  const section = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches) return;
    const frames = gsap.utils.toArray<HTMLElement>(".identity-frame", section.current);
    const labels = gsap.utils.toArray<HTMLElement>(".identity-label", section.current);
    const timeline = gsap.timeline({ scrollTrigger: { trigger: section.current, start: "top top", end: "+=320%", scrub: 1, pin: true, anticipatePin: 1 } });
    frames.slice(1).forEach((frame, index) => {
      timeline.to(frames[index], { clipPath: "inset(0 0 100% 0)", duration: 1 }, index + .7)
        .fromTo(frame, { clipPath: "inset(100% 0 0 0)", scale: 1.06 }, { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 1 }, index + .7)
        .to(labels[index], { y: -20, opacity: 0, duration: .25 }, index + .75)
        .fromTo(labels[index + 1], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .35 }, index + .95);
    });
  }, { scope: section });

  return (
    <section id="identity-in-motion" ref={section} className="relative min-h-svh overflow-hidden bg-black text-white" aria-label="Identity in Motion">
      <div className="absolute left-[var(--gutter)] top-24 z-20 max-w-2xl"><p className="eyebrow mb-4 text-white/60">Identity in Motion</p><h2 className="display text-[clamp(3.5rem,8vw,8rem)]">Worn by every version of you.</h2></div>
      <div className="absolute inset-0 hidden md:left-[38%] md:block">
        {identityFrames.map((frame, index) => <div key={frame.image} className="identity-frame absolute inset-0" style={{ zIndex: identityFrames.length - index }}><Image src={frame.image} alt={frame.alt} fill loading="eager" sizes="(max-width: 767px) 100vw, 62vw" className="object-cover" style={{ objectPosition: frame.position }} /></div>)}
      </div>
      <div className="absolute bottom-10 left-[var(--gutter)] z-30 hidden h-20 overflow-hidden md:block">
        {identityFrames.map((frame, index) => <p key={frame.words} className={`identity-label absolute bottom-0 whitespace-nowrap text-[clamp(1.6rem,3vw,3rem)] ${index ? "opacity-0" : ""}`}>{frame.words}</p>)}
      </div>
      <div className="mobile-only relative z-10 space-y-4 px-[var(--gutter)] pb-12 pt-[22rem]">
        {identityFrames.map((frame) => <div key={frame.words} className="relative aspect-[3/4] overflow-hidden"><Image src={frame.image} alt={frame.alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: frame.position }} /><p className="absolute inset-x-4 bottom-4 text-2xl">{frame.words}</p></div>)}
      </div>
      <p className="absolute bottom-8 right-[var(--gutter)] z-30 hidden text-[.65rem] uppercase tracking-[.16em] text-white/55 md:block"></p>
    </section>
  );
}

const statements = ["No fixed form.", "No fixed identity.", "No fixed expression.", "Style Without Limit."];

export function StatementSequence() {
  const section = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches) return;
    const lines = gsap.utils.toArray<HTMLElement>(".statement-line", section.current);
    const timeline = gsap.timeline({ scrollTrigger: { trigger: section.current, start: "top top", end: "+=220%", scrub: 1, pin: true } });
    lines.slice(1).forEach((line, index) => timeline.to(lines[index], { yPercent: -120, opacity: 0, duration: .6 }, index).fromTo(line, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6 }, index + .25));
  }, { scope: section });
  return (
    <section ref={section} className="site-shell relative flex min-h-svh items-center overflow-hidden bg-white">
      <div className="relative h-[clamp(10rem,20vw,20rem)] w-full">
        {statements.map((text, index) => <p key={text} className={`statement-line display absolute inset-0 flex items-center text-[clamp(4rem,12vw,13rem)] ${index ? "opacity-0" : ""}`}>{text}</p>)}
      </div>
    </section>
  );
}
