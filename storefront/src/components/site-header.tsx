import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { getCartCount } from "@/lib/cart/service";

// Top navigation. Tickets is shown but flagged "coming soon" (phase 2).
export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const tBrand = await getTranslations("Brand");
  const cartCount = await getCartCount();

  const links = [
    { href: "/", label: t("home") },
    { href: "/shop", label: t("shop") },
    { href: "/campaigns", label: t("campaigns") },
    { href: "/tickets", label: t("tickets") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Image src="/logo.jpeg" alt="Polaris Atelier Korea" width={32} height={32} className="rounded-full" />
          {tBrand("name")}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              {link.badge ? (
                <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {link.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/cart"
            className="relative text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {t("cart")}
            {cartCount > 0 ? (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
