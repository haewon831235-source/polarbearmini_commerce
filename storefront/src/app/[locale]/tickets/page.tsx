import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function TicketsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("Nav");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">{tNav("tickets")}</h1>
      <iframe
        src="https://nol.yanolja.com/ticket/products/26006618"
        className="mt-4 h-[80vh] w-full rounded-lg border border-border"
        title={tNav("tickets")}
      />
    </div>
  );
}
