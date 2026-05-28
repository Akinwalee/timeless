const drops = [
  { number: "01", title: "Quality", subtitle: "Tees" },
  { number: "02", title: "Premium", subtitle: "Detailing" },
  { number: "03", title: "Everyday", subtitle: "Fits" },
];

export default function FirstDrop() {
  return (
    <section
      className="border-b border-brand-border py-[var(--section-padding)] max-[920px]:py-[var(--section-padding-mobile)]"
      aria-labelledby="drop-title"
    >
      <div className="container grid items-start gap-[72px] md:grid-cols-[0.42fr_1fr] max-[920px]:grid-cols-1 max-[920px]:gap-12">
        <div className="text-[12px] font-extrabold uppercase tracking-[0.22em] text-brand-muted-2">
          First Drop
        </div>
        <div>
          <h2
            id="drop-title"
            className="max-w-[920px] text-[clamp(34px,5vw,78px)] font-black leading-[0.95] tracking-[-0.07em]"
          >
            Clean basics. Bold details. Everyday fits.
          </h2>
          <p className="mt-7 max-w-[720px] text-[18px] text-brand-muted">
            The first Timeless release starts with wearable pieces shaped for
            daily movement, and quiet confidence.
          </p>

          <div
            className="mt-11 grid gap-[18px] md:grid-cols-3 max-[920px]:grid-cols-1"
            aria-label="Drop categories"
          >
            {drops.map((drop) => (
              <article
                key={drop.number}
                className="flex min-h-[240px] flex-col justify-between border border-brand-border bg-brand-soft-black p-6 transition-all duration-[180ms] hover:-translate-y-1 hover:border-brand-border-light hover:bg-[#111] max-[560px]:min-h-[180px]"
              >
                <span className="text-[12px] font-extrabold tracking-[0.18em] text-brand-muted-2">
                  {drop.number}
                </span>
                <h3 className="text-[30px] font-black uppercase leading-[0.96] tracking-[-0.06em]">
                  {drop.title}
                  <br />
                  {drop.subtitle}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
