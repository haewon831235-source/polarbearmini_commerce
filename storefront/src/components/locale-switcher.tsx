"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

// Client-side locale switcher. Navigates to the same path under the chosen
// locale; next-intl persists the choice in the NEXT_LOCALE cookie.
export function LocaleSwitcher() {
  const t = useTranslations("LocaleNames");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <label className="inline-flex items-center gap-1 text-sm">
      <span className="sr-only">{tNav("language")}</span>
      <select
        aria-label={tNav("language")}
        value={locale}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as Locale;
          startTransition(() => {
            router.replace(pathname, { locale: next });
          });
        }}
        className="rounded-md border border-border bg-background px-2 py-1 text-sm"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {t(l)}
          </option>
        ))}
      </select>
    </label>
  );
}
