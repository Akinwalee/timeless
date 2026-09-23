import { PortableText } from "next-sanity";
import type { JournalBlock } from "@/lib/content";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";

export function JournalBody({ blocks }: { blocks: JournalBlock[] }) {
  return (
    <div>
      {blocks.map((block) => {
        if (block._type === "text") {
          return (
            <section key={block._key} className="site-shell grid gap-10 py-[var(--section)] md:grid-cols-[.55fr_1.45fr]">
              <p className="eyebrow pt-2 text-black/40">Field note</p>
              <div>{block.heading && <h2 className="mb-10 text-[clamp(2.4rem,4.5vw,5rem)] leading-[1] tracking-[-.055em]">{block.heading}</h2>}<div className="grid gap-10 text-lg leading-relaxed text-black/58 md:grid-cols-2">{block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
            </section>
          );
        }
        if (block._type === "block") {
          return <section key={block._key} className="portable-copy site-shell mx-auto max-w-4xl py-10 text-lg leading-relaxed text-black/65"><PortableText value={[block] as never} /></section>;
        }
        if (block._type === "image") {
          return <ImageReveal key={block._key} className="mx-[var(--gutter)] aspect-[4/5] md:aspect-[16/9] md:max-h-[80svh]"><ResponsiveImage image={block.image} sizes="100vw" />{block.image.caption && <span className="absolute bottom-4 left-4 bg-black/65 px-3 py-2 text-[.62rem] uppercase tracking-[.13em] text-white">{block.image.caption}</span>}</ImageReveal>;
        }
        if (block._type === "imagePair") {
          return <section key={block._key} className="site-shell grid gap-4 py-[var(--section)] md:grid-cols-[1.1fr_.9fr]"><ImageReveal className="aspect-[4/5]"><ResponsiveImage image={block.left} sizes="(max-width: 767px) 100vw, 55vw" /></ImageReveal><ImageReveal className="aspect-[4/5] md:mt-36"><ResponsiveImage image={block.right} sizes="(max-width: 767px) 100vw, 45vw" /></ImageReveal></section>;
        }
        if (block._type === "quote") {
          return <section key={block._key} className="flex min-h-[70svh] items-center bg-black px-[var(--gutter)] py-[var(--section)] text-white"><Reveal><p className="eyebrow text-white/40">Field note</p><blockquote className="display mt-8 max-w-[13ch] text-[clamp(4.2rem,10vw,11rem)]">“{block.quote}”</blockquote>{block.attribution && <p className="mt-8 text-sm text-white/50">{block.attribution}</p>}</Reveal></section>;
        }
        if (block._type === "video") {
          return <section key={block._key} className="site-shell py-[var(--section)]"><video controls playsInline preload="metadata" poster={block.poster?.src} className="aspect-video w-full bg-black"><source src={block.url} /></video>{block.caption && <p className="mt-4 text-sm text-black/50">{block.caption}</p>}</section>;
        }
        return null;
      })}
    </div>
  );
}
