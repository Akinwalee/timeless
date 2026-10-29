import { describe, it, expect } from "vitest";
import { validEmail, newsletterRateLimit } from "./newsletter";

describe("newsletter input and burst limits", () => {
  it("accepts email addresses and rejects invalid/oversized input", () => {
    expect(validEmail("reader@example.invalid")).toBe(true);
    for (const input of [null, 123, "invalid", "a b@example.invalid", "a".repeat(255) + "@x.test"]) expect(validEmail(input)).toBe(false);
  });
  it("limits repeated attempts and allows recovery when the window expires", () => {
    for (let i = 0; i < 5; i++) expect(newsletterRateLimit("test-burst", 1000)).toBe(true);
    expect(newsletterRateLimit("test-burst", 1000)).toBe(false);
    expect(newsletterRateLimit("test-burst", 901001)).toBe(true);
  });
});
