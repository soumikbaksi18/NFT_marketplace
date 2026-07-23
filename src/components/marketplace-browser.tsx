"use client";

import { useDeferredValue, useState } from "react";
import { PokemonCard } from "@/components/pokemon-card";
import {
  pokemonNfts,
  pokemonTypes,
  type PokemonTypeFilter,
} from "@/data/pokemon-nfts";

type SortMode = "featured" | "price-low" | "price-high" | "rarity";

export function MarketplaceBrowser() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<PokemonTypeFilter>("All");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const deferredQuery = useDeferredValue(query);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filtered = pokemonNfts
    .filter((nft) => {
      const matchesType = type === "All" || nft.type === type;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        nft.name.toLowerCase().includes(normalizedQuery) ||
        nft.title.toLowerCase().includes(normalizedQuery) ||
        nft.region.toLowerCase().includes(normalizedQuery);

      return matchesType && matchesQuery;
    })
    .sort((left, right) => {
      if (sortMode === "price-low") return left.priceXlm - right.priceXlm;
      if (sortMode === "price-high") return right.priceXlm - left.priceXlm;
      if (sortMode === "rarity") return right.rarityScore - left.rarityScore;
      return 0;
    });

  return (
    <section className="market-shell">
      <div className="market-hero">
        <div>
          <p className="eyebrow">Pokemon marketplace on Stellar</p>
          <h1>Explore collectible Pokemon NFTs priced only in XLM.</h1>
          <p className="section-copy">
            Every card below is priced between 50 and 100 XLM and styled like a live collectible
            drop. Browse by type, search by Pokemon, and build your own dream lineup.
          </p>
        </div>
        <div className="hero-kpis">
          <div className="kpi-card">
            <span>Floor Range</span>
            <strong>50-100 XLM</strong>
          </div>
          <div className="kpi-card">
            <span>Curated Drops</span>
            <strong>{pokemonNfts.length}</strong>
          </div>
          <div className="kpi-card">
            <span>Chain</span>
            <strong>Stellar</strong>
          </div>
        </div>
      </div>

      <div className="market-toolbar">
        <label className="search-box">
          <span className="sr-only">Search NFTs</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by Pokemon, title, or region"
          />
        </label>

        <div className="type-filter-row" role="tablist" aria-label="Filter by type">
          {pokemonTypes.map((entry) => (
            <button
              key={entry}
              type="button"
              className={`type-chip ${entry === type ? "active" : ""}`}
              onClick={() => setType(entry)}
            >
              {entry}
            </button>
          ))}
        </div>

        <label className="sort-box">
          <span>Sort</span>
          <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rarity">Highest Rarity</option>
          </select>
        </label>
      </div>

      <div className="market-results-row">
        <p>{filtered.length} NFTs matched</p>
        <p>All prices are shown in XLM.</p>
      </div>

      <div className="market-grid">
        {filtered.map((nft) => (
          <PokemonCard key={nft.id} nft={nft} />
        ))}
      </div>
    </section>
  );
}
