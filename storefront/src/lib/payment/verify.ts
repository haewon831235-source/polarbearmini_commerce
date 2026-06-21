"use server";

import { getCart } from "@/lib/cart/service";
import { writeCartCookie } from "@/lib/cart/cookie";
import { getPortoneApiSecret } from "./portone";
import { recordPaymentOutcome } from "./record";
import { localeCurrency, type Locale } from "@/i18n/routing";

export type VerifyResult =
  | { ok: true; paymentId: string; amount: number }
  | { ok: false; reason: string; status?: string };

// Server-side payment verification (anti-tamper): re-derives the expected
// amount from the server cart and confirms the real paid amount/status with
// PortOne's API before treating the order as paid. Then clears the cart.
export async function verifyAndFinalizePayment(input: {
  paymentId: string;
  locale: string;
}): Promise<VerifyResult> {
  const secret = getPortoneApiSecret();
  // PortOne disabled: behave exactly as before, record nothing (no attempt
  // actually happened).
  if (!secret) return { ok: false, reason: "not-configured" };

  const currency = localeCurrency[input.locale as Locale];
  const cart = await getCart({ locale: input.locale, currency });
  const expected = cart.subtotal.amountMinor;
  if (expected <= 0) {
    await recordPaymentOutcome({
      paymentId: input.paymentId,
      status: "error",
      errorReason: "empty-cart",
    });
    return { ok: false, reason: "empty-cart" };
  }

  let payment: {
    status?: string;
    amount?: { total?: number };
    currency?: string;
  };
  try {
    const res = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(input.paymentId)}`,
      { headers: { Authorization: `PortOne ${secret}` }, cache: "no-store" },
    );
    if (!res.ok) {
      await recordPaymentOutcome({
        paymentId: input.paymentId,
        status: "failed",
        errorReason: "lookup-failed",
      });
      return { ok: false, reason: "lookup-failed" };
    }
    payment = await res.json();
  } catch {
    await recordPaymentOutcome({
      paymentId: input.paymentId,
      status: "error",
      errorReason: "lookup-error",
    });
    return { ok: false, reason: "lookup-error" };
  }

  const paid = payment?.amount?.total;
  const status = payment?.status;
  if (status === "PAID" && paid === expected) {
    await recordPaymentOutcome({
      paymentId: input.paymentId,
      status: "paid",
      pgStatus: status,
    });
    await writeCartCookie([]); // order placed → empty the cart
    return { ok: true, paymentId: input.paymentId, amount: paid };
  }
  await recordPaymentOutcome({
    paymentId: input.paymentId,
    status: "failed",
    errorReason: "verification-failed",
    pgStatus: status,
  });
  return { ok: false, reason: "verification-failed", status };
}
