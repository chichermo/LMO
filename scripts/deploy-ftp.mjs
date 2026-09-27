import { Client } from 'basic-ftp'

const server = process.env.FTP_SERVER
const user = process.env.FTP_USERNAME
const password = process.env.FTP_PASSWORD
const remoteDir = process.env.FTP_SERVER_DIR || 'public_html'

if (!server || !user || !password) {
  console.error(`Faltan credenciales FTP.

En PowerShell (solo esta sesión):
  $env:FTP_SERVER="ftp.lmoinox.cl"
  $env:FTP_USERNAME="su_usuario"
  $env:FTP_PASSWORD="su_clave"
  npm run deploy
`)
  process.exit(1)
}

const client = new Client(120000)
client.ftp.verbose = false

try {
  console.log(`Conectando a ${server}…`)
  await client.access({
    host: server,
    user,
    password,
    secure: false,
  })
  await client.ensureDir(remoteDir)
  console.log(`Subiendo dist/ → ${remoteDir}/ (sobrescribe archivos del sitio)`)
  await client.uploadFromDir('dist')
  console.log('Deploy FTP listo.')
} catch (err) {
  console.error('Deploy FTP falló:', err.message)
  process.exit(1)
} finally {
  client.close()
}
