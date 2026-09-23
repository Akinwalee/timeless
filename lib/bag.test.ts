import { describe, expect, it } from "vitest";
import {
  bagReducer,
  bagTotal,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  initialBagState,
  normalizeWhatsAppNumber,
  parseStoredBag,
  serializeBag,
  type AddBagItem,
} from "./bag";

const item: AddBagItem = {
  productId: "essential-tee",
  productSlug: "essential-tee",
  name: "Timeless Essential Tee",
  variantId: "black",
  colour: "Black",
  size: "M",
  price: 1_500_000,
  currency: "NGN",
  image: "/tee.jpg",
  imageAlt: "Black tee",
};

describe("bag", () => {
  it("adds identical selections by incrementing quantity", () => {
    const once = bagReducer(initialBagState, { type: "add", item });
    const twice = bagReducer(once, { type: "add", item: { ...item, quantity: 2 } });
    expect(twice.items).toHaveLength(1);
    expect(twice.items[0].quantity).toBe(3);
  });

  it("changes quantity, removes and totals items in minor units", () => {
    const added = bagReducer(initialBagState, { type: "add", item });
    const changed = bagReducer(added, { type: "quantity", key: added.items[0].key, quantity: 3 });
    expect(bagTotal(changed.items)).toBe(4_500_000);
    expect(bagReducer(changed, { type: "remove", key: changed.items[0].key }).items).toEqual([]);
  });

  it("round-trips valid storage and rejects old or malformed values", () => {
    const state = bagReducer(initialBagState, { type: "add", item });
    expect(parseStoredBag(serializeBag(state.items))).toEqual(state.items);
    expect(parseStoredBag('{"version":0,"items":[]}')).toEqual([]);
    expect(parseStoredBag("not-json")).toEqual([]);
  });

  it("formats a complete WhatsApp order without clearing state", () => {
    const state = bagReducer(initialBagState, { type: "add", item: { ...item, quantity: 2 } });
    const message = buildWhatsAppMessage(state.items);
    expect(message).toContain("Colour: Black");
    expect(message).toContain("Size: M");
    expect(message).toContain("Quantity: 2");
    expect(message).toContain("ORDER TOTAL: ₦30,000");
    expect(buildWhatsAppUrl(state.items, "+234 800 123 4567")).toContain("wa.me/2348001234567");
    expect(state.items).toHaveLength(1);
  });

  it("disables checkout for a missing or invalid number", () => {
    expect(normalizeWhatsAppNumber("+234 (800) 123-4567")).toBe("2348001234567");
    expect(buildWhatsAppUrl([{ ...item, key: "key", quantity: 1 }], "123")).toBeNull();
    expect(buildWhatsAppUrl([], "+2348001234567")).toBeNull();
  });
});
