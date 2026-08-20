import './main.js'
import { CATEGORIES } from './data/products.js'
import { drawingFor } from './drawings.js'
import { bindPlateHover, drawSvg, staggerIn } from './motion.js'
import { onScroll } from 'animejs'

const root = document.querySelector('[data-cats]')
if (root) {
  root.innerHTML = CATEGORIES.map(
    (c) => `
    <a class="cat-tile" href="/productos.html?cat=${c.id}">
      <span class="heat">${c.kicker}</span>
      <h3>${c.name}</h3>
      <p>${c.blurb}</p>
      <div class="cat-draw">${drawingFor(c.id)}</div>
    </a>`
  ).join('')
  const tiles = root.querySelectorAll('.cat-tile')
  staggerIn(tiles, { from: 'center', y: 32 })
  tiles.forEach((tile) => {
    bindPlateHover(tile)
    drawSvg(tile.querySelector('svg'), { duration: 1000, step: 24 })
  })
}

const industries = document.querySelectorAll('.industries li')
const industryRow = document.querySelector('.industries')
if (industries.length && industryRow) {
  onScroll({
    target: industryRow,
    enter: 'bottom-=8% top',
    repeat: false,
    onEnter: () => staggerIn(industries, { from: 'first', y: 18, duration: 560 }),
  })
}
