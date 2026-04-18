import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { SITE_LINKS } from '@/lib/site-links'

export function InstagramSection() {
  const t = useTranslations('instagram')

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base-2)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <SectionTitle label={t('label')} title={t('title')} center />
        {/* TODO: Instagram埋め込みウィジェットのスクリプトをここに挿入 */}
        <div
          className="h-64 rounded-2xl flex items-center justify-center mb-8"
          style={{ backgroundColor: 'var(--bf-base)' }}
        >
          <p className="text-sm" style={{ color: 'var(--bf-ink-faint)' }}>
            Instagram フィード（準備中）
          </p>
        </div>
        <a
          href={SITE_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm tracking-widest underline underline-offset-4"
          style={{ color: 'var(--bf-ink-muted)' }}
        >
          {t('link')} →
        </a>
      </div>
    </section>
  )
}
