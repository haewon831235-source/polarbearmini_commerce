"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { verifyAndFinalizePayment } from "@/lib/payment/verify";

export function PortonePayButton({
  storeId,
  channelKey,
  orderName,
  totalAmount,
  locale,
  payLabel,
}: {
  storeId: string;
  channelKey: string;
  orderName: string;
  totalAmount: number;
  locale: string;
  payLabel: string;
}) {
  const t = useTranslations("Checkout");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function pay() {
    setError(null);
    // Unique payment id per attempt (PortOne requirement).
    const paymentId = `order-${crypto.randomUUID()}`;

    let response;
    try {
      // Loaded lazily (browser-only SDK).
      const { requestPayment, Currency, PaymentPayMethod } = await import(
        "@portone/browser-sdk/v2"
      );
      response = await requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName,
        totalAmount,
        currency: Currency.KRW,
        payMethod: PaymentPayMethod.CARD,
        customer: {
          fullName: name || undefined,
          email: email || undefined,
          phoneNumber: phone || undefined,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return;
    }

    // A non-empty `code` means the payment failed or was cancelled.
    if (response?.code != null) {
      setError(response.message ?? t("payError"));
      return;
    }

    startTransition(async () => {
      const result = await verifyAndFinalizePayment({ paymentId, locale });
      if (result.ok) {
        router.push(`/checkout/complete?paymentId=${encodeURIComponent(paymentId)}`);
      } else {
        setError(t("payError"));
      }
    });
  }

  const field =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";

  return (
    <div className="space-y-3">
      <input
        className={field}
        placeholder={t("name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className={field}
        type="email"
        placeholder={t("email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className={field}
        placeholder={t("phone")}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {error ? (
        <p className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}

      <button
        onClick={pay}
        disabled={isPending}
        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {isPending ? t("processing") : payLabel}
      </button>
    </div>
  );
}
