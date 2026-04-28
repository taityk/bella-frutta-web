import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'

export function PartnerSection() {
  const t = useTranslations('partner')

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-4xl mx-auto">
        <SectionTitle label={t('label')} title={t('title')} />
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* 写真 */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--bf-base-2)' }}
            >
              <Image
                src="/images/others/137838.jpg"
                alt="山崎さんと店長"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* テキスト */}
          <div className="flex-1">
            <p
              className="text-xs tracking-[0.2em] uppercase mb-2"
              style={{ color: 'var(--bf-gold)' }}
            >
              PARTNER
            </p>
            <h3
              className="text-2xl mb-1 tracking-wider"
              style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
            >
              {t('name')}
            </h3>
            <p
              className="text-xs tracking-widest mb-8"
              style={{ color: 'var(--bf-ink-muted)' }}
            >
              {t('shop')}
            </p>

            <div className="flex flex-col gap-5 text-sm leading-[2] tracking-wider" style={{ color: 'var(--bf-ink-muted)' }}>
              <p>{t('bio1')}</p>
              <p>{t('bio2')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
