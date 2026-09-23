"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export function Newsletter({ inverse = false }: { inverse?: boolean }) {
  const [joined, setJoined] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setJoined(true); };
  return joined ? <p className="py-4 text-sm" role="status">You’re close now. Watch your inbox.</p> : (
    <form onSubmit={submit} className={`flex border-b ${inverse ? "border-white/40" : "border-black/40"}`}>
      <label className="sr-only" htmlFor={`email-${inverse}`}>Email address</label>
      <input id={`email-${inverse}`} required type="email" placeholder="Email address" className="min-h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-current placeholder:opacity-50" />
      <button className="flex min-h-12 min-w-12 items-center justify-end" type="submit" aria-label="Join Timeless"><ArrowRight strokeWidth={1.2} /></button>
    </form>
  );
}
