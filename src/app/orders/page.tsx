"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { pokemonNfts } from "@/data/pokemon-nfts";
import { markOwned, readOrders, type StoredOrder } from "@/lib/orders";

type PaymentView = {
  status: string;
  owned: boolean;
  checkoutUrl: string;
  transactionHash: string | null;
  failureMessage: string | null;
  paidAt: string | null;
};

const OPEN = new Set(["created", "pending", "confirmed"]);

function statusLabel(status: string): string {
  if (status === "completed" || status === "confirmed") return "Paid";
  if (status === "pending" || status === "created") return "Awaiting payment";
  if (status === "expired") return "Expired";
  if (status === "canceled") return "Canceled";
  if (status === "failed") return "Failed";
  return status;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [payments, setPayments] = useState<Record<string, PaymentView>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setOrders(readOrders());
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;

    let cancelled = false;

    async function refresh() {
      const next: Record<string, PaymentView> = {};
      await Promise.all(
        orders.map(async (order) => {
          try {
            const response = await fetch(`/api/payments/${order.paymentId}`);
            const payload = (await response.json()) as {
              status?: string;
              owned?: boolean;
              checkoutUrl?: string;
              transactionHash?: string | null;
              failureMessage?: string | null;
              paidAt?: string | null;
              error?: string;
            };
            if (!response.ok || !payload.status) {
              throw new Error(payload.error || "Status unavailable");
            }
            if (payload.owned) markOwned(order.paymentId, payload.transactionHash ?? null);
            next[order.paymentId] = {
              status: payload.status,
              owned: Boolean(payload.owned),
              checkoutUrl: payload.checkoutUrl || order.checkoutUrl,
              transactionHash: payload.transactionHash ?? null,
              failureMessage: payload.failureMessage ?? null,
              paidAt: payload.paidAt ?? null,
            };
          } catch (error) {
            next[order.paymentId] = {
              status: "unknown",
              owned: false,
              checkoutUrl: order.checkoutUrl,
              transactionHash: null,
              failureMessage: error instanceof Error ? error.message : "Status unavailable",
              paidAt: null,
            };
          }
        }),
      );
      if (!cancelled) {
        setPayments(next);
        setLoadError(null);
      }
    }

    refresh().catch((error: unknown) => {
      if (!cancelled) {
        setLoadError(error instanceof Error ? error.message : "Could not refresh orders.");
      }
    });

    const timer = window.setInterval(() => {
      refresh().catch(() => undefined);
    }, 8000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [orders]);

  return (
    <main className="app-shell marketplace-page">
      <div className="grid-backdrop" />
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="marketplace-topbar">
        <SiteHeader ctaLabel="Marketplace" ctaHref="/marketplace" />
      </section>

      <section className="market-shell">
        <div className="market-hero">
          <div>
            <p className="eyebrow">Hypertron checkout</p>
            <h1>Orders from this browser.</h1>
            <p className="section-copy">
              Each purchase opens Hypertron hosted checkout on Stellar testnet. Come back here after
              paying. A paid NFT shows up once Hypertron marks the payment confirmed or completed.
            </p>
          </div>
        </div>

        {loadError ? <p className="buy-error">{loadError}</p> : null}

        {orders.length === 0 ? (
          <div className="about-copy-card order-empty">
            <h3>No checkouts yet</h3>
            <p>Buy a Pokemon from the marketplace. The secret API key never leaves the server.</p>
            <Link href="/marketplace" className="neon-button">
              Browse NFTs
            </Link>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order) => {
              const nft = pokemonNfts.find((item) => item.id === order.nftId);
              const payment = payments[order.paymentId];
              const status = payment?.status ?? "loading";
              const owned = Boolean(payment?.owned) || status === "completed" || status === "confirmed";
              return (
                <article key={order.paymentId} className="order-row">
                  <img
                    src={nft?.imageUrl}
                    alt={nft ? `${nft.name} artwork` : "NFT artwork"}
                    className="order-art"
                  />
                  <div className="order-copy">
                    <p className="pokemon-trainer">{nft?.edition ?? "PokeXLM"}</p>
                    <h2>{nft ? `${nft.name} ${nft.number}` : order.nftId}</h2>
                    <p>
                      {order.amount || nft?.priceXlm} {order.currency || "XLM"}
                    </p>
                    <p className={`order-status ${owned ? "paid" : ""}`}>{owned ? "Owned" : statusLabel(status)}</p>
                    {payment?.failureMessage && !owned ? (
                      <p className="buy-error">{payment.failureMessage}</p>
                    ) : null}
                    {payment?.transactionHash ? (
                      <p className="order-hash">Tx {payment.transactionHash}</p>
                    ) : null}
                  </div>
                  {OPEN.has(status) ? (
                    <a className="card-action" href={payment?.checkoutUrl || order.checkoutUrl}>
                      Continue checkout
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
