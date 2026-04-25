import { useTranslations, useLocale } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { LineButton } from '@/components/ui/LineButton'
import { SITE_LINKS, STORE_INFO } from '@/lib/site-links'

export function AccessSection() {
  const t = useTranslations('access')
  const locale = useLocale()
  const isJa = locale === 'ja'

  return (
    <section id="access" className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-4xl mx-auto">
        <SectionTitle label={t('label')} title={t('title')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* 地図 */}
          <div className="rounded-2xl overflow-hidden" style={{ minHeight: 256 }}>
            <iframe
              src="https://maps.google.com/maps?q=Bella+Frutta+Daikanyama&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 256, display: 'block' }}
              allowFullScreen
              loading="lazy"
              title="Bella Frutta DAIKANYAMA 地図"
            />
          </div>

          {/* 店舗情報 */}
          <div className="flex flex-col gap-6 justify-center">
            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--bf-gold)' }}>
                {t('hours')}
              </p>
              {(isJa ? STORE_INFO.hours_ja : STORE_INFO.hours_en).split('\n').map((line, i) => (
                <p key={i} className="text-base tracking-wider" style={{ color: 'var(--bf-ink)' }}>
                  {line}
                </p>
              ))}
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--bf-gold)' }}>
                TEL
              </p>
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="text-base tracking-wider"
                style={{ color: 'var(--bf-ink)' }}
              >
                {STORE_INFO.phone}
              </a>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--bf-gold)' }}>
                ACCESS
              </p>
              <p className="text-sm leading-relaxed tracking-wider" style={{ color: 'var(--bf-ink-muted)' }}>
                {isJa ? STORE_INFO.address_ja : STORE_INFO.address_en}
              </p>
              <p className="text-sm mt-1 tracking-wider" style={{ color: 'var(--bf-ink-muted)' }}>
                {isJa ? '東急東横線 代官山駅から徒歩5分' : '5 min walk from Daikanyama Station (Tokyu Toyoko Line)'}
              </p>
              <a
                href={SITE_LINKS.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-widest mt-1 inline-block underline underline-offset-4"
                style={{ color: 'var(--bf-ink-faint)' }}
              >
                {t('map')} →
              </a>
            </div>
            <LineButton label={t('line')} />
          </div>
        </div>
      </div>
    </section>
  )
}
