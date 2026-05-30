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
  '/products/trex-liquid-04.png',
  '/products/trex-liver.png',
  '/products/trex-maca.png',
  '/products/trex-royal-jelly.png',
  '/products/trex-tongkat.png',
  '/products/vita-peak.png',
])

export default function Picture({ src, ...imgProps }) {
  if (!src || !/\.(png|jpe?g)$/i.test(src)) {
    return <img src={src} {...imgProps} />
  }
  const base = src.replace(/\.(png|jpe?g)$/i, '')
  const webp = `${base}.webp`
  const avif = `${base}.avif`
  const useAvif = !NO_AVIF.has(src)
  return (
    <picture>
      {useAvif && <source type="image/avif" srcSet={avif} />}
      <source type="image/webp" srcSet={webp} />
      <img src={src} {...imgProps} />
    </picture>
  )
}
