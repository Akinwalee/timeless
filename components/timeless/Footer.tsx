import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-black py-[54px] text-brand-white">
      <div className="container flex items-end justify-between gap-8 max-[920px]:grid max-[920px]:gap-8">
        <div>
          <div className="text-[clamp(42px,8vw,112px)] font-black uppercase leading-[0.82] tracking-[-0.08em]">
            Timeless
          </div>
        </div>
        <div className="text-right text-[13px] text-brand-muted max-[920px]:text-left">
          <div className="mb-2.5 flex justify-end gap-[18px] text-[12px] font-extrabold uppercase tracking-[0.14em] text-brand-white max-[920px]:justify-start">
            <Link href="#" aria-label="Instagram">
              Instagram
            </Link>
            <Link href="#" aria-label="TikTok">
              TikTok
            </Link>
            <Link href="mailto:hello@wearetimeless.co">Contact</Link>
          </div>
          <p>Style without limits.</p>
          <p>© 2026 Timeless. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
