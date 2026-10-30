import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getJournalEntries } from "@/sanity/lib/fetch";
import { IMAGE_SIZES, columnImageSizes } from "@/lib/images";
import { formatEditorialDate } from "@/lib/dates";

export const metadata = pageMetadata('Journal', 'People, places, process and identity in motion.', '/journal');

export default async function JournalPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const allStories = await getJournalEntries();
  const categories = ["All", ...new Set(allStories.map((story) => story.category))];
  const requested = (await searchParams).category;
  const selected = requested && categories.includes(requested) ? requested : "All";
  const stories = selected === "All" ? allStories : allStories.filter(story => story.category === selected);
  const [featured, ...remaining] = stories;

  return (
    <main id="main-content">
      <section className="page-intro pb-12">
        <h1 className="display page-title">Journal</h1>
        <p className="mt-8 max-w-lg text-xl text-muted">People, places, process and identity in motion.</p>
        {categories.length > 1 && (
          <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-[.68rem] uppercase tracking-[.13em]">
            {categories.map(item => <Link href={item === "All" ? "/journal" : `/journal?category=${encodeURIComponent(item)}`} aria-current={item === selected ? "page" : undefined} className={item === selected ? "border-b border-black pb-1" : "text-muted"} key={item}>{item}</Link>)}
          </div>
        )}
      </section>

      <section className="site-shell pb-[var(--section)]">
        {!featured ? (
          <div className="border-t border-black/20 py-24"><p className="eyebrow text-muted">No stories published yet.</p></div>
        ) : (
          <>
            <Link href={`/journal/${featured.slug}`} className="group grid gap-7 border-t border-black/20 pt-5 md:grid-cols-[1.35fr_.65fr]">
              <ImageReveal className="aspect-[4/5] md:aspect-[16/10]">
                <ResponsiveImage image={featured.coverImage} frame={{ mobile: .8, desktop: 1.6 }} priority sizes={IMAGE_SIZES.journalFeatured} className="grayscale transition-transform duration-700 group-hover:scale-[1.02]" />
              </ImageReveal>
              <div className="flex flex-col justify-between">
                <p className="eyebrow text-muted">{featured.issue} · {featured.category}<br />{formatEditorialDate(featured.date)}</p>
                <div className="mt-16"><h2 className="text-[clamp(3rem,6vw,7rem)] leading-[.92] tracking-[-.06em]">{featured.title}</h2><p className="mt-6 max-w-md text-sm leading-relaxed text-muted">{featured.excerpt}</p><span className="text-link mt-9">Open story <ArrowUpRight size={15} /></span></div>
              </div>
            </Link>

            <div className="mt-28 grid items-start gap-x-5 gap-y-28 md:grid-cols-12">
              {remaining.map((story, index) => (
                <Reveal key={story.slug} as="article" className={index % 3 === 0 ? "md:col-span-5" : index % 3 === 1 ? "md:col-span-4 md:mt-48" : "md:col-span-7 md:col-start-6"}>
                  <Link href={`/journal/${story.slug}`} className="group">
                    <ImageReveal className={index % 3 === 2 ? "aspect-[16/10]" : "aspect-[3/4]"}><ResponsiveImage image={story.coverImage} frame={{ mobile: index % 3 === 2 ? 1.6 : .75, desktop: index % 3 === 2 ? 1.6 : .75 }} sizes={columnImageSizes(index % 3 === 0 ? 5 : index % 3 === 1 ? 4 : 7, 12, 20)} className="transition-transform duration-700 group-hover:scale-[1.02]" /></ImageReveal>
                    <div className="mt-5 flex items-start justify-between gap-5"><div><p className="eyebrow text-muted">{story.issue} · {story.category}</p><h2 className="mt-4 text-[clamp(2rem,3vw,3.8rem)] leading-[.98] tracking-[-.05em]">{story.title}</h2></div><ArrowUpRight className="mt-1 shrink-0" strokeWidth={1.2} /></div>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">{story.excerpt}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>

      <Link href="/in-the-wild" className="group block bg-black px-[var(--gutter)] py-[var(--section)] text-white">
        <p className="eyebrow text-white/75">A separate living archive</p>
        <h2 className="display mt-6 text-[clamp(5rem,12vw,14rem)] transition-opacity group-hover:opacity-65">Timeless in the Wild</h2>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-white/75">Clothing in real rooms, streets, friendships and journeys—kept apart from the Journal as its own ongoing record.</p>
        <span className="text-link mt-9">Open the archive <ArrowUpRight size={15} /></span>
      </Link>
    </main>
  );
}
