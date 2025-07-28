import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es', 'de', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'tr', 'zh', 'ru', 'fil', 'uk'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/pathnames': {
      en: '/',
      es: 'es',
      de: 'de',
      fr: 'fr',
      hi: 'hi',
      it: 'it',
      ja: 'ja',
      ko: 'ko',
      pt: 'pt',
      tr: 'tr',
      zh: 'zh',
      ru: 'ru',
      fil: 'fil',
      uk: 'uk'
    }
  }
})
