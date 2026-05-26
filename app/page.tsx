"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const LAUNCH_DATE = new Date("2026-12-31T23:59:59Z");

function getCountdown(): Countdown {
  const distance = LAUNCH_DATE.getTime() - Date.now();
  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / 1000 / 60) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export default function Home() {
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown());

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(timer);
  }, []);

  const socialLinks = useMemo(
    () => [
      { name: "Instagram", href: "#" },
      { name: "X", href: "#" },
      { name: "Email", href: "mailto:hello@timeless.com" },
    ],
    [],
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 py-12 text-black md:px-12 md:py-16">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-5 border-b border-black/15 pb-10"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-600">Hero</p>
        <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
          Timeless is Coming
        </h1>
      </motion.section>

      <section className="grid gap-12 border-b border-black/15 pb-12 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-600">
            Brand Statement
          </p>
          <p className="max-w-xl text-xl leading-relaxed md:text-2xl">
            Crafted for those who wear quiet confidence, Timeless blends purity,
            precision, and presence into every piece.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-600">Countdown</p>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            {Object.entries(countdown).map(([unit, value]) => (
              <div key={unit} className="rounded-2xl border border-black px-4 py-6">
                <p className="text-3xl font-semibold md:text-4xl">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">
                  {unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5 border-b border-black/15 pb-12">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-600">Visual Preview</p>
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            whileHover={{ y: -4 }}
            className="aspect-[4/5] rounded-3xl border border-black bg-[linear-gradient(140deg,#fff_5%,#f4f4f4_45%,#ddd_100%)]"
          />
          <motion.div
            whileHover={{ y: -4 }}
            className="aspect-[4/5] rounded-3xl border border-black bg-[linear-gradient(20deg,#fff_5%,#f6f6f6_50%,#d9d9d9_100%)]"
          />
          <motion.div
            whileHover={{ y: -4 }}
            className="aspect-[4/5] rounded-3xl border border-black bg-[linear-gradient(220deg,#fff_5%,#f7f7f7_45%,#d8d8d8_100%)]"
          />
        </div>
      </section>

      <section className="space-y-5 border-b border-black/15 pb-12">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-600">Waitlist Form</p>
        <form className="flex max-w-xl flex-col gap-3 sm:flex-row">
          <Input type="email" required placeholder="Enter your email" />
          <Button size="lg" type="submit">
            Join Waitlist
          </Button>
        </form>
      </section>

      <section className="space-y-5 border-b border-black/15 pb-12">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-600">Social Links</p>
        <div className="flex flex-wrap gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="inline-flex items-center gap-2 rounded-full border border-black px-4 py-2 text-sm transition-colors hover:bg-black hover:text-white"
            >
              {social.name}
            </a>
          ))}
        </div>
      </section>

      <footer className="py-2 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Timeless. Style without limit.
      </footer>
    </main>
  );
}
