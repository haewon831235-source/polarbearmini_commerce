import { getTranslations, setRequestLocale } from "next-intl/server";

// Shared shell for legal pages (terms/privacy/refund). Real content is a
// legal/ops deliverable to be filled in before launch (see plan §5).
export async function LegalPage({
  locale,
  titleKey,
}: {
  locale: string;
  titleKey: "termsTitle" | "privacyTitle" | "refundTitle";
}) {
  setRequestLocale(locale);
  const t = await getTranslations("Legal");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">{t(titleKey)}</h1>
      <p className="text-muted-foreground">{t("placeholder")}</p>
    </div>
  );
}
