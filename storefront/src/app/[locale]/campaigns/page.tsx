import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function CampaignsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Campaigns");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mb-8 text-muted-foreground">{t("subtitle")}</p>

      <div className="flex flex-col gap-4">
        <a
          href="https://acosta-korea.co.kr/board/product/list.html?board_no=4&category_no=1"
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

        <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
          <div className="relative aspect-[3/4] w-full max-w-sm mx-auto">
            <Image
              src="/campaigns/rabius.jpg"
              alt={t("rabiusTitle")}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold">{t("rabiusTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("rabiusDesc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
