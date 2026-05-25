import { useState, useEffect } from 'react'

/* PDP gallery — main image + thumbnail strip below.
   Black background matches the dark backgrounds of product photos. */
export default function ProductGallery({ product }) {
  const images = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image].filter(Boolean)
  const [active, setActive] = useState(0)

  // Reset to first image when product changes
  useEffect(() => { setActive(0) }, [product.id])

  return (
    <div>
      {/* Main image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-black">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${product.name} · view ${i + 1}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
              i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        ))}

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

      {/* Thumbnails (only if multiple images) */}
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-6 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`View ${i + 1}`}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition bg-black ${
                i === active
                  ? 'border-amber'
                  : 'border-bone/10 hover:border-bone/30 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={src}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
