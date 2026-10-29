import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { campaignAttribution, trackEvent } from "./analytics";

beforeEach(() => {
  vi.stubGlobal("navigator", { doNotTrack: "0" });
  vi.stubGlobal("window", { timelessMeasurementAllowed: false, gtag: vi.fn(), location: { search: "" }, sessionStorage: { getItem: vi.fn(), setItem: vi.fn() } });
});
afterEach(() => vi.unstubAllGlobals());

it("does not emit denied or Do Not Track events", () => {
  trackEvent("add_to_bag", { quantity: 1 });
  expect(window.gtag).not.toHaveBeenCalled();
  window.timelessMeasurementAllowed = true;
  vi.stubGlobal("navigator", { doNotTrack: "1" });
  trackEvent("add_to_bag", { quantity: 1 });
  expect(window.gtag).not.toHaveBeenCalled();
});

it("only forwards an allowlist and drops email/query-string values", () => {
  window.timelessMeasurementAllowed = true;
  trackEvent("newsletter_submit", { placement: "footer", email: "private@example.invalid", product_id: "private@example.invalid", page_path: "/?email=private", quantity: 1 });
  expect(window.gtag).toHaveBeenCalledExactlyOnceWith("event", "newsletter_submit", { placement: "footer", quantity: 1 });
});

it("retains permitted campaign labels without copying arbitrary query data", () => {
  window.location.search = "?utm_source=instagram&utm_campaign=private@example.invalid&email=private@example.invalid";
  expect(campaignAttribution()).toEqual({ campaign_source: "instagram" });
  expect(window.sessionStorage.setItem).toHaveBeenCalledWith("timeless:campaign:v1", '{"campaign_source":"instagram"}');
});
