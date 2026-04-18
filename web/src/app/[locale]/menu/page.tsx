import { getMenuItems } from '@/lib/sheets'
import { MenuGrid } from '@/components/menu/MenuGrid'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'メニュー | Bella Frutta DAIKANYAMA',
  description: '旬の果物を使ったスムージー・カットフルーツをご用意しています。',
}

export default async function MenuPage() {
  let items: Awaited<ReturnType<typeof getMenuItems>> = []
  try {
    items = await getMenuItems()
  } catch {
    // Sheets not configured
  }

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
            メニュー
          </h1>
          <p className="text-sm" style={{ color: 'var(--bf-ink-muted)' }}>
            旬の果物を使ったスムージー・カットフルーツをご用意しています。
          </p>
        </div>
        <MenuGrid items={items} />
      </div>
    </div>
  )
}
