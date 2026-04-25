'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const SLIDES = [
  '/images/header/292A6945.jpg',
  '/images/header/292A7012.jpg',
  '/images/header/292A7032.jpg',
  '/images/header/292A7158.jpg',
  '/images/header/292A7204.jpg',
  '/images/header/292A7340.jpg',
]

export function HeroSlider() {
  const t = useTranslations('hero')
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
      {/* スライド画像 */}
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt="Bella Frutta DAIKANYAMA"
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/30" />

      {/* テキスト */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
        <p
          className="text-3xl md:text-5xl leading-snug mb-4 whitespace-pre-line"
          style={{ fontFamily: '"Noto Serif JP", serif', letterSpacing: '0.06em' }}
        >
          {t('catch')}
        </p>
        <p className="text-sm md:text-base tracking-widest opacity-80 mb-10">
          {t('sub')}
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/menu"
            className="px-8 py-3 text-sm tracking-widest border border-white text-white hover:bg-white hover:text-black transition-colors rounded-full"
          >
            {t('cta_menu')}
          </Link>
          <Link
            href="/#access"
            className="px-8 py-3 text-sm tracking-widest text-white hover:opacity-70 transition-opacity"
          >
            {t('cta_access')} →
          </Link>
        </div>
      </div>

      {/* ドットインジケーター（最初の10枚分のみ表示） */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {SLIDES.slice(0, 10).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{ backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.4)' }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
