"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product, ProductVariant } from "@/lib/content";
import { useBag } from "@/components/bag/BagProvider";

type ProductSelection = {
  product: Product;
  variant?: ProductVariant;
  variantId: string;
  size: string;
  added: boolean;
  selectVariant: (id: string) => void;
  selectSize: (size: string) => void;
  add: () => void;
};

const SelectionContext = createContext<ProductSelection | null>(null);

export function ProductSelectionProvider({ product, children }: { product: Product; children: ReactNode }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id || "");
  const [size, setSize] = useState("");
  const [addedSelection, setAddedSelection] = useState("");
  const { addItem } = useBag();
  const variant = product.variants.find((item) => item.id === variantId) || product.variants[0];
  const selection = `${variant?.id}:${size}`;

  const selectVariant = (id: string) => { setVariantId(id); setAddedSelection(""); };
  const selectSize = (value: string) => { setSize(value); setAddedSelection(""); };
  const add = () => {
    if (!variant || !product.sizes.includes(size) || product.status !== "available") return;
    addItem({
      productId: product.id, productSlug: product.slug, name: product.name,
      variantId: variant.id, colour: variant.name, size,
      price: product.price, currency: product.currency,
      image: variant.primaryImage.src, imageAlt: variant.primaryImage.alt,
    });
    setAddedSelection(selection);
  };

  return <SelectionContext.Provider value={{ product, variant, variantId, size, added: addedSelection === selection, selectVariant, selectSize, add }}>{children}</SelectionContext.Provider>;
}

export function useProductSelection() {
  const selection = useContext(SelectionContext);
  if (!selection) throw new Error("Product selection must be inside ProductSelectionProvider");
  return selection;
}
