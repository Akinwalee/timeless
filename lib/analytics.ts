import { readStorage, writeStorage } from "./storage";

export const MEASUREMENT_KEY = "timeless:measurement:v1";
type EventName = "page_view" | "view_item" | "select_variant" | "add_to_bag" | "view_bag" | "update_bag" | "checkout_handoff" | "checkout_unavailable" | "newsletter_start" | "newsletter_submit" | "newsletter_success" | "newsletter_error";
type EventProperties = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    timelessMeasurementAllowed?: boolean;
  }
}

export function measurementConfigured() {
  return process.env.NEXT_PUBLIC_DEPLOYMENT_ENV !== "preview" && process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" && /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "");
}

export function measurementAllowed() {
  if (typeof window === "undefined" || !measurementConfigured() || navigator.doNotTrack === "1") return false;
  return readStorage("localStorage", MEASUREMENT_KEY).value === "allowed";
}

export function saveMeasurementPreference(allowed: boolean) {
  writeStorage("localStorage", MEASUREMENT_KEY, allowed ? "allowed" : "denied");
  window.timelessMeasurementAllowed = allowed;
  if (!allowed) {
    const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (id) (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true;
    try { window.sessionStorage.removeItem("timeless:campaign:v1"); } catch { /* Storage may be blocked. */ }
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) continue;
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      const parts = window.location.hostname.split(".");
      for (let i = 0; i < parts.length - 1; i++) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${parts.slice(i).join(".")}; SameSite=Lax`;
    }
  }
  window.dispatchEvent(new Event("timeless:measurement-change"));
}

export function trackEvent(name: EventName, properties: EventProperties = {}) {
  if (typeof window === "undefined" || !window.timelessMeasurementAllowed || navigator.doNotTrack === "1") return;
  // Drop arbitrary data rather than forwarding email, URLs, free text or message contents.
  const allowed = new Set(["page_path", "page_location", "product_id", "variant_id", "size", "quantity", "currency", "value", "placement", "item_count", "action", "reason", "result", "campaign_source", "campaign_medium", "campaign_name"]);
  const safe = Object.fromEntries(Object.entries(properties).filter(([key, value]) => allowed.has(key) && (typeof value !== "string" || (value.length <= 200 && !/[?@]/.test(value)))));
  window.gtag?.("event", name, safe);
}

export function campaignAttribution() {
  const query = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  for (const [param, key] of [["utm_source", "campaign_source"], ["utm_medium", "campaign_medium"], ["utm_campaign", "campaign_name"]]) {
    const value = query.get(param);
    if (value && /^[a-zA-Z0-9_. -]{1,80}$/.test(value)) result[key] = value;
  }
  if (Object.keys(result).length) writeStorage("sessionStorage", "timeless:campaign:v1", JSON.stringify(result));
  if (!Object.keys(result).length) {
    try {
      const stored = JSON.parse(readStorage("sessionStorage", "timeless:campaign:v1").value || "{}");
      for (const key of ["campaign_source", "campaign_medium", "campaign_name"]) if (typeof stored[key] === "string" && /^[a-zA-Z0-9_. -]{1,80}$/.test(stored[key])) result[key] = stored[key];
    } catch { /* No attribution is preferable to a broken visit. */ }
  }
  return result;
}
