import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCart } from "@/lib/cart/service";
import { formatMoney } from "@/lib/commerce";
import { localeCurrency, type Locale } from "@/i18n/routing";
import { getPortoneConfig } from "@/lib/payment/portone";
import { PortonePayButton } from "@/components/portone-pay-button";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Checkout");

  const currency = localeCurrency[locale as Locale];
  const cart = await getCart({ locale, currency });

  if (cart.lines.length === 0) {
    redirect({ href: "/cart", locale });
  }

  // PortOne (KR PGs) handles KRW. Live only when keys are configured.
  const portone = getPortoneConfig();
  const paymentEnabled = Boolean(portone) && currency === "KRW";

  const first = cart.lines[0];
  const orderName =
    cart.lines.length > 1
      ? `${first.title} 외 ${cart.lines.length - 1}건`
      : first.title;

  const methods = [
    t("methodToss"),
    t("methodKakao"),
    t("methodNaver"),
    t("methodCard"),
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Order summary */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">{t("orderSummary")}</h2>
          <ul className="divide-y divide-border border-y border-border text-sm">
            {cart.lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-4 py-3">
                <span>
                  {line.title}
                  {line.variantLabel ? ` · ${line.variantLabel}` : ""}
                  <span className="text-muted-foreground"> × {line.qty}</span>
                </span>
                <span className="shrink-0 font-medium">
                  {formatMoney(
                    { currency: cart.currency, amountMinor: line.lineTotalMinor },
                    locale,
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between text-base font-bold">
            <span>{t("total")}</span>
            <span>{formatMoney(cart.subtotal, locale)}</span>
          </div>
        </section>

        {/* Payment */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">{t("paymentSection")}</h2>

          {paymentEnabled && portone ? (
            <PortonePayButton
              storeId={portone.storeId}
              channelKey={portone.channelKey}
              orderName={orderName}
              totalAmount={cart.subtotal.amountMinor}
              locale={locale}
              payLabel={`${formatMoney(cart.subtotal, locale)} ${t("pay")}`}
            />
          ) : (
            <>
              <div className="space-y-2">
                {methods.map((m, i) => (
                  <label
                    key={m}
                    className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm"
                  >
                    <input
                      type="radio"
                      name="paymethod"
                      defaultChecked={i === 0}
                      disabled
                    />
                    {m}
                  </label>
                ))}
              </div>
              <p className="mt-4 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                {t("pendingNote")}
              </p>
              <button
                disabled
                className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground opacity-60"
              >
                {formatMoney(cart.subtotal, locale)}
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
