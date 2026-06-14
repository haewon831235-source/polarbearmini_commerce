"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { setQtyAction, removeFromCartAction } from "@/lib/cart/actions";

export function CartLineControls({
  handle,
  variantId,
  qty,
}: {
  handle: string;
  variantId: string | null;
  qty: number;
}) {
  const t = useTranslations("Cart");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const change = (next: number) =>
    startTransition(async () => {
      await setQtyAction({ handle, variantId, qty: next });
      router.refresh();
    });

  const remove = () =>
    startTransition(async () => {
      await removeFromCartAction({ handle, variantId });
      router.refresh();
    });

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-md border border-border">
        <button
          onClick={() => change(qty - 1)}
          disabled={isPending}
          className="px-2.5 py-1 text-base leading-none disabled:opacity-40"
          aria-label="-"
        >
          −
        </button>
        <span className="min-w-7 text-center text-sm">{qty}</span>
        <button
          onClick={() => change(qty + 1)}
          disabled={isPending}
          className="px-2.5 py-1 text-base leading-none disabled:opacity-40"
          aria-label="+"
        >
          +
        </button>
      </div>
      <button
        onClick={remove}
        disabled={isPending}
        className="text-xs text-muted-foreground underline-offset-2 hover:underline disabled:opacity-40"
      >
        {t("remove")}
      </button>
    </div>
  );
}
