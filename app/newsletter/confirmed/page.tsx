import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Email confirmation", robots: { index: false, follow: false } };

export default function NewsletterConfirmed() {
  return <main id="main-content" className="page-intro min-h-[70svh]"><p className="eyebrow text-muted">Timeless emails</p><h1 className="mt-8 max-w-3xl text-[clamp(3rem,7vw,6rem)] leading-none tracking-[-.05em]">Thanks for confirming.</h1><p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">If you arrived here from your Brevo confirmation link, your email preference has been confirmed. You can unsubscribe using the link in any marketing email.</p><Link href="/shop" className="text-link mt-10">Explore the drop</Link></main>;
}
