import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '../globals.css'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params
  const description =
    locale === 'ja'
      ? '旬の果物を、代官山で。水・氷ゼロのスムージー専門店。'
      : 'Seasonal fruits in Daikanyama. Smoothies made with zero water, zero ice — 100% fruit.'

  return {
    title: 'Bella Frutta DAIKANYAMA',
    description,
    icons: {
      icon: '/images/others/logo/circle.jpg',
      apple: '/images/others/logo/circle.jpg',
    },
    openGraph: {
      title: 'Bella Frutta DAIKANYAMA',
      description,
      type: 'website',
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

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
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="pt-24">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
