import { getTranslations } from 'next-intl/server'
import { FruitCalendarTable } from '@/components/calendar/FruitCalendarTable'
import type { CalendarEntry } from '@/lib/types'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calendar_page' })
  return {
    title: `${t('title')} | Bella Frutta DAIKANYAMA`,
    description: t('description'),
  }
}

const STATIC_ENTRIES: CalendarEntry[] = [
  { month: 1, fruit_ja: 'みかん', fruit_en: 'Mikan', origin_ja: '佐世保・出島の花', origin_en: 'Sasebo, Dejima no Hana', note_ja: '糖度18度', note_en: 'Brix 18°' },
  { month: 2, fruit_ja: 'いちご', fruit_en: 'Strawberry', origin_ja: '栃木', origin_en: 'Tochigi', note_ja: '', note_en: '' },
  { month: 3, fruit_ja: 'デコポン', fruit_en: 'Dekopon', origin_ja: '香川・あきやま農園', origin_en: 'Kagawa, Akiyama Farm', note_ja: '2〜3ヶ月熟成', note_en: 'Aged 2-3 months' },
  { month: 4, fruit_ja: 'いちご', fruit_en: 'Strawberry', origin_ja: '栃木', origin_en: 'Tochigi', note_ja: '', note_en: '' },
  { month: 5, fruit_ja: 'メロン', fruit_en: 'Melon', origin_ja: '茨城', origin_en: 'Ibaraki', note_ja: '', note_en: '' },
  { month: 6, fruit_ja: 'マンゴー', fruit_en: 'Mango', origin_ja: '宮崎', origin_en: 'Miyazaki', note_ja: '', note_en: '' },
  { month: 7, fruit_ja: 'スイカ', fruit_en: 'Watermelon', origin_ja: '熊本', origin_en: 'Kumamoto', note_ja: '', note_en: '' },
  { month: 8, fruit_ja: 'もも', fruit_en: 'Peach', origin_ja: '山梨', origin_en: 'Yamanashi', note_ja: '', note_en: '' },
  { month: 9, fruit_ja: 'ぶどう', fruit_en: 'Grape', origin_ja: '山梨', origin_en: 'Yamanashi', note_ja: '', note_en: '' },
  { month: 10, fruit_ja: 'なし', fruit_en: 'Pear', origin_ja: '千葉', origin_en: 'Chiba', note_ja: '', note_en: '' },
  { month: 11, fruit_ja: 'りんご', fruit_en: 'Apple', origin_ja: '青森', origin_en: 'Aomori', note_ja: '', note_en: '' },
  { month: 12, fruit_ja: 'みかん', fruit_en: 'Mikan', origin_ja: '佐世保・出島の花', origin_en: 'Sasebo, Dejima no Hana', note_ja: '', note_en: '' },
]

export default async function CalendarPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calendar_page' })

  const displayEntries = STATIC_ENTRIES

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: 'var(--bf-gold)' }}
          >
            FRUIT CALENDAR
          </p>
          <h1
            className="text-3xl tracking-wider mb-4"
            style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
          >
            {t('title')}
          </h1>
          <p className="text-sm" style={{ color: 'var(--bf-ink-muted)' }}>
            {t('description')}
          </p>
        </div>
        <FruitCalendarTable entries={displayEntries} />
      </div>
    </div>
  )
}
