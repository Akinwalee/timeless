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

type BagContextValue = {
  items: ReturnType<typeof parseStoredBag>;
  count: number;
  total: number;
  open: boolean;
  hydrated: boolean;
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
    dispatch({ type: "hydrate", items: parseStoredBag(window.localStorage.getItem(BAG_STORAGE_KEY)) });
    const sync = (event: StorageEvent) => {
      if (event.key === BAG_STORAGE_KEY) {
        dispatch({ type: "hydrate", items: parseStoredBag(event.newValue) });
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (state.hydrated) window.localStorage.setItem(BAG_STORAGE_KEY, serializeBag(state.items));
  }, [state.hydrated, state.items]);

  const addItem = useCallback((item: AddBagItem) => {
    dispatch({ type: "add", item });
    setOpen(true);
  }, []);

  const value = useMemo<BagContextValue>(() => ({
    items: state.items,
    count: state.hydrated ? bagItemCount(state.items) : 0,
    total: bagTotal(state.items),
    open,
    hydrated: state.hydrated,
    openBag: () => setOpen(true),
    closeBag: () => setOpen(false),
    addItem,
    setQuantity: (key, quantity) => dispatch({ type: "quantity", key, quantity }),
    removeItem: (key) => dispatch({ type: "remove", key }),
    clearBag: () => dispatch({ type: "clear" }),
  }), [addItem, open, state.hydrated, state.items]);

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
