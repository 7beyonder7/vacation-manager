import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import fr from './locales/fr.json'

const saved = localStorage.getItem('lang')
const fallback = 'en'
const locale = saved || (navigator.language?.startsWith('fr') ? 'fr' : 'en')

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale,
  fallbackLocale: fallback,
  messages: { en, fr }
})
