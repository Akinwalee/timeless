import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroScene } from "@/components/motion/HeroScene";
import { IdentitySequence, StatementSequence } from "@/components/motion/Sequences";
import { ImageReveal, Reveal, SplitReveal } from "@/components/motion/Reveal";
import { Newsletter } from "@/components/site/Newsletter";
import { product, stories } from "@/lib/content";

export default function Home() {
  return (
    <main id="main-content">
      <HeroScene />

      <section className="site-shell grid gap-10 py-[var(--section)] md:grid-cols-[1.55fr_.75fr] md:items-start">
        <ImageReveal parallax className="aspect-[4/5] md:aspect-[5/6]"><Image src="/images/brand/asset-008.jpg" alt="Model wearing the first Timeless tee" fill sizes="(max-width: 767px) 100vw, 64vw" className="object-cover" /></ImageReveal>
        <div className="md:sticky md:top-28 md:pt-12">
          <p className="eyebrow text-black/50">First Drop / 001</p>
          <SplitReveal className="display mt-6 text-[clamp(4rem,7vw,8rem)]">The Essential Tee.</SplitReveal>
          <p className="mt-7 text-xl">{product.price}</p>
          <p className="mt-10 max-w-xs text-sm leading-relaxed text-black/55">One deliberate piece, available in Black, White, Cream and Navy. Made to begin where your styling takes over.</p>
          <div className="mt-7 flex gap-2" aria-label="Available colours">{product.colors.map(color => <span key={color} className="border border-black/20 px-2.5 py-1.5 text-[.6rem] uppercase tracking-[.12em]">{color}</span>)}</div>
          <Link href={`/shop/${product.slug}`} className="text-link mt-12">View the piece <ArrowRight size={15} strokeWidth={1.3} /></Link>
        </div>
      </section>

      <IdentitySequence />

      <section className="grid bg-bone md:grid-cols-2">
        <div className="site-shell flex min-h-[65svh] flex-col justify-between py-16 md:min-h-svh md:py-20">
          <p className="eyebrow text-black/50">Product as object</p>
          <SplitReveal className="display max-w-2xl text-[clamp(4rem,8vw,9rem)]">What remains when the noise leaves.</SplitReveal>
          <div className="grid grid-cols-3 border-t border-black/20 pt-5 text-[.67rem] uppercase tracking-[.12em]"><span>Soft handfeel</span><span>Relaxed fit</span><span>Built to layer</span></div>
        </div>
        <ImageReveal parallax className="min-h-[75svh] md:min-h-svh"><Image src="/images/brand/asset-010.jpg" alt="Close view of Timeless embroidery and cotton texture" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></ImageReveal>
      </section>

      <StatementSequence />

      <section className="site-shell grid gap-12 py-[var(--section)] md:grid-cols-[.9fr_1.1fr] md:items-end">
        <ImageReveal className="aspect-[4/5]"><Image src="/images/brand/asset-011.jpg" alt="Two people in a quiet Timeless campaign portrait" fill sizes="(max-width: 767px) 100vw, 42vw" className="object-cover" /></ImageReveal>
        <Reveal className="pb-2 md:pb-14 md:pl-[8vw]">
          <p className="eyebrow text-black/50">About Timeless</p>
          <h2 className="mt-6 max-w-xl text-[clamp(2.7rem,5vw,5.6rem)] leading-[.96] tracking-[-.06em]">Built from identity, not imitation.</h2>
          <p className="editorial-copy mt-10 text-black/60">Timeless began in the space between generic clothing and borrowed aspiration. Minimal clothing. Intentional expression. No prescribed version of who you should be.</p>
          <Link href="/about" className="text-link mt-10">Discover Timeless <ArrowRight size={15} strokeWidth={1.3} /></Link>
        </Reveal>
      </section>

      <section className="bg-black py-[var(--section)] text-white">
        <div className="site-shell flex items-end justify-between"><div><h2 className="display text-[clamp(4.5rem,10vw,11rem)]">Timeless In the Wild</h2></div><Link href="/journal" className="text-link hidden md:inline-flex">Enter the Journal <ArrowRight size={15} /></Link></div>
        <div className="site-shell mt-16 grid grid-cols-2 items-start gap-3 md:grid-cols-12 md:gap-5">
          <ImageReveal className="col-span-2 aspect-[3/4] md:col-span-6 md:aspect-[4/5]"><Image src="/images/editorial/harlem-friends.jpg" alt="Friends together on a city street" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover grayscale" /><span className="absolute bottom-4 left-4 text-[.62rem] uppercase tracking-[.14em]">Akure / 2026 · First Drop</span></ImageReveal>
          <ImageReveal className="col-span-1 mt-16 aspect-[3/4] md:col-span-3 md:mt-36"><Image src="/images/editorial/street-portrait.jpg" alt="Street style portrait in monochrome clothing" fill sizes="(max-width: 767px) 50vw, 25vw" className="object-cover grayscale" /></ImageReveal>
          <ImageReveal className="col-span-1 aspect-[3/4] md:col-span-3 md:mt-8"><Image src="/images/brand/asset-014.jpg" alt="Timeless tee styled in a studio portrait" fill sizes="(max-width: 767px) 50vw, 25vw" className="object-cover grayscale" /></ImageReveal>
        </div>
        <Link href="/journal" className="text-link mx-[var(--gutter)] mt-10 md:hidden">Enter the Journal <ArrowRight size={15} /></Link>
      </section>

      <section className="site-shell py-[var(--section)]">
        <div className="mb-16 grid gap-6 md:grid-cols-2 md:items-end"><div><p className="eyebrow text-black/50">Journal / Latest</p><h2 className="display mt-5 text-[clamp(4.5rem,9vw,10rem)]">Stories in motion.</h2></div><p className="max-w-sm pb-2 text-sm text-black/55 md:justify-self-end">People, process and the moments that give the product a life beyond the catalogue.</p></div>
        <Link href={`/journal/${stories[0].slug}`} className="group grid gap-6 md:grid-cols-[1.4fr_.6fr]">
          <ImageReveal className="aspect-[16/10]"><Image src={stories[0].image} alt="Featured Journal story" fill sizes="(max-width: 767px) 100vw, 68vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" /></ImageReveal>
          <div className="flex flex-col justify-between border-t border-black/20 pt-4"><p className="eyebrow text-black/50">{stories[0].issue} · {stories[0].category}</p><div className="mt-16"><h3 className="text-[clamp(2.2rem,4vw,4.8rem)] leading-[.95] tracking-[-.055em]">{stories[0].title}</h3><p className="mt-5 max-w-sm text-sm text-black/55">{stories[0].excerpt}</p></div><p className="mt-10 text-xs uppercase tracking-[.12em]">{stories[0].date} <ArrowRight className="ml-2 inline" size={14} /></p></div>
        </Link>
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
