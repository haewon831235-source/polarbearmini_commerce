import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  const rows: Array<[string, string]> = [
    [t("companyLabel"), t("company")],
    [t("ceoLabel"), t("ceo")],
    [t("bizNumberLabel"), t("bizNumber")],
    [t("mailOrderLabel"), t("mailOrder")],
    [t("addressLabel"), t("address")],
    [t("contactLabel"), t("contact")],
  ];

  return (
    <footer className="mt-16 border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-x-8 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <span className="shrink-0 font-medium text-foreground">
                {label}
              </span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        <nav className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/legal/terms" className="hover:text-foreground">
            {t("terms")}
          </Link>
          <Link href="/legal/privacy" className="hover:text-foreground">
            {t("privacy")}
          </Link>
          <Link href="/legal/refund" className="hover:text-foreground">
            {t("refund")}
          </Link>
        </nav>

        <p className="mt-6 text-xs text-muted-foreground">{t("rights")}</p>
      </div>
    </footer>
  );
}
