import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'

// TODO: 店長の紹介テキストを入れる（現在ダミー）
export function OwnerSection() {
  const t = useTranslations('owner')

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-4xl mx-auto">
        <SectionTitle label={t('label')} title={t('title')} />
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="w-full md:w-64 flex-shrink-0">
            <div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--bf-base-2)' }}
            >
              <Image
                src="/images/others/292A7361.jpg"
                alt="店長"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <h3
              className="text-xl mb-4 tracking-wider"
              style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
            >
              店長名（準備中）
            </h3>
            <p className="text-sm leading-[2] tracking-wider" style={{ color: 'var(--bf-ink-muted)' }}>
              店長の紹介テキストをここに入れます。
              果物への想い、Bella Fruttaを始めたきっかけ、
              お客様に伝えたいメッセージなど。
              （テキスト準備中 — 店舗側と確認後に更新）
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
