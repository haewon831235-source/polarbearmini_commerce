import { LegalPage } from "@/components/legal-page";

export default async function RefundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalPage locale={locale} titleKey="refundTitle" />;
}
