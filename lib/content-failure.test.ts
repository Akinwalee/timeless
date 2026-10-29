import { afterEach, describe, expect, it, vi } from "vitest";

const { client } = vi.hoisted(() => ({ client: vi.fn() }));
vi.mock("../sanity/lib/client", () => ({ getSanityClient: client }));
vi.mock("../sanity/lib/queries", () => ({ PRODUCTS_QUERY: "products", PRODUCT_QUERY: "product", JOURNAL_QUERY: "journal", JOURNAL_ENTRY_QUERY: "entry", IN_THE_WILD_QUERY: "wild", SETTINGS_QUERY: "settings" }));
vi.mock("../sanity/lib/image", () => ({ resolveSanityImage: vi.fn() }));

import { getProducts, getProduct, getJournalEntries, getGlobalSettings } from "../sanity/lib/fetch";

afterEach(() => vi.resetAllMocks());

describe("configured content failures", () => {
  it("does not replace a configured catalogue with independently priced fallback products", async () => {
    client.mockReturnValue({ fetch: vi.fn().mockRejectedValue(new Error("private provider error")) });
    await expect(getProducts()).rejects.toThrow("temporarily unavailable");
    await expect(getProduct("essential-tee")).rejects.toThrow("temporarily unavailable");
    await expect(getJournalEntries()).rejects.toThrow("temporarily unavailable");
    // The contact/navigation shell stays available without claiming product availability.
    await expect(getGlobalSettings()).resolves.toHaveProperty("navigation");
  });

  it("retains local content only when no CMS is configured", async () => {
    client.mockReturnValue(null);
    expect((await getProducts())[0].slug).toBe("essential-tee");
  });

  it("keeps a deliberately empty published catalogue empty", async () => {
    client.mockReturnValue({ fetch: vi.fn().mockResolvedValue([]) });
    expect(await getProducts()).toEqual([]);
  });
});
