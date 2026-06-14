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
      <p className="mb-6 text-muted-foreground">{t("subtitle")}</p>
      <iframe
        src="https://acosta-korea.co.kr/board/product/list.html?board_no=4&category_no=1"
        className="h-[80vh] w-full rounded-lg border border-border"
        title={t("title")}
      />
    </div>
  );
}
