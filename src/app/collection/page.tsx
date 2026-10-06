"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { pokemonNfts, type PokemonNft } from "@/data/pokemon-nfts";
import { markOwned, readOrders, saveOrder } from "@/lib/orders";

type OwnedNft = {
  nft: PokemonNft;
  txHash: string | null;
};

type PaymentPayload = {
  owned?: boolean;
  nftId?: string | null;
  transactionHash?: string | null;
  amount?: string;
  currency?: string;
  checkoutUrl?: string;
  error?: string;
};

export default function CollectionPage() {
  const [owned, setOwned] = useState<OwnedNft[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("payment");
    const tx = params.get("tx");
    const nftFromQuery = params.get("nft");
    setHighlightId(nftFromQuery);

    async function loadPayment(id: string, hintedTx: string | null) {
      const query = hintedTx ? `?tx=${encodeURIComponent(hintedTx)}` : "";
      const response = await fetch(`/api/payments/${encodeURIComponent(id)}${query}`);
      return (await response.json()) as PaymentPayload;
    }

    async function load() {
      const stored = readOrders();
      const ids = new Set(stored.map((order) => order.paymentId));
      if (paymentId && /^pay_[A-Za-z0-9]+$/.test(paymentId)) ids.add(paymentId);

      const confirmed: OwnedNft[] = [];
      await Promise.all(
        [...ids].map(async (id) => {
          const hinted = id === paymentId ? tx : null;
          const payload = await loadPayment(id, hinted);
          if (!payload.owned || !payload.nftId) return;
          const nft = pokemonNfts.find((item) => item.id === payload.nftId);
          if (!nft) return;
          const existing = stored.find((order) => order.paymentId === id);
          if (existing) {
            markOwned(id, payload.transactionHash ?? null);
          } else {
            saveOrder({
              paymentId: id,
              nftId: nft.id,
              checkoutUrl: payload.checkoutUrl || "",
              amount: payload.amount || String(nft.priceXlm),
              currency: payload.currency || "XLM",
              createdAt: new Date().toISOString(),
              txHash: payload.transactionHash ?? null,
              owned: true,
            });
          }
          confirmed.push({ nft, txHash: payload.transactionHash ?? null });
        }),
      );

      const unique = new Map<string, OwnedNft>();
      for (const item of confirmed) unique.set(item.nft.id, item);
      setOwned([...unique.values()]);
      if (paymentId && nftFromQuery && !unique.has(nftFromQuery)) {
        setMessage("This payment is not confirmed on Stellar yet.");
      }
      setLoading(false);
    }

    load().catch(() => {
      setMessage("Could not check which NFTs you own.");
      setLoading(false);
    });
  }, []);

  const highlight = owned.find((item) => item.nft.id === highlightId) ?? owned[0] ?? null;

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
            <p className="eyebrow">Your collection</p>
            <h1>{highlight ? `You own ${highlight.nft.name}.` : "NFTs you have paid for."}</h1>
            <p className="section-copy">
              Hypertron checkout sends you here after Stellar confirms the payment. Ownership follows
              the on-chain transfer, using the checkout memo.
            </p>
          </div>
        </div>

        {loading ? <p className="section-copy">Checking Stellar…</p> : null}
        {message ? <p className="buy-error">{message}</p> : null}

        {!loading && owned.length === 0 ? (
          <div className="about-copy-card order-empty">
            <h3>No owned NFTs yet</h3>
            <p>Buy one from the marketplace. After the payment confirms, this page lists it.</p>
            <Link href="/marketplace" className="neon-button">
              Browse NFTs
            </Link>
          </div>
        ) : null}

        {highlight ? (
          <article className="owned-hero">
            <img src={highlight.nft.imageUrl} alt={`${highlight.nft.name} artwork`} />
            <div>
              <p className="owned-pill">Owned</p>
              <h2>
                {highlight.nft.name} <span>{highlight.nft.number}</span>
              </h2>
              <p>{highlight.nft.title}</p>
              <p>
                {highlight.nft.priceXlm} XLM · {highlight.nft.edition}
              </p>
              {highlight.txHash ? <p className="order-hash">Tx {highlight.txHash}</p> : null}
            </div>
          </article>
        ) : null}

        {owned.length > 1 ? (
          <div className="order-list">
            {owned
              .filter((item) => item.nft.id !== highlight?.nft.id)
              .map((item) => (
                <article key={item.nft.id} className="order-row">
                  <img src={item.nft.imageUrl} alt="" className="order-art" />
                  <div className="order-copy">
                    <p className="owned-pill">Owned</p>
                    <h2>
                      {item.nft.name} {item.nft.number}
                    </h2>
                  </div>
                </article>
              ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
