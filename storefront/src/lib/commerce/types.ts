// Commerce domain types — the stable contract the storefront UI depends on.
// Phase B implements this against Supabase; Phase A swaps in a Medusa-backed
// implementation WITHOUT changing these types or the UI. (See plan guardrail.)

export type CurrencyCode = "KRW" | "JPY" | "USD" | "CNY";

export interface Money {
  currency: CurrencyCode;
  /** Amount in the currency's smallest unit (KRW/JPY exp 0, USD/CNY exp 2). */
  amountMinor: number;
}

export interface ProductVariant {
  id: string;
  sku?: string;
  /** Localized option label, e.g. "L" / "ブラック". */
  label: string;
}

export interface ProductListItem {
  id: string;
  handle: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  ipFranchise?: string;
  price?: Money;
}

export interface Product extends ProductListItem {
  description?: string;
  seoTitle?: string;
  seoDesc?: string;
  variants: ProductVariant[];
}

export interface ListProductsOptions {
  locale: string;
  currency: CurrencyCode;
}

export interface GetProductOptions extends ListProductsOptions {
  handle: string;
}

/** The interface any commerce backend (Supabase now, Medusa later) must satisfy. */
export interface CommerceProvider {
  listProducts(opts: ListProductsOptions): Promise<ProductListItem[]>;
  getProduct(opts: GetProductOptions): Promise<Product | null>;
}
