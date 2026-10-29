"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  BAG_STORAGE_KEY,
  bagItemCount,
  bagReducer,
  bagTotal,
  initialBagState,
  parseStoredBag,
  serializeBag,
  type AddBagItem,
} from "@/lib/bag";
import { BagDrawer } from "./BagDrawer";
import { readStorage, writeStorage } from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";

type BagContextValue = {
  items: ReturnType<typeof parseStoredBag>;
  count: number;
  total: number;
  open: boolean;
  hydrated: boolean;
  persistent: boolean;
  openBag: () => void;
  closeBag: () => void;
  addItem: (item: AddBagItem) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearBag: () => void;
};

const BagContext = createContext<BagContextValue | null>(null);

export function BagProvider({
  children,
  whatsappNumber,
}: {
  children: ReactNode;
  whatsappNumber?: string;
}) {
  const [state, dispatch] = useReducer(bagReducer, initialBagState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = readStorage("localStorage", BAG_STORAGE_KEY);
    dispatch({ type: "hydrate", items: parseStoredBag(stored.value), persistent: stored.available });
    const sync = (event: StorageEvent) => {
      if (event.key === BAG_STORAGE_KEY) {
        dispatch({ type: "hydrate", items: parseStoredBag(event.newValue) });
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (state.hydrated) {
      const available = writeStorage("localStorage", BAG_STORAGE_KEY, serializeBag(state.items));
      if (available !== state.persistent) dispatch({ type: "storage", available });
    }
  }, [state.hydrated, state.items, state.persistent]);

  const addItem = useCallback((item: AddBagItem) => {
    dispatch({ type: "add", item });
    trackEvent("add_to_bag", { product_id: item.productId, variant_id: item.variantId, size: item.size, quantity: item.quantity || 1, currency: item.currency, value: item.price / 100 });
    setOpen(true);
  }, []);

  const value = useMemo<BagContextValue>(() => ({
    items: state.items,
    count: state.hydrated ? bagItemCount(state.items) : 0,
    total: bagTotal(state.items),
    open,
    hydrated: state.hydrated,
    persistent: state.persistent,
    openBag: () => setOpen(true),
    closeBag: () => setOpen(false),
    addItem,
    setQuantity: (key, quantity) => { dispatch({ type: "quantity", key, quantity }); trackEvent("update_bag", { action: "quantity", quantity }); },
    removeItem: (key) => { dispatch({ type: "remove", key }); trackEvent("update_bag", { action: "remove" }); },
    clearBag: () => { dispatch({ type: "clear" }); trackEvent("update_bag", { action: "clear" }); },
  }), [addItem, open, state.persistent, state.hydrated, state.items]);

  return (
    <BagContext.Provider value={value}>
      {children}
      <BagDrawer whatsappNumber={whatsappNumber} />
    </BagContext.Provider>
  );
}

export function useBag() {
  const context = useContext(BagContext);
  if (!context) throw new Error("useBag must be used inside BagProvider");
  return context;
}
