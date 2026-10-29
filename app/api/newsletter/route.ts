import { createHash } from "node:crypto";
import { NEWSLETTER_MESSAGE, newsletterRateLimit, readNewsletterBody, validEmail } from "../../../lib/newsletter";
import { getSiteUrl } from "../../../lib/site";

export const runtime = "nodejs";

function reply(status: number, message: string) {
  return Response.json({ ok: status >= 200 && status < 300, message }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // No cross-origin form/JSON submissions. Production origin is configuration, not an untrusted Host header.
  const expected = process.env.NODE_ENV === "production" ? getSiteUrl() : new URL(request.url).origin;
  const trustedOrigins = new Set([expected]);
  if (process.env.NODE_ENV === "production") {
    // The owned apex and www hosts serve the same site. Never trust arbitrary
    // request Host/forwarded headers or suffix matches when accepting an alias.
    const alias = new URL(expected);
    alias.hostname = alias.hostname.startsWith("www.") ? alias.hostname.slice(4) : `www.${alias.hostname}`;
    trustedOrigins.add(alias.origin);
  }
  if (!origin || !trustedOrigins.has(origin)) return reply(403, "Reload this page and try again. If signup still fails, contact Timeless.");
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return reply(415, "Please use the newsletter form.");

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  if (!apiKey || !Number.isSafeInteger(listId) || listId < 1 || !Number.isSafeInteger(templateId) || templateId < 1) {
    return reply(503, "Newsletter signup is temporarily unavailable. Please try again later.");
  }

  let value: unknown;
  try { value = await readNewsletterBody(request); }
  catch { return reply(400, "Please check your details and try again."); }
  if (!value || typeof value !== "object") return reply(400, "Please check your details and try again.");
  const body = value as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim() : body.email;
  if (!validEmail(email) || body.consent !== true || body.website) return reply(400, "Enter a valid email and agree to receive Timeless emails.");

  // The proxy must overwrite forwarding headers; configure a distributed edge limit before promotion.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const clientKey = createHash("sha256").update(ip).digest("hex");
  const emailKey = createHash("sha256").update(email.toLowerCase()).digest("hex");
  if (!newsletterRateLimit(`ip:${clientKey}`) || !newsletterRateLimit(`email:${emailKey}`)) {
    return reply(429, "Too many attempts. Please wait 15 minutes before trying again.");
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, includeListIds: [listId], templateId, redirectionUrl: `${getSiteUrl()}/newsletter/confirmed`, contactPixelTrackingConsent: false }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) {
      // Provider bodies can contain addresses or account details; do not log or return them.
      console.warn("Newsletter provider rejected request", { status: response.status });
      return reply(502, "We could not request your confirmation email. Please try again later.");
    }
    return reply(200, NEWSLETTER_MESSAGE);
  } catch {
    console.warn("Newsletter provider unavailable");
    return reply(502, "We could not reach our email service. Please try again later.");
  }
}
