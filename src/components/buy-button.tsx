"use client";

import { useState } from "react";
import { saveOrder } from "@/lib/orders";

type BuyButtonProps = {
  nftId: string;
  label?: string;
  className?: string;
};

type CheckoutResponse = {
  paymentId?: string;
  nftId?: string;
  checkoutUrl?: string;
  amount?: string;
  currency?: string;
  error?: string;
};

export function BuyButton({
  nftId,
  label = "Buy with Hypertron",
  className = "card-action",
}: BuyButtonProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nftId }),
      });
      const payload = (await response.json()) as CheckoutResponse;
      if (!response.ok || !payload.checkoutUrl || !payload.paymentId || !payload.nftId) {
        throw new Error(payload.error || "Could not open Hypertron checkout.");
      }
      saveOrder({
        paymentId: payload.paymentId,
        nftId: payload.nftId,
        checkoutUrl: payload.checkoutUrl,
        amount: payload.amount ?? "",
        currency: payload.currency ?? "XLM",
        createdAt: new Date().toISOString(),
      });
      const back = new URL("/collection", window.location.origin);
      back.searchParams.set("nft", payload.nftId);
      back.searchParams.set("payment", payload.paymentId);
      const checkout = new URL(payload.checkoutUrl);
      checkout.searchParams.set("return", back.toString());
      window.location.assign(checkout.toString());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not open Hypertron checkout.");
      setBusy(false);
    }
  }

  return (
    <div className="buy-wrap">
      <button type="button" className={className} onClick={startCheckout} disabled={busy}>
        {busy ? "Opening checkout…" : label}
      </button>
      {error ? <p className="buy-error">{error}</p> : null}
    </div>
  );
}
