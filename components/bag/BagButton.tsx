"use client";

import { useBag } from "./BagProvider";

export function BagButton({ className = "" }: { className?: string }) {
  const { count, openBag } = useBag();
  return (
    <button type="button" onClick={openBag} className={className} aria-label={`Open shopping bag with ${count} ${count === 1 ? "item" : "items"}`}>
      Bag ({count})
    </button>
  );
}
