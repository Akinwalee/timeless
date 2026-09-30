import type { ProductVariant } from "@/lib/content";

export function ProductColourSelector({
  variants,
  selectedId,
  onChange,
  onIntent,
  className = "",
}: {
  variants: ProductVariant[];
  selectedId: string;
  onChange: (id: string) => void;
  onIntent?: (id: string) => void;
  className?: string;
}) {
  const selected = variants.find((variant) => variant.id === selectedId);

  return (
    <fieldset className={`product-colour-selector ${className}`}>
      <legend className="mb-3 text-xs uppercase tracking-[.12em]">
        Colour <span className="ml-3 normal-case tracking-normal text-black/50">{selected?.name}</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => onChange(variant.id)}
            onFocus={() => onIntent?.(variant.id)}
            onPointerEnter={() => onIntent?.(variant.id)}
            aria-pressed={variant.id === selectedId}
            className={`min-h-11 min-w-11 border px-4 text-xs transition-colors ${variant.id === selectedId ? "border-black bg-black text-white" : "border-black/25 hover:border-black"}`}
          >
            {variant.name}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
