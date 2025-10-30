import en from './en.js'
import fr from './fr.js'

const catalogs = { en, fr }

function pickLocale(header = 'en') {
  const h = String(header).toLowerCase()
  if (h.startsWith('fr')) return 'fr'
  return 'en'
}

/** Resolve a dotted key like "errors.overlapCreate" */
export function t(header, key) {
  const loc = pickLocale(header)
  const dict = catalogs[loc] || catalogs.en
  return key.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), dict)
}
