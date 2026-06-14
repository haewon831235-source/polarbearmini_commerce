import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function TicketsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("Nav");
  const t = await getTranslations("Tickets");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{tNav("tickets")}</h1>
      <p className="mb-8 text-muted-foreground">{t("subtitle")}</p>

      <a
        href="https://nol.yanolja.com/ticket/products/26006618"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col gap-4 rounded-xl border border-border bg-muted/30 p-8 transition-colors hover:bg-muted/60"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{t("cardTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("cardDesc")}</p>
          </div>
          <span className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            {t("cardCta")} →
          </span>
        </div>
      </a>
    </div>
  );
}
