"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/bag";
import { formatMoney } from "@/lib/money";
import { useBag } from "./BagProvider";

export function BagDrawer({ whatsappNumber }: { whatsappNumber?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const { items, total, open, closeBag, setQuantity, removeItem, clearBag } = useBag();
  const checkoutUrl = buildWhatsAppUrl(items, whatsappNumber);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className="bag-dialog m-0 ml-auto h-full max-h-none w-full max-w-xl bg-white p-0 text-black backdrop:bg-black/55"
      aria-labelledby="bag-title"
      onCancel={(event) => { event.preventDefault(); closeBag(); }}
      onClose={closeBag}
      onClick={(event) => { if (event.target === dialog.current) closeBag(); }}
    >
      <div className="flex h-full flex-col">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-black/15 px-5 md:px-8">
          <div>
            <p id="bag-title" className="text-sm uppercase tracking-[.14em]">Your bag</p>
            <p className="mt-1 text-[.65rem] text-black/45">{items.length} {items.length === 1 ? "selection" : "selections"}</p>
          </div>
          <button autoFocus type="button" onClick={closeBag} className="grid h-11 w-11 place-items-center" aria-label="Close bag">
            <X size={22} strokeWidth={1.3} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="display text-6xl">Nothing here yet.</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-black/50">Choose a colour and size, then add the piece to begin your order.</p>
            <Link href="/shop" onClick={closeBag} className="solid-button mt-10">Explore the drop</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-3 md:px-8">
              {items.map((item) => (
                <article key={item.key} className="grid grid-cols-[6.5rem_1fr] gap-5 border-b border-black/15 py-6">
                  <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                    <Image src={item.image} alt={item.imageAlt} fill sizes="110px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base leading-tight">{item.name}</h3>
                        <p className="mt-2 text-xs text-black/50">{item.colour} · {item.size}</p>
                      </div>
                      <button type="button" onClick={() => removeItem(item.key)} className="text-[.65rem] uppercase tracking-[.12em] text-black/45 underline-offset-4 hover:underline">Remove</button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-5">
                      <div className="flex h-10 items-center border border-black/20" aria-label={`Quantity for ${item.name}`}>
                        <button type="button" onClick={() => setQuantity(item.key, item.quantity - 1)} className="grid h-full w-10 place-items-center" aria-label={`Decrease ${item.name} quantity`}><Minus size={13} /></button>
                        <span className="min-w-8 text-center text-xs" aria-live="polite">{item.quantity}</span>
                        <button type="button" onClick={() => setQuantity(item.key, item.quantity + 1)} className="grid h-full w-10 place-items-center" aria-label={`Increase ${item.name} quantity`}><Plus size={13} /></button>
                      </div>
                      <p className="text-sm">{formatMoney(item.price * item.quantity, item.currency)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <footer className="shrink-0 border-t border-black/15 bg-white px-5 py-6 md:px-8">
              <div className="flex items-center justify-between text-lg"><span>Total</span><span>{formatMoney(total, items[0].currency)}</span></div>
              <p className="mt-2 text-xs text-black/45">Delivery is confirmed with you on WhatsApp.</p>
              {checkoutUrl ? (
                <a href={checkoutUrl} target="_blank" rel="noreferrer" className="solid-button mt-6 w-full" aria-label="Continue checkout on WhatsApp">Checkout on WhatsApp</a>
              ) : (
                <>
                  <button type="button" disabled className="solid-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-35">Checkout unavailable</button>
                  <p className="mt-3 text-xs leading-relaxed text-black/50" role="status">WhatsApp checkout is not configured yet. Your bag remains saved.</p>
                </>
              )}
              <div className="mt-5 min-h-6 text-center">
                {confirmingClear ? (
                  <p className="text-xs">Clear every item? <button type="button" onClick={() => { clearBag(); setConfirmingClear(false); }} className="ml-2 underline">Yes, clear</button><button type="button" onClick={() => setConfirmingClear(false)} className="ml-3 underline">Keep bag</button></p>
                ) : (
                  <button type="button" onClick={() => setConfirmingClear(true)} className="text-[.65rem] uppercase tracking-[.12em] text-black/45">Clear bag</button>
                )}
              </div>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}
