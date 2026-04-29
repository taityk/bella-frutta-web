'use client'
import { useLocale } from 'next-intl'
import type { CalendarEntry } from '@/lib/types'

type Props = {
  entries: CalendarEntry[]
}

const MONTHS_JA = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const TOTAL_MONTHS = 12

export function FruitCalendarTable({ entries }: Props) {
  const locale = useLocale()
  const monthNames = locale === 'ja' ? MONTHS_JA : MONTHS_EN

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: '640px' }}>
        {/* ヘッダー：月 */}
        <div className="flex mb-2">
          <div style={{ width: '140px', flexShrink: 0 }} />
          <div className="flex flex-1">
            {monthNames.map((m, i) => (
              <div
                key={i}
                className="flex-1 text-center text-xs tracking-wider py-2"
                style={{ color: 'var(--bf-ink-faint)' }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* グリッド区切り線 */}
        <div className="flex mb-3">
          <div style={{ width: '140px', flexShrink: 0 }} />
          <div className="flex flex-1 relative" style={{ height: '1px', backgroundColor: 'var(--bf-base-2)' }}>
            {Array.from({ length: TOTAL_MONTHS }).map((_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ borderLeft: '1px solid var(--bf-base-2)' }}
              />
            ))}
          </div>
        </div>

        {/* フルーツ行 */}
        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const name = locale === 'ja' ? entry.fruit_ja : entry.fruit_en
            const origin = locale === 'ja' ? entry.origin_ja : entry.origin_en
            const note = locale === 'ja' ? entry.note_ja : entry.note_en

            // バーの位置・幅を計算
            const start = entry.start_month - 1 // 0-indexed
            const end = entry.end_month - 1     // 0-indexed
            const barLeft = (start / TOTAL_MONTHS) * 100
            const barWidth = ((end - start + 1) / TOTAL_MONTHS) * 100

            return (
              <div key={entry.id} className="flex items-center">
                {/* フルーツ名 */}
                <div
                  style={{ width: '140px', flexShrink: 0 }}
                  className="text-sm pr-3 text-right leading-tight"
                >
                  <span style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}>
                    {name}
                  </span>
                  {origin && (
                    <div className="text-xs mt-0.5" style={{ color: 'var(--bf-ink-faint)' }}>
                      {origin}
                    </div>
                  )}
                </div>

                {/* ガントバー */}
                <div className="flex-1 relative" style={{ height: '32px' }}>
                  {/* 背景グリッド線 */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {Array.from({ length: TOTAL_MONTHS }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1"
                        style={{ borderLeft: i > 0 ? '1px dashed var(--bf-base-2)' : 'none' }}
                      />
                    ))}
                  </div>

                  {/* カラーバー */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 rounded-full flex items-center px-3"
                    style={{
                      left: `${barLeft}%`,
                      width: `${barWidth}%`,
                      height: '26px',
                      backgroundColor: entry.color,
                    }}
                  >
                    {note && (
                      <span
                        className="text-xs truncate"
                        style={{ color: 'rgba(0,0,0,0.55)', fontFamily: '"Noto Sans JP", sans-serif' }}
                      >
                        {note}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 下部グリッド線 */}
        <div className="flex mt-3">
          <div style={{ width: '140px', flexShrink: 0 }} />
          <div className="flex flex-1" style={{ height: '1px', backgroundColor: 'var(--bf-base-2)' }} />
        </div>
      </div>
    </div>
  )
}
