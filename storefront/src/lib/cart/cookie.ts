import { cookies } from "next/headers";

// Cart is persisted in a cookie as a small list of item refs. Resolving to
// full product/price data happens at read time via the commerce provider.
const CART_COOKIE = "pbm_cart";

export interface CartItemRef {
  handle: string;
  variantId: string | null;
  qty: number;
}

export function cartKey(handle: string, variantId: string | null): string {
  return `${handle}::${variantId ?? ""}`;
}

export async function readCartCookie(): Promise<CartItemRef[]> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

export async function writeCartCookie(items: CartItemRef[]): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify({ items }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
