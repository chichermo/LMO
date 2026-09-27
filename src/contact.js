import { toast } from './main.js'
import { bindMailForm } from './mail.js'

const form = document.querySelector('[data-contact-form]')
const ok = document.querySelector('[data-form-ok]')

bindMailForm(form, {
  buildPayload: (formEl) => {
    const data = Object.fromEntries(new FormData(formEl))
    return {
      tipo: 'contacto',
      nombre: data.nombre,
      empresa: data.empresa,
      email: data.email,
      telefono: data.telefono,
      mensaje: data.mensaje,
      website: data.website,
    }
  },
  onSuccess: () => {
    form?.setAttribute('hidden', '')
    ok?.removeAttribute('hidden')
    toast('Enviado a ventas@lmoinox.cl')
  },
})
