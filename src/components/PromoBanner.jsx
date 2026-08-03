/* Full-bleed campaign banner — desktop (wide) and mobile (tall) crops swap
   at the sm breakpoint. Artwork carries its own copy/CTA; the whole banner
   is a single link. Shared by the homepage promo banner set. */
export default function PromoBanner({ href, ariaLabel, alt, base }) {
  return (
    <section className="relative">
      <a href={href} aria-label={ariaLabel} className="group block relative overflow-hidden">
        <picture>
          <source media="(max-width: 639px)" type="image/avif" srcSet={`${base}-mobile.avif`} />
          <source media="(max-width: 639px)" type="image/webp" srcSet={`${base}-mobile.webp`} />
          <source media="(max-width: 639px)" srcSet={`${base}-mobile.jpg`} />
          <source type="image/avif" srcSet={`${base}-desktop.avif`} />
          <source type="image/webp" srcSet={`${base}-desktop.webp`} />
          <img
            src={`${base}-desktop.jpg`}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.015]"
          />
        </picture>
      </a>
    </section>
  )
}
