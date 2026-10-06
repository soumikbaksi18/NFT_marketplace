import type { HypertronPayment } from "@/lib/hypertron";

const TX_HASH = /^[a-fA-F0-9]{64}$/;

type HorizonTx = {
  successful?: boolean;
  memo_type?: string;
  memo?: string;
  hash?: string;
};

type HorizonOperation = {
  type?: string;
  to?: string;
  account?: string;
  amount?: string;
  starting_balance?: string;
};

function horizonBase(): string {
  const raw = process.env.HYPERTRON_HORIZON_URL?.trim() || "https://horizon-testnet.stellar.org";
  return raw.replace(/\/$/, "");
}

function canonicalAmount(value: string): string {
  const trimmed = value.trim();
  const [wholeRaw, fracRaw = ""] = trimmed.split(".");
  const whole = wholeRaw.replace(/^0+(?=\d)/, "") || "0";
  const frac = fracRaw.replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole;
}

async function horizonGet<T>(path: string): Promise<T | null> {
  const response = await fetch(`${horizonBase()}${path}`, { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json().catch(() => null)) as T | null;
}

async function transactionMatches(
  txHash: string,
  memo: string,
  destination: string,
  amount: string,
): Promise<boolean> {
  const tx = await horizonGet<HorizonTx>(`/transactions/${txHash}`);
  if (!tx?.successful || tx.memo_type !== "text" || tx.memo !== memo) return false;

  const ops = await horizonGet<{ _embedded?: { records?: HorizonOperation[] } }>(
    `/transactions/${txHash}/operations`,
  );
  const expected = canonicalAmount(amount);
  return (ops?._embedded?.records ?? []).some((operation) => {
    const paidTo = operation.to || operation.account;
    const paidAmount = operation.amount || operation.starting_balance;
    if (!paidTo || !paidAmount || paidTo !== destination) return false;
    return canonicalAmount(paidAmount) === expected;
  });
}

export async function confirmPaymentOnChain(
  payment: HypertronPayment,
  hintedTx: string | null,
): Promise<{ owned: boolean; txHash: string | null }> {
  if (payment.status === "confirmed" || payment.status === "completed") {
    return { owned: true, txHash: payment.transaction_hash };
  }

  const memo = payment.link_memo?.trim();
  const destination = payment.destination_address?.trim();
  if (!memo || !destination) return { owned: false, txHash: null };

  if (hintedTx && TX_HASH.test(hintedTx)) {
    const matched = await transactionMatches(hintedTx, memo, destination, payment.amount);
    if (matched) return { owned: true, txHash: hintedTx };
  }

  const listed = await horizonGet<{ _embedded?: { records?: HorizonTx[] } }>(
    `/accounts/${destination}/transactions?limit=20&order=desc`,
  );
  const hit = (listed?._embedded?.records ?? []).find(
    (tx) => tx.successful && tx.memo_type === "text" && tx.memo === memo && tx.hash,
  );
  if (!hit?.hash || !TX_HASH.test(hit.hash)) return { owned: false, txHash: null };

  const matched = await transactionMatches(hit.hash, memo, destination, payment.amount);
  return matched ? { owned: true, txHash: hit.hash } : { owned: false, txHash: null };
}
