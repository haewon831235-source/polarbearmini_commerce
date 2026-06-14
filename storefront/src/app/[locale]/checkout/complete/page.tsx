import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CheckoutCompletePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ paymentId?: string }>;
}) {
  const { locale } = await params;
  const { paymentId } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("Complete");

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
        ✓
      </div>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("thanks")}</p>

      {paymentId ? (
        <p className="mt-6 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
          {t("orderNo")}: <span className="font-mono">{paymentId}</span>
        </p>
      ) : null}

      <Link
        href="/shop"
        className={`${buttonVariants({ variant: "outline" })} mt-8`}
      >
        {t("backToShop")}
      </Link>
    </div>
  );
}
