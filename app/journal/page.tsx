import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";
import { stories } from "@/lib/content";

export const metadata: Metadata = { title: "Journal", description: "People, places, process and identity in motion." };
const categories = ["All", "In the Wild", "Campaigns", "Process", "People", "Notes"];

export default function JournalPage() {
  return (
    <main id="main-content">
      <section className="page-intro pb-12"><p className="eyebrow text-black/45">Timeless archive / 2026</p><h1 className="display page-title mt-6">Journal</h1><p className="mt-8 max-w-lg text-xl text-black/55">People, places, process and identity in motion.</p><div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-[.68rem] uppercase tracking-[.13em]">{categories.map((item, i) => <button className={i ? "text-black/45 transition-colors hover:text-black" : "border-b border-black pb-1"} key={item}>{item}</button>)}</div></section>

      <section className="site-shell pb-[var(--section)]">
        <Link href={`/journal/${stories[0].slug}`} className="group grid gap-7 border-t border-black/20 pt-5 md:grid-cols-[1.35fr_.65fr]">
          <ImageReveal className="aspect-[4/5] md:aspect-[16/10] md:min-h-[55svh]"><Image src={stories[0].image} alt="Featured In the Wild story" fill priority sizes="(max-width: 767px) 100vw, 67vw" className="object-cover grayscale transition-transform duration-700 group-hover:scale-[1.02]" /></ImageReveal>
          <div className="flex flex-col justify-between"><p className="eyebrow text-black/45">{stories[0].issue}<br className="md:hidden" /> · {stories[0].category}<br />{stories[0].date}</p><div className="mt-16"><h2 className="text-[clamp(3rem,6vw,7rem)] leading-[.92] tracking-[-.06em]">{stories[0].title}</h2><p className="mt-6 max-w-md text-sm leading-relaxed text-black/55">{stories[0].excerpt}</p><span className="text-link mt-9">Open story <ArrowUpRight size={15} /></span></div></div>
        </Link>

        <div className="mt-28 grid items-start gap-x-5 gap-y-28 md:grid-cols-12">
          {stories.slice(1).map((story, index) => <Reveal key={story.slug} as="article" className={`${index === 0 ? "md:col-span-5" : index === 1 ? "md:col-span-4 md:mt-48" : "md:col-span-7 md:col-start-6"}`}><Link href={`/journal/${story.slug}`} className="group"><ImageReveal className={`${index === 2 ? "aspect-[16/10]" : "aspect-[3/4]"}`}><Image src={story.image} alt={story.title} fill sizes="(max-width: 767px) 100vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" /></ImageReveal><div className="mt-5 flex items-start justify-between gap-5"><div><p className="eyebrow text-black/40">{story.issue} · {story.category}</p><h2 className="mt-4 text-[clamp(2rem,3vw,3.8rem)] leading-[.98] tracking-[-.05em]">{story.title}</h2></div><ArrowUpRight className="mt-1 shrink-0" strokeWidth={1.2} /></div><p className="mt-5 max-w-md text-sm leading-relaxed text-black/55">{story.excerpt}</p></Link></Reveal>)}
        </div>
      </section>
      <section className="bg-black px-[var(--gutter)] py-[var(--section)] text-white"><p className="eyebrow text-white/45">A recurring series</p><h2 className="display mt-6 text-[clamp(5rem,12vw,14rem)]">Timeless in the Wild</h2><p className="mt-10 max-w-xl text-lg leading-relaxed text-white/60">Once the clothing leaves the controlled campaign environment, it becomes part of real rooms, streets, friendships and journeys. That is where the archive begins.</p></section>
    </main>
  );
}
