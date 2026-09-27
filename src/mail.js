import { toast } from './main.js'

export async function sendLead(payload) {
  const res = await fetch('enviar.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  let data = {}
  try {
    data = await res.json()
  } catch {
    data = {}
  }

  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'No se pudo enviar. Escriba a ventas@lmoinox.cl')
  }
}

export function bindMailForm(form, { buildPayload, onSuccess }) {
  if (!form) return

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (form.querySelector('[name="website"]')?.value) {
      onSuccess?.()
      return
    }

    const btn = form.querySelector('[type="submit"]')
    const original = btn?.textContent
    if (btn) {
      btn.disabled = true
      btn.textContent = 'Enviando…'
    }

    try {
      await sendLead(buildPayload(form))
      onSuccess?.()
    } catch (err) {
      toast(err.message || 'No se pudo enviar')
    } finally {
      if (btn) {
        btn.disabled = false
        if (original) btn.textContent = original
      }
    }
  })
}
