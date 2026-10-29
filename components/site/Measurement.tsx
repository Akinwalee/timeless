"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { campaignAttribution, MEASUREMENT_KEY, measurementAllowed, measurementConfigured, saveMeasurementPreference, trackEvent } from "@/lib/analytics";
import { readStorage } from "@/lib/storage";

export function Measurement() {
  const pathname = usePathname();
  const [prompt, setPrompt] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const update = () => {
      const enabled = measurementAllowed();
      window.timelessMeasurementAllowed = enabled;
      setAllowed(enabled);
      setPrompt(measurementConfigured() && navigator.doNotTrack !== "1" && !readStorage("localStorage", MEASUREMENT_KEY).value);
    };
    const show = () => setPrompt(measurementConfigured());
    update();
    window.addEventListener("timeless:measurement-change", update);
    window.addEventListener("timeless:measurement-preferences", show);
    const storage = (event: StorageEvent) => { if (event.key === MEASUREMENT_KEY) update(); };
    window.addEventListener("storage", storage);
    return () => {
      window.removeEventListener("timeless:measurement-change", update);
      window.removeEventListener("timeless:measurement-preferences", show);
      window.removeEventListener("storage", storage);
    };
  }, []);

  useEffect(() => {
    if (!allowed || pathname.startsWith("/studio")) return;
    const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!;
    const flag = `ga-disable-${id}`;
    (window as unknown as Record<string, unknown>)[flag] = false;
    window.dataLayer ||= [];
    window.gtag ||= function () {
      // gtag's documented command queue uses an Arguments object.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    if (!document.getElementById("timeless-ga")) {
      window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      window.gtag("js", new Date());
      window.gtag("config", id, { send_page_view: false, page_location: `${window.location.origin}${pathname}`, page_referrer: document.referrer ? new URL(document.referrer).origin : "", allow_google_signals: false, allow_ad_personalization_signals: false });
      const script = document.createElement("script");
      script.id = "timeless-ga"; script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(script);
    }
    trackEvent("page_view", { page_path: pathname, page_location: `${window.location.origin}${pathname}`, ...campaignAttribution() });
    if (pathname.startsWith("/shop/")) trackEvent("view_item", { product_id: pathname.split("/").pop()! });
  }, [allowed, pathname]);

  useEffect(() => {
    if (allowed) return;
    const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (id) (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true;
  }, [allowed]);

  if (!prompt || pathname.startsWith("/studio")) return null;
  return <aside aria-label="Optional measurement" className="fixed inset-x-4 bottom-4 z-[85] max-w-xl border border-black/25 bg-white p-5 text-black shadow-lg md:left-auto md:right-6">
    <p className="text-sm leading-relaxed">Allow optional Google Analytics measurement to help us understand visits and shopping actions? Shopping works either way. <Link className="underline" href="/privacy">Privacy</Link></p>
    <div className="mt-4 flex flex-wrap gap-3"><button className="solid-button" onClick={() => { saveMeasurementPreference(false); setPrompt(false); }}>Decline</button><button className="solid-button" onClick={() => { saveMeasurementPreference(true); setPrompt(false); }}>Allow measurement</button></div>
  </aside>;
}

export function MeasurementPreferences() {
  if (!measurementConfigured()) return null;
  return <button type="button" className="text-left uppercase tracking-[.12em] underline underline-offset-4" onClick={() => window.dispatchEvent(new Event("timeless:measurement-preferences"))}>Measurement preferences</button>;
}
