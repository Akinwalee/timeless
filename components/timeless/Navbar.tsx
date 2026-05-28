import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-30 border-b border-brand-border"
      style={{
        background: "rgba(5, 5, 5, 0.78)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
      aria-label="Main navigation"
    >
      <div className="container flex h-[var(--nav-height)] items-center justify-between gap-6 max-[920px]:h-[var(--nav-height-mobile)]">
        <Link
          href="#top"
          className="text-[14px] font-extrabold uppercase tracking-[0.26em] max-[560px]:text-[12px]"
        >
          Timeless
        </Link>
        <Link
          href="#waitlist"
          className="border-b border-current pb-1 text-[12px] font-bold uppercase tracking-[0.18em] text-brand-off-white max-[560px]:text-[11px]"
        >
          Join Waitlist
        </Link>
      </div>
    </nav>
  );
}
