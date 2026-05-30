import { useEffect, useRef, useState } from 'react'
import Picture from './Picture.jsx'

/* Product visual — renders the real product photo.
   Loader strategy: aspect-square wrapper reserves space (no CLS), a
   brand-tinted pulse skeleton sits underneath, and the image fades in
   on decode complete. Falls back to a CSS bottle mock if no image set. */
export default function ProductVisual({ product }) {
  if (product.image) return <ImageVisual product={product} />
  return <FallbackVisual product={product} />
}

function ImageVisual({ product }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  // If the image is already in cache, `onLoad` may fire before our ref is
  // wired up — check `complete` once after mount so cached images don't
  // get stuck behind the skeleton.
  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-ink-800/40">
      {/* Skeleton — slow amber pulse on dark base. Visible until the image
          decodes, fades out in 400ms. aria-hidden because it's purely
          decorative; screen readers go straight to the <img> alt. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-400 ease-out ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-700/70 to-ink-800 animate-pulse" />
        <div className="absolute inset-0 grain opacity-25" />
        {/* Subtle centered amber dot — same affordance as the route loader,
            so the brand language stays consistent across loading surfaces. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-amber/70 animate-pulse" />
        </div>
      </div>

      {/* Image — object-contain so non-square product shots aren't cropped;
          fades in once decoded. */}
      <Picture
        ref={imgRef}
        src={product.image}
        alt={product.name}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`relative w-full h-full block object-contain transition-opacity duration-500 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Category chip */}
      <div className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.2em] text-bone bg-ink/80 backdrop-blur-md rounded-full px-2.5 py-1 font-brand font-semibold border border-bone/10 z-10">
        {product.categoryLabel}
      </div>

      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] text-ink bg-amber rounded-full px-2.5 py-1 font-brand font-bold z-10">
          {product.badge}
        </div>
      )}
    </div>
  )
}

/* Fallback for any product missing an image */
function FallbackVisual({ product }) {
  const accent = product.accent || 'from-amber to-rust'
  return (
    <div className={`relative w-full aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${accent} grain`}>
      <div className="absolute inset-0 grain opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
      <div className="absolute top-3 left-4 font-display text-[6rem] leading-none text-ink/20 select-none">
        {product.name[0]}
      </div>
      <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-ink/70 bg-bone/60 backdrop-blur rounded-full px-2.5 py-1 font-bold">
        {product.categoryLabel}
      </div>
      <div className="absolute bottom-3 left-4 right-4 text-[10px] uppercase tracking-widest font-bold text-bone/90">
        {product.subtitle}
      </div>
    </div>
  )
}
