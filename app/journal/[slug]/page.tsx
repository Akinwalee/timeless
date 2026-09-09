import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImageReveal, Reveal, SplitReveal } from "@/components/motion/Reveal";
import { stories } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return stories.map(story => ({ slug: story.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const story = stories.find(item => item.slug === slug); return { title: story?.title ?? "Journal" }; }

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const index = stories.findIndex(item => item.slug === slug);
  if (index < 0) notFound();
  const story = stories[index];
  const next = stories[(index + 1) % stories.length];
  return (
    <main id="main-content">
      <header className="page-intro pb-14"><div className="grid gap-7 md:grid-cols-[.65fr_1.35fr]"><div><p className="eyebrow text-black/45">{story.category}</p><p className="mt-4 text-xs text-black/45">{story.issue} · {story.date}</p></div><h1 className="display text-[clamp(4.5rem,10vw,11rem)]">{story.title}</h1></div></header>
      <ImageReveal className="mx-[var(--gutter)] aspect-[4/5] md:aspect-[16/9] md:min-h-[62svh]"><Image src={story.image} alt={story.title} fill priority sizes="100vw" className="object-cover grayscale" /></ImageReveal>
      <article>
        <section className="site-shell grid gap-10 py-[var(--section)] md:grid-cols-[.55fr_1.45fr]"><p className="eyebrow pt-2 text-black/40">Field note / 004</p><div><p className="max-w-4xl text-[clamp(2.1rem,4.2vw,5rem)] leading-[1.03] tracking-[-.055em]">{story.excerpt} Nothing here needed to be performed.</p><div className="mt-20 grid gap-10 text-lg leading-relaxed text-black/58 md:grid-cols-2"><p>We met without a shot list. The camera followed the way each person naturally occupied the clothes: sleeves pushed, hems shifted, one piece becoming several.</p><p>The images are less about documentation than evidence. Style changes when it meets a person, and then changes again when that person moves.</p></div></div></section>

        <section className="site-shell grid gap-4 pb-[var(--section)] md:grid-cols-[1.1fr_.9fr]"><ImageReveal className="aspect-[4/5]"><Image src="/images/brand/asset-014.jpg" alt="Portrait from the story" fill sizes="(max-width: 767px) 100vw, 55vw" className="object-cover" /></ImageReveal><ImageReveal className="aspect-[4/5] md:mt-36"><Image src="/images/brand/asset-008.jpg" alt="Second portrait from the story" fill sizes="(max-width: 767px) 100vw, 45vw" className="object-cover" /><span className="absolute bottom-4 left-4 text-[.62rem] uppercase tracking-[.13em]">Look 02 / White / First Drop</span></ImageReveal></section>

        <section className="flex min-h-[80svh] items-center bg-black px-[var(--gutter)] text-white"><SplitReveal className="display max-w-[11ch] text-[clamp(5rem,12vw,14rem)]">Real presence leaves room for change.</SplitReveal></section>

        <section className="site-shell grid gap-14 py-[var(--section)] md:grid-cols-2 md:items-center"><ImageReveal className="aspect-square"><Image src="/images/brand/asset-010.jpg" alt="Timeless embroidery detail" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></ImageReveal><Reveal className="md:pl-[8vw]"><p className="eyebrow text-black/40">Detail / close</p><blockquote className="mt-7 text-[clamp(2.2rem,4vw,4.7rem)] leading-[1] tracking-[-.05em]">“The piece stayed the same. Everything around it moved.”</blockquote><p className="mt-8 text-sm text-black/50">Akure, August 2026</p></Reveal></section>
      </article>
      <Link href={`/journal/${next.slug}`} className="group relative block min-h-[80svh] overflow-hidden bg-black text-white"><Image src={next.image} alt="Next story" fill sizes="100vw" className="object-cover opacity-55 transition-transform duration-[1200ms] group-hover:scale-[1.03]" /><div className="site-shell absolute inset-x-0 bottom-10"><p className="eyebrow text-white/55">Next story</p><h2 className="display mt-7 text-[clamp(4.5rem,10vw,11rem)]">{next.title}</h2><p className="mt-8 text-sm">{next.category} <ArrowRight className="ml-2 inline" size={15} /></p></div></Link>
    </main>
  );
}
