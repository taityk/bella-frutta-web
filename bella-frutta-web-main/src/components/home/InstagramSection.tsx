'use client'
import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { SITE_LINKS } from '@/lib/site-links'

export function InstagramSection() {
  const t = useTranslations('instagram')

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base-2)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <SectionTitle label={t('label')} title={t('title')} center />

        <p
          className="text-sm leading-relaxed tracking-wide mb-10"
          style={{ color: 'var(--bf-ink-muted)' }}
        >
          {t('body')}
        </p>

        <a
          href={SITE_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border transition-opacity hover:opacity-70"
          style={{ borderColor: 'var(--bf-gold)', color: 'var(--bf-ink)' }}
        >
          {/* Instagram icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            style={{ color: 'var(--bf-gold)' }}
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
          </svg>
          <span className="text-sm tracking-widest">{t('cta')}</span>
        </a>

        <p
          className="mt-4 text-xs tracking-widest"
          style={{ color: 'var(--bf-ink-faint)' }}
        >
          @bella_frutta.daikanyama
        </p>
      </div>
    </section>
  )
}
