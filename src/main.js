import { SITE, NAV } from './data/site.js'
import { countQuote, quoteText } from './quote.js'
import { bootMotion, countPunch, toastMotion } from './motion.js'
import './styles/main.css'

const page = document.body.dataset.page || ''

function header() {
  return `
    <a class="skip" href="#contenido">Saltar al contenido</a>
    <div class="progress" data-progress></div>
    <header class="site-header">
      <a class="brand" href="/">
        <img src="/brand/mark.svg" alt="" width="34" height="41">
        <span class="brand-type">
          <strong>LMO INOX</strong>
          <span>SPA · ${SITE.rut}</span>
        </span>
      </a>
      <nav class="nav" data-nav>
        ${NAV.map((item) => `<a href="${item.href}" ${page.includes(item.match) ? 'aria-current="page"' : ''}>${item.label}</a>`).join('')}
      </nav>
      <div class="header-cta">
        <a class="btn btn-red" href="/cotizar.html">Cotizar <span class="quote-count" data-count>00</span></a>
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
            <li><a href="/productos.html?cat=flanges">Flanges</a></li>
            <li><a href="/productos.html?cat=fitting">Fitting</a></li>
            <li><a href="/productos.html?cat=valvulas">Válvulas</a></li>
            <li><a href="/productos.html?cat=duplex">Duplex / Súper Duplex</a></li>
            <li><a href="/productos.html?cat=hdpe">HDPE</a></li>
          </ul>
        </div>
        <div>
          <h3>Empresa</h3>
          <ul>
            <li><a href="/empresa.html">Quiénes somos</a></li>
            <li><a href="/contacto.html">Contacto</a></li>
            <li><a href="/cotizar.html">Solicitar cotización</a></li>
          </ul>
        </div>
        <div>
          <h3>Contacto</h3>
          <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
          <p>${SITE.phoneDisplay}</p>
          <p>${SITE.city}</p>
          <p>${SITE.hours}</p>
        </div>
      </div>
      <div class="legal">
        <span>Acta ${SITE.founded} · N° ${SITE.atencion}</span>
        <span>© ${new Date().getFullYear()} ${SITE.legal}</span>
      </div>
    </footer>
    <a class="wa" href="${whatsappUrl()}" target="_blank" rel="noreferrer" aria-label="WhatsApp">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.1 4.9A9.9 9.9 0 0 0 3.3 18.6L2 22l3.5-1.3A9.9 9.9 0 0 0 19.1 4.9Zm-7.1 15a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-2.4.9.9-2.3-.2-.3A8.2 8.2 0 1 1 12 20Zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1l-.6.8c-.1.2-.3.2-.6.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.6l.4-.5.1-.3c0-.1 0-.3-.1-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 1.4.6 1.9.6 2.6.5.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.1-.4-.2Z" fill="currentColor"/></svg>
    </a>
    <div class="toast" data-toast></div>
  `
}

export function whatsappUrl(text = quoteText()) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`
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

  window.addEventListener('lmo:quote', syncCount)
  syncCount()
  bootMotion()
}

mountChrome()
