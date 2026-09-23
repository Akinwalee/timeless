import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getJournalEntries } from "@/sanity/lib/fetch";
import { formatEditorialDate } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Journal",
  description: "People, places, process and identity in motion.",
};

export default async function JournalPage() {
  const stories = await getJournalEntries();
  const categories = ["All", ...new Set(stories.map((story) => story.category))];
  const [featured, ...remaining] = stories;

  return (
    <main id="main-content">
      <section className="page-intro pb-12">
        <p className="eyebrow text-black/45">Timeless archive / 2026</p>
        <h1 className="display page-title mt-6">Journal</h1>
        <p className="mt-8 max-w-lg text-xl text-black/55">People, places, process and identity in motion.</p>
        {categories.length > 1 && (
          <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-[.68rem] uppercase tracking-[.13em]">
            {categories.map((item, index) => <span className={index ? "text-black/45" : "border-b border-black pb-1"} key={item}>{item}</span>)}
          </div>
        )}
      </section>

      <section className="site-shell pb-[var(--section)]">
        {!featured ? (
          <div className="border-t border-black/20 py-24"><p className="eyebrow text-black/45">No stories published yet.</p></div>
        ) : (
          <>
            <Link href={`/journal/${featured.slug}`} className="group grid gap-7 border-t border-black/20 pt-5 md:grid-cols-[1.35fr_.65fr]">
              <ImageReveal className="aspect-[4/5] md:aspect-[16/10] md:min-h-[55svh]">
                <ResponsiveImage image={featured.coverImage} priority sizes="(max-width: 767px) 100vw, 67vw" className="grayscale transition-transform duration-700 group-hover:scale-[1.02]" />
              </ImageReveal>
              <div className="flex flex-col justify-between">
                <p className="eyebrow text-black/45">{featured.issue} · {featured.category}<br />{formatEditorialDate(featured.date)}</p>
                <div className="mt-16"><h2 className="text-[clamp(3rem,6vw,7rem)] leading-[.92] tracking-[-.06em]">{featured.title}</h2><p className="mt-6 max-w-md text-sm leading-relaxed text-black/55">{featured.excerpt}</p><span className="text-link mt-9">Open story <ArrowUpRight size={15} /></span></div>
              </div>
            </Link>

            <div className="mt-28 grid items-start gap-x-5 gap-y-28 md:grid-cols-12">
              {remaining.map((story, index) => (
                <Reveal key={story.slug} as="article" className={index % 3 === 0 ? "md:col-span-5" : index % 3 === 1 ? "md:col-span-4 md:mt-48" : "md:col-span-7 md:col-start-6"}>
                  <Link href={`/journal/${story.slug}`} className="group">
                    <ImageReveal className={index % 3 === 2 ? "aspect-[16/10]" : "aspect-[3/4]"}><ResponsiveImage image={story.coverImage} sizes="(max-width: 767px) 100vw, 45vw" className="transition-transform duration-700 group-hover:scale-[1.02]" /></ImageReveal>
                    <div className="mt-5 flex items-start justify-between gap-5"><div><p className="eyebrow text-black/40">{story.issue} · {story.category}</p><h2 className="mt-4 text-[clamp(2rem,3vw,3.8rem)] leading-[.98] tracking-[-.05em]">{story.title}</h2></div><ArrowUpRight className="mt-1 shrink-0" strokeWidth={1.2} /></div>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-black/55">{story.excerpt}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>

      <Link href="/in-the-wild" className="group block bg-black px-[var(--gutter)] py-[var(--section)] text-white">
        <p className="eyebrow text-white/45">A separate living archive</p>
        <h2 className="display mt-6 text-[clamp(5rem,12vw,14rem)] transition-opacity group-hover:opacity-65">Timeless in the Wild</h2>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-white/60">Clothing in real rooms, streets, friendships and journeys—kept apart from the Journal as its own ongoing record.</p>
        <span className="text-link mt-9">Open the archive <ArrowUpRight size={15} /></span>
      </Link>
    </main>
  );
}
