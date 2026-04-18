import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'
import type { MenuItem } from '@/lib/types'

type Props = {
  items: MenuItem[]
}

export function ProductsSection({ items }: Props) {
  const t = useTranslations('products')
  const locale = useLocale()

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle label={t('label')} title={t('title')} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
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
              <div className="p-3">
                <p
                  className="text-sm font-medium mb-1 tracking-wide"
                  style={{ color: 'var(--bf-ink)' }}
                >
                  {locale === 'ja' ? item.name_ja : item.name_en}
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--bf-ink-muted)' }}
                >
                  ¥{item.price.toLocaleString()} {t('unit')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
