import Image from "next/image";
import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Timeless home" className={className}>
      <Image
        src="/images/brand/logo-white.png"
        alt="Timeless Wordmark"
        width={4320}
        height={1493}
        sizes="180px"
        className="brand-wordmark h-auto w-[180px]"
      />
    </Link>
  );
}
