import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { getCart } from "@/lib/cart/service";
import { formatMoney } from "@/lib/commerce";
import { localeCurrency, type Locale } from "@/i18n/routing";
import { CartLineControls } from "@/components/cart-line-controls";

export const dynamic = "force-dynamic";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Cart");
  const tNav = await getTranslations("Nav");

  const currency = localeCurrency[locale as Locale];
  const cart = await getCart({ locale, currency });

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold">{t("title")}</h1>
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
          {t("empty")}
        </div>
        <div className="mt-6">
          <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
            {tNav("shop")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">{t("title")}</h1>

      <ul className="divide-y divide-border border-y border-border">
        {cart.lines.map((line) => (
          <li key={line.key} className="flex gap-4 py-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
              {line.imageUrl ? (
                <Image
                  src={line.imageUrl}
                  alt={line.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10 p-1 text-center text-[10px] text-muted-foreground">
                  {line.title}
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-sm font-medium">{line.title}</p>
                {line.variantLabel ? (
                  <p className="text-xs text-muted-foreground">
                    {line.variantLabel}
                  </p>
                ) : null}
              </div>
              <CartLineControls
                handle={line.handle}
                variantId={line.variantId}
                qty={line.qty}
              />
            </div>

            <div className="text-right text-sm font-semibold">
              {formatMoney(
                { currency: cart.currency, amountMinor: line.lineTotalMinor },
                locale,
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{t("subtotal")}</span>
        <span className="text-lg font-bold">
          {formatMoney(cart.subtotal, locale)}
        </span>
      </div>

      <Link
        href="/checkout"
        className={`${buttonVariants({ size: "lg" })} mt-6 w-full`}
      >
        {t("checkout")}
      </Link>
    </div>
  );
}
