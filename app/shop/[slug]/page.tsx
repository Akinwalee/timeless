import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { normalizeWhatsAppNumber } from "@/lib/bag";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductConfigurator } from "@/components/product/ProductConfigurator";
import { ProductSelectionProvider } from "@/components/product/ProductSelection";
import { ProductFinalPurchase } from "@/components/product/ProductFinalPurchase";
import { ImageReveal, SplitReveal } from "@/components/motion/Reveal";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { getGlobalSettings, getJournalEntries, getProduct, getProducts } from "@/sanity/lib/fetch";

import { IMAGE_SIZES, columnImageSizes } from "@/lib/images";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return pageMetadata(product?.name || "Shop", product?.description || "Explore Timeless clothing.", `/shop/${slug}`);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, stories, settings] = await Promise.all([getProduct(slug), getJournalEntries(), getGlobalSettings()]);
  if (!product) notFound();
  const firstVariant = product.variants[0];
  const number = normalizeWhatsAppNumber(settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  const sizingHref = number ? `https://wa.me/${number}?text=${encodeURIComponent(`Please help me choose a size for ${product.name}.`)}` : `mailto:${settings.contactEmail}`;
  const editorialImages = product.variants.map(
    (variant) => variant.primaryImage
  );
  const nextStory = stories[0];
  return (
    <main id="main-content" className="pt-20 pb-24 md:pb-0">
      <ProductSelectionProvider key={product.id} product={product}>
      <ProductConfigurator product={product} />
      <section className="site-shell grid gap-12 py-[var(--section)] md:grid-cols-[.7fr_1.3fr]"><p className="eyebrow text-muted">The piece.</p><div><SplitReveal className="display text-[clamp(4rem,8vw,9rem)]">Simple enough to become yours.</SplitReveal><div className="mt-20 grid gap-px border border-black/20 bg-black/20 md:grid-cols-2">{[["Materials", product.materials], ["Fit", product.fit], ["Construction", product.construction], ["Care", product.care]].map(([title, copy]) => <div key={title} className="bg-white p-7 md:p-10"><h3 className="text-sm">{title}</h3><p className="mt-5 text-sm leading-relaxed text-muted">{copy || "Details available soon."}</p></div>)}</div></div></section>
      {firstVariant && <section id="size-guide" className="grid bg-bone md:grid-cols-2"><ImageReveal className="min-h-[75svh]"><ResponsiveImage image={firstVariant.primaryImage} sizes="(max-width: 767px) 100vw, 50vw" /></ImageReveal><div className="site-shell flex flex-col justify-center py-20"><p className="eyebrow text-muted">Fit / relaxed</p><h2 className="display mt-7 text-[clamp(4rem,7vw,8rem)]">Room to move.</h2><p className="mt-9 max-w-lg text-lg leading-relaxed text-muted">{product.fit || "Designed with a relaxed shape. Choose your usual size for an easy fit, or size up to push the silhouette further."}</p><p className="mt-6 max-w-lg text-sm leading-relaxed text-muted">For measurements or help choosing between sizes, contact us on WhatsApp before placing your order. This is a fit note, not a measurement chart.</p><a href={sizingHref} target="_blank" rel="noreferrer" className="text-link mt-6 self-start">Ask about measurements</a><div className="mt-12 border-t border-black/20 text-sm"><p className="flex justify-between border-b border-black/20 py-4"><span>Available sizes</span><span>{product.sizes.join(" · ")}</span></p></div></div></section>}
      {editorialImages.length > 0 && <section className="site-shell py-[var(--section)]"><p className="eyebrow text-muted">Worn your way.</p><h2 className="display mt-6 text-[clamp(4.5rem,10vw,11rem)]">Same piece. Different Styles.</h2><div className="mt-16 grid gap-4 md:grid-cols-[.8fr_1.2fr_.8fr]">{editorialImages.slice(0, 3).map((image, index) => <ImageReveal key={image.src} className={`aspect-[3/4] ${index === 0 ? "md:mt-28" : index === 2 ? "md:mt-44" : ""}`}><ResponsiveImage image={image} frame={{ mobile: .75, desktop: .75 }} sizes={columnImageSizes(index === 1 ? 1.2 : .8, 2.8)} /></ImageReveal>)}</div></section>}
      <ProductFinalPurchase />
      {nextStory && <section className="site-shell border-t border-black/15 py-[var(--section)]"><p className="eyebrow text-muted">Continue exploring</p><Link href={`/journal/${nextStory.slug}`} className="group mt-10 grid gap-6 md:grid-cols-2 md:items-end"><div><h2 className="text-[clamp(3rem,6vw,7rem)] leading-[.92] tracking-[-.06em]">{nextStory.title}</h2><p className="mt-6 text-sm text-muted">{nextStory.category} · {nextStory.date} →</p></div><ImageReveal className="aspect-[16/9]"><ResponsiveImage image={nextStory.coverImage} frame={{ mobile: 16 / 9, desktop: 16 / 9 }} sizes={IMAGE_SIZES.half} className="transition-transform duration-700 group-hover:scale-[1.02]" /></ImageReveal></Link></section>}
      </ProductSelectionProvider>
    </main>
  );
}
