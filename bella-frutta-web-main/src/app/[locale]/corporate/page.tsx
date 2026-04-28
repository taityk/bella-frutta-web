import { getTranslations } from 'next-intl/server'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { SITE_LINKS } from '@/lib/site-links'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'corporate_page' })
  return {
    title: `${t('title')} | Bella Frutta DAIKANYAMA`,
    description: t('description'),
  }
}

// 提供実績（仮ロゴ）- 実際の企業ロゴ画像に差し替えてください
const PLACEHOLDER_CLIENTS = [
  { id: 1, name: 'Company A' },
  { id: 2, name: 'Company B' },
  { id: 3, name: 'Company C' },
  { id: 4, name: 'Company D' },
  { id: 5, name: 'Company E' },
  { id: 6, name: 'Company F' },
]

export default async function CorporatePage() {
  const t = await getTranslations('corporate_page')

  const services = [
    { title: t('service1_title'), body: t('service1_body') },
    { title: t('service2_title'), body: t('service2_body') },
    { title: t('service3_title'), body: t('service3_body') },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bf-base)' }}>
      {/* ヒーロー */}
      <div
        className="py-32 px-4 text-center"
        style={{ backgroundColor: 'var(--bf-base-2)' }}
      >
        <p
          className="text-xs tracking-[0.2em] uppercase mb-4"
          style={{ color: 'var(--bf-gold)' }}
        >
          CORPORATE
        </p>
        <h1
          className="text-3xl md:text-4xl tracking-wider mb-4"
          style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
        >
          {t('title')}
        </h1>
        <p className="text-sm md:text-base max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--bf-ink-muted)' }}>
          {t('description')}
        </p>
      </div>

      {/* サービス */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle label={t('services_label')} title={t('services_title')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="p-8 rounded-2xl"
                style={{ backgroundColor: 'var(--bf-surface)' }}
              >
                <h3
                  className="text-lg mb-4 tracking-wider"
                  style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
                >
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--bf-ink-muted)' }}>
                  {service.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 提供実績 */}
      <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base-2)' }}>
        <div className="max-w-4xl mx-auto">
          <SectionTitle label={t('clients_label')} title={t('clients_title')} />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {PLACEHOLDER_CLIENTS.map((client) => (
              <div
                key={client.id}
                className="aspect-square rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--bf-surface)' }}
              >
                <span
                  className="text-xs tracking-widest"
                  style={{ color: 'var(--bf-ink-muted)' }}
                >
                  LOGO
                </span>
              </div>
            ))}
          </div>
          <p
            className="mt-6 text-xs tracking-wider text-center"
            style={{ color: 'var(--bf-ink-faint)' }}
          >
            {t('clients_note')}
          </p>
        </div>
      </section>

      {/* 問い合わせCTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <SectionTitle label={t('cta_label')} title={t('cta_title')} center />
          <p className="text-sm mb-10 leading-relaxed" style={{ color: 'var(--bf-ink-muted)' }}>
            {t('cta_body')}
          </p>
          {SITE_LINKS.corporateForm ? (
            <a
              href={SITE_LINKS.corporateForm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 rounded-full text-sm tracking-widest text-white transition-colors hover:opacity-80"
              style={{ backgroundColor: 'var(--bf-accent)' }}
            >
              {t('cta_button')}
            </a>
          ) : (
            <p className="text-sm" style={{ color: 'var(--bf-ink-faint)' }}>
              （フォームURL準備中）
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
