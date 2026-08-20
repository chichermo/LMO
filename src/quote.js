const KEY = 'lmo-quote-v1'

export function getQuote() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function saveQuote(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent('lmo:quote'))
}

export function addToQuote(product, qty = 1) {
  const items = getQuote()
  const found = items.find((i) => i.id === product.id)
  if (found) found.qty += qty
  else {
    items.push({
      id: product.id,
      name: product.name,
      qty,
      note: product.sizes,
    })
  }
  saveQuote(items)
  return items
}

export function updateQty(id, qty) {
  const items = getQuote().map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
  saveQuote(items)
}

export function removeItem(id) {
  saveQuote(getQuote().filter((i) => i.id !== id))
}

export function clearQuote() {
  saveQuote([])
}

export function countQuote() {
  return getQuote().reduce((n, i) => n + i.qty, 0)
}

export function quoteText() {
  const items = getQuote()
  if (!items.length) return 'Quiero cotizar materiales LMO INOX.'
  const lines = items.map((i) => `• ${i.name} × ${i.qty} (${i.note})`).join('\n')
  return `Hola, quiero cotizar con LMO INOX SPA:\n\n${lines}\n\nQuedo atento.`
}
