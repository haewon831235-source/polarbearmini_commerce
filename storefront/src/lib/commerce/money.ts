import type { CurrencyCode, Money } from "./types";

// Number of decimal places per currency. KRW and JPY have none.
const CURRENCY_EXPONENT: Record<CurrencyCode, number> = {
  KRW: 0,
  JPY: 0,
  USD: 2,
  CNY: 2,
};

/** Format a Money value for display in the given locale (e.g. "₩18,000"). */
export function formatMoney(money: Money, locale: string): string {
  const exponent = CURRENCY_EXPONENT[money.currency];
  const value = money.amountMinor / 10 ** exponent;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
  }).format(value);
}
