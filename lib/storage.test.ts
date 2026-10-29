import { afterEach, describe, expect, it, vi } from "vitest";
import { readStorage, writeStorage } from "./storage";

afterEach(() => vi.unstubAllGlobals());

describe("browser storage recovery", () => {
  it("keeps denied storage access from escaping into the application", () => {
    vi.stubGlobal("window", Object.defineProperty({}, "localStorage", { get() { throw new DOMException("blocked", "SecurityError"); } }));
    expect(readStorage("localStorage", "bag")).toEqual({ value: null, available: false });
    expect(writeStorage("localStorage", "bag", "value")).toBe(false);
  });

  it("reports failed writes without losing an available read", () => {
    vi.stubGlobal("window", { localStorage: { getItem: () => "saved", setItem: () => { throw new DOMException("full", "QuotaExceededError"); } } });
    expect(readStorage("localStorage", "bag")).toEqual({ value: "saved", available: true });
    expect(writeStorage("localStorage", "bag", "new")).toBe(false);
  });
});
