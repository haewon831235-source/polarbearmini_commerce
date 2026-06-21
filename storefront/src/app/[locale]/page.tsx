import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { commerce } from "@/lib/commerce";
import { localeCurrency, type Locale } from "@/i18n/routing";
import { ProductCard } from "@/components/product-card";

// Featured goods are read from Supabase at request time (prototype).
export const dynamic = "force-dynamic";

// Reference IP from the company's real performance portfolio (shown as brand
// proof). Replace with CMS-driven campaign content in phase A.
const IP_REFERENCES = [
  "Attack on Titan",
  "Jujutsu Kaisen",
  "Final Fantasy",
  "The Lion King",
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const tNav = await getTranslations("Nav");

  const currency = localeCurrency[locale as Locale];
  const featured = await commerce.listProducts({ locale, currency });

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="flex flex-col items-start gap-6 py-20">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          {t("heroSubtitle")}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/shop" className={buttonVariants({ size: "lg" })}>
            {t("heroCta")}
          </Link>
          <a
            href="https://star.polarisatelierkorea.com/mypage"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            {tNav("starMypage")}
            <span className="ml-2 flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>
              <span className="animate-pulse text-[10px] font-medium text-red-500">{tNav("live")}</span>
            </span>
          </a>
        </div>
      </section>

      {/* Featured goods */}
      <section className="py-10">
        <h2 className="mb-6 text-2xl font-semibold">{t("featuredTitle")}</h2>
        {/* Lion King MD 리스트 배너 — 민트 필터 적용 */}
        <div className="mb-6 overflow-hidden rounded-xl border border-border">
          <a href="/lion-king-md.png" target="_blank" rel="noopener noreferrer">
            <img
              src="/lion-king-md.png"
              alt="The Lion King Live in Concert — MD 리스트"
              className="w-full object-contain"
              style={{ filter: "hue-rotate(135deg) saturate(0.9) brightness(0.97)" }}
            />
          </a>
        </div>
        {featured.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            {t("featuredEmpty")}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {/* IP references */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold">{t("ipTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("ipSubtitle")}</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {IP_REFERENCES.map((ip) => (
            <div
              key={ip}
              className="flex aspect-video items-center justify-center rounded-lg border border-border bg-muted/40 p-4 text-center text-sm font-medium"
            >
              {ip}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
