import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        productos: resolve(__dirname, 'productos.html'),
        producto: resolve(__dirname, 'producto.html'),
        cotizar: resolve(__dirname, 'cotizar.html'),
        empresa: resolve(__dirname, 'empresa.html'),
        contacto: resolve(__dirname, 'contacto.html'),
      },
    },
  },
})
