import { getTranslations, setRequestLocale } from 'next-intl/server'
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

type FruitItem = {
  name: string
  variety?: string
  timing?: '上旬〜' | '中旬〜' | '下旬〜' | '〜終盤'
}

type MonthData = {
  month: number
  fruits: FruitItem[]
}

const TIMING_ORDER: Record<string, number> = {
  '上旬〜': 1,
  '中旬〜': 2,
  '下旬〜': 3,
  '〜終盤': 4,
}

function sortedFruits(fruits: FruitItem[]): FruitItem[] {
  return [...fruits].sort((a, b) => {
    const ta = a.timing ? (TIMING_ORDER[a.timing] ?? 0) : 0
    const tb = b.timing ? (TIMING_ORDER[b.timing] ?? 0) : 0
    return ta - tb
  })
}

const CALENDAR_DATA: MonthData[] = [
  {
    month: 1,
    fruits: [
      { name: 'イチゴ' },
      { name: 'デコポン' },
      { name: '紅マドンナ' },
      { name: '紅はるか' },
      { name: 'みかん' },
      { name: '甘平', timing: '中旬〜' },
    ],
  },
  {
    month: 2,
    fruits: [
      { name: '紅マドンナ' },
      { name: 'みかん' },
      { name: '甘平', variety: 'クィーンスプラッシュ', timing: '中旬〜' },
      { name: 'せとか', timing: '下旬〜' },
    ],
  },
  {
    month: 3,
    fruits: [
      { name: 'イチゴ' },
      { name: 'メロン', variety: 'アールス' },
      { name: '甘平' },
      { name: 'せとか' },
      { name: '紅プリンセス' },
      { name: 'にじゅうまる' },
      { name: '八朔' },
      { name: 'ハウススイカ', variety: 'ルナピエナ', timing: '下旬〜' },
    ],
  },
  {
    month: 4,
    fruits: [
      { name: 'イチゴ' },
      { name: 'メロン', variety: 'レノン・アールス' },
      { name: 'スイカ', variety: 'ピノガール' },
      { name: 'ブルーベリー' },
      { name: 'せとか' },
      { name: 'デコポン' },
      { name: 'ココナッツ' },
      { name: 'マンゴー' },
    ],
  },
  {
    month: 5,
    fruits: [
      { name: 'メロン', variety: 'クィンシー・オトメ・アンデス' },
      { name: 'スイカ', variety: 'ピノガール' },
      { name: 'マンゴー', variety: '太陽のたまご' },
      { name: 'ミニトマト', variety: '豊橋 麗' },
      { name: 'パイナップル', variety: 'フィリピン高地栽培' },
      { name: 'バナナ', variety: '王様・王子のこだわり' },
      { name: 'パッションフルーツ' },
      { name: 'ビワ', variety: '長崎産' },
      { name: 'アメリカンチェリー', variety: 'ロイヤルヘレン' },
      { name: 'ブルーベリー', variety: 'メキシコ産', timing: '上旬〜' },
      { name: 'ブルーベリー', variety: '長野上田産', timing: '中旬〜' },
      { name: 'デコポン', variety: '秋山農園', timing: '中旬〜' },
    ],
  },
  {
    month: 6,
    fruits: [
      { name: 'メロン', variety: 'クィンシー・アンデス・エルソル' },
      { name: '極みメロン' },
      { name: 'スイカ', variety: 'ピノガール' },
      { name: 'スイカ', variety: '28・28金色羅皇' },
      { name: 'マンゴー', variety: '宮崎・太陽のたまご' },
      { name: 'ミニトマト', variety: '豊橋 麗' },
      { name: 'ブルーベリー', variety: '茨城県小美玉産' },
      { name: 'アメリカンチェリー', variety: 'レーニア' },
      { name: 'とうもろこし', variety: 'ドルチェ・ミルフィーユ' },
      { name: 'ビワ' },
      { name: 'プラム', variety: '貴陽' },
      { name: 'ライチ' },
      { name: 'パイナップル' },
      { name: 'バナナ' },
      { name: 'パッションフルーツ' },
      { name: '夕張メロン', timing: '中旬〜' },
      { name: '桃', variety: '日川白桃', timing: '中旬〜' },
    ],
  },
  {
    month: 7,
    fruits: [
      { name: 'メロン', variety: 'クィンシー・エルソル' },
      { name: 'アールスメロン' },
      { name: 'ライデンメロン' },
      { name: 'スイカ', variety: 'ピノガール' },
      { name: 'マンゴー', variety: '宮崎・太陽のたまご' },
      { name: 'シャインマスカット' },
      { name: '桃', variety: '一桃匠' },
      { name: 'プラム', variety: '貴陽' },
      { name: 'みかん' },
      { name: 'パッションフルーツ' },
      { name: 'パイナップル' },
      { name: 'バナナ' },
      { name: 'スイカ', variety: 'チッチェ', timing: '中旬〜' },
      { name: '桃', variety: '天', timing: '下旬〜' },
      { name: '桃', variety: '浅間白桃', timing: '下旬〜' },
    ],
  },
  {
    month: 8,
    fruits: [
      { name: 'メロン' },
      { name: 'スイカ', variety: 'チッチェ' },
      { name: '桃', variety: '天' },
      { name: '桃', variety: '岡山産' },
      { name: 'イチジク' },
      { name: '梨', variety: '幸水・太鼓判' },
      { name: 'プラム', variety: '貴陽' },
      { name: 'ネクタリン' },
      { name: 'ジャクソンフルーツ' },
      { name: 'ミニトマト' },
      { name: '柿' },
      { name: 'みかん' },
      { name: 'パッションフルーツ' },
      { name: 'パイナップル' },
      { name: 'バナナ' },
      { name: 'クィーンニーナ', timing: '上旬〜' },
      { name: 'シャインマスカット', timing: '上旬〜' },
      { name: 'ルビーロマン', variety: '石川県産', timing: '上旬〜' },
      { name: 'ピオーネ', timing: '中旬〜' },
    ],
  },
  {
    month: 9,
    fruits: [
      { name: 'メロン', variety: 'ライデン・アールス' },
      { name: '桃' },
      { name: 'シャインマスカット' },
      { name: 'クィーンニーナ・ピオーネ' },
      { name: '梨', variety: '新甘泉・加賀しずく' },
      { name: 'プラム' },
      { name: 'イチジク' },
      { name: '柿' },
      { name: 'みかん' },
      { name: 'パイナップル' },
      { name: 'バナナ' },
      { name: 'スイカ', timing: '〜終盤' },
      { name: '富士の輝き', timing: '下旬〜' },
    ],
  },
  {
    month: 10,
    fruits: [
      { name: 'メロン', variety: 'アールス' },
      { name: '桃' },
      { name: 'シャインマスカット' },
      { name: '富士の輝き' },
      { name: 'マイハート' },
      { name: 'クィーンニーナ' },
      { name: 'エンバイヤ' },
      { name: '梨' },
      { name: '洋梨' },
      { name: '柿' },
      { name: 'みかん' },
      { name: 'スイカ', timing: '〜終盤' },
    ],
  },
  {
    month: 11,
    fruits: [
      { name: 'メロン', variety: 'アールス' },
      { name: '桃', variety: '冬美白' },
      { name: 'シャインマスカット' },
      { name: '洋梨', variety: 'コミス・ル・レクチェ' },
      { name: '梨' },
      { name: '柿', variety: '秋王' },
      { name: 'リンゴ' },
      { name: '栗' },
      { name: 'みかん', variety: '金 など' },
      { name: '紅マドンナ', timing: '中旬〜' },
    ],
  },
  {
    month: 12,
    fruits: [
      { name: 'イチゴ' },
      { name: 'メロン', variety: 'アールス' },
      { name: 'シャインマスカット' },
      { name: '紅マドンナ' },
      { name: '梨', variety: '南水' },
      { name: 'みかん' },
    ],
  },
]

