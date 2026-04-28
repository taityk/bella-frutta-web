import { getTranslations, setRequestLocale } from 'next-intl/server'
import { STATIC_MENU_ITEMS } from '@/lib/static-menu'
import { MenuGrid } from '@/components/menu/MenuGrid'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'menu_page' })
  return {
    title: `${t('title')} | Bella Frutta DAIKANYAMA`,
    description: t('description'),
  }
}

export default async function MenuPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'menu_page' })

  const items = STATIC_MENU_ITEMS

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: 'var(--bf-gold)' }}
          >
            MENU
          </p>
          <h1
            className="text-3xl tracking-wider mb-4"
            style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
          >
            {t('title')}
          </h1>
          <p className="text-sm" style={{ color: 'var(--bf-ink-muted)' }}>
            {t('description')}
          </p>
        </div>
        <MenuGrid items={items} />
      </div>
    </div>
  )
}
