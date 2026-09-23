import type { Metadata } from "next";
import { getInTheWildEntries } from "@/sanity/lib/fetch";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";

export const metadata: Metadata = {
  title: "In the Wild",
  description: "Timeless worn in real rooms, streets, friendships and journeys.",
};

export default async function InTheWildPage() {
  const entries = await getInTheWildEntries();
  return (
    <main id="main-content">
      <header className="page-intro pb-14">
        <p className="eyebrow text-black/45">Field archive / 2026</p>
        <h1 className="display page-title mt-6">In the Wild</h1>
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-black/55">Once the clothing leaves the controlled campaign environment, it becomes part of real rooms, streets, friendships and journeys.</p>
      </header>
      {entries.length ? (
        <div className="pb-[var(--section)]">
          {entries.map((entry, index) => (
            <article id={entry.slug} key={entry.id} className="site-shell border-t border-black/20 py-16 md:py-24">
              <Reveal className="mb-10 grid gap-7 md:grid-cols-[.65fr_1.35fr] md:items-end">
                <div><p className="eyebrow text-black/45">{String(index + 1).padStart(2, "0")} / {entry.location}</p><p className="mt-4 text-xs text-black/45">{entry.date} · {entry.pieceWorn}</p></div>
                <div><h2 className="display text-[clamp(4rem,8vw,9rem)]">{entry.title}</h2>{entry.note && <p className="mt-6 max-w-xl text-sm leading-relaxed text-black/55">{entry.note}</p>}</div>
              </Reveal>
              <div className="grid gap-4 md:grid-cols-12 md:items-start">
                {entry.images.slice(0, 3).map((image, imageIndex) => (
                  <ImageReveal key={image.src} className={`${imageIndex === 0 ? "aspect-[4/5] md:col-span-7 md:aspect-[5/4]" : imageIndex === 1 ? "aspect-[3/4] md:col-span-3 md:mt-28" : "aspect-[3/4] md:col-span-2 md:mt-8"}`}>
                    <ResponsiveImage image={image} sizes={imageIndex === 0 ? "(max-width: 767px) 100vw, 58vw" : "(max-width: 767px) 100vw, 25vw"} />
                  </ImageReveal>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="site-shell pb-[var(--section)]"><div className="border-t border-black/20 py-20"><p className="text-2xl tracking-[-.04em]">The field archive is being assembled.</p></div></section>
      )}
    </main>
  );
}
