import { getSupabaseServerClient } from "@/lib/supabase/server";
import { defaultLocale } from "@/i18n/routing";
import type {
  CommerceProvider,
  CurrencyCode,
  GetProductOptions,
  ListProductsOptions,
  Money,
  Product,
  ProductListItem,
} from "./types";

// --- helpers ---------------------------------------------------------------

type TranslationRow = { locale: string; title?: string; subtitle?: string | null };

// Pick the best translation: requested locale -> default (ko) -> en -> first.
function pickTranslation<T extends { locale: string }>(
  rows: T[] | null | undefined,
  locale: string,
): T | undefined {
  if (!rows?.length) return undefined;
  const order = [locale, defaultLocale, "en"];
  for (const l of order) {
    const found = rows.find((r) => r.locale === l);
    if (found) return found;
  }
  return rows[0];
}

function pickPrice(
  rows: { currency: string; amount_minor: number }[] | null | undefined,
  currency: CurrencyCode,
): Money | undefined {
  const row = rows?.find((r) => r.currency === currency);
  return row
    ? { currency: row.currency as CurrencyCode, amountMinor: Number(row.amount_minor) }
    : undefined;
}

// --- provider --------------------------------------------------------------

export const supabaseCommerce: CommerceProvider = {
  async listProducts({ locale, currency }: ListProductsOptions) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("product")
      .select(
        `id, handle, ip_franchise, image_url,
         product_translation ( locale, title, subtitle ),
         product_price ( currency, amount_minor )`,
      )
      .eq("status", "active")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((p): ProductListItem => {
      const tr = pickTranslation<TranslationRow>(p.product_translation, locale);
      return {
        id: p.id,
        handle: p.handle,
        title: tr?.title ?? p.handle,
        subtitle: tr?.subtitle ?? undefined,
        imageUrl: p.image_url ?? undefined,
        ipFranchise: p.ip_franchise ?? undefined,
        price: pickPrice(p.product_price, currency),
      };
    });
  },

  async getProduct({ handle, locale, currency }: GetProductOptions) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("product")
      .select(
        `id, handle, ip_franchise, image_url,
         product_translation ( locale, title, subtitle, description, seo_title, seo_desc ),
         product_price ( currency, amount_minor ),
         product_variant ( id, sku, position, variant_translation ( locale, label ) )`,
      )
      .eq("status", "active")
      .eq("handle", handle)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const tr = pickTranslation<
      TranslationRow & { description?: string; seo_title?: string; seo_desc?: string }
    >(data.product_translation, locale);

    const variants = (data.product_variant ?? [])
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((v) => {
        const vt = pickTranslation(v.variant_translation, locale);
        return {
          id: v.id,
          sku: v.sku ?? undefined,
          label: vt?.label ?? v.sku ?? "",
        };
      });

    const product: Product = {
      id: data.id,
      handle: data.handle,
      title: tr?.title ?? data.handle,
      subtitle: tr?.subtitle ?? undefined,
      description: tr?.description ?? undefined,
      seoTitle: tr?.seo_title ?? undefined,
      seoDesc: tr?.seo_desc ?? undefined,
      imageUrl: data.image_url ?? undefined,
      ipFranchise: data.ip_franchise ?? undefined,
      price: pickPrice(data.product_price, currency),
      variants,
    };
    return product;
  },
};
