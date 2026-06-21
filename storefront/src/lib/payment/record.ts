"use server";

import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { getCart } from "@/lib/cart/service";
import { localeCurrency, type Locale } from "@/i18n/routing";

// Persists every payment ATTEMPT to shop_order so the admin dashboard can show
// payment progress + failure reasons. All functions are best-effort: any
// logging failure is swallowed so it can never block or break the real
// checkout flow. No-ops when Supabase is not configured.

export type OutcomeStatus = "paid" | "failed" | "error";
export type ErrorReason =
  | "empty-cart"
  | "lookup-failed"
  | "lookup-error"
  | "verification-failed"
  | "sdk-cancel"
  | "sdk-failure";

// Called when a payment attempt begins. Snapshots the server cart into
// shop_order (status 'started') + order_item. Re-reads the cart server-side so
// the recorded line items / amount are authoritative (client only sends ids).
export async function recordPaymentStarted(input: {
  paymentId: string;
  locale: string;
  orderName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}): Promise<void> {
  try {
    const supabase = getSupabaseServiceClient();
    if (!supabase) return;

    const currency = localeCurrency[input.locale as Locale] ?? "KRW";
    const cart = await getCart({ locale: input.locale, currency });

    const { data: order, error } = await supabase
      .from("shop_order")
      .upsert(
        {
          payment_id: input.paymentId,
          status: "started",
          order_name: input.orderName ?? cart.lines[0]?.title ?? null,
          amount_minor: cart.subtotal.amountMinor,
          currency,
          locale: input.locale,
          customer_name: input.customerName ?? null,
          customer_email: input.customerEmail ?? null,
          customer_phone: input.customerPhone ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "payment_id" },
      )
      .select("id")
      .single();

    if (error || !order) return;

    if (cart.lines.length > 0) {
      await supabase.from("order_item").insert(
        cart.lines.map((l) => ({
          order_id: order.id,
          handle: l.handle,
          variant_id: l.variantId,
          title: l.title,
          variant_label: l.variantLabel ?? null,
          unit_amount_minor: l.unitPrice?.amountMinor ?? 0,
          qty: l.qty,
          line_total_minor: l.lineTotalMinor,
        })),
      );
    }
  } catch {
    /* logging must never break checkout */
  }
}

// Called at each terminal outcome. Upserts on payment_id so it works even if
// the 'started' row was never written (e.g. SDK failed first).
export async function recordPaymentOutcome(input: {
  paymentId: string;
  status: OutcomeStatus;
  errorReason?: ErrorReason;
  pgStatus?: string;
}): Promise<void> {
  try {
    const supabase = getSupabaseServiceClient();
    if (!supabase) return;

    await supabase.from("shop_order").upsert(
      {
        payment_id: input.paymentId,
        status: input.status,
        error_reason: input.errorReason ?? null,
        pg_status: input.pgStatus ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "payment_id" },
    );
  } catch {
    /* logging must never break checkout */
  }
}
