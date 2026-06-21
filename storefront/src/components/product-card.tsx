"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/commerce/money";
import type { ProductListItem } from "@/lib/commerce/types";

export function ProductCard({
  product,
  locale,
}: {
  product: ProductListItem;
  locale: string;
}) {
  const t = useTranslations("Product");
  const [revealed, setRevealed] = useState(false);
  const label = product.ipFranchise ?? product.title;

  return (
    <div className="group block overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-md">
      <div className="relative aspect-square bg-muted">
        {product.imageUrl && revealed ? (
          // Image is revealed — clicking it navigates to the product page.
          <Link href={`/shop/${product.handle}`} className="block h-full w-full">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          </Link>
        ) : product.imageUrl ? (
          // Cover: hides the image until the shopper taps to reveal it.
          <button
            type="button"
            onClick={() => setRevealed(true)}
            aria-label={t("revealImage")}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted-foreground/10 transition-colors hover:from-muted-foreground/10 hover:to-muted-foreground/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-muted-foreground"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            <span className="text-xs font-medium text-foreground/70">
              {t("revealImage")}
            </span>
          </button>
        ) : (
          // No image uploaded yet — fall back to a labelled placeholder link.
          <Link
            href={`/shop/${product.handle}`}
            className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10 text-xs text-muted-foreground"
          >
            {label}
          </Link>
        )}
      </div>
      <Link href={`/shop/${product.handle}`} className="block p-3">
        {product.ipFranchise ? (
          <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
            {product.ipFranchise}
          </p>
        ) : null}
        <h3 className="line-clamp-2 text-sm font-medium">{product.title}</h3>
        {product.price ? (
          <p className="mt-2 text-sm font-semibold">
            {formatMoney(product.price, locale)}
          </p>
        ) : null}
      </Link>
    </div>
  );
}
