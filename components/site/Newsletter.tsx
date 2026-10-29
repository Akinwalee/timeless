"use client";

import { FormEvent, useId, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function Newsletter({ inverse = false }: { inverse?: boolean }) {
  const id = useId();
  const [state, setState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [started, setStarted] = useState(false);
  const placement = inverse ? "footer" : "home";
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "pending") return;
    const data = new FormData(event.currentTarget);
    setState("pending");
    setMessage("");
    trackEvent("newsletter_submit", { placement });
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), consent: data.get("consent") === "on", website: data.get("website") }),
        signal: AbortSignal.timeout(12000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.message || "Signup could not be completed. Please try again.");
      setState("success");
      setMessage(result.message);
      trackEvent("newsletter_success", { placement, result: "confirmation_requested" });
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error && error.name !== "TimeoutError" && error.name !== "TypeError" ? error.message : "We could not connect. Please check your connection and try again.");
      trackEvent("newsletter_error", { placement, reason: "submission_failed" });
    }
  };

  if (state === "success") return <p className="py-4 text-sm leading-relaxed" role="status">{message}</p>;
  return (
    <form onSubmit={submit} aria-busy={state === "pending"} onFocusCapture={() => {
      if (!started) { setStarted(true); trackEvent("newsletter_start", { placement }); }
    }}>
      <div className={`flex border-b ${inverse ? "border-white/40" : "border-black/40"}`}>
        <label className="sr-only" htmlFor={`${id}-email`}>Email address</label>
        <input id={`${id}-email`} name="email" required type="email" autoComplete="email" maxLength={254} placeholder="Email address" aria-describedby={`${id}-notice ${id}-message`} className="min-h-14 min-w-0 flex-1 bg-transparent text-base placeholder:text-current placeholder:opacity-75" />
        <button className="flex min-h-12 min-w-12 items-center justify-end disabled:opacity-50" disabled={state === "pending"} type="submit" aria-label={state === "pending" ? "Requesting confirmation" : "Join Timeless"}><ArrowRight strokeWidth={1.2} /></button>
      </div>
      <div className="hidden" aria-hidden="true"><label htmlFor={`${id}-website`}>Website</label><input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" /></div>
      <label id={`${id}-notice`} className={`mt-4 flex items-start gap-3 text-xs leading-relaxed ${inverse ? "text-white/75" : "text-muted"}`}>
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 shrink-0 accent-current" />
        <span>I agree to receive Timeless drops and stories by email. Confirm by email and unsubscribe anytime. <Link href="/privacy" className="underline underline-offset-4">Privacy</Link></span>
      </label>
      <p id={`${id}-message`} role={state === "error" ? "alert" : "status"} className="mt-3 text-sm leading-relaxed">{state === "pending" ? "Requesting your confirmation email…" : message}</p>
      <noscript><p className="mt-3 text-sm">Enable JavaScript to join the email list.</p></noscript>
    </form>
  );
}
