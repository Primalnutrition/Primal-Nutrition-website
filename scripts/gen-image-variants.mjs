/**
 * Generate AVIF + WebP variants for every raster image under public/.
 *
 * Why this exists: Picture.jsx already serves <source type="image/avif"> and
 * <source type="image/webp"> ahead of the original, so the browser picks the
 * smallest format it supports — but only if the variant file exists. Images
 * added without running this fall back to the raw PNG/JPEG, which is how a
 * 2 MB PNG ended up on a product page next to a 12 KB AVIF.
 *
 * It also caps the long edge. Product photos were shipping at 4160x6240
 * (26 MP) to be displayed around 600px wide.
 *
 * Safe to re-run: existing variants are skipped unless --force is passed.
 * Originals are never modified or deleted — they remain the final fallback.
 *
 * Usage:
 *   node scripts/gen-image-variants.mjs            # generate what is missing
 *   node scripts/gen-image-variants.mjs --force    # rebuild everything
 *   node scripts/gen-image-variants.mjs --dry-run  # report only
 */
import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('public')
const SRC_EXT = new Set(['.png', '.jpg', '.jpeg'])
const MAX_EDGE = 1600          // ample for a full-bleed gallery on a 2x display
const AVIF = { quality: 55, effort: 4 }
const WEBP = { quality: 78 }

const force = process.argv.includes('--force')
const dryRun = process.argv.includes('--dry-run')

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (SRC_EXT.has(path.extname(entry.name).toLowerCase())) yield full
  }
}

const mb = (b) => (b / 1048576).toFixed(1)

async function main() {
  const stats = { scanned: 0, avif: 0, webp: 0, skipped: 0, failed: 0 }
  let srcBytes = 0, outBytes = 0

  for await (const file of walk(ROOT)) {
    stats.scanned++
    const base = file.slice(0, -path.extname(file).length)
    const avifPath = `${base}.avif`
    const webpPath = `${base}.webp`
    const needAvif = force || !existsSync(avifPath)
    const needWebp = force || !existsSync(webpPath)

    if (!needAvif && !needWebp) { stats.skipped++; continue }

    const { size } = await stat(file)
    srcBytes += size
    const rel = path.relative(ROOT, file)

    if (dryRun) {
      console.log(`  would build ${needAvif ? 'avif ' : ''}${needWebp ? 'webp ' : ''}- ${rel} (${mb(size)} MB)`)
      continue
    }

    try {
      const img = sharp(file, { failOn: 'none' })
      const meta = await img.metadata()
      // Only downscale — never upscale a small source.
      const resize = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_EDGE
        ? { width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true }
        : null

      if (needAvif) {
        const p = resize ? img.clone().resize(resize) : img.clone()
        await p.avif(AVIF).toFile(avifPath)
        outBytes += (await stat(avifPath)).size
        stats.avif++
      }
      if (needWebp) {
        const p = resize ? img.clone().resize(resize) : img.clone()
        await p.webp(WEBP).toFile(webpPath)
        outBytes += (await stat(webpPath)).size
        stats.webp++
      }
      console.log(`  ok  ${rel}  ${meta.width}x${meta.height} ${mb(size)} MB`)
    } catch (err) {
      stats.failed++
      console.log(`  !!  ${rel}: ${err.message}`)
    }
  }

  console.log(
    `\nscanned ${stats.scanned} · built ${stats.avif} avif + ${stats.webp} webp` +
    ` · skipped ${stats.skipped} · failed ${stats.failed}`,
  )
  if (!dryRun && srcBytes) {
    console.log(`sources touched ${mb(srcBytes)} MB -> variants ${mb(outBytes)} MB`)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
