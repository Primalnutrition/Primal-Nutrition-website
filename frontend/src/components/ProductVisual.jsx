/* Product visual — renders the real product photo on a white
   backdrop so photos with white/light backgrounds render faithfully.
   Falls back to a CSS bottle mock if no image set. */
export default function ProductVisual({ product }) {
  if (product.image) return <ImageVisual product={product} />
  return <FallbackVisual product={product} />
}

function ImageVisual({ product }) {
  return (
    <div className="relative w-full aspect-square rounded-2xl bg-white border border-bone/5 overflow-hidden">
      {/* Raw image — no filters, no scale, full container, never cropped */}
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-contain"
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
