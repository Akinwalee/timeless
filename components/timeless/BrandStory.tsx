export default function BrandStory() {
  return (
    <section
      className="border-b border-brand-border py-[var(--section-padding)] max-[920px]:py-[var(--section-padding-mobile)]"
      aria-labelledby="about-title"
    >
      <div className="container grid items-start gap-[72px] md:grid-cols-[0.42fr_1fr] max-[920px]:grid-cols-1 max-[920px]:gap-12">
        <div className="text-[12px] font-extrabold uppercase tracking-[0.22em] text-brand-muted-2">
          About Timeless
        </div>
        <div>
          <h2
            id="about-title"
            className="max-w-[920px] text-[clamp(34px,5vw,78px)] font-black leading-[0.95] tracking-[-0.07em]"
          >
            Built for the moments that stay with you.
          </h2>
          <p className="mt-7 max-w-[720px] text-[18px] text-brand-muted">
            Campus days. Late nights. First wins. New friendships. Quiet
            ambition. Loud expression. The first drop begins with everyday
            streetwear made to feel current now and memorable later.
          </p>
        </div>
      </div>
    </section>
  );
}
