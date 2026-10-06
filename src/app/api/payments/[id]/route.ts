import { NextResponse } from "next/server";
import { confirmPaymentOnChain } from "@/lib/chain-payment";
import { getHypertronPayment } from "@/lib/hypertron";

const PAYMENT_ID = /^pay_[A-Za-z0-9]+$/;

export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  const id = context.params.id;
  if (!PAYMENT_ID.test(id)) {
    return NextResponse.json({ error: "Unknown payment id." }, { status: 400 });
  }

  try {
    const payment = await getHypertronPayment(id);
    const hintedTx = new URL(request.url).searchParams.get("tx");
    const chain = await confirmPaymentOnChain(payment, hintedTx);
    const owned =
      payment.status === "confirmed" ||
      payment.status === "completed" ||
      chain.owned;
    return NextResponse.json({
      paymentId: payment.id,
      status: payment.status,
      owned,
      amount: payment.amount,
      currency: payment.currency,
      checkoutUrl: payment.checkout_url,
      expiresAt: payment.expires_at,
      paidAt: payment.paid_at,
      transactionHash: payment.transaction_hash || chain.txHash,
      failureMessage: payment.failure_message,
      nftId: payment.metadata?.nft_id ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load payment.";
    const status = /not found/i.test(message) ? 404 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
