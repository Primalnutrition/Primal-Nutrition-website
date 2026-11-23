// Every raster source under public/ has an AVIF and a WebP sibling, generated
// by scripts/gen-image-variants.mjs. These sets exist as an escape hatch for
// any file whose variant is missing or bad — add its path and that <source>
// is skipped, so the browser falls back to the original rather than 404ing.
//
// Both are empty because every image currently has both variants. If you add
// images, run the script; do not add entries here to work around missing
// files, or you ship the multi-megabyte original instead.
const NO_AVIF = new Set([])
const NO_WEBP = new Set([])

import { forwardRef } from 'react'

const Picture = forwardRef(function Picture({ src, ...imgProps }, ref) {
  if (!src || !/\.(png|jpe?g)$/i.test(src)) {
    return <img ref={ref} src={src} {...imgProps} />
  }
  const base = src.replace(/\.(png|jpe?g)$/i, '')
  const webp = `${base}.webp`
  const avif = `${base}.avif`
  const useAvif = !NO_AVIF.has(src)
  const useWebp = !NO_WEBP.has(src)
  return (
    <picture>
      {useAvif && <source type="image/avif" srcSet={avif} />}
      {useWebp && <source type="image/webp" srcSet={webp} />}
      <img ref={ref} src={src} {...imgProps} />
    </picture>
  )
})

export default Picture