const MONTH_NAMES_JA = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const TIMING_LABEL: Record<string, string> = {
  '上旬〜': '上旬〜',
  '中旬〜': '中旬〜',
  '下旬〜': '下旬〜',
  '〜終盤': '〜終盤',
}

export default async function CalendarPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'calendar_page' })

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-16 text-center">
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

        {/* 月別グリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CALENDAR_DATA.map(({ month, fruits }) => (
            <div
              key={month}
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'var(--bf-base-2, rgba(0,0,0,0.03))' }}
            >
              {/* 月ヘッダー */}
              <div
                className="flex items-baseline gap-1 mb-4 pb-3"
                style={{ borderBottom: '1px solid var(--bf-base-3, rgba(0,0,0,0.08))' }}
              >
                <span
                  className="text-3xl font-light"
                  style={{ color: 'var(--bf-gold)', fontFamily: '"Noto Serif JP", serif', lineHeight: 1 }}
                >
                  {month}
                </span>
                <span className="text-sm tracking-wider" style={{ color: 'var(--bf-ink-muted)' }}>
                  月
                </span>
              </div>

              {/* 果物リスト（時期順） */}
              <ul className="flex flex-col gap-2">
                {sortedFruits(fruits).map((fruit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className="mt-[7px] shrink-0 rounded-full"
                      style={{ width: '4px', height: '4px', backgroundColor: 'var(--bf-gold)', opacity: 0.5 }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className="text-sm leading-snug"
                          style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
                        >
                          {fruit.name}
                        </span>
                        {fruit.timing && (
                          <span
                            className="text-xs shrink-0"
                            style={{ color: 'var(--bf-gold)', opacity: 0.8 }}
                          >
                            {TIMING_LABEL[fruit.timing]}
                          </span>
                        )}
                      </div>
                      {fruit.variety && (
                        <span
                          className="text-xs leading-snug"
                          style={{ color: 'var(--bf-ink-muted)' }}
                        >
                          {fruit.variety}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
