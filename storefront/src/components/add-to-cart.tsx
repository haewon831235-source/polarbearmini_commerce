"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { addToCartAction } from "@/lib/cart/actions";
import type { ProductVariant } from "@/lib/commerce";

export function AddToCart({
  handle,
  variants,
}: {
  handle: string;
  variants: ProductVariant[];
}) {
  const t = useTranslations("Product");
  const router = useRouter();
  const [variantId, setVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onAdd() {
    startTransition(async () => {
      await addToCartAction({ handle, variantId, qty });
      setAdded(true);
      router.refresh(); // update header cart count
      setTimeout(() => setAdded(false), 2000);
    });
  }

  return (
    <div className="mt-6 space-y-4">
      {variants.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium">
            {t("selectOption")}
          </label>
          <select
            value={variantId ?? ""}
            onChange={(e) => setVariantId(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">{t("quantity")}</label>
        <div className="flex items-center rounded-md border border-border">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-1 text-lg leading-none disabled:opacity-40"
            disabled={qty <= 1}
            aria-label="-"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-1 text-lg leading-none"
            aria-label="+"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={onAdd}
        disabled={isPending}
        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-60"
      >
        {added ? t("added") : t("addToCart")}
      </button>
    </div>
  );
}
