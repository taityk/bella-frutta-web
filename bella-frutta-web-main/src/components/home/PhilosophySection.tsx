'use client'
import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'

export function PhilosophySection() {
  const t = useTranslations('philosophy')

  const points = [
    { title: t('p1_title'), body: t('p1_body') },
    { title: t('p2_title'), body: t('p2_body') },
    { title: t('p3_title'), body: t('p3_body') },
  ]

  return (
    <section
      className="py-24 px-4"
      style={{ backgroundColor: 'var(--bf-base-2)' }}
    >
      <div className="max-w-4xl mx-auto">
        <SectionTitle label={t('label')} title={t('title')} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((point) => (
            <div
              key={point.title}
              className="p-6 rounded-2xl"
              style={{ backgroundColor: 'var(--bf-surface)' }}
            >
              <h3
                className="text-base mb-3 tracking-wider"
                style={{
                  color: 'var(--bf-ink)',
                  fontFamily: '"Noto Serif JP", serif',
                }}
              >
                {point.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--bf-ink-muted)' }}
              >
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
