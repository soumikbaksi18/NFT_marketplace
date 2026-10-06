import { NextResponse } from "next/server";
import { pokemonNfts } from "@/data/pokemon-nfts";
import { createNftCheckout } from "@/lib/hypertron";

export async function POST(request: Request) {
  let nftId = "";
  try {
    const body = (await request.json()) as { nftId?: unknown };
    nftId = typeof body.nftId === "string" ? body.nftId : "";
  } catch {
    return NextResponse.json({ error: "Send a JSON body with nftId." }, { status: 400 });
  }

  const nft = pokemonNfts.find((item) => item.id === nftId);
  if (!nft) {
    return NextResponse.json({ error: "That NFT is not in this marketplace." }, { status: 404 });
  }

  try {
    const payment = await createNftCheckout(nft);
    return NextResponse.json({
      paymentId: payment.id,
      nftId: nft.id,
      status: payment.status,
      checkoutUrl: payment.checkout_url,
      amount: payment.amount,
      currency: payment.currency,
      expiresAt: payment.expires_at,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start Hypertron checkout.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
