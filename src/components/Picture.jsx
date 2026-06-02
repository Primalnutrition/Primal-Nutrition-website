// PNG/JPG sources for which AVIF was not generated (alpha channel).
// Browsers will fall back to WebP for these.
const NO_AVIF = new Set([
  '/brand/dotted-circle.png',
  '/brand/icon-brain.png',
  '/brand/icon-build.png',
  '/brand/icon-energy.png',
  '/brand/icon-performance.png',
  '/brand/icon-stress.png',
  '/products/hydra-muscle.png',
  '/products/hydra-muscle-01.png',
  '/products/hydra-muscle-02.png',
  '/products/hydra-muscle-03.png',
  '/products/hydra-muscle-04.png',
  '/products/trex-cordyceps.png',
  '/products/trex-ginseng.png',
  '/products/trex-ginseng-01.png',
  '/products/trex-ginseng-02.png',
  '/products/trex-ginseng-03.png',
  '/products/trex-ginseng-04.png',
  '/products/trex-ginseng-05.png',
  '/products/trex-ginseng-06.png',
  '/products/trex-liquid-04.png',
  '/products/trex-liver.png',
  '/products/trex-liver-01.jpeg',
  '/products/trex-liver-02.jpeg',
  '/products/trex-liver-03.jpeg',
  '/products/trex-liver-04.jpeg',
  '/products/trex-liver-05.jpeg',
  '/products/trex-liver-06.jpeg',
  '/products/trex-liver-07.jpeg',
  '/products/trex-maca.png',
  '/products/trex-maca-01.jpeg',
  '/products/trex-maca-02.jpeg',
  '/products/trex-maca-03.jpeg',
  '/products/trex-maca-04.jpeg',
  '/products/trex-maca-05.jpeg',
  '/products/trex-maca-06.jpeg',
  '/products/trex-maca-07.jpeg',
  '/products/trex-royal-jelly.png',
  '/products/trex-royal-jelly-01.jpeg',
  '/products/trex-royal-jelly-02.jpeg',
  '/products/trex-royal-jelly-03.jpeg',
  '/products/trex-royal-jelly-04.jpeg',
  '/products/trex-royal-jelly-05.jpeg',
  '/products/trex-royal-jelly-06.jpeg',
  '/products/trex-royal-jelly-07.jpeg',
  '/products/trex-tongkat.png',
  '/products/trex-tongkat-01.jpeg',
  '/products/trex-tongkat-02.jpeg',
  '/products/trex-tongkat-03.jpeg',
  '/products/trex-tongkat-04.jpeg',
  '/products/trex-tongkat-05.jpeg',
  '/products/trex-tongkat-06.jpeg',
  '/products/trex-tongkat-07.jpeg',
  '/products/vita-peak.png',
])
// Note: /products/trex-liquid.png does have an AVIF — it's rendered without alpha.

import { forwardRef } from 'react'

const Picture = forwardRef(function Picture({ src, ...imgProps }, ref) {
  if (!src || !/\.(png|jpe?g)$/i.test(src)) {
    return <img ref={ref} src={src} {...imgProps} />
  }
  const base = src.replace(/\.(png|jpe?g)$/i, '')
  const webp = `${base}.webp`
  const avif = `${base}.avif`
  const useAvif = !NO_AVIF.has(src)
  return (
    <picture>
      {useAvif && <source type="image/avif" srcSet={avif} />}
      <source type="image/webp" srcSet={webp} />
      <img ref={ref} src={src} {...imgProps} />
    </picture>
  )
})

export default Picture
