import { formatMoney } from "./money";

export const BAG_STORAGE_KEY = "timeless:bag:v1";
export const BAG_STORAGE_VERSION = 1;

export type BagItem = {
  key: string;
  productId: string;
  productSlug: string;
  name: string;
  variantId: string;
  colour: string;
  size: string;
  quantity: number;
  price: number;
  currency: string;
  image: string;
  imageAlt: string;
};

export type AddBagItem = Omit<BagItem, "key" | "quantity"> & { quantity?: number };

export type BagState = { items: BagItem[]; hydrated: boolean; persistent: boolean };

export type BagAction =
  | { type: "hydrate"; items: BagItem[]; persistent?: boolean }
  | { type: "storage"; available: boolean }
  | { type: "add"; item: AddBagItem }
  | { type: "quantity"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "clear" };

export const initialBagState: BagState = { items: [], hydrated: false, persistent: true };

export function bagItemKey(item: Pick<BagItem, "productId" | "variantId" | "size">) {
  return `${item.productId}:${item.variantId}:${item.size}`;
}

export function bagReducer(state: BagState, action: BagAction): BagState {
  if (action.type === "hydrate") return { items: action.items, hydrated: true, persistent: action.persistent ?? state.persistent };
  if (action.type === "storage") return { ...state, persistent: action.available };
  if (action.type === "clear") return { ...state, items: [] };
  if (action.type === "remove") return { ...state, items: state.items.filter((item) => item.key !== action.key) };
  if (action.type === "quantity") {
    if (action.quantity < 1) return { ...state, items: state.items.filter((item) => item.key !== action.key) };
    return {
      ...state,
      items: state.items.map((item) =>
        item.key === action.key
          ? { ...item, quantity: Math.min(99, Math.floor(action.quantity)) }
          : item,
      ),
    };
  }

  const key = bagItemKey(action.item);
  const quantity = Math.max(1, Math.min(99, Math.floor(action.item.quantity || 1)));
  const existing = state.items.find((item) => item.key === key);
  if (existing) {
    return {
      ...state,
      items: state.items.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
          : item,
      ),
    };
  }
  return { ...state, items: [...state.items, { ...action.item, key, quantity }] };
}

export function serializeBag(items: BagItem[]) {
  return JSON.stringify({ version: BAG_STORAGE_VERSION, items });
}

export function parseStoredBag(value: string | null): BagItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as { version?: number; items?: unknown };
    if (parsed.version !== BAG_STORAGE_VERSION || !Array.isArray(parsed.items)) return [];
    return parsed.items.slice(0, 100).flatMap((candidate) => {
      if (!candidate || typeof candidate !== "object") return [];
      const item = candidate as Partial<BagItem>;
      const textFields = [item.productId, item.productSlug, item.name, item.variantId, item.colour, item.size, item.imageAlt];
      if (textFields.some((value) => typeof value !== "string" || !value.trim() || value.length > 500)) return [];
      if (typeof item.image !== "string" || item.image.length > 2000) return [];
      const localImage = item.image.startsWith("/") && !item.image.startsWith("//");
      let sanityImage = false;
      try {
        const url = new URL(item.image);
        sanityImage = url.protocol === "https:" && url.hostname === "cdn.sanity.io";
      } catch { /* A local image does not need a URL origin. */ }
      if (!localImage && !sanityImage) return [];
      if (!Number.isSafeInteger(item.price) || item.price! < 0 ||
          typeof item.currency !== "string" || !/^[A-Z]{3}$/.test(item.currency) ||
          typeof item.quantity !== "number" || !Number.isFinite(item.quantity)) return [];
      return [{
        ...item,
        key: bagItemKey(item as BagItem),
        quantity: Math.max(1, Math.min(99, Math.floor(item.quantity))),
      } as BagItem];
    });
  } catch {
    return [];
  }
}

export function bagItemCount(items: BagItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function bagTotal(items: BagItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function normalizeWhatsAppNumber(number?: string) {
  const normalized = (number || "").replace(/\D/g, "");
  return normalized.length >= 8 ? normalized : "";
}

export function buildWhatsAppMessage(items: BagItem[]) {
  const currency = items[0]?.currency || "NGN";
  const lines = ["TIMELESS ORDER REQUEST", ""];
  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name}`,
      `Colour: ${item.colour}`,
      `Size: ${item.size}`,
      `Quantity: ${item.quantity}`,
      `Unit price: ${formatMoney(item.price, item.currency)}`,
      `Line total: ${formatMoney(item.price * item.quantity, item.currency)}`,
      "",
    );
  });
  lines.push(`ITEMS SUBTOTAL: ${formatMoney(bagTotal(items), currency)}`, "", "Shipping is additional and will be quoted after I share my delivery address.", "Please confirm current availability and the final total before payment.");
  return lines.join("\n");
}

export function buildWhatsAppUrl(items: BagItem[], number?: string) {
  const normalized = normalizeWhatsAppNumber(number);
  if (!normalized || items.length === 0) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(buildWhatsAppMessage(items))}`;
}
