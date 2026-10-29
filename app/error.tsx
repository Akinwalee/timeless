"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (!error.digest && process.env.NEXT_PUBLIC_SENTRY_DSN) void import("@sentry/nextjs").then(Sentry => Sentry.captureException(error));
  }, [error]);
  return <main id="main-content" className="page-intro min-h-[70svh]"><h1 className="max-w-3xl text-5xl tracking-[-.05em]">We could not load this page.</h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">Please try again. Your saved bag stays in this browser when storage is available.</p><div className="mt-10 flex gap-6"><button className="solid-button" onClick={reset}>Try again</button><Link className="text-link self-center" href="/">Return home</Link></div></main>;
}
