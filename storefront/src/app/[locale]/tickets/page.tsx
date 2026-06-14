import { getTranslations, setRequestLocale } from "next-intl/server";

// Ticketing is phase 2 (A6). Shown as "coming soon" for now.
export default async function TicketsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("Nav");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-3 text-3xl font-bold">{tNav("tickets")}</h1>
      <p className="text-muted-foreground">{tNav("ticketsBadge")}</p>
    </div>
  );
}
