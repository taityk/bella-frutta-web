'use client'
import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'

type NewsItem = {
  id: string
  category_ja: string
  category_en: string
  title_ja: string
  title_en: string
  body_ja: string
  body_en: string
  date_ja?: string
  date_en?: string
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'tv-tokyo-nanairo',
    category_ja: 'TV',
    category_en: 'TV',
    title_ja: 'テレビ東京「なないろ日和」',
    title_en: 'TV Tokyo — Nanairo Biyori',
    body_ja: '当店が番組内にてご紹介いただきました。',
    body_en: 'Bella Frutta was featured on the programme.',
    date_ja: '2025年5月29日放映',
    date_en: 'Aired May 29, 2025',
  },
  {
    id: 'salus-july',
    category_ja: '雑誌',
    category_en: 'Magazine',
    title_ja: 'SALUS 7月号',
    title_en: 'SALUS — July Issue',
    body_ja: '当店が誌面にてご紹介いただきました。',
    body_en: 'Bella Frutta was featured in this issue.',
    date_ja: '6月20日発売',
    date_en: 'On sale June 20',
  },
]

export function NewsSection() {
  const locale = useLocale()
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  const goTo = useCallback((index: number, dir: 'next' | 'prev') => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 300)
  }, [animating])

  const prev = () => goTo((current - 1 + NEWS_ITEMS.length) % NEWS_ITEMS.length, 'prev')
  const next = () => goTo((current + 1) % NEWS_ITEMS.length, 'next')

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection('next')
      setAnimating(true)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % NEWS_ITEMS.length)
        setAnimating(false)
      }, 300)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const item = NEWS_ITEMS[current]
  const category = locale === 'ja' ? item.category_ja : item.category_en
  const title = locale === 'ja' ? item.title_ja : item.title_en
  const body = locale === 'ja' ? item.body_ja : item.body_en
  const date = locale === 'ja' ? item.date_ja : item.date_en

  return (
    <section style={{ backgroundColor: 'var(--bf-ink)', color: 'white' }}>
      <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-6">
        {/* NEWSラベル */}
        <div className="shrink-0 hidden sm:block">
          <span
            className="text-xs tracking-[0.25em] font-light"
            style={{ color: 'var(--bf-gold)' }}
          >
            NEWS
          </span>
        </div>

        {/* 区切り */}
        <div
          className="hidden sm:block shrink-0 w-px self-stretch"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        />

        {/* カルーセル本体 */}
        <div className="flex-1 overflow-hidden relative min-h-[48px] flex items-center">
          <div
            className="w-full transition-all duration-300"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${direction === 'next' ? '-12px' : '12px'})`
                : 'translateX(0)',
            }}
          >
            <div className="flex items-baseline gap-3 flex-wrap">
              {/* カテゴリバッジ */}
              <span
                className="text-xs px-2 py-0.5 rounded shrink-0"
                style={{
                  backgroundColor: 'rgba(180,140,60,0.25)',
                  color: 'var(--bf-gold)',
                  border: '1px solid rgba(180,140,60,0.4)',
                }}
              >
                {category}
              </span>

              {/* タイトル */}
              <span
                className="text-sm sm:text-base font-light tracking-wide"
                style={{ fontFamily: '"Noto Serif JP", serif' }}
              >
                {title}
              </span>

              {/* 本文 */}
              <span
                className="text-xs sm:text-sm"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {body}
              </span>

              {/* 日付 */}
              {date && (
                <span
                  className="text-xs"
                  style={{ color: 'var(--bf-gold)', opacity: 0.8 }}
                >
                  {date}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="shrink-0 flex items-center gap-3">
          {/* ドット */}
          <div className="flex gap-1.5">
            {NEWS_ITEMS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '16px' : '4px',
                  height: '4px',
                  backgroundColor: i === current ? 'var(--bf-gold)' : 'rgba(255,255,255,0.3)',
                }}
                aria-label={`News ${i + 1}`}
              />
            ))}
          </div>

          {/* 矢印 */}
          <div className="flex gap-1">
            <button
              onClick={prev}
              className="w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
              aria-label="前へ"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 2L3.5 6L7.5 10" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={next}
              className="w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
              aria-label="次へ"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2L8.5 6L4.5 10" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
