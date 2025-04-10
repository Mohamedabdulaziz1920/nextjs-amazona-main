// i18n-config.ts
export const i18n = {
  locales: ['en-US', 'ar'] as const, // استخدام as const لتثبيت النوع
  defaultLocale: 'ar',
} as const

export type Locale = (typeof i18n.locales)[number] // 'en-US' | 'ar'

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

export const routing = {
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  localePrefix: 'as-needed',
} as const
