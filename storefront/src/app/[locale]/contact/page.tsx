import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("Nav");
  const tFooter = await getTranslations("Footer");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">{tNav("contact")}</h1>
      <p className="text-muted-foreground">
        {tFooter("contactLabel")}: {tFooter("contact")}
      </p>
    </div>
  );
}
