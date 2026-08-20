import { CATEGORIES, MATERIALS, PRODUCTS, filterProducts } from './data/products.js'
import { drawingFor } from './drawings.js'
import { addToQuote } from './quote.js'
import { toast } from './main.js'
import { bindPlateHover, drawSvg, punch, staggerIn, staggerOut } from './motion.js'

const params = new URLSearchParams(location.search)
const q = document.querySelector('[name="q"]')
const cat = document.querySelector('[name="cat"]')
const mat = document.querySelector('[name="mat"]')
const grid = document.querySelector('[data-grid]')
const tally = document.querySelector('[data-tally]')

if (cat) {
  cat.innerHTML = `<option value="">Todas</option>` + CATEGORIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')
  cat.value = params.get('cat') || ''
}
if (mat) {
  mat.innerHTML = `<option value="">Todos</option>` + MATERIALS.map((m) => `<option value="${m.id}">${m.name}</option>`).join('')
  mat.value = params.get('mat') || ''
}
if (q) q.value = params.get('q') || ''

let generation = 0
let firstPaint = true

function plateMarkup(p) {
  return `
    <article class="product-plate">
      <div class="product-viz">${drawingFor(p.category, p.material)}</div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.summary}</p>
        <div class="spec-inline">
          ${p.norms.map((n) => `<i>${n}</i>`).join('')}
          <i>${p.sizes}</i>
        </div>
        <div class="plate-actions">
          <a class="btn" href="/producto.html?id=${p.id}">Ficha</a>
          <button class="btn btn-red" type="button" data-add="${p.id}">Añadir a cotización</button>
        </div>
      </div>
    </article>`
}

function paint(list) {
  if (!grid) return
  if (!list.length) {
    grid.innerHTML = `<div class="empty">No hay coincidencias. Ajuste filtros o pida el ítem por cotización.</div>`
    return
  }
  grid.innerHTML = list.map(plateMarkup).join('')
  const plates = grid.querySelectorAll('.product-plate')
  staggerIn(plates, { from: firstPaint ? 'center' : 'first' })
  plates.forEach((plate) => {
    bindPlateHover(plate)
    drawSvg(plate.querySelector('svg'), { duration: 980, step: 22 })
  })
  firstPaint = false
}

async function render() {
  const my = ++generation
  const list = filterProducts({
    q: q?.value || '',
    category: cat?.value || '',
    material: mat?.value || '',
  })
  if (tally) tally.textContent = `${String(list.length).padStart(2, '0')} ítems`

  const existing = grid?.querySelectorAll('.product-plate')
  if (existing?.length) {
    await staggerOut(existing)
    if (my !== generation) return
  }
  if (my !== generation) return
  paint(list)
}

function persist() {
  const next = new URLSearchParams()
  if (q?.value) next.set('q', q.value)
  if (cat?.value) next.set('cat', cat.value)
  if (mat?.value) next.set('mat', mat.value)
  history.replaceState(null, '', `${location.pathname}${next.toString() ? `?${next}` : ''}`)
}

let searchTimer = 0
q?.addEventListener('input', () => {
  persist()
  clearTimeout(searchTimer)
  searchTimer = window.setTimeout(render, 160)
})
;[cat, mat].forEach((el) => {
  el?.addEventListener('change', () => {
    persist()
    render()
  })
})

grid?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]')
  if (!btn) return
  const product = PRODUCTS.find((p) => p.id === btn.dataset.add)
  if (!product) return
  addToQuote(product)
  punch(btn.closest('.product-plate'))
  toast('Ítem añadido a la cotización')
})

staggerIn(document.querySelectorAll('.filters .field'), { from: 'first', y: 12, duration: 480 })

render()
