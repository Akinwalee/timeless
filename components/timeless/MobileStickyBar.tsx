import Link from "next/link";

export default function MobileStickyBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-brand-border px-4 py-3 max-[920px]:block"
      style={{
        background: "rgba(5, 5, 5, 0.86)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
      aria-hidden="false"
    >
      <Link href="#waitlist" className="btn w-full">
        Join the Waitlist
      </Link>
    </div>
  );
}
