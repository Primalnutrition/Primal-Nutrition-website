#!/usr/bin/env node
/**
 * gen-qr.js — Generate QR code PNGs for each product's label page.
 * Run: node scripts/gen-qr.js
 * Output: public/brand/qr-<productId>.png  (512×512, ink bg, amber dots)
 */
import QRCode from 'qrcode'
import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const BASE_URL = 'https://primalnutrition.in/#/label/'

const PRODUCTS = [
  { id: 'trex-liquid',      name: 'T-Rex Liquid' },
  { id: 'trex-tongkat',     name: 'Tongkat Ali' },
  { id: 'trex-maca',        name: 'Black Maca' },
  { id: 'trex-ginseng',     name: 'Korean Panax Ginseng' },
  { id: 'trex-cordyceps',   name: 'Cordyceps' },
  { id: 'trex-liver',       name: 'Liver Detox' },
  { id: 'trex-royal-jelly', name: 'Royal Jelly' },
  { id: 'hydra-muscle',     name: 'Hydra Muscle' },
  { id: 'vita-peak',        name: 'Vita Peak' },
]

const OUT_DIR = 'public/brand'

if (!existsSync(OUT_DIR)) {
  await mkdir(OUT_DIR, { recursive: true })
}

for (const { id, name } of PRODUCTS) {
  const url = `${BASE_URL}${id}`
  const outPath = `${OUT_DIR}/qr-${id}.png`

  await QRCode.toFile(outPath, url, {
    type: 'png',
    width: 512,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#0A0A0A',   // ink — matches brand
      light: '#F5EFE6',  // bone — high contrast on light print background
    },
  })

  console.log(`✓  ${name.padEnd(24)}  →  ${outPath}`)
  console.log(`   URL: ${url}`)
}

console.log(`\nDone — ${PRODUCTS.length} QR codes generated in ${OUT_DIR}/`)
console.log(`\nPrint tip: use qr-<id>.png at minimum 25mm × 25mm on packaging.`)
console.log(`Scan test: open Camera app on iPhone, point at QR — should open primalnutrition.in/#/label/<id>`)
