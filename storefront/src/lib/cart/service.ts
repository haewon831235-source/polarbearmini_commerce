import { commerce, type CurrencyCode, type Money } from "@/lib/commerce";
import { readCartCookie, cartKey } from "./cookie";

export interface CartLine {
  key: string;
  handle: string;
  variantId: string | null;
  title: string;
  variantLabel?: string;
  imageUrl?: string;
  unitPrice?: Money;
  qty: number;
  lineTotalMinor: number;
}

export interface Cart {
  lines: CartLine[];
  currency: CurrencyCode;
  subtotal: Money;
  count: number;
}

// Resolve the cookie's item refs into full cart lines for the given locale/currency.
export async function getCart(opts: {
  locale: string;
  currency: CurrencyCode;
}): Promise<Cart> {
  const refs = await readCartCookie();
  const lines: CartLine[] = [];

  for (const ref of refs) {
    const product = await commerce.getProduct({
      handle: ref.handle,
      locale: opts.locale,
      currency: opts.currency,
    });
    if (!product) continue;
    const variant = ref.variantId
      ? product.variants.find((v) => v.id === ref.variantId)
      : undefined;
    const unit = product.price;
    const lineTotalMinor = (unit?.amountMinor ?? 0) * ref.qty;
    lines.push({
      key: cartKey(ref.handle, ref.variantId),
      handle: ref.handle,
      variantId: ref.variantId,
      title: product.title,
      variantLabel: variant?.label,
      imageUrl: product.imageUrl,
      unitPrice: unit,
      qty: ref.qty,
      lineTotalMinor,
    });
  }

  const subtotalMinor = lines.reduce((s, l) => s + l.lineTotalMinor, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return {
    lines,
    currency: opts.currency,
    subtotal: { currency: opts.currency, amountMinor: subtotalMinor },
    count,
  };
}

export async function getCartCount(): Promise<number> {
  const refs = await readCartCookie();
  return refs.reduce((s, r) => s + r.qty, 0);
}
