'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { STATIC_MENU_ITEMS } from '@/lib/static-menu'
import type { MenuItem } from '@/lib/types'

type Props = {
  items: MenuItem[]
}

function ItemCard({ name, image_url, price, unit, marketPrice }: { name: string; image_url: string; price: number; unit: string; marketPrice: string }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: 'var(--bf-surface)' }}
    >
      <div className="relative aspect-square" style={{ backgroundColor: 'var(--bf-base-2)' }}>
        {image_url ? (
          <Image src={image_url} alt={name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs tracking-widest" style={{ color: 'var(--bf-ink-faint)' }}>{name}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium tracking-wide mb-1" style={{ color: 'var(--bf-ink)' }}>
          {name}
        </p>
        <p className="text-xs" style={{ color: 'var(--bf-ink-muted)' }}>
          {price > 0 ? `¥${price.toLocaleString()}~ ${unit}` : marketPrice}
        </p>
      </div>
    </div>
  )
}

function CategoryBlock({
  heading,
  items,
  isJa,
  unit,
  marketPrice,
}: {
  heading: string
  items: MenuItem[]
  isJa: boolean
  unit: string
  marketPrice: string
}) {
  return (
    <div className="mb-12">
      <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--bf-ink)' }}>
        {heading}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            name={isJa ? item.name_ja : item.name_en}
            image_url={item.image_url}
            price={item.price}
            unit={unit}
            marketPrice={marketPrice}
          />
        ))}
      </div>
    </div>
  )
}

export function ProductsSection({ items }: Props) {
  const t = useTranslations('products')
  const locale = useLocale()
  const isJa = locale === 'ja'
  const unit = t('unit')
  const marketPrice = t('market_price')

  const display = items.length > 0 ? items : STATIC_MENU_ITEMS

  const smoothies = display.filter((i) => i.category === 'smoothie')
  const fruits = display.filter((i) => i.category === 'fruit')

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle label={t('label')} title={t('title')} />

        {smoothies.length > 0 && (
          <CategoryBlock
            heading={isJa ? 'スムージー' : 'Smoothies'}
            items={smoothies}
            isJa={isJa}
            unit={unit}
            marketPrice={marketPrice}
          />
        )}
        {fruits.length > 0 && (
          <CategoryBlock
            heading={isJa ? 'カットフルーツ' : 'Cut Fruit'}
            items={fruits}
            isJa={isJa}
            unit={unit}
            marketPrice={marketPrice}
          />
        )}

        {/* もっと見るボタン */}
        <div className="text-center mt-4">
          <Link
            href="/menu"
            className="inline-block px-10 py-3 rounded-full text-sm tracking-widest border transition-colors hover:opacity-70"
            style={{ borderColor: 'var(--bf-accent)', color: 'var(--bf-accent)' }}
          >
            {isJa ? 'メニューをもっと見る' : 'View Full Menu'}
          </Link>
        </div>
      </div>
    </section>
  )
}
