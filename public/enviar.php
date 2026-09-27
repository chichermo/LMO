<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const TO = 'ventas@lmoinox.cl';
const FROM = 'info@lmoinox.cl';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
  exit;
}

function read_input(): array
{
  $raw = file_get_contents('php://input') ?: '';
  $json = json_decode($raw, true);
  if (is_array($json)) {
    return $json;
  }
  return $_POST;
}

function clean_line(string $value): string
{
  return trim(str_replace(["\r", "\n", "\0"], '', $value));
}

function field(array $data, string $key, int $max = 240): string
{
  $value = isset($data[$key]) ? clean_line((string) $data[$key]) : '';
  if (function_exists('mb_substr')) {
    return mb_substr($value, 0, $max);
  }
  return substr($value, 0, $max);
}

function field_text(array $data, string $key, int $max = 4000): string
{
  $value = isset($data[$key]) ? trim(str_replace("\0", '', (string) $data[$key])) : '';
  $value = str_replace(["\r\n", "\r"], "\n", $value);
  if (function_exists('mb_substr')) {
    return mb_substr($value, 0, $max);
  }
  return substr($value, 0, $max);
}

function fail(int $code, string $message): void
{
  http_response_code($code);
  echo json_encode(['ok' => false, 'error' => $message]);
  exit;
}

$data = read_input();

if (field($data, 'website') !== '') {
  echo json_encode(['ok' => true]);
  exit;
}

$tipo = field($data, 'tipo', 20);
if (!in_array($tipo, ['contacto', 'cotizacion'], true)) {
  fail(400, 'Formulario no válido');
}

$nombre = field($data, 'nombre');
$empresa = field($data, 'empresa');
$email = field($data, 'email');
$telefono = field($data, 'telefono');
$ciudad = field($data, 'ciudad');
$rut = field($data, 'rut');
$mensaje = field_text($data, 'mensaje');

if ($nombre === '' || $empresa === '' || $telefono === '' || $mensaje === '') {
  fail(400, 'Complete los campos obligatorios');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  fail(400, 'El email no es válido');
}

$label = $tipo === 'cotizacion' ? 'Cotización' : 'Contacto';
$asunto = $label . ' LMO INOX SPA · ' . ($empresa !== '' ? $empresa : $nombre);
if (function_exists('mb_encode_mimeheader')) {
  $asunto = mb_encode_mimeheader($asunto, 'UTF-8', 'B', "\r\n");
}

$cuerpo = implode("\n", [
  $label . ' desde lmoinox.cl',
  '',
  'Nombre: ' . $nombre,
  'Empresa: ' . $empresa,
  'RUT: ' . ($rut !== '' ? $rut : '—'),
  'Email: ' . $email,
  'Teléfono: ' . $telefono,
  'Ciudad / faena: ' . ($ciudad !== '' ? $ciudad : '—'),
  '',
  $mensaje,
  '',
  '—',
  'Enviado el ' . gmdate('Y-m-d H:i') . ' UTC',
]);

$headers = [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
  'From: LMO INOX SPA <' . FROM . '>',
  'Reply-To: ' . $nombre . ' <' . $email . '>',
  'X-Mailer: LMO-INOX-Web',
];

$headerLine = implode("\r\n", $headers);
$ok = @mail(TO, $asunto, $cuerpo, $headerLine, '-f' . FROM);
if (!$ok) {
  $ok = @mail(TO, $asunto, $cuerpo, $headerLine);
}

if (!$ok) {
  fail(500, 'No se pudo enviar. Escriba a ventas@lmoinox.cl');
}

echo json_encode(['ok' => true]);
