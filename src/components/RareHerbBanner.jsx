/* Full-bleed promo banner for the Rare Herb Series capsule line.
   Artwork carries its own title/tagline — desktop (wide) and mobile (tall)
   crops swap at the sm breakpoint. Whole banner links to the shop. */
export default function RareHerbBanner() {
  return (
    <section className="relative">
      <a
        href="#/shop"
        aria-label="Shop the Rare Herb Series"
        className="group block relative overflow-hidden"
      >
        <picture>
          <source
            media="(max-width: 639px)"
            type="image/avif"
            srcSet="/brand/rare-herb-banner-mobile.avif"
          />
          <source
            media="(max-width: 639px)"
            type="image/webp"
            srcSet="/brand/rare-herb-banner-mobile.webp"
          />
          <source
            media="(max-width: 639px)"
            srcSet="/brand/rare-herb-banner-mobile.jpg"
          />
          <source type="image/avif" srcSet="/brand/rare-herb-banner-desktop.avif" />
          <source type="image/webp" srcSet="/brand/rare-herb-banner-desktop.webp" />
          <img
            src="/brand/rare-herb-banner-desktop.jpg"
            alt="The Rare Herb Series — Liver Detox, Black Maca, Cordyceps, Royal Jelly and Tongkat Ali. Sourced from the wild. Built for performance."
            loading="lazy"
            decoding="async"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.015]"
          />
        </picture>

        {/* Shop chip — sits in the empty top-right of both crops */}
        <span className="absolute top-4 right-4 sm:top-6 sm:right-8 inline-flex items-center gap-2 rounded-full bg-ink/80 backdrop-blur-md border border-amber/40 px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-brand font-semibold text-bone group-hover:bg-amber group-hover:text-ink transition">
          Shop the series
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
          </svg>
        </span>
      </a>
    </section>
  )
}
