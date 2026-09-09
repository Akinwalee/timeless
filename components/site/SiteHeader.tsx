"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./Wordmark";

const links = [{ href: "/shop", label: "Shop" }, { href: "/journal", label: "Journal" }, { href: "/about", label: "About" }];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const next = window.scrollY;
      setHidden(next > previous && next > 100 && !open);
      previous = next;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[80] text-white mix-blend-difference transition-transform duration-500 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
        <nav className="site-shell flex h-20 items-center justify-between" aria-label="Primary navigation">
          <Wordmark className="relative z-10 text-[2.15rem]" />
          <div className="hidden items-center gap-8 text-[.72rem] uppercase tracking-[.13em] md:flex">
            {links.map((link) => <Link key={link.href} className="transition-opacity hover:opacity-50" href={link.href}>{link.label}</Link>)}
            <button type="button" className="uppercase tracking-[.13em]" aria-label="Open shopping bag">Bag (0)</button>
          </div>
          <div className="flex items-center gap-5 text-[.7rem] uppercase tracking-[.12em] md:hidden">
            <span>Bag (0)</span>
            <button type="button" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} strokeWidth={1.4} /></button>
          </div>
        </nav>
      </header>
      <div className={`fixed inset-0 z-[90] bg-black text-white transition-[clip-path] duration-700 [transition-timing-function:var(--ease-editorial)] ${open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"}`} aria-hidden={!open}>
        <div className="site-shell flex h-20 items-center justify-between">
          <Wordmark className="text-[2.15rem]" />
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu"><X size={25} strokeWidth={1.2} /></button>
        </div>
        <div className="grid h-[calc(100svh-5rem)] md:grid-cols-[1.1fr_.9fr]">
          <div className="site-shell flex flex-col justify-center pb-12">
            {links.map((link, index) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="display border-b border-white/25 py-3 text-[clamp(4rem,13vw,9rem)]">
                <span className="mr-4 align-top text-[.65rem] tracking-normal">0{index + 1}</span>{link.label}
              </Link>
            ))}
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[.68rem] uppercase tracking-[.12em] text-white/65">
              <a href="#">Instagram</a><a href="mailto:hello@timeless.ng">Contact</a><a href="#">Shipping</a><a href="#">Returns</a>
            </div>
          </div>
          <div className="relative hidden overflow-hidden md:block">
            <Image src="/images/brand/asset-014.jpg" alt="Timeless campaign portrait" fill sizes="45vw" className="object-cover grayscale" />
          </div>
        </div>
      </div>
    </>
  );
}
