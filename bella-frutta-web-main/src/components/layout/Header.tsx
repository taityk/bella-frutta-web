'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Build the path for the other locale
  // pathname in next-intl includes locale prefix: /en/menu or /menu
  const otherLocale = locale === 'ja' ? 'en' : 'ja'
  let otherLocalePath: string
  if (locale === 'ja') {
    // Japanese default: pathname = '/menu', other = '/en/menu'
    otherLocalePath = `/en${pathname}`
  } else {
    // English: pathname = '/en/menu', strip '/en' prefix
    otherLocalePath = pathname.replace(/^\/en/, '') || '/'
  }

  const navLinks = [
    { href: '/menu', label: t('menu') },
    { href: '/calendar', label: t('calendar') },
    { href: '/corporate', label: t('corporate') },
    { href: '/#access', label: t('access') },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(26,24,21,0.92)' }}
    >
      <div className="max-w-6xl mx-auto px-4 h-24 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/others/logo/logo.png"
            alt="Bella Frutta DAIKANYAMA"
            width={180}
            height={50}
            className="object-contain"
            style={{ height: '90px', width: 'auto' }}
          />
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wider transition-opacity hover:opacity-60"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={otherLocalePath}
            className="text-xs tracking-[0.15em] uppercase px-3 py-1 border rounded-full transition-opacity hover:opacity-60"
            style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.6)' }}
          >
            {t('lang')}
          </Link>
        </nav>

        {/* モバイルハンバーガー */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label={t('menu_open')}
        >
          <div className="w-6 h-0.5 mb-1.5 bg-white/80" />
          <div className="w-6 h-0.5 mb-1.5 bg-white/80" />
          <div className="w-6 h-0.5 bg-white/80" />
        </button>
      </div>

      {/* モバイルドロワー */}
      {open && (
        <div
          className="md:hidden border-t px-4 py-6 flex flex-col gap-4"
          style={{ backgroundColor: 'rgba(26,24,21,0.97)', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wider"
              style={{ color: 'rgba(255,255,255,0.85)' }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={otherLocalePath}
            className="text-xs tracking-[0.15em] uppercase"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {t('lang')}
          </Link>
        </div>
      )}
    </header>
  )
}
