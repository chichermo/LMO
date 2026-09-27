import { SITE, NAV } from './data/site.js'
import { CATEGORIES } from './data/products.js'
import { countQuote, quoteText } from './quote.js'
import { bootMotion, countPunch, toastMotion } from './motion.js'
import './styles/main.css'

const page = document.body.dataset.page || ''

function header() {
  return `
    <a class="skip" href="#contenido">Saltar al contenido</a>
    <div class="progress" data-progress></div>
    <header class="site-header">
      <a class="brand" href="index.html">
        <img src="brand/mark.svg" alt="" width="34" height="41">
        <span class="brand-type">
          <strong>LMO INOX</strong>
          <span>SPA · ${SITE.rut}</span>
        </span>
      </a>
      <nav class="nav" data-nav>
        ${NAV.map((item) => `<a href="${item.href}" ${page === item.match || page.includes(item.match) && item.match !== 'home' ? 'aria-current="page"' : ''}>${item.label}</a>`).join('')}
        <button type="button" data-back>Regresar</button>
      </nav>
      <div class="header-cta">
        <a class="btn btn-red" href="cotizar.html">Cotizar <span class="quote-count" data-count>00</span></a>
        <button class="nav-toggle" type="button" aria-label="Abrir menú" data-toggle><span></span></button>
      </div>
    </header>
  `
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="foot-grid">
        <div>
          <h3>Sociedad</h3>
          <p><strong>${SITE.legal}</strong></p>
          <p>RUT ${SITE.rut}</p>
          <p>Compra y venta de materiales de acero.</p>
        </div>
        <div>
          <h3>Catálogo</h3>
          <ul>
            ${CATEGORIES.map((c) => `<li><a href="productos.html?cat=${c.id}">${c.name}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h3>Menú</h3>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="productos.html">Catálogo</a></li>
            <li><a href="empresa.html">Quiénes somos</a></li>
            <li><a href="contacto.html">Contacto</a></li>
            <li><a href="cotizar.html">Solicitar cotización</a></li>
          </ul>
        </div>
        <div>
          <h3>Contacto</h3>
          <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
          ${SITE.whatsapp.map((w) => `<p><a href="${whatsappUrl(w.id)}" target="_blank" rel="noreferrer">${w.display}</a></p>`).join('')}
          <p>${SITE.city}</p>
          <p>${SITE.hours}</p>
        </div>
      </div>
      <div class="legal">
        <span>Acta ${SITE.founded} · N° ${SITE.atencion}</span>
        <span>© ${new Date().getFullYear()} ${SITE.legal}</span>
      </div>
    </footer>
    <div class="wa-dock" data-wa-dock>
      <div class="wa-panel" data-wa-panel hidden>
        <p class="wa-kicker">Elegir WhatsApp</p>
        <div data-wa-links>${waLinkMarkup()}</div>
      </div>
      <button class="wa" type="button" data-wa-toggle aria-expanded="false" aria-label="Elegir WhatsApp">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.1 4.9A9.9 9.9 0 0 0 3.3 18.6L2 22l3.5-1.3A9.9 9.9 0 0 0 19.1 4.9Zm-7.1 15a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-2.4.9.9-2.3-.2-.3A8.2 8.2 0 1 1 12 20Zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1l-.6.8c-.1.2-.3.2-.6.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.6l.4-.5.1-.3c0-.1 0-.3-.1-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 1.4.6 1.9.6 2.6.5.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.1-.4-.2Z" fill="currentColor"/></svg>
      </button>
    </div>
    <div class="toast" data-toast></div>
  `
}

export function whatsappUrl(phone = SITE.whatsapp[0].id, text = quoteText()) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

function waLinkMarkup(text = quoteText()) {
  return SITE.whatsapp
    .map(
      (w) => `
      <a href="${whatsappUrl(w.id, text)}" target="_blank" rel="noreferrer">
        <small>${w.label}</small>
        <strong>${w.display}</strong>
      </a>`
    )
    .join('')
}

export function setWhatsAppOpen(open) {
  const dock = document.querySelector('[data-wa-dock]')
  const panel = document.querySelector('[data-wa-panel]')
  const toggle = document.querySelector('[data-wa-toggle]')
  if (!dock || !panel || !toggle) return
  dock.classList.toggle('open', open)
  panel.hidden = !open
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
}

export function openWhatsAppPicker() {
  const links = document.querySelector('[data-wa-links]')
  if (links) links.innerHTML = waLinkMarkup()
  setWhatsAppOpen(true)
}

function bindWhatsAppPicker() {
  const dock = document.querySelector('[data-wa-dock]')
  const toggle = document.querySelector('[data-wa-toggle]')
  if (!dock || !toggle) return

  const links = document.querySelector('[data-wa-links]')
  if (links) links.innerHTML = waLinkMarkup()

  toggle.addEventListener('click', () => {
    const open = !dock.classList.contains('open')
    if (open) openWhatsAppPicker()
    else setWhatsAppOpen(false)
  })

  dock.addEventListener('click', (event) => {
    if (event.target.closest('a')) setWhatsAppOpen(false)
  })

  document.addEventListener('click', (event) => {
    if (!dock.classList.contains('open')) return
    if (event.target.closest('[data-wa-dock]') || event.target.closest('[data-wa-open]')) return
    setWhatsAppOpen(false)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setWhatsAppOpen(false)
  })

  window.addEventListener('lmo:quote', () => {
    if (links) links.innerHTML = waLinkMarkup()
  })
}

function syncCount() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const next = String(countQuote()).padStart(2, '0')
    if (el.textContent === next) return
    el.textContent = next
    countPunch(el)
  })
}

export function toast(message) {
  const el = document.querySelector('[data-toast]')
  if (!el) return
  el.textContent = message
  el.classList.add('show')
  toastMotion(el, true)
  clearTimeout(toast._t)
  toast._t = setTimeout(() => {
    toastMotion(el, false)
    el.classList.remove('show')
  }, 2200)
}

export function mountChrome() {
  const root = document.querySelector('[data-app]')
  if (!root) return
  root.insertAdjacentHTML('afterbegin', header())
  root.insertAdjacentHTML('beforeend', footer())

  const nav = document.querySelector('[data-nav]')
  document.querySelector('[data-toggle]')?.addEventListener('click', () => {
    nav?.classList.toggle('open')
  })
  document.querySelectorAll('[data-back]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (window.history.length > 1) window.history.back()
      else window.location.href = 'index.html'
    })
  })

  window.addEventListener('lmo:quote', syncCount)
  syncCount()
  bindWhatsAppPicker()
  bootMotion()
}

mountChrome()
