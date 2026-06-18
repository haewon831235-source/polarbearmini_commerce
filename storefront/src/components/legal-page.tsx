import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

export async function LegalPage({
  locale,
  titleKey,
  children,
}: {
  locale: string;
  titleKey: "termsTitle" | "privacyTitle" | "refundTitle";
  children?: ReactNode;
}) {
  setRequestLocale(locale);
  const t = await getTranslations("Legal");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t(titleKey)}</h1>
      {children ?? <p className="text-muted-foreground">{t("placeholder")}</p>}
    </div>
  );
}
