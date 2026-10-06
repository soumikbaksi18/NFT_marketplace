import type { PokemonNft } from "@/data/pokemon-nfts";

export type HypertronPayment = {
  id: string;
  status: string;
  amount: string;
  currency: string;
  description: string | null;
  checkout_url: string;
  link_memo?: string;
  destination_address?: string;
  metadata: Record<string, string>;
  expires_at: string | null;
  paid_at: string | null;
  transaction_hash: string | null;
  failure_message: string | null;
};

type ErrorEnvelope = {
  error?: { message?: string; code?: string } | string;
  message?: string;
};

function apiBase(): string {
  const raw = process.env.HYPERTRON_API_BASE_URL?.trim();
  if (!raw) {
    throw new Error("HYPERTRON_API_BASE_URL is not set.");
  }
  return raw.replace(/\/$/, "");
}

function secretKey(): string {
  const key = process.env.HYPERTRON_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("HYPERTRON_SECRET_KEY is not set.");
  }
  return key;
}

function errorMessage(payload: ErrorEnvelope, fallback: string): string {
  if (typeof payload.error === "string" && payload.error) return payload.error;
  if (payload.error && typeof payload.error === "object" && payload.error.message) {
    return payload.error.message;
  }
  if (payload.message) return payload.message;
  return fallback;
}

async function hypertronFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${secretKey()}`);
  if (init.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${apiBase()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function createNftCheckout(nft: PokemonNft): Promise<HypertronPayment> {
  const response = await hypertronFetch("/v1/payments", {
    method: "POST",
    headers: {
      "Idempotency-Key": `pokexlm_${nft.id}_${crypto.randomUUID()}`,
    },
    body: JSON.stringify({
      amount: String(nft.priceXlm),
      currency: "XLM",
      description: `PokeXLM · ${nft.name} ${nft.title}`.slice(0, 500),
      metadata: {
        nft_id: nft.id,
        nft_name: nft.name,
        edition: nft.edition,
        marketplace: "pokexlm",
      },
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as HypertronPayment & ErrorEnvelope;
  if (!response.ok || !payload.id || !payload.checkout_url) {
    throw new Error(errorMessage(payload, "Hypertron could not open checkout."));
  }
  return payload;
}

export async function getHypertronPayment(paymentId: string): Promise<HypertronPayment> {
  const response = await hypertronFetch(`/v1/payments/${encodeURIComponent(paymentId)}`);
  const payload = (await response.json().catch(() => ({}))) as HypertronPayment & ErrorEnvelope;
  if (!response.ok || !payload.id) {
    throw new Error(errorMessage(payload, "Hypertron payment was not found."));
  }
  return payload;
}
