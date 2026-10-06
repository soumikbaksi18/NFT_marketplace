export type StoredOrder = {
  paymentId: string;
  nftId: string;
  checkoutUrl: string;
  amount: string;
  currency: string;
  createdAt: string;
  txHash?: string | null;
  owned?: boolean;
};

const STORAGE_KEY = "pokexlm.orders";

export function readOrders(): StoredOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredOrder[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((order) => order.paymentId && order.nftId);
  } catch {
    return [];
  }
}

export function saveOrder(order: StoredOrder): void {
  const existing = readOrders().filter((item) => item.paymentId !== order.paymentId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...existing].slice(0, 40)));
}

export function markOwned(paymentId: string, txHash: string | null): StoredOrder | null {
  const orders = readOrders();
  const match = orders.find((order) => order.paymentId === paymentId);
  if (!match) return null;
  const next = { ...match, owned: true, txHash };
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(orders.map((order) => (order.paymentId === paymentId ? next : order))),
  );
  return next;
}

export function ownedNftIds(): string[] {
  return readOrders().filter((order) => order.owned).map((order) => order.nftId);
}
