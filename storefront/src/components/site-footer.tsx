import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="mt-16 border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <nav className="flex flex-wrap gap-4 text-sm">
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
