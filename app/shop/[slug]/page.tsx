import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductConfigurator } from "@/components/product/ProductConfigurator";
import { ImageReveal, SplitReveal } from "@/components/motion/Reveal";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getJournalEntries, getProduct, getProducts } from "@/sanity/lib/fetch";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product?.name || "Shop", description: product?.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, stories] = await Promise.all([getProduct(slug), getJournalEntries()]);
  if (!product) notFound();
  const firstVariant = product.variants[0];
  const editorialImages = product.variants.map(
    (variant) => variant.primaryImage
  );
  const nextStory = stories[0];
  return (
    <main id="main-content" className="pt-20">
      <ProductConfigurator product={product} />
      <section className="site-shell grid gap-12 py-[var(--section)] md:grid-cols-[.7fr_1.3fr]"><p className="eyebrow text-black/50">The piece.</p><div><SplitReveal className="display text-[clamp(4rem,8vw,9rem)]">Simple enough to become yours.</SplitReveal><div className="mt-20 grid gap-px border border-black/20 bg-black/20 md:grid-cols-2">{[["Materials", product.materials], ["Fit", product.fit], ["Construction", product.construction], ["Care", product.care]].map(([title, copy]) => <div key={title} className="bg-white p-7 md:p-10"><h3 className="text-sm">{title}</h3><p className="mt-5 text-sm leading-relaxed text-black/55">{copy || "Details available soon."}</p></div>)}</div></div></section>
      {firstVariant && <section id="size-guide" className="grid bg-bone md:grid-cols-2"><ImageReveal className="min-h-[75svh]"><ResponsiveImage image={firstVariant.primaryImage} sizes="(max-width: 767px) 100vw, 50vw" /></ImageReveal><div className="site-shell flex flex-col justify-center py-20"><p className="eyebrow text-black/50">Fit / relaxed</p><h2 className="display mt-7 text-[clamp(4rem,7vw,8rem)]">Room to move.</h2><p className="mt-9 max-w-lg text-lg leading-relaxed text-black/58">{product.fit || "Designed with a relaxed shape. Choose your usual size for an easy fit, or size up to push the silhouette further."}</p><div className="mt-12 border-t border-black/20 text-sm"><p className="flex justify-between border-b border-black/20 py-4"><span>Available sizes</span><span>{product.sizes.join(" · ")}</span></p></div></div></section>}
      {editorialImages.length > 0 && <section className="site-shell py-[var(--section)]"><p className="eyebrow text-black/50">Worn your way.</p><h2 className="display mt-6 text-[clamp(4.5rem,10vw,11rem)]">One piece. No fixed form.</h2><div className="mt-16 grid gap-4 md:grid-cols-[.8fr_1.2fr_.8fr]">{editorialImages.slice(0, 3).map((image, index) => <ImageReveal key={image.src} className={`aspect-[3/4] ${index === 0 ? "md:mt-28" : index === 2 ? "md:mt-44" : ""}`}><ResponsiveImage image={image} sizes="(max-width: 767px) 100vw, 36vw" /></ImageReveal>)}</div></section>}
      {nextStory && <section className="site-shell border-t border-black/15 py-[var(--section)]"><p className="eyebrow text-black/50">Continue exploring</p><Link href={`/journal/${nextStory.slug}`} className="group mt-10 grid gap-6 md:grid-cols-2 md:items-end"><div><h2 className="text-[clamp(3rem,6vw,7rem)] leading-[.92] tracking-[-.06em]">{nextStory.title}</h2><p className="mt-6 text-sm text-black/50">{nextStory.category} · {nextStory.date} →</p></div><ImageReveal className="aspect-[16/9]"><ResponsiveImage image={nextStory.coverImage} sizes="50vw" className="transition-transform duration-700 group-hover:scale-[1.02]" /></ImageReveal></Link></section>}
    </main>
  );
}
