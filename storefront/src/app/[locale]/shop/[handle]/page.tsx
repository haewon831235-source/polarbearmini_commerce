import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { commerce, formatMoney } from "@/lib/commerce";
import { localeCurrency, type Locale } from "@/i18n/routing";
import { AddToCart } from "@/components/add-to-cart";

export const dynamic = "force-dynamic";

type PageParams = { locale: string; handle: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, handle } = await params;
  const currency = localeCurrency[locale as Locale];
  const product = await commerce.getProduct({ handle, locale, currency });
  if (!product) return {};
  return {
    title: product.seoTitle ?? product.title,
    description: product.seoDesc ?? product.subtitle,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale, handle } = await params;
  setRequestLocale(locale);

  const currency = localeCurrency[locale as Locale];
  const product = await commerce.getProduct({ handle, locale, currency });
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10 text-sm text-muted-foreground">
              {product.ipFranchise ?? product.title}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.ipFranchise ? (
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              {product.ipFranchise}
            </p>
          ) : null}
          <h1 className="text-2xl font-bold">{product.title}</h1>
          {product.subtitle ? (
            <p className="mt-1 text-muted-foreground">{product.subtitle}</p>
          ) : null}

          {product.price ? (
            <p className="mt-4 text-2xl font-semibold">
              {formatMoney(product.price, locale)}
            </p>
          ) : null}

          <AddToCart handle={product.handle} variants={product.variants} />

          {product.description ? (
            <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
