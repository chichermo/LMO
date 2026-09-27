import { writeFileSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { Resvg } from '@resvg/resvg-js'

const root = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const fontkit = require('fontkit')
const font = fontkit.create(readFileSync(join(root, 'BigShouldersDisplay.ttf'))).getVariation({ wght: 800 })
const UPM = font.unitsPerEm

function textGroup(text, x, baseline, size, fill) {
  const scale = size / UPM
  const run = font.layout(text)
  let cursor = 0
  const parts = []
  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i]
    const d = glyph.path.toSVG(2)
    if (d) {
      const gx = x + (cursor + (pos.xOffset || 0)) * scale
      const gy = baseline - (pos.yOffset || 0) * scale
      parts.push(`<path fill="${fill}" transform="translate(${gx.toFixed(2)} ${gy.toFixed(2)}) scale(${scale} ${-scale})" d="${d}"/>`)
    }
    cursor += pos.xAdvance
  })
  return { svg: parts.join('\n  '), width: cursor * scale }
}

const steel = `
  <linearGradient id="steelL" x1="8" y1="4" x2="72" y2="92" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#F7F4EC"/>
    <stop offset=".32" stop-color="#C9C6BC"/>
    <stop offset=".5" stop-color="#F2EFE6"/>
    <stop offset=".7" stop-color="#9A9A94"/>
    <stop offset="1" stop-color="#E4E1D8"/>
  </linearGradient>
  <linearGradient id="steelEdge" x1="0" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
    <stop stop-color="#ffffff" stop-opacity=".7"/>
    <stop offset="1" stop-color="#7A7A76"/>
  </linearGradient>`

const markColor = `
  <path d="M10 6h28v62h38v22H10V6Z" fill="url(#steelL)" stroke="#1A1814" stroke-width="1.35"/>
  <circle cx="24" cy="22" r="5.2" fill="#0C0D10"/>
  <circle cx="24" cy="40" r="5.2" fill="#0C0D10"/>
  <circle cx="24" cy="58" r="5.2" fill="#0C0D10"/>
  <rect x="10" y="92" width="66" height="2.6" fill="#D3122A"/>`

const markBlack = `
  <path fill-rule="evenodd" d="M10 6h28v62h38v22H10V6Z M24 16.8a5.2 5.2 0 1 1 0 10.4a5.2 5.2 0 0 1 0-10.4Z M24 34.8a5.2 5.2 0 1 1 0 10.4a5.2 5.2 0 0 1 0-10.4Z M24 52.8a5.2 5.2 0 1 1 0 10.4a5.2 5.2 0 0 1 0-10.4Z" fill="#1A1814"/>
  <rect x="10" y="92" width="66" height="2.6" fill="#1A1814"/>`

function lockup({ mark, defs, nameFill, spaFill, rutFill }) {
  const tx = 104
  const name = textGroup('LMO INOX', tx, 68, 52, nameFill)
  const spa = textGroup('SPA', tx + name.width + 8, 68, 52, spaFill)
  const rut = textGroup('RUT 78.487.968-2', tx, 88, 10, rutFill)
  const width = Math.ceil(tx + name.width + 8 + spa.width + 18)
  const height = 108
  return { width, height, svg: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <title>LMO INOX SPA</title>
  ${defs ? `<defs>${defs}</defs>` : ''}
  <g>${mark}</g>
  ${name.svg}
  ${spa.svg}
  ${rut.svg}
</svg>
` }
}

const color = lockup({
  mark: markColor,
  defs: steel,
  nameFill: '#1A1814',
  spaFill: '#D3122A',
  rutFill: '#6E6E6A',
})

const black = lockup({
  mark: markBlack,
  defs: '',
  nameFill: '#1A1814',
  spaFill: '#1A1814',
  rutFill: '#1A1814',
})

const isotipo = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 98" width="80" height="98">
  <title>Isotipo LMO INOX SPA</title>
  <defs>${steel}</defs>
  ${markColor}
</svg>
`

function writePair(name, svg, pngWidth) {
  writeFileSync(join(root, `${name}.svg`), svg)
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: pngWidth },
    background: 'rgba(0,0,0,0)',
  }).render()
  writeFileSync(join(root, `${name}.png`), png.asPng())
}

writePair('lmo-inox-logo-color', color.svg, 4800)
writePair('lmo-inox-logo-negro', black.svg, 4800)
writePair('lmo-inox-isotipo', isotipo, 2400)

const whitePng = new Resvg(color.svg, {
  fitTo: { mode: 'width', value: 4800 },
  background: '#ffffff',
}).render()
writeFileSync(join(root, 'lmo-inox-logo-color-fondo-blanco.png'), whitePng.asPng())

console.log('color', color.width, 'x', color.height)
