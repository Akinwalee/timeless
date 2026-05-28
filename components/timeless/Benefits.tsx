const benefits = [
  {
    number: "01",
    title: "First Access",
    description: "Get notified before the first drop goes public.",
  },
  {
    number: "02",
    title: "Launch Perks",
    description: "Receive early-bird offers made only for the waitlist.",
  },
  {
    number: "03",
    title: "Drop Updates",
    description: "Know what is dropping, when it drops, and how to get it.",
  },
  {
    number: "04",
    title: "Behind Scenes",
    description: "Follow the build-up before Timeless officially launches.",
  },
];

export default function Benefits() {
  return (
    <section
      className="border-b border-brand-border py-[var(--section-padding)] max-[920px]:py-[var(--section-padding-mobile)]"
      aria-labelledby="benefits-title"
    >
      <div className="container grid items-start gap-[72px] md:grid-cols-[0.42fr_1fr] max-[920px]:grid-cols-1 max-[920px]:gap-12">
        <div className="text-[12px] font-extrabold uppercase tracking-[0.22em] text-brand-muted-2">
          Why Join Early
        </div>
        <div>
          <h2
            id="benefits-title"
            className="max-w-[920px] text-[clamp(34px,5vw,78px)] font-black leading-[0.95] tracking-[-0.07em]"
          >
            The first ones get closer access.
          </h2>

          <div className="mt-11 grid border border-brand-border md:grid-cols-4 max-[920px]:grid-cols-1">
            {benefits.map((benefit, i) => (
              <article
                key={benefit.number}
                className={`flex min-h-[220px] flex-col justify-between gap-10 p-7 max-[920px]:min-h-auto ${
                  /* Right border for desktop, bottom border for mobile */
                  i < benefits.length - 1
                    ? "md:border-r md:border-brand-border max-[920px]:border-b max-[920px]:border-r-0 max-[920px]:border-brand-border"
                    : ""
                }`}
              >
                <span className="text-[12px] font-extrabold tracking-[0.16em] text-brand-muted-2">
                  {benefit.number}
                </span>
                <div>
                  <h3 className="mb-3 text-[20px] font-bold uppercase leading-none tracking-[-0.04em]">
                    {benefit.title}
                  </h3>
                  <p className="text-[14px] text-brand-muted">
                    {benefit.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
