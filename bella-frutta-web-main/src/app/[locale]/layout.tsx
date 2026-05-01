import type { Metadata } from 'next'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const JSON_LD_JA = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'Bella Frutta DAIKANYAMA',
  alternateName: ['ベラフルッタ代官山', 'Bella Frutta'],
  description: '代官山のフルーツ・スムージー・フルーツアイス専門店。渋谷・恵比寿から徒歩圏内。旬の果物を使った水・氷ゼロのスムージー。',
  url: 'https://bella-frutta.jp',
  telephone: '070-9394-7270',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '代官山町',
    addressLocality: '渋谷区',
    addressRegion: '東京都',
    addressCountry: 'JP',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday', 'Friday', 'Saturday', 'Sunday'], opens: '11:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Thursday'], opens: '13:00', closes: '18:00' },
  ],
  servesCuisine: ['フルーツ', 'スムージー', 'アイス', '果物'],
  image: 'https://bella-frutta.jp/images/header/292A6945.jpg',
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 35.6491,
    longitude: 139.7025,
  },
  areaServed: ['代官山', '渋谷', '恵比寿', '中目黒'],
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params

  const isJa = locale === 'ja'

  const title = isJa
    ? 'Bella Frutta | 代官山のフルーツ・スムージー専門店｜渋谷・恵比寿近く'
    : 'Bella Frutta | Fruit Smoothies in Daikanyama, Tokyo'

  const description = isJa
    ? '代官山でフルーツ・スムージーを楽しめる専門店。渋谷・恵比寿から徒歩圏内。旬の果物を使った水・氷ゼロのスムージー。'
    : 'Premium fruit smoothies in Daikanyama, Tokyo. Near Shibuya & Ebisu. Zero water, zero ice — 100% seasonal fruit.'

  const keywords = isJa
    ? ['代官山', 'フルーツ', 'スムージー', 'アイス', '渋谷', '恵比寿', '果物', '旬', 'フルーツアイス', 'フルーツスムージー', 'Bella Frutta', 'ベラフルッタ', '代官山スムージー', '代官山フルーツ']
    : ['Daikanyama', 'fruit smoothie', 'fruit ice', 'Tokyo', 'Shibuya', 'Ebisu', 'seasonal fruit', 'Bella Frutta']

  return {
    metadataBase: new URL(process.env.URL ?? 'https://bella-frutta.jp'),
    title,
    description,
    keywords,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
        { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isJa ? 'ja_JP' : 'en_US',
      images: [{ url: '/images/header/292A6945.jpg', width: 1200, height: 630, alt: 'Bella Frutta DAIKANYAMA' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/header/292A6945.jpg'],
    },
    alternates: {
      canonical: isJa ? 'https://bella-frutta.jp' : 'https://bella-frutta.jp/en',
      languages: {
        'ja': 'https://bella-frutta.jp',
        'en': 'https://bella-frutta.jp/en',
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages({ locale })

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400&family=Noto+Sans+JP:wght@400;500&family=Outfit:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script id="json-ld" type="application/ld+json" strategy="beforeInteractive">{`${JSON.stringify(JSON_LD_JA)}`}</Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-BHK1PGJQ5G" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BHK1PGJQ5G');
        `}</Script>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="pt-24">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
