import { SITE } from './data/site.js'
import { getQuote, updateQty, removeItem, clearQuote, quoteText } from './quote.js'
import { whatsappUrl, toast } from './main.js'
import { staggerIn } from './motion.js'

const list = document.querySelector('[data-quote-list]')
const form = document.querySelector('[data-quote-form]')
const wa = document.querySelector('[data-wa]')

function render() {
  const items = getQuote()
  if (!list) return
  if (!items.length) {
    list.innerHTML = `<div class="empty">Aún no hay ítems. Agregue productos desde el <a href="/productos.html">catálogo</a> o descríbalos en el mensaje.</div>`
    return
  }
  list.innerHTML = items
    .map(
      (i) => `
      <div class="quote-item">
        <div>
          <strong>${i.name}</strong>
          <div class="muted">${i.note}</div>
        </div>
        <input class="qty" type="number" min="1" value="${i.qty}" data-qty="${i.id}" aria-label="Cantidad ${i.name}">
        <button class="linkish" type="button" data-remove="${i.id}">Quitar</button>
      </div>`
    )
    .join('')
  staggerIn(list.querySelectorAll('.quote-item'), { from: 'first', y: 12, duration: 480 })
}

list?.addEventListener('input', (e) => {
  const input = e.target.closest('[data-qty]')
  if (!input) return
  updateQty(input.dataset.qty, Number(input.value || 1))
})

list?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove]')
  if (!btn) return
  removeItem(btn.dataset.remove)
  render()
})

document.querySelector('[data-clear]')?.addEventListener('click', () => {
  clearQuote()
  render()
})

function payload(formEl) {
  const data = Object.fromEntries(new FormData(formEl))
  return `Cotización LMO INOX SPA
Empresa: ${data.empresa}
RUT: ${data.rut}
Contacto: ${data.contacto}
Email: ${data.email}
Teléfono: ${data.telefono}
Ciudad: ${data.ciudad}

${quoteText()}

Notas: ${data.notas || '—'}
`
}

form?.addEventListener('submit', (e) => {
  e.preventDefault()
  const body = payload(form)
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent('Cotización LMO INOX')}&body=${encodeURIComponent(body)}`
  window.location.href = mailto
  toast('Abriendo su cliente de correo')
})

if (wa) wa.href = whatsappUrl()
window.addEventListener('lmo:quote', () => {
  if (wa) wa.href = whatsappUrl()
})

render()
