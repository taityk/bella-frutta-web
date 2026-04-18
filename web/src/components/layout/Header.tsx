'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const otherLocale = locale === 'ja' ? 'en' : 'ja'
  const [open, setOpen] = useState(false)

  const navLinks = [
    { href: '/menu', label: t('menu') },
    { href: '/calendar', label: t('calendar') },
    { href: '/corporate', label: t('corporate') },
    { href: '/#access', label: t('access') },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b"
      style={{ borderColor: 'var(--bf-base-2)' }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/others/logo/circle.jpg"
            alt="Bella Frutta DAIKANYAMA"
            width={40}
            height={40}
            className="rounded-full"
          />
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wider transition-colors hover:opacity-60"
              style={{ color: 'var(--bf-ink)' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${otherLocale}`}
            className="text-xs tracking-[0.15em] uppercase px-3 py-1 border rounded-full transition-colors hover:opacity-60"
            style={{ borderColor: 'var(--bf-ink-faint)', color: 'var(--bf-ink-muted)' }}
          >
            {t('lang')}
          </Link>
        </nav>

        {/* モバイルハンバーガー */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="メニューを開く"
        >
          <div className="w-6 h-0.5 mb-1.5" style={{ backgroundColor: 'var(--bf-ink)' }} />
          <div className="w-6 h-0.5 mb-1.5" style={{ backgroundColor: 'var(--bf-ink)' }} />
          <div className="w-6 h-0.5" style={{ backgroundColor: 'var(--bf-ink)' }} />
        </button>
      </div>

      {/* モバイルドロワー */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-6 flex flex-col gap-4"
             style={{ borderColor: 'var(--bf-base-2)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wider"
              style={{ color: 'var(--bf-ink)' }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${otherLocale}`}
            className="text-xs tracking-[0.15em] uppercase"
            style={{ color: 'var(--bf-ink-muted)' }}
          >
            {t('lang')}
          </Link>
        </div>
      )}
    </header>
  )
}
