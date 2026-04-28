'use client'
import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'

export function ConceptSection() {
  const t = useTranslations('concept')

  return (
    <section
      className="py-24 px-4"
      style={{ backgroundColor: 'var(--bf-base)' }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <SectionTitle label={t('label')} title={t('title')} center />
        <p
          className="leading-[2] tracking-wider text-sm md:text-base"
          style={{ color: 'var(--bf-ink-muted)' }}
        >
          {t('body')}
        </p>
      </div>
    </section>
  )
}
