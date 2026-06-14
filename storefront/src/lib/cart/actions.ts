"use server";

import { revalidatePath } from "next/cache";
import { readCartCookie, writeCartCookie, cartKey, type CartItemRef } from "./cookie";

async function mutate(fn: (items: CartItemRef[]) => CartItemRef[]) {
  const items = await readCartCookie();
  await writeCartCookie(fn(items));
  // Refresh server components that read the cart (header badge, cart page).
  revalidatePath("/", "layout");
}

export async function addToCartAction(input: {
  handle: string;
  variantId: string | null;
  qty?: number;
}) {
  const qty = Math.max(1, input.qty ?? 1);
  await mutate((items) => {
    const key = cartKey(input.handle, input.variantId);
    const existing = items.find((i) => cartKey(i.handle, i.variantId) === key);
    if (existing) existing.qty += qty;
    else items.push({ handle: input.handle, variantId: input.variantId, qty });
    return items;
  });
}

export async function setQtyAction(input: {
  handle: string;
  variantId: string | null;
  qty: number;
}) {
  await mutate((items) => {
    const key = cartKey(input.handle, input.variantId);
    if (input.qty <= 0) {
      return items.filter((i) => cartKey(i.handle, i.variantId) !== key);
    }
    const item = items.find((i) => cartKey(i.handle, i.variantId) === key);
    if (item) item.qty = input.qty;
    return items;
  });
}

export async function removeFromCartAction(input: {
  handle: string;
  variantId: string | null;
}) {
  await mutate((items) =>
    items.filter(
      (i) => cartKey(i.handle, i.variantId) !== cartKey(input.handle, input.variantId),
    ),
  );
}
