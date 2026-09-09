import type { Metadata } from "next";
import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <main id="main-content">
      <section className="page-intro pb-10"><p className="eyebrow text-black/50">Drop 001 / 2026</p><h1 className="display page-title mt-7">The First Drop</h1><p className="mt-8 max-w-lg text-lg text-black/55">A deliberately small beginning. One essential piece, open to every interpretation.</p></section>
      <section className="site-shell pb-[var(--section)]">
        <ImageReveal className="aspect-[4/5] md:aspect-[16/8] md:min-h-[48svh]"><Image src="/images/brand/asset-011.jpg" alt="The First Drop campaign" fill priority sizes="100vw" className="object-cover" /></ImageReveal>
        <div className="mt-20 grid gap-16 md:grid-cols-[1fr_1.2fr] md:items-start"><Reveal><p className="eyebrow text-black/50">Catalogue / 01 piece</p><h2 className="display mt-6 text-[clamp(3.5rem,6vw,7rem)]">Less, with more intention.</h2><p className="mt-8 max-w-sm text-sm leading-relaxed text-black/55">The catalogue is small because the idea is clear. Start with the piece that moves through your life, not around it.</p></Reveal><ProductCard /></div>
      </section>
      <section className="relative min-h-[80svh] overflow-hidden bg-black text-white"><Image src="/images/brand/asset-034.jpg" alt="Timeless campaign portrait" fill sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-black/25" /><p className="display site-shell absolute bottom-10 max-w-[12ch] text-[clamp(4rem,10vw,11rem)]">Made for expression, not approval.</p></section>
    </main>
  );
}
