"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="fixed inset-0 z-[200] grid min-h-svh place-items-center bg-black px-6 text-white">
        <div className="max-w-xl border border-white/25 p-8 md:p-12">
          <p className="eyebrow text-white/50">Timeless Studio</p>
          <h1 className="mt-6 text-4xl tracking-[-.05em]">Connect a Sanity project.</h1>
          <p className="mt-6 text-sm leading-relaxed text-white/60">
            Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to
            .env.local, then restart the development server. The storefront is
            currently using its curated local fallback content.
          </p>
        </div>
      </main>
    );
  }

  return <div className="fixed inset-0 z-[200] bg-black"><NextStudio config={config} /></div>;
}
