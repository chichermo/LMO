import {
  animate,
  createDrawable,
  createTimeline,
  onScroll,
  splitText,
  stagger,
  utils,
} from 'animejs'

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function geometry(root) {
  return [...root.querySelectorAll('path, circle, ellipse, rect, polygon, polyline, line')].filter((node) => {
    const stroke = node.getAttribute('stroke')
    return stroke && stroke !== 'none'
  })
}

function gridOf(items) {
  const parent = items[0]?.parentElement
  if (!parent) return [1, items.length]
  const cols = getComputedStyle(parent).gridTemplateColumns.split(' ').filter(Boolean).length || 1
  return [cols, Math.ceil(items.length / cols)]
}

export function drawSvg(root, { delay = 0, duration = 1100, step = 30 } = {}) {
  if (reduced || !root) return null
  const nodes = geometry(root)
  if (!nodes.length) return null
  try {
    const drawable = createDrawable(nodes)
    return animate(drawable, {
      draw: ['0 0', '0 1'],
      ease: 'inOut(3)',
      duration,
      delay: stagger(step, { start: delay }),
    })
  } catch {
    return null
  }
}

export function staggerIn(items, { from = 'center', y = 26, duration = 680 } = {}) {
  const list = [...items]
  if (!list.length) return null
  if (reduced) {
    utils.set(list, { opacity: 1, y: 0 })
    return null
  }
  utils.set(list, { opacity: 0, y })
  return animate(list, {
    opacity: 1,
    y: 0,
    duration,
    ease: 'outExpo',
    delay: stagger(42, { grid: gridOf(list), from }),
  })
}

export function staggerOut(items) {
  const list = [...items]
  if (!list.length) return Promise.resolve()
  if (reduced) return Promise.resolve()
  return new Promise((resolve) => {
    animate(list, {
      opacity: 0,
      y: 14,
      duration: 220,
      ease: 'inQuad',
      delay: stagger(10, { from: 'end' }),
      onComplete: resolve,
    })
  })
}

export function bindPlateHover(el) {
  if (reduced || el.dataset.hoverBound) return
  el.dataset.hoverBound = '1'
  const drawing = el.querySelector('svg')
  el.addEventListener('pointerenter', () => {
    animate(el, { y: -5, duration: 280, ease: 'outQuad', composition: 'blend' })
    if (drawing) animate(drawing, { rotate: 6, duration: 520, ease: 'outExpo', composition: 'blend' })
  })
  el.addEventListener('pointerleave', () => {
    animate(el, { y: 0, duration: 280, ease: 'outQuad', composition: 'blend' })
    if (drawing) animate(drawing, { rotate: 0, duration: 420, ease: 'outQuad', composition: 'blend' })
  })
}

export function punch(el) {
  if (!el || reduced) return
  animate(el, {
    scale: [1, 0.978, 1],
    duration: 320,
    ease: 'outQuad',
  })
}

export function revealOnScroll(selector) {
  if (reduced) return
  document.querySelectorAll(selector).forEach((el) => {
    if (el.querySelector('[data-cats], .industries')) return
    utils.set(el, { opacity: 0, y: 36 })
    animate(el, {
      opacity: 1,
      y: 0,
      duration: 780,
      ease: 'outQuart',
      autoplay: onScroll({
        target: el,
        enter: 'bottom-=12% top',
        repeat: false,
      }),
    })
  })
}

function heroMotion() {
  const title = document.querySelector('.hero h1')
  const plate = document.querySelector('.drawing-plate svg')
  const plotter = document.querySelector('[data-plotter]')
  if (!title) return

  if (reduced) {
    if (plate) drawSvg(plate, { duration: 0 })
    return
  }

  const split = splitText(title, { words: true, chars: false })
  utils.set(split.words, { y: 36, opacity: 0 })
  utils.set('.hero .kicker, .hero .lede, .hero-actions, .hero-meta, .drawing-label', { opacity: 0, y: 16 })

  const tl = createTimeline({ defaults: { ease: 'outExpo' } })
  tl.add('.hero .kicker', { opacity: 1, y: 0, duration: 500 }, 0)
  tl.add(
    split.words,
    {
      opacity: 1,
      y: 0,
      duration: 780,
      delay: stagger(55),
    },
    80
  )
  tl.add('.hero .lede, .hero-actions, .hero-meta', { opacity: 1, y: 0, duration: 620, delay: stagger(90) }, 420)
  tl.add('.drawing-label', { opacity: 1, y: 0, duration: 500 }, 280)

  if (plate) drawSvg(plate, { delay: 180, duration: 1400, step: 38 })

  if (plotter) {
    createTimeline({ loop: true, defaults: { ease: 'inOutSine', duration: 1600 } })
      .add(plotter, { x: 28, y: 24 }, 0)
      .add(plotter, { x: 210, y: 70 })
      .add(plotter, { x: 120, y: 200 })
      .add(plotter, { x: 48, y: 150 })
      .add(plotter, { x: 28, y: 24 })
  }
}

function chromeMotion() {
  if (reduced) return
  const header = document.querySelector('.site-header')
  const wa = document.querySelector('.wa')
  const bar = document.querySelector('[data-progress]')
  if (header) {
    utils.set(header, { y: -18, opacity: 0 })
    animate(header, { y: 0, opacity: 1, duration: 640, ease: 'outQuart' })
  }
  if (wa) {
    utils.set(wa, { y: 40, opacity: 0 })
    animate(wa, { y: 0, opacity: 1, duration: 520, delay: 700, ease: 'outExpo' })
  }
  if (bar) {
    utils.set(bar, { scaleX: 0 })
    bar.style.transformOrigin = '0 50%'
    animate(bar, {
      scaleX: 1,
      ease: 'linear',
      autoplay: onScroll({ target: document.documentElement, sync: true }),
    })
  }

  const intro = document.querySelector('.page-intro')
  if (intro) {
    const bits = intro.querySelectorAll('h1, .lede, .kicker')
    utils.set(bits, { opacity: 0, y: 18 })
    animate(bits, { opacity: 1, y: 0, duration: 680, ease: 'outExpo', delay: stagger(70) })
  }
}

export function bootMotion() {
  chromeMotion()
  heroMotion()
  revealOnScroll('.section, .cta-band')
}

export function toastMotion(el, show) {
  if (!el) return
  if (reduced) {
    el.style.transform = show ? 'none' : 'translateY(120%)'
    return
  }
  animate(el, {
    y: show ? 0 : 80,
    opacity: show ? 1 : 0,
    duration: show ? 420 : 280,
    ease: show ? 'outExpo' : 'inQuad',
    composition: 'replace',
  })
}

export function countPunch(el) {
  if (!el || reduced) return
  animate(el, {
    scale: [1, 1.18, 1],
    duration: 280,
    ease: 'outExpo',
  })
}
