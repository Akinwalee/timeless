import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Timeless home" className={`script leading-none ${className}`}>
      Timeless.
    </Link>
  );
}
