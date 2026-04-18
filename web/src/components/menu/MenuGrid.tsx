'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import type { MenuItem } from '@/lib/types'

type Props = {
  items: MenuItem[]
}

export function MenuGrid({ items }: Props) {
  const t = useTranslations('menu_page')
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState<'all' | 'smoothie' | 'fruit'>('all')

  const filtered = activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory)

  const tabs = [
    { key: 'all' as const, label: t('all') },
    { key: 'smoothie' as const, label: t('smoothie') },
    { key: 'fruit' as const, label: t('fruit') },
  ]

  return (
    <>
      {/* タブ */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className="px-5 py-2 rounded-full text-sm tracking-wider transition-colors"
            style={{
              backgroundColor: activeCategory === tab.key ? 'var(--bf-accent)' : 'var(--bf-base-2)',
              color: activeCategory === tab.key ? 'white' : 'var(--bf-ink-muted)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* グリッド */}
      {filtered.length === 0 ? (
        <p className="text-sm text-center py-12" style={{ color: 'var(--bf-ink-faint)' }}>
          {activeCategory === 'all' ? 'メニューを準備中です。' : '該当する商品がありません。'}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--bf-surface)' }}
            >
              {item.image_url && (
                <div className="relative aspect-square">
                  <Image
                    src={item.image_url}
                    alt={locale === 'ja' ? item.name_ja : item.name_en}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <p
                  className="text-sm font-medium mb-1 tracking-wide"
                  style={{ color: 'var(--bf-ink)' }}
                >
                  {locale === 'ja' ? item.name_ja : item.name_en}
                </p>
                <p className="text-xs mb-2" style={{ color: 'var(--bf-ink-muted)' }}>
                  {locale === 'ja' ? item.description_ja : item.description_en}
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--bf-accent)' }}
                >
                  ¥{item.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
