"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { BagButton } from "@/components/bag/BagButton";
import type { NavigationLink } from "@/lib/content";

export function SiteHeader({
  links,
  socialLinks,
  contactEmail,
}: {
  links: NavigationLink[];
  socialLinks: NavigationLink[];
  contactEmail: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [overHomeHero, setOverHomeHero] = useState(pathname === "/");
  const menu = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const next = window.scrollY;
      setHidden(next > previous && next > 100 && !open);
      setOverHomeHero(pathname === "/" && next < window.innerHeight * 0.82);
      previous = next;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open, pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeButton.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      menuButton.current?.focus();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(menu.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') || []);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[80] text-white transition-transform duration-500 ${overHomeHero ? "" : "mix-blend-difference"} ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
        <nav className="site-shell flex h-20 items-center justify-between" aria-label="Primary navigation">
          <Wordmark className="relative z-10" />
          <div className="hidden items-center gap-8 text-[.72rem] uppercase tracking-[.13em] md:flex">
            {links.map((link) => <Link key={link.href} className="transition-opacity hover:opacity-50" href={link.href} target={link.external ? "_blank" : undefined}>{link.label}</Link>)}
            <BagButton className="uppercase tracking-[.13em]" />
          </div>
          <div className="flex items-center gap-5 text-[.7rem] uppercase tracking-[.12em] md:hidden">
            <BagButton />
            <button ref={menuButton} type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Menu size={22} strokeWidth={1.4} /></button>
          </div>
        </nav>
      </header>
      <div ref={menu} role="dialog" aria-modal={open ? true : undefined} aria-label="Navigation menu" onKeyDown={onMenuKeyDown} inert={open ? undefined : true} className={`fixed inset-0 z-[90] bg-black text-white transition-[clip-path] duration-700 [transition-timing-function:var(--ease-editorial)] ${open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"}`} aria-hidden={!open}>
        <div className="site-shell flex h-20 items-center justify-between">
          <Wordmark className="" />
          <button ref={closeButton} type="button" onClick={() => { setOpen(false); menuButton.current?.focus(); }} aria-label="Close menu"><X size={25} strokeWidth={1.2} /></button>
        </div>
        <div className="grid h-[calc(100svh-5rem)] md:grid-cols-[1.1fr_.9fr]">
          <div className="site-shell flex flex-col justify-center pb-12">
            {links.map((link, index) => (
              <Link key={link.href} href={link.href} target={link.external ? "_blank" : undefined} onClick={() => setOpen(false)} className="display border-b border-white/25 py-3 text-[clamp(3.4rem,11vw,8rem)]">
                <span className="mr-4 align-top text-[.65rem] tracking-normal">0{index + 1}</span>{link.label}
              </Link>
            ))}
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[.68rem] uppercase tracking-[.12em] text-white/65">
              {socialLinks.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}
              <a href={`mailto:${contactEmail}`}>Contact</a>
            </div>
          </div>
          <div className="relative hidden overflow-hidden md:block">
            <Image src="/images/timeless/site/navigation-portrait.jpg" alt="Portrait of a Timeless model in the cream Essential Tee" fill sizes="45vw" className="object-cover grayscale" />
          </div>
        </div>
      </div>
    </>
  );
}
