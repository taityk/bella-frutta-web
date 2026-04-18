import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { SITE_LINKS } from '@/lib/site-links'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')

  return (
    <footer
      className="py-12 px-4 mt-20"
      style={{ backgroundColor: 'var(--bf-ink)', color: 'var(--bf-base)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          {/* ロゴ */}
          <Image
            src="/images/others/logo/circle.jpg"
            alt="Bella Frutta DAIKANYAMA"
            width={60}
            height={60}
            className="rounded-full opacity-80"
          />

          {/* ナビリンク */}
          <nav className="flex flex-col gap-3">
            <Link href="/menu" className="text-sm opacity-70 hover:opacity-100 tracking-wider">
              {tNav('menu')}
            </Link>
            <Link href="/calendar" className="text-sm opacity-70 hover:opacity-100 tracking-wider">
              {tNav('calendar')}
            </Link>
            <Link href="/corporate" className="text-sm opacity-70 hover:opacity-100 tracking-wider">
              {t('corporate')}
            </Link>
          </nav>

          {/* SNSリンク */}
          <div className="flex flex-col gap-3">
            <a
              href={SITE_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-70 hover:opacity-100 tracking-wider"
            >
              Instagram
            </a>
            <a
              href={SITE_LINKS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-70 hover:opacity-100 tracking-wider"
            >
              LINE
            </a>
          </div>
        </div>

        <p className="text-xs opacity-40 tracking-wider">{t('copy')}</p>
      </div>
    </footer>
  )
}
