import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroScene } from "@/components/motion/HeroScene";
import { IdentitySequence, StatementSequence } from "@/components/motion/Sequences";
import { ImageReveal, Reveal, SplitReveal } from "@/components/motion/Reveal";
import { Newsletter } from "@/components/site/Newsletter";
import { FeaturedProduct } from "@/components/product/FeaturedProduct";
import { InTheWildCarousel } from "@/components/editorial/InTheWildCarousel";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getHomepageContent } from "@/sanity/lib/fetch";
import { formatEditorialDate } from "@/lib/dates";

export default async function Home() {
  const { product, inTheWild, journal } = await getHomepageContent();
  return (
    <main id="main-content">
      <HeroScene />

      {product ? <FeaturedProduct product={product} /> : <section className="site-shell py-[var(--section)]"><p className="text-2xl">The next piece is being prepared.</p></section>}

      <IdentitySequence />

      <section className="grid bg-bone md:grid-cols-2">
        <div className="site-shell flex min-h-[65svh] flex-col justify-between py-16 md:min-h-svh md:py-20">
          <p className="eyebrow text-black/50"></p>
          <SplitReveal className="display max-w-2xl text-[clamp(4rem,8vw,9rem)]">What remains when the noise leaves.</SplitReveal>
          <div className="grid grid-cols-3 border-t border-black/20 pt-5 text-[.67rem] uppercase tracking-[.12em]"><span>Soft handfeel</span><span>Relaxed fit</span><span>Built to layer</span></div>
        </div>
        <ImageReveal parallax className="min-h-[75svh] md:min-h-svh"><Image src="/images/brand/asset-010.jpg" alt="Close view of Timeless embroidery and cotton texture" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></ImageReveal>
      </section>

      <StatementSequence />

      <section className="site-shell grid gap-12 py-[clamp(5rem,9vw,8rem)] md:grid-cols-[.9fr_1.1fr] md:items-center">
        <ImageReveal className="h-[min(68svh,42rem)] min-h-[30rem]"><Image src="/images/timeless/about/about-timeless-preview.jpg" alt="Timeless portrait on the stadium steps" fill sizes="(max-width: 767px) 100vw, 42vw" className="object-cover object-[50%_55%]" /></ImageReveal>
        <Reveal className="pb-2 md:pl-[8vw]">
          <p className="eyebrow text-black/50">About Timeless</p>
          <h2 className="mt-6 max-w-xl text-[clamp(2.7rem,5vw,5.6rem)] leading-[.96] tracking-[-.06em]">Designed with identity.</h2>
          <p className="editorial-copy mt-10 text-black/60">Timeless began in the space between generic clothing and borrowed aspiration. Minimal clothing. Intentional expression. Designed to step out of the prescribed version of who you should be.</p>
          <Link href="/about" className="text-link mt-10">Discover Timeless <ArrowRight size={15} strokeWidth={1.3} /></Link>
        </Reveal>
      </section>

      <InTheWildCarousel entries={inTheWild} />

      <section className="site-shell py-[var(--section)]">
        <div className="mb-16 grid gap-6 md:grid-cols-2 md:items-end"><div><p className="eyebrow text-black/50">Journal / Latest</p><h2 className="display mt-5 text-[clamp(4.5rem,9vw,10rem)]">Stories in motion.</h2></div><p className="max-w-sm pb-2 text-sm text-black/55 md:justify-self-end">People, process and the moments that give timeless its life beyond the catalogue.</p></div>
        {journal ? (
          <Link href={`/journal/${journal.slug}`} className="group grid gap-6 md:grid-cols-[1.4fr_.6fr]">
            <ImageReveal className="aspect-[16/10]"><ResponsiveImage image={journal.coverImage} sizes="(max-width: 767px) 100vw, 68vw" className="transition-transform duration-700 group-hover:scale-[1.02]" /></ImageReveal>
            <div className="flex flex-col justify-between border-t border-black/20 pt-4"><p className="eyebrow text-black/50">{journal.issue} · {journal.category}</p><div className="mt-16"><h3 className="text-[clamp(2.2rem,4vw,4.8rem)] leading-[.95] tracking-[-.055em]">{journal.title}</h3><p className="mt-5 max-w-sm text-sm text-black/55">{journal.excerpt}</p></div><p className="mt-10 text-xs uppercase tracking-[.12em]">{formatEditorialDate(journal.date)} <ArrowRight className="ml-2 inline" size={14} /></p></div>
          </Link>
        ) : <p className="border-t border-black/20 py-12 text-black/50">The next Journal story is being prepared.</p>}
      </section>

      <section className="site-shell grid min-h-[70svh] items-center border-t border-black/15 py-24 md:grid-cols-2">
        <div><p className="eyebrow text-black/50">Community</p><h2 className="display mt-7 text-[clamp(5rem,11vw,12rem)]">Stay close.</h2></div>
        <div className="mt-10 max-w-xl md:mt-0"><p className="mb-12 text-xl leading-snug tracking-[-.03em]">Drops, stories and things worth knowing before they travel wider.</p><Newsletter /></div>
      </section>

      <section className="relative min-h-svh overflow-hidden bg-black text-white">
        <Image src="/images/brand/asset-025.jpg" alt="Folded Timeless garments in campaign colours" fill sizes="100vw" className="object-cover" />
      </section>
    </main>
  );
}
