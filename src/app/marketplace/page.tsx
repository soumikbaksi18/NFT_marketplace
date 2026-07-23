import Link from "next/link";
import { MarketplaceBrowser } from "@/components/marketplace-browser";
import { SiteHeader } from "@/components/site-header";

export default function MarketplacePage() {
  return (
    <main className="app-shell marketplace-page">
      <div className="grid-backdrop" />
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="marketplace-topbar">
        <SiteHeader ctaLabel="Back Home" ctaHref="/" />
      </section>

      <MarketplaceBrowser />

      <footer className="site-footer">
        <p>PokeXLM demo marketplace for Pokemon-themed NFTs.</p>
        <Link href="/" className="ghost-button">
          Return to landing page
        </Link>
      </footer>
    </main>
  );
}
