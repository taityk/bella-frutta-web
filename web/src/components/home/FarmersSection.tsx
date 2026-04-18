import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'

// TODO: 店舗側から仕入れ先情報・写真を受け取り次第、差し替える
const DUMMY_FARMERS = [
  {
    id: 'akiyama',
    name_ja: '香川 あきやま農園',
    fruit_ja: 'デコポン',
    note_ja: '2〜3ヶ月熟成させた、めちゃくちゃ甘いデコポン。',
  },
  {
    id: 'dejima',
    name_ja: 'させほ 出島の花',
    fruit_ja: 'みかん',
    note_ja: '糖度18度。通常の約2倍の甘さを誇る希少なみかん。',
  },
  {
    id: 'yukimilk',
    name_ja: '雪みるく農家',
    fruit_ja: '各種フルーツ',
    note_ja: '（紹介テキスト準備中）',
  },
]

export function FarmersSection() {
  const t = useTranslations('farmers')

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base-2)' }}>
      <div className="max-w-4xl mx-auto">
        <SectionTitle label={t('label')} title={t('title')} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DUMMY_FARMERS.map((farmer) => (
            <div
              key={farmer.id}
              className="p-6 rounded-2xl"
              style={{ backgroundColor: 'var(--bf-surface)' }}
            >
              <p
                className="text-xs tracking-widest uppercase mb-2"
                style={{ color: 'var(--bf-gold)' }}
              >
                {farmer.fruit_ja}
              </p>
              <h3
                className="text-base mb-3 tracking-wider"
                style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
              >
                {farmer.name_ja}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--bf-ink-muted)' }}>
                {farmer.note_ja}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
