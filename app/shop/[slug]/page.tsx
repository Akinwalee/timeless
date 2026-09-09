import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GalleryViewer } from "@/components/product/GalleryViewer";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ImageReveal, SplitReveal } from "@/components/motion/Reveal";
import { product, stories } from "@/lib/content";

export const metadata: Metadata = { title: product.name, description: product.description };
export function generateStaticParams() { return [{ slug: product.slug }]; }

export default function ProductPage() {
  return (
    <main id="main-content" className="pt-20">
      <section className="grid items-start md:grid-cols-2"><GalleryViewer /><ProductPurchase /></section>
      <section className="site-shell grid gap-12 py-[var(--section)] md:grid-cols-[.7fr_1.3fr]"><p className="eyebrow text-black/50">The piece.</p><div><SplitReveal className="display text-[clamp(4rem,8vw,9rem)]">Simple enough to become yours.</SplitReveal><div className="mt-20 grid gap-px bg-black/20 border border-black/20 md:grid-cols-2">{[["Fabric","Premium cotton jersey with a soft, substantial handfeel."],["Fit","Relaxed through the body with an easy dropped shoulder."],["Construction","Reinforced neckline and clean-finished seams for repeat wear."],["Care","Cold wash with like colours. Line dry. Iron on reverse."]].map(([title, copy]) => <div key={title} className="bg-white p-7 md:p-10"><h3 className="text-sm">{title}</h3><p className="mt-5 text-sm leading-relaxed text-black/55">{copy}</p></div>)}</div></div></section>
      <section id="size-guide" className="grid bg-bone md:grid-cols-2"><ImageReveal className="min-h-[75svh]"><Image src="/images/brand/asset-008.jpg" alt="Model wearing the Essential Tee" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></ImageReveal><div className="site-shell flex flex-col justify-center py-20"><p className="eyebrow text-black/50">Fit / relaxed</p><h2 className="display mt-7 text-[clamp(4rem,7vw,8rem)]">Room to move.</h2><p className="mt-9 max-w-lg text-lg leading-relaxed text-black/58">Designed with a relaxed shape. Choose your usual size for an easy fit, or size up to push the silhouette further.</p><div className="mt-12 border-t border-black/20 text-sm"><p className="flex justify-between border-b border-black/20 py-4"><span>Model 01</span><span>178 cm · wears M</span></p><p className="flex justify-between border-b border-black/20 py-4"><span>Model 02</span><span>165 cm · wears S</span></p></div></div></section>
      <section className="site-shell py-[var(--section)]"><p className="eyebrow text-black/50">Worn your way.</p><h2 className="display mt-6 text-[clamp(4.5rem,10vw,11rem)]">One piece. No fixed form.</h2><div className="mt-16 grid gap-4 md:grid-cols-[.8fr_1.2fr_.8fr]"><ImageReveal className="aspect-[3/4] md:mt-28"><Image src="/images/brand/asset-014.jpg" alt="Oversized tee styling" fill sizes="33vw" className="object-cover" /></ImageReveal><ImageReveal className="aspect-[3/4]"><Image src="/images/brand/asset-011.jpg" alt="Two-person Timeless styling" fill sizes="40vw" className="object-cover" /></ImageReveal><ImageReveal className="aspect-[3/4] md:mt-44"><Image src="/images/editorial/street-portrait.jpg" alt="Street styling portrait" fill sizes="33vw" className="object-cover grayscale" /></ImageReveal></div></section>
      <section className="site-shell border-t border-black/15 py-[var(--section)]"><p className="eyebrow text-black/50">Continue exploring</p><Link href={`/journal/${stories[1].slug}`} className="group mt-10 grid gap-6 md:grid-cols-2 md:items-end"><div><h2 className="text-[clamp(3rem,6vw,7rem)] leading-[.92] tracking-[-.06em]">{stories[1].title}</h2><p className="mt-6 text-sm text-black/50">Process · {stories[1].date} →</p></div><ImageReveal className="aspect-[16/9]"><Image src={stories[1].image} alt="Next Journal story" fill sizes="50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" /></ImageReveal></Link></section>
    </main>
  );
}
