import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImageReveal, Reveal, SplitReveal } from "@/components/motion/Reveal";
import { values } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="relative flex min-h-svh items-end overflow-hidden bg-black px-[var(--gutter)] pb-10 text-white md:pb-16">
        <Image src="/images/brand/asset-034.jpg" alt="Timeless campaign portrait" fill priority sizes="100vw" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <div className="relative z-10"><p className="eyebrow mb-7 text-white/55">About Timeless</p><h1 className="display max-w-[12ch] text-[clamp(5rem,13vw,15rem)]">Identity over imitation.</h1></div>
      </section>

      <section className="site-shell grid gap-12 py-[var(--section)] md:grid-cols-[.45fr_1.55fr]">
        <p className="eyebrow pt-2 text-black/45">The beginning / Nigeria</p>
        <div><SplitReveal className="max-w-5xl text-[clamp(2.8rem,5.8vw,7rem)] leading-[.98] tracking-[-.06em]">Young people were never short on creativity. The options simply did not reflect it.</SplitReveal><div className="mt-20 grid gap-10 text-lg leading-relaxed text-black/58 md:grid-cols-2"><p>Fashion was frequently either generic or derivative: mass production without identity on one side, imported aspiration on the other.</p><p>Timeless emerged from the space between both. Not to prescribe a new identity, but to make room for the one already moving.</p></div></div>
      </section>

      <ImageReveal parallax className="mx-[var(--gutter)] aspect-[4/5] md:aspect-[16/9] md:min-h-[60svh]"><Image src="/images/brand/asset-011.jpg" alt="Two people in an authentic studio campaign portrait" fill sizes="100vw" className="object-cover" /></ImageReveal>

      <section className="py-[var(--section)]">
        <div className="site-shell mb-20"><p className="eyebrow text-black/45">What Timeless believes</p></div>
        {values.map(([title, copy], index) => <Reveal key={title} className="site-shell grid min-h-[62svh] items-center border-t border-black/15 py-16 md:grid-cols-[.2fr_1.25fr_.55fr]"><span className="self-start pt-2 text-xs text-black/40">0{index + 1}</span><h2 className="display text-[clamp(4.2rem,9vw,10.5rem)]">{title}</h2><p className="max-w-sm self-end pb-2 text-base leading-relaxed text-black/55">{copy}</p></Reveal>)}
      </section>

      <section className="relative flex min-h-svh items-center overflow-hidden bg-black px-[var(--gutter)] text-white">
        <Image src="/images/brand/asset-025.jpg" alt="Layers of garments representing change and expression" fill sizes="100vw" className="object-cover opacity-45" /><div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 max-w-6xl"><p className="eyebrow mb-8 text-white/55">The philosophy</p><h2 className="display text-[clamp(5rem,13vw,14rem)]">Style Without Limit.</h2><p className="mt-10 max-w-2xl text-xl leading-relaxed text-white/70">Style is not supposed to remain still. Neither do people. Timeless creates clothing that moves with every version of the person wearing it.</p></div>
      </section>

      <section className="site-shell grid gap-16 py-[var(--section)] md:grid-cols-[1.15fr_.85fr] md:items-end">
        <ImageReveal className="aspect-[4/5]"><Image src="/images/editorial/street-portrait.jpg" alt="Portrait reflecting a global language of personal style" fill sizes="(max-width: 767px) 100vw, 55vw" className="object-cover grayscale" /></ImageReveal>
        <div className="pb-8"><p className="eyebrow text-black/45">Where it is going</p><h2 className="display mt-7 text-[clamp(4rem,7vw,8rem)]">Built here.<br />Not limited to here.</h2><p className="editorial-copy mt-10 text-black/58">A modern African streetwear identity can be deeply rooted without becoming geographically contained. Timeless is building from Nigeria, in conversation with everywhere.</p></div>
      </section>

      <section className="site-shell border-t border-black/15 py-[var(--section)]"><p className="display text-[clamp(4.5rem,10vw,12rem)]">This is only the beginning.</p><Link href="/shop" className="text-link mt-12">Explore the first drop <ArrowRight size={15} /></Link></section>
    </main>
  );
}
