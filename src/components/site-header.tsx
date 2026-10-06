import Link from "next/link";

type SiteHeaderProps = {
  ctaLabel?: string;
  ctaHref?: string;
};

export function SiteHeader({
  ctaLabel = "Explore NFTs",
  ctaHref = "/marketplace",
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="PokeXLM home">
        <span className="brand-mark" />
        <span className="brand-text">POKEXLM</span>
      </Link>

      <nav className="site-nav" aria-label="Primary">
        <Link href="/">Home</Link>
        <a href="#collection">Collection</a>
        <a href="#about">About</a>
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/collection">My NFTs</Link>
        <Link href="/orders">Orders</Link>
      </nav>

      <Link href={ctaHref} className="neon-button header-cta">
        {ctaLabel}
      </Link>
    </header>
  );
}
