import { getProduct, getCategory, MATERIALS } from './data/products.js'
import { drawingFor } from './drawings.js'
import { addToQuote } from './quote.js'
import { toast } from './main.js'
import { animate, stagger, utils } from 'animejs'
import { drawSvg, punch, reduced } from './motion.js'

const id = new URLSearchParams(location.search).get('id')
const product = getProduct(id)
const root = document.querySelector('[data-detail]')

if (!product || !root) {
  if (root) {
    root.innerHTML = `<div class="empty">No encontramos esa ficha. <a href="/productos.html">Volver al catálogo</a>.</div>`
  }
} else {
  const cat = getCategory(product.category)
  const mat = MATERIALS.find((m) => m.id === product.material)
  document.title = `${product.name} · LMO INOX SPA`
  root.innerHTML = `
    <div class="detail">
      <div class="detail-viz">${drawingFor(product.category, product.material)}</div>
      <div class="detail-body">
        <p class="kicker"><span class="rule"></span> ${cat?.name || ''} · ${mat?.name || ''}</p>
        <h1>${product.name}</h1>
        <p class="lede" style="margin-top:1rem">${product.summary}</p>
        <table class="spec-table">
          <tr><th>Normas</th><td>${product.norms.join(' · ')}</td></tr>
          <tr><th>Rango</th><td>${product.sizes}</td></tr>
          <tr><th>Clase / schedule</th><td>${product.classes}</td></tr>
          <tr><th>Acabado</th><td>${product.finish}</td></tr>
          <tr><th>Usos</th><td>${product.uses.join(' · ')}</td></tr>
        </table>
        <div class="hero-actions">
          <button class="btn btn-red" type="button" data-add>Añadir a cotización</button>
          <a class="btn" href="/productos.html?cat=${product.category}">Más de ${cat?.name || 'esta línea'}</a>
        </div>
      </div>
    </div>
  `
  const viz = root.querySelector('.detail-viz svg')
  drawSvg(viz, { duration: 1400, step: 36 })
  if (!reduced) {
    const rows = root.querySelectorAll('.spec-table tr, .detail-body h1, .detail-body .lede, .hero-actions')
    utils.set(rows, { opacity: 0, y: 16 })
    animate(rows, {
      opacity: 1,
      y: 0,
      duration: 620,
      ease: 'outExpo',
      delay: stagger(70),
    })
  }
  root.querySelector('[data-add]')?.addEventListener('click', () => {
    addToQuote(product)
    punch(root.querySelector('.detail'))
    toast('Ítem añadido a la cotización')
  })
}
