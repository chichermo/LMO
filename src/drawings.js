const stroke = 'stroke="#1a1814" stroke-width="1.6" stroke-linejoin="miter" fill="none"'

export function drawingFor(category, material = '304') {
  const tint = material.includes('duplex') || material === '316' ? '#8a8d92' : material === 'hdpe' ? '#2b2b2b' : material === 'carbono' ? '#6a6256' : '#b9b6ae'
  switch (category) {
    case 'flanges':
      return flange(tint)
    case 'fitting':
      return elbow(tint)
    case 'tubos':
    case 'canerias':
      return pipe(tint)
    case 'perfiles':
      return angle(tint)
    case 'valvulas':
      return valve(tint)
    case 'planchas':
      return plate(tint)
    case 'hdpe':
      return hdpe(tint)
    case 'duplex':
      return duplex(tint)
    default:
      return flange(tint)
  }
}

function flange(tint) {
  return `<svg viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="46" fill="${tint}" fill-opacity=".18" stroke="#1a1814" stroke-width="1.6"/>
    <circle cx="60" cy="60" r="34" ${stroke}/>
    <circle cx="60" cy="60" r="16" ${stroke} fill="#efe8d8"/>
    <circle cx="60" cy="18" r="4.2" ${stroke}/><circle cx="60" cy="102" r="4.2" ${stroke}/>
    <circle cx="18" cy="60" r="4.2" ${stroke}/><circle cx="102" cy="60" r="4.2" ${stroke}/>
    <circle cx="30.5" cy="30.5" r="4.2" ${stroke}/><circle cx="89.5" cy="30.5" r="4.2" ${stroke}/>
    <circle cx="30.5" cy="89.5" r="4.2" ${stroke}/><circle cx="89.5" cy="89.5" r="4.2" ${stroke}/>
    <path d="M60 6v8M60 106v8M6 60h8M106 60h8" stroke="#d3122a" stroke-width="1.4"/>
  </svg>`
}

function elbow(tint) {
  return `<svg viewBox="0 0 120 120" aria-hidden="true">
    <path d="M18 38h42c22 0 34 12 34 34v30" fill="${tint}" fill-opacity=".18" stroke="#1a1814" stroke-width="1.6" fill-rule="evenodd"/>
    <path d="M18 50h38c14 0 22 8 22 22v30" ${stroke}/>
    <rect x="10" y="32" width="14" height="24" ${stroke}/>
    <rect x="86" y="92" width="24" height="14" ${stroke}/>
    <path d="M18 38h-8M104 106v8" stroke="#d3122a" stroke-width="1.4"/>
  </svg>`
}

function pipe(tint) {
  return `<svg viewBox="0 0 120 120" aria-hidden="true">
    <ellipse cx="28" cy="60" rx="14" ry="22" fill="${tint}" fill-opacity=".2" stroke="#1a1814" stroke-width="1.6"/>
    <path d="M28 38h64M28 82h64" ${stroke}/>
    <ellipse cx="92" cy="60" rx="14" ry="22" ${stroke}/>
    <ellipse cx="92" cy="60" rx="7" ry="12" ${stroke} fill="#efe8d8"/>
    <path d="M20 28h80" stroke="#d3122a" stroke-width="1.3"/>
  </svg>`
}

function angle(tint) {
  return `<svg viewBox="0 0 120 120" aria-hidden="true">
    <path d="M28 20h28v52h44v28H28V20Z" fill="${tint}" fill-opacity=".2" stroke="#1a1814" stroke-width="1.6"/>
    <circle cx="42" cy="36" r="5" ${stroke}/>
    <circle cx="42" cy="54" r="5" ${stroke}/>
    <circle cx="42" cy="72" r="5" ${stroke}/>
    <path d="M28 104h72" stroke="#d3122a" stroke-width="2"/>
  </svg>`
}

function valve(tint) {
  return `<svg viewBox="0 0 120 120" aria-hidden="true">
    <rect x="18" y="52" width="84" height="22" fill="${tint}" fill-opacity=".2" stroke="#1a1814" stroke-width="1.6"/>
    <path d="M40 52l20 22 20-22v22H40V52Z" ${stroke}/>
    <rect x="54" y="24" width="12" height="28" ${stroke}/>
    <circle cx="60" cy="22" r="12" ${stroke}/>
    <path d="M48 22h24" ${stroke}/>
    <rect x="10" y="48" width="12" height="30" ${stroke}/>
    <rect x="98" y="48" width="12" height="30" ${stroke}/>
  </svg>`
}

function plate(tint) {
  return `<svg viewBox="0 0 120 120" aria-hidden="true">
    <path d="M18 32h78l8 12v50H26l-8-12V32Z" fill="${tint}" fill-opacity=".22" stroke="#1a1814" stroke-width="1.6"/>
    <path d="M18 32l8 12h78" ${stroke}/>
    <path d="M26 44v50" ${stroke}/>
    <path d="M22 88h70" stroke="#d3122a" stroke-width="1.4"/>
  </svg>`
}

function hdpe(tint) {
  return `<svg viewBox="0 0 120 120" aria-hidden="true">
    <rect x="22" y="44" width="76" height="32" rx="16" fill="${tint}" fill-opacity=".18" stroke="#1a1814" stroke-width="1.6"/>
    <circle cx="28" cy="60" r="14" ${stroke}/>
    <circle cx="92" cy="60" r="14" ${stroke}/>
    <circle cx="92" cy="60" r="7" ${stroke}/>
    <path d="M40 60h40" stroke="#d3122a" stroke-width="1.6"/>
  </svg>`
}

function duplex(tint) {
  return `<svg viewBox="0 0 120 120" aria-hidden="true">
    <polygon points="60,14 102,38 102,82 60,106 18,82 18,38" fill="${tint}" fill-opacity=".18" stroke="#1a1814" stroke-width="1.6"/>
    <polygon points="60,34 86,50 86,74 60,90 34,74 34,50" ${stroke}/>
    <circle cx="60" cy="60" r="8" ${stroke}/>
    <path d="M60 14v20M60 90v16" stroke="#d3122a" stroke-width="1.4"/>
  </svg>`
}
