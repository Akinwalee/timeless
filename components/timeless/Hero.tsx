import Link from "next/link";
import Countdown from "./Countdown";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section
      className="grid min-h-[calc(100vh-var(--nav-height))] items-center border-b border-brand-border py-[72px] pb-[88px] max-[920px]:min-h-auto max-[920px]:py-[62px] max-[920px]:pb-[72px]"
      aria-labelledby="hero-title"
    >
      <div className="container">
        {/* Hero grid: two columns on desktop, single on mobile */}
        <div className="grid items-end gap-20 md:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] max-[920px]:grid-cols-1 max-[920px]:gap-12">
          {/* ── Left column: Copy ── */}
          <div>
            <div className="eyebrow reveal">First drop loading</div>

            <h1
              id="hero-title"
              className="reveal delay-1 max-w-[860px] text-[clamp(58px,10vw,150px)] font-black uppercase leading-[0.86] tracking-[-0.075em] max-[560px]:text-[clamp(58px,19vw,96px)]"
            >
              <span className="block">Timeless</span>
              <span className="block">is coming</span>
            </h1>

            <div className="reveal delay-2 mt-[34px] max-w-[580px]">
              <p className="mb-5 text-[clamp(22px,3vw,38px)] font-bold leading-[1.04] tracking-[-0.05em] text-brand-off-white">
                Style without limits.
              </p>
              <p className="max-w-[530px] text-[17px] text-brand-muted">
                Join the waitlist for early access to our first drop, launch
                updates, and limited release details before everyone else.
              </p>
            </div>

            <div className="reveal delay-3 mt-[34px] flex flex-wrap items-center gap-[18px] max-[560px]:grid">
              <Link
                href="#waitlist"
                className="btn max-[560px]:w-full"
              >
                Join the Waitlist
              </Link>
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand-muted-2">
                First drop access starts here
              </span>
            </div>
          </div>

          {/* ── Right column: Hero Card ── */}
          <aside
            className={styles.heroCard}
            aria-label="Timeless first drop teaser"
          >
            <div className={styles.cardTop}>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-muted">
                Drop preview
              </span>
              <span className="text-[72px] font-black leading-[0.82] tracking-[-0.08em] max-[560px]:text-[54px]">
                01
              </span>
            </div>

            <div className={styles.shirtOutline} aria-hidden="true">
              <span className={styles.shirtText}>Timeless</span>
            </div>

            <div className={styles.cardBottom}>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-muted">
                Oversized tees
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-muted">
                Limited first release
              </span>
            </div>
          </aside>
        </div>

        {/* ── Countdown Timer ── */}
        <Countdown />
      </div>
    </section>
  );
}
