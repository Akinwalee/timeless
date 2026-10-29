import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const origin = "https://weartimeless.xyz";
function request(body: unknown, requestOrigin = origin) {
  return new Request(`${origin}/api/newsletter`, { method: "POST", headers: { Origin: requestOrigin, "Content-Type": "application/json" }, body: JSON.stringify(body) });
}

beforeEach(() => {
  vi.stubEnv("BREVO_API_KEY", "dummy-test-key");
  vi.stubEnv("BREVO_LIST_ID", "12");
  vi.stubEnv("BREVO_DOI_TEMPLATE_ID", "34");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", origin);
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("newsletter acceptance boundary", () => {
  it("only confirms an accepted Brevo DOI request and keeps the key server-side", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetcher);
    const response = await POST(request({ email: "audit-success@example.invalid", consent: true, website: "" }));
    expect(response.status).toBe(200);
    expect((await response.json()).message).toContain("confirmation");
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/contacts/doubleOptinConfirmation");
    expect(options.headers["api-key"]).toBe("dummy-test-key");
    expect(JSON.parse(options.body)).toEqual({ email: "audit-success@example.invalid", includeListIds: [12], templateId: 34, redirectionUrl: `${origin}/newsletter/confirmed`, contactPixelTrackingConsent: false });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("rejects invalid email, missing consent, honeypot and foreign origins without calling Brevo", async () => {
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    for (const body of [{ email: "invalid", consent: true }, { email: "audit@example.invalid", consent: false }, { email: "audit@example.invalid", consent: true, website: "spam" }]) {
      expect((await POST(request(body))).status).toBe(400);
    }
    expect((await POST(request({ email: "audit@example.invalid", consent: true }, "https://other.invalid"))).status).toBe(403);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("never shows success for a rejected or unreachable provider", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(new Response('{"message":"private provider detail"}', { status: 400 })).mockRejectedValueOnce(new TypeError("offline"));
    vi.stubGlobal("fetch", fetcher);
    for (const email of ["audit-rejected@example.invalid", "audit-offline@example.invalid"]) {
      const response = await POST(request({ email, consent: true }));
      expect(response.status).toBe(502);
      expect(await response.text()).not.toContain("private provider detail");
    }
  });

  it("fails honestly without configuration and bounds oversized requests", async () => {
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    vi.stubEnv("BREVO_API_KEY", "");
    expect((await POST(request({ email: "audit@example.invalid", consent: true }))).status).toBe(503);
    vi.stubEnv("BREVO_API_KEY", "dummy-test-key");
    expect((await POST(request({ email: "a".repeat(3000), consent: true }))).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
});
