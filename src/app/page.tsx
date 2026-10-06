import Link from "next/link";
import { BuyButton } from "@/components/buy-button";
import { PokemonCard } from "@/components/pokemon-card";
import { SiteHeader } from "@/components/site-header";
import { pokemonNfts } from "@/data/pokemon-nfts";

const featured = pokemonNfts[4];
const collectionPreview = pokemonNfts.slice(0, 3);
const featuredStats = [
  { value: "720+", label: "Pokemon-inspired genesis collectibles" },
  { value: "48H", label: "Fastest sellout window on preview drops" },
  { value: "6.5%", label: "Royalty split across creator vaults" }
];

export default function HomePage() {
  return (
    <main className="app-shell">
      <div className="grid-backdrop" />
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="hero-panel">
        <SiteHeader />

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Pokemon collectibles on Stellar</p>
            <h1>UNLEASH THE FUTURE OF POKEMON NFTS</h1>
            <p className="hero-description">
              Collect, trade, and showcase limited Pokemon drops in a cinematic NFT marketplace
              designed for XLM-native collectors.
            </p>

            <div className="hero-actions">
              <Link href="/marketplace" className="neon-button">
                Explore All NFTs
              </Link>
              <a href="#collection" className="ghost-button">
                View Collection
              </a>
            </div>

            <div className="stat-grid">
              {featuredStats.map((item) => (
                <div key={item.label} className="stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-feature">
            <div className="hero-orb" />
            <div className="feature-card floating-card">
              <span className="mini-label">Featured Mythic Drop</span>
              <img src={featured.imageUrl} alt={featured.name} className="feature-image" />
              <div className="feature-copy">
                <p>{featured.title}</p>
                <h2>
                  {featured.name} {featured.number}
                </h2>
                <div className="feature-bottom-row">
                  <div>
                    <span>Rarity Score</span>
                    <strong>{featured.rarityScore.toFixed(1)}/10</strong>
                  </div>
                  <div>
                    <span>Price</span>
                    <strong>{featured.priceXlm} XLM</strong>
                  </div>
                </div>
                <BuyButton nftId={featured.id} className="neon-button feature-buy" label="Buy with Hypertron" />
              </div>
            </div>

            <div className="hero-badge badge-top">{featured.edition}</div>
            <div className="hero-badge badge-bottom">Collector grade: apex tier</div>
          </div>
        </div>
      </section>

      <section id="about" className="content-section about-section">
        <div className="section-heading centered">
          <p className="eyebrow">About PokeXLM</p>
          <h2>A limited collection of bold Pokemon drops with battle-ready energy.</h2>
        </div>

        <div className="about-grid">
          <div className="about-copy-card">
            <h3>Built for modern collectors</h3>
            <p>
              Inspired by cinematic NFT landing pages, this demo pairs a neon cyber-arena with
              beloved Pokemon characters and XLM-native pricing.
            </p>
          </div>
          <div className="about-copy-card">
            <h3>Curated scarcity</h3>
            <p>
              Each featured NFT carries a region, edition tag, rarity score, and a fixed price
              between 50 and 100 XLM to keep the showcase tight and intentional.
            </p>
          </div>
          <div className="about-copy-card">
            <h3>Fast route to market</h3>
            <p>
              The landing page flows directly into the marketplace, so visitors can move from brand
              story to collectible discovery in one click.
            </p>
          </div>
        </div>
      </section>

      <section id="collection" className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Collector preview</p>
            <h2>Each Pokemon drop is crafted like a premium live-auction collectible.</h2>
          </div>
          <Link href="/marketplace" className="ghost-button">
            Open Marketplace
          </Link>
        </div>

        <div className="preview-grid">
          {collectionPreview.map((nft) => (
            <PokemonCard key={nft.id} nft={nft} compact />
          ))}
        </div>
      </section>
    </main>
  );
}
