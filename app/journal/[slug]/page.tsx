import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImageReveal } from "@/components/motion/Reveal";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { JournalBody } from "@/components/editorial/JournalBody";
import { getJournalEntries, getJournalEntry } from "@/sanity/lib/fetch";
import { formatEditorialDate } from "@/lib/dates";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getJournalEntries()).map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getJournalEntry(slug);
  return { title: story?.title ?? "Journal", description: story?.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [story, stories] = await Promise.all([getJournalEntry(slug), getJournalEntries()]);
  if (!story) notFound();
  const index = stories.findIndex((entry) => entry.slug === story.slug);
  const next = story.nextSlug ? stories.find((entry) => entry.slug === story.nextSlug) : stories[(index + 1) % stories.length];

  return (
    <main id="main-content">
      <header className="page-intro pb-14">
        <div className="grid gap-7 md:grid-cols-[.65fr_1.35fr]"><div><p className="eyebrow text-black/45">{story.category}</p><p className="mt-4 text-xs text-black/45">{story.issue} · {formatEditorialDate(story.date)}</p></div><h1 className="display text-[clamp(4.5rem,10vw,11rem)]">{story.title}</h1></div>
      </header>
      <ImageReveal className="mx-[var(--gutter)] aspect-[4/5] md:aspect-[16/9] md:max-h-[76svh]"><ResponsiveImage image={story.coverImage} priority sizes="100vw" className="grayscale" /></ImageReveal>
      <article>
        <section className="site-shell grid gap-10 py-[var(--section)] md:grid-cols-[.55fr_1.45fr]"><p className="eyebrow pt-2 text-black/40">Introduction</p><p className="max-w-4xl text-[clamp(2.1rem,4.2vw,5rem)] leading-[1.03] tracking-[-.055em]">{story.excerpt}</p></section>
        <JournalBody blocks={story.body} />
      </article>
      {next && (
        <Link href={`/journal/${next.slug}`} className="group relative block min-h-[80svh] overflow-hidden bg-black text-white">
          <ResponsiveImage image={next.coverImage} sizes="100vw" className="opacity-55 transition-transform duration-[1200ms] group-hover:scale-[1.03]" />
          <div className="site-shell absolute inset-x-0 bottom-10"><p className="eyebrow text-white/55">Next story</p><h2 className="display mt-7 text-[clamp(4.5rem,10vw,11rem)]">{next.title}</h2><p className="mt-8 text-sm">{next.category} <ArrowRight className="ml-2 inline" size={15} /></p></div>
        </Link>
      )}
    </main>
  );
}
