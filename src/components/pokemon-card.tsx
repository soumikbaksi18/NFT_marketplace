import Link from "next/link";
import type { PokemonNft } from "@/data/pokemon-nfts";

type PokemonCardProps = {
  nft: PokemonNft;
  compact?: boolean;
};

export function PokemonCard({ nft, compact = false }: PokemonCardProps) {
  return (
    <article className={`pokemon-card ${compact ? "compact" : ""}`}>
      <div className="pokemon-art-shell" style={{ "--card-accent": nft.accent } as React.CSSProperties}>
        <span className="edition-badge">{nft.edition}</span>
        <img src={nft.imageUrl} alt={`${nft.name} official artwork`} className="pokemon-art" />
      </div>

      <div className="pokemon-body">
        <div className="pokemon-meta-row">
          <div>
            <p className="pokemon-trainer">{nft.trainer}</p>
            <h3 className="pokemon-title">
              {nft.name} <span>{nft.number}</span>
            </h3>
          </div>
          <span className="type-pill">{nft.type}</span>
        </div>

        <p className="pokemon-subtitle">{nft.title}</p>
        <p className="pokemon-tagline">{nft.tagline}</p>

        <div className="pokemon-stats">
          <div>
            <span>Rarity Score</span>
            <strong>{nft.rarityScore.toFixed(1)}/10</strong>
          </div>
          <div>
            <span>Region</span>
            <strong>{nft.region}</strong>
          </div>
        </div>

        <div className="pokemon-footer">
          <div>
            <span>Price</span>
            <strong>{nft.priceXlm} XLM</strong>
          </div>
          <Link href="/marketplace" className="card-action" aria-label={`Buy ${nft.name}`}>
            View NFT
          </Link>
        </div>
      </div>
    </article>
  );
}
