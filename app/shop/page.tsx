import type { Metadata } from "next";
import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";
import { getProducts } from "@/sanity/lib/fetch";

export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <main id="main-content">
      <section className="page-intro pb-10"><p className="eyebrow text-black/50">Drop 001 / 2026</p><h1 className="display page-title mt-7">The First Drop</h1><p className="mt-8 max-w-lg text-lg text-black/55">One essential piece, open to every interpretation.</p></section>
      <section className="site-shell pb-[var(--section)]">
        <ImageReveal className="aspect-[4/5] md:aspect-[16/8] md:min-h-[48svh]"><Image src="/images/timeless/site/shop-campaign.jpg" alt="The First Drop cast assembled on the court" fill priority sizes="100vw" className="object-cover" /></ImageReveal>
        <div className="mt-16 grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-start">
          <Reveal><p className="eyebrow text-black/50">Catalogue / {String(products.length).padStart(2, "0")} {products.length === 1 ? "piece" : "pieces"}</p><h2 className="display mt-6 text-[clamp(3.5rem,6vw,7rem)]">Less, with more intention.</h2><p className="mt-8 max-w-sm text-sm leading-relaxed text-black/55">Start with the piece that moves with you through life.</p></Reveal>
          <div className="grid gap-16">{products.length ? products.map((product) => <ProductCard key={product.id} product={product} />) : <p className="border-t border-black/20 py-10 text-black/50">The next drop is being prepared.</p>}</div>
        </div>
      </section>
      <section className="relative min-h-[80svh] overflow-hidden bg-black text-white"><Image src="/images/timeless/site/shop-closing.jpg" alt="Two Timeless models standing together on the court" fill sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-black/25" /><p className="display site-shell absolute bottom-10 max-w-[12ch] text-[clamp(4rem,10vw,11rem)]">Made for expression.</p></section>
    </main>
  );
}
