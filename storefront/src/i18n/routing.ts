import { defineRouting } from "next-intl/routing";

// Supported locales. `ko` is the default (KR market); `ja` is a priority
// audience due to the anime-IP fandom. English is the global fallback.
export const locales = ["ko", "en", "ja", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

// Map a request country (Vercel `x-vercel-ip-country`) to a default locale.
// Used by the proxy to seed locale before next-intl runs its detection.
export const countryToLocale: Record<string, Locale> = {
  KR: "ko",
  JP: "ja",
  CN: "zh",
  TW: "zh",
  HK: "zh",
  MO: "zh",
};

// Currency shown per locale/region. Charged price is always the explicitly
// configured price for the region (no auto FX conversion) — see plan.
// Values intentionally match commerce `CurrencyCode`.
export const localeCurrency: Record<Locale, "KRW" | "JPY" | "CNY" | "USD"> = {
  ko: "KRW",
  ja: "JPY",
  zh: "CNY",
  en: "USD",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always prefix the path (/ko, /en, ...) for clean SEO + hreflang alternates.
  localePrefix: "always",
});
