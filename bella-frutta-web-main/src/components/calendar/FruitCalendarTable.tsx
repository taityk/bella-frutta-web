'use client'
import { useLocale, useTranslations } from 'next-intl'
import type { CalendarEntry } from '@/lib/types'

type Props = {
  entries: CalendarEntry[]
}

const MONTH_NAMES_JA = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const MONTH_NAMES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function FruitCalendarTable({ entries }: Props) {
  const locale = useLocale()
  const t = useTranslations('calendar_page')

  // 月ごとにグループ化
  const byMonth: Partial<Record<CalendarEntry['month'], CalendarEntry[]>> = {}
  entries.forEach((entry) => {
    if (!byMonth[entry.month]) byMonth[entry.month] = []
    byMonth[entry.month]!.push(entry)
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--bf-base-2)' }}>
            <th
              className="text-left py-3 px-4 text-xs tracking-widest uppercase"
              style={{ color: 'var(--bf-ink-faint)' }}
            >
              {t('month_label')}
            </th>
            <th
              className="text-left py-3 px-4 text-xs tracking-widest uppercase"
              style={{ color: 'var(--bf-ink-faint)' }}
            >
              {t('fruit_label')}
            </th>
            <th
              className="text-left py-3 px-4 text-xs tracking-widest uppercase"
              style={{ color: 'var(--bf-ink-faint)' }}
            >
              {t('origin')}
            </th>
          </tr>
        </thead>
        <tbody>
          {([1,2,3,4,5,6,7,8,9,10,11,12] as CalendarEntry['month'][]).map((month) => {
            const monthEntries = byMonth[month]
            if (!monthEntries || monthEntries.length === 0) return null
            return monthEntries.map((entry, idx) => (
              <tr
                key={`${month}-${idx}`}
                style={{ borderBottom: '1px solid var(--bf-base-2)' }}
              >
                {idx === 0 && (
                  <td
                    className="py-4 px-4 font-medium tracking-wider align-top"
                    rowSpan={monthEntries.length}
                    style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
                  >
                    {locale === 'ja' ? MONTH_NAMES_JA[month - 1] : MONTH_NAMES_EN[month - 1]}
                  </td>
                )}
                <td className="py-4 px-4" style={{ color: 'var(--bf-ink)' }}>
                  {locale === 'ja' ? entry.fruit_ja : entry.fruit_en}
                </td>
                <td className="py-4 px-4 text-sm" style={{ color: 'var(--bf-ink-muted)' }}>
                  {locale === 'ja' ? entry.origin_ja : entry.origin_en}
                </td>
              </tr>
            ))
          })}
        </tbody>
      </table>
    </div>
  )
}
