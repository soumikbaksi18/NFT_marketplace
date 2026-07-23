export type PokemonNft = {
  id: string;
  number: string;
  name: string;
  title: string;
  tagline: string;
  trainer: string;
  type: "Electric" | "Fire" | "Ghost" | "Fighting" | "Psychic" | "Grass" | "Water" | "Normal" | "Dragon" | "Dark" | "Fairy";
  region: string;
  priceXlm: number;
  rarityScore: number;
  edition: string;
  accent: string;
  imageUrl: string;
};

export const pokemonNfts: PokemonNft[] = [
  {
    id: "pikachu-volt-runner",
    number: "#025",
    name: "Pikachu",
    title: "Volt Runner",
    tagline: "Neon-charged scout with stormlight reflexes.",
    trainer: "Ari Kestrel",
    type: "Electric",
    region: "Kanto",
    priceXlm: 58,
    rarityScore: 8.9,
    edition: "Genesis Spark",
    accent: "linear-gradient(135deg, #f3ff41 0%, #72ff45 100%)",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
  },
  {
    id: "charizard-solar-warden",
    number: "#006",
    name: "Charizard",
    title: "Solar Warden",
    tagline: "Flameborn aerial titan from the obsidian division.",
    trainer: "Nova Vale",
    type: "Fire",
    region: "Kanto",
    priceXlm: 96,
    rarityScore: 9.8,
    edition: "Molten Crest",
    accent: "linear-gradient(135deg, #ff8a00 0%, #ff2d55 100%)",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
  },
  {
    id: "gengar-shadow-pulse",
    number: "#094",
    name: "Gengar",
    title: "Shadow Pulse",
    tagline: "Cloaked trickster pulsing through midnight portals.",
    trainer: "Mika Dusk",
    type: "Ghost",
    region: "Kanto",
    priceXlm: 74,
    rarityScore: 9.2,
    edition: "Phantom Night",
    accent: "linear-gradient(135deg, #9756ff 0%, #ff4fd8 100%)",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png"
  },
  {
    id: "lucario-aura-forge",
    number: "#448",
    name: "Lucario",
    title: "Aura Forge",
    tagline: "A disciplined striker forged for cosmic tournaments.",
    trainer: "Kai Sol",
    type: "Fighting",
    region: "Sinnoh",
    priceXlm: 82,
    rarityScore: 9.1,
    edition: "Iron Halo",
    accent: "linear-gradient(135deg, #48c6ef 0%, #6f86ff 100%)",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png"
  },
  {
    id: "mewtwo-quantum-mind",
    number: "#150",
    name: "Mewtwo",
    title: "Quantum Mind",
    tagline: "The featured mythic unit shaping the next meta.",
    trainer: "Dr. Lyra",
    type: "Psychic",
    region: "Kanto",
    priceXlm: 99,
    rarityScore: 10,
    edition: "Mythic Core",
    accent: "linear-gradient(135deg, #d16bff 0%, #5effd6 100%)",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png"
  },
  {
    id: "bulbasaur-verdant-seed",
    number: "#001",
    name: "Bulbasaur",
    title: "Verdant Seed",
    tagline: "Botanic guardian bred for the genesis gardens.",
    trainer: "Sera Bloom",
    type: "Grass",
    region: "Kanto",
    priceXlm: 53,
    rarityScore: 8.4,
    edition: "Bloom Circuit",
    accent: "linear-gradient(135deg, #86efac 0%, #22c55e 100%)",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
  },
  {
    id: "blastoise-tidal-vault",
    number: "#009",
    name: "Blastoise",
    title: "Tidal Vault",
    tagline: "Heavy-water defender built for fortress seas.",
    trainer: "Rune Harbor",
    type: "Water",
    region: "Kanto",
    priceXlm: 88,
    rarityScore: 9.3,
    edition: "Deep Current",
    accent: "linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png"
  },
  {
    id: "eevee-prism-shift",
    number: "#133",
    name: "Eevee",
    title: "Prism Shift",
    tagline: "Adaptive lineage with multiform evolution rights.",
    trainer: "Pax Ember",
    type: "Normal",
    region: "Kanto",
    priceXlm: 61,
    rarityScore: 8.7,
    edition: "Prismatic Path",
    accent: "linear-gradient(135deg, #f5d0a9 0%, #f59e0b 100%)",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png"
  },
  {
    id: "dragonite-sky-harbinger",
    number: "#149",
    name: "Dragonite",
    title: "Sky Harbinger",
    tagline: "Interstellar courier carrying gold-wing clearance.",
    trainer: "Aster Quinn",
    type: "Dragon",
    region: "Kanto",
    priceXlm: 92,
    rarityScore: 9.6,
    edition: "Aether Flight",
    accent: "linear-gradient(135deg, #fb7185 0%, #f59e0b 100%)",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png"
  },
  {
    id: "greninja-night-surge",
    number: "#658",
    name: "Greninja",
    title: "Night Surge",
    tagline: "Stealth-born assassin from the lunar relay.",
    trainer: "Nyx Torrent",
    type: "Dark",
    region: "Kalos",
    priceXlm: 85,
    rarityScore: 9.5,
    edition: "Shadow Stream",
    accent: "linear-gradient(135deg, #34d399 0%, #0f172a 100%)",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png"
  },
  {
    id: "gardevoir-star-empress",
    number: "#282",
    name: "Gardevoir",
    title: "Star Empress",
    tagline: "Celestial protector radiating psychic bloom fields.",
    trainer: "Eira Wren",
    type: "Fairy",
    region: "Hoenn",
    priceXlm: 79,
    rarityScore: 9,
    edition: "Moon Garden",
    accent: "linear-gradient(135deg, #f9a8d4 0%, #c084fc 100%)",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png"
  },
  {
    id: "rayquaza-orbit-breaker",
    number: "#384",
    name: "Rayquaza",
    title: "Orbit Breaker",
    tagline: "Legendary sky serpent with apex vault privileges.",
    trainer: "Orin Flux",
    type: "Dragon",
    region: "Hoenn",
    priceXlm: 97,
    rarityScore: 9.9,
    edition: "Celestial Apex",
    accent: "linear-gradient(135deg, #22c55e 0%, #bef264 100%)",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png"
  }
];

export const pokemonTypes = ["All", "Electric", "Fire", "Ghost", "Fighting", "Psychic", "Grass", "Water", "Normal", "Dragon", "Dark", "Fairy"] as const;

export type PokemonTypeFilter = (typeof pokemonTypes)[number];
