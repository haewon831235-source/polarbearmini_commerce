import { getTranslations, setRequestLocale } from "next-intl/server";
import { commerce } from "@/lib/commerce";
import { localeCurrency, type Locale } from "@/i18n/routing";
import { ProductCard } from "@/components/product-card";

// Reads from Supabase at request time. Phase A switches to ISR for SEO.
export const dynamic = "force-dynamic";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("Nav");
  const tHome = await getTranslations("Home");

  const currency = localeCurrency[locale as Locale];
  const products = await commerce.listProducts({ locale, currency });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">{tNav("shop")}</h1>
      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
          {tHome("featuredEmpty")}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
