# Bella Frutta DAIKANYAMA Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bella Frutta DAIKANYAMA の公式Webサイトを Next.js 15 で新規構築し、Netlify に公開する。Google Sheets をCMSとして使いスタッフがメニューを更新できる運用体制を整える。

**Architecture:** Next.js 15 App Router + next-intl によるi18n（`/` 日本語、`/en/` 英語）。メニューデータは Google Sheets API v4 でビルド時取得（ISR）。Netlify Build Hook でシート編集→自動デプロイのフローを実現。

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, next-intl, Google Sheets API v4, Netlify

**Spec:** `docs/superpowers/specs/2026-04-19-bella-frutta-website-design.md`

---

## File Map

```
web/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx              # ルートレイアウト（Header/Footer）
│   │   │   ├── page.tsx                # トップページ
│   │   │   ├── menu/
│   │   │   │   └── page.tsx            # メニューページ（QRコード飛び先）
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx            # 果物カレンダーページ
│   │   │   └── corporate/
│   │   │       └── page.tsx            # 法人向けページ
│   │   └── api/
│   │       └── revalidate/
│   │           └── route.ts            # Netlify Webhook受信 → ISR revalidate
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx              # ナビゲーション + 言語切り替え
│   │   │   └── Footer.tsx              # フッター（LINE・法人リンク等）
│   │   ├── home/
│   │   │   ├── HeroSlider.tsx          # 写真スライドショー + CTA
│   │   │   ├── ConceptSection.tsx      # コンセプト「旬の果物を五感で体験する」
│   │   │   ├── PhilosophySection.tsx   # こだわり（水・氷ゼロ、果実100%）
│   │   │   ├── ProductsSection.tsx     # 商品紹介（Sheetsデータ）
│   │   │   ├── FarmersSection.tsx      # 仕入れ先・農家紹介（ダミー）
│   │   │   ├── OwnerSection.tsx        # 店長紹介（ダミー）
│   │   │   ├── InstagramSection.tsx    # Instagram埋め込みウィジェット
│   │   │   └── AccessSection.tsx       # アクセス・営業時間・MAP・LINE
│   │   ├── menu/
│   │   │   └── MenuGrid.tsx            # メニュー一覧グリッド
│   │   ├── calendar/
│   │   │   └── FruitCalendarTable.tsx  # 果物カレンダー表
│   │   ├── corporate/
│   │   │   └── CorporateServices.tsx   # 法人サービス紹介
│   │   └── ui/
│   │       ├── SectionTitle.tsx        # セクション見出し（和文+英字ラベル）
│   │       └── LineButton.tsx          # LINE誘導ボタン
│   ├── lib/
│   │   ├── types.ts                    # 共通型定義（MenuItem, CalendarEntry等）
│   │   ├── sheets.ts                   # Google Sheets API フェッチャー
│   │   └── site-links.ts              # LINE URL等のリンク定数
│   ├── i18n/
│   │   ├── routing.ts                  # next-intl ルーティング設定
│   │   └── request.ts                  # next-intl リクエスト設定
│   └── middleware.ts                   # next-intl ミドルウェア
├── messages/
│   ├── ja.json                         # 日本語テキスト
│   └── en.json                         # 英語テキスト
├── public/
│   └── images/ → ../img/ (シンボリックリンク or コピー)
├── __tests__/
│   ├── lib/
│   │   ├── types.test.ts
│   │   └── sheets.test.ts
│   └── components/
│       └── ui/
│           └── SectionTitle.test.tsx
├── tailwind.config.ts
├── next.config.ts
├── .env.local.example
└── netlify.toml
```

---

## Task 1: Next.js プロジェクト初期化

**Files:**
- Create: `web/` 以下全体（next create-next-app で生成）
- Create: `web/tailwind.config.ts`
- Create: `web/.env.local.example`

- [ ] **Step 1: Next.js プロジェクトを初期化**

```bash
cd /Users/taity/Desktop/bella_frutta/web
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

プロンプトが出たら:
- Would you like to use ESLint? → Yes
- Would you like to use `src/` directory? → Yes（フラグ指定済み）

- [ ] **Step 2: 追加パッケージをインストール**

```bash
cd /Users/taity/Desktop/bella_frutta/web
npm install next-intl
npm install googleapis
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Tailwind CSS のカスタム変数を設定**

`src/app/globals.css` を以下に置き換える:

```css
@import "tailwindcss";

:root {
  --bf-base: #faf9f6;
  --bf-surface: #ffffff;
  --bf-base-2: #f0ece3;
  --bf-ink: #1a1815;
  --bf-ink-muted: #5c5852;
  --bf-ink-faint: #8a847b;
  --bf-gold: #c9a96e;
  --bf-gold-hover: #b8955a;
  --bf-accent: #2b4535;
  --bf-accent-hover: #1f3327;
  --bf-accent-soft: rgba(43, 69, 53, 0.07);
}

body {
  background-color: var(--bf-base);
  color: var(--bf-ink);
}
```

- [ ] **Step 4: vitest 設定ファイルを作成**

`web/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

`web/src/test-setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 5: package.json にテストスクリプトを追加**

`web/package.json` の scripts に追加:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: 不要なデフォルトファイルを削除・クリア**

```bash
cd /Users/taity/Desktop/bella_frutta/web
rm -rf src/app/favicon.ico
# src/app/page.tsx と src/app/layout.tsx は後のタスクで上書き
```

- [ ] **Step 7: 画像ディレクトリをシンボリックリンクで繋ぐ**

```bash
cd /Users/taity/Desktop/bella_frutta/web
ln -sf ../web/img public/images
# または: cp -r img/* public/images/ (コピーの場合)
mkdir -p public/images
cp -r img/* public/images/
```

- [ ] **Step 8: 動作確認**

```bash
cd /Users/taity/Desktop/bella_frutta/web
npm run dev
```

ブラウザで `http://localhost:3000` を開いてNext.jsの初期画面が表示されることを確認。

---

## Task 2: 型定義と定数

**Files:**
- Create: `web/src/lib/types.ts`
- Create: `web/src/lib/site-links.ts`
- Create: `web/__tests__/lib/types.test.ts`

- [ ] **Step 1: 型定義を作成**

`web/src/lib/types.ts`:

```typescript
export type MenuItem = {
  id: string
  category: 'smoothie' | 'fruit' | 'other'
  name_ja: string
  name_en: string
  price: number
  description_ja: string
  description_en: string
  image_url: string
  active: boolean
}

export type CalendarEntry = {
  month: number        // 1-12
  fruit_ja: string
  fruit_en: string
  origin_ja: string
  origin_en: string
  note_ja: string
  note_en: string
}

export type NewsItem = {
  id: string
  title_ja: string
  title_en: string
  body_ja: string
  body_en: string
  published_at: string // ISO date string
  active: boolean
}
```

- [ ] **Step 2: サイトリンク定数を作成**

`web/src/lib/site-links.ts`:

```typescript
export const SITE_LINKS = {
  line: 'https://lin.ee/Uq5FESU',
  instagram: 'https://www.instagram.com/bellafrutta_daikanyama/',
  corporateForm: '', // TODO: Googleフォームを店舗側から入手したら追記
  googleMaps: 'https://maps.google.com/?q=Bella+Frutta+Daikanyama',
} as const

export const STORE_INFO = {
  name_ja: 'Bella Frutta DAIKANYAMA',
  name_en: 'Bella Frutta DAIKANYAMA',
  address_ja: '東京都渋谷区代官山町', // TODO: 正確な住所に更新
  address_en: 'Daikanyama, Shibuya, Tokyo', // TODO
  hours_ja: '10:00 - 18:00', // TODO: 正確な営業時間に更新
  hours_en: '10:00 AM - 6:00 PM', // TODO
  closed_ja: '火曜日定休', // TODO: 確認
  closed_en: 'Closed on Tuesdays', // TODO
} as const
```

- [ ] **Step 3: 型テストを作成**

`web/__tests__/lib/types.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import type { MenuItem, CalendarEntry } from '@/lib/types'

describe('MenuItem type', () => {
  it('should accept valid menu item', () => {
    const item: MenuItem = {
      id: '1',
      category: 'smoothie',
      name_ja: 'いちごスムージー',
      name_en: 'Strawberry Smoothie',
      price: 800,
      description_ja: '旬のいちごを使用',
      description_en: 'Made with seasonal strawberries',
      image_url: '/images/menu/strawberry.jpg',
      active: true,
    }
    expect(item.category).toBe('smoothie')
    expect(item.price).toBeTypeOf('number')
  })
})

describe('CalendarEntry type', () => {
  it('should accept valid calendar entry', () => {
    const entry: CalendarEntry = {
      month: 4,
      fruit_ja: 'いちご',
      fruit_en: 'Strawberry',
      origin_ja: '栃木県',
      origin_en: 'Tochigi',
      note_ja: '春の定番',
      note_en: 'Spring classic',
    }
    expect(entry.month).toBe(4)
  })
})
```

- [ ] **Step 4: テストを実行して通過を確認**

```bash
cd /Users/taity/Desktop/bella_frutta/web
npm test
```

Expected: PASS（型テストは型チェックなので実行時エラーなし）

---

## Task 3: Google Sheets データレイヤー

**Files:**
- Create: `web/src/lib/sheets.ts`
- Create: `web/.env.local.example`
- Create: `web/__tests__/lib/sheets.test.ts`

- [ ] **Step 1: .env.local.example を作成**

`web/.env.local.example`:

```bash
# Google Sheets API
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"

# Netlify Build Hook（シート更新で自動デプロイ用）
NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/xxxxx

# Revalidate secret（Webhook認証用）
REVALIDATE_SECRET=your_random_secret_here
```

- [ ] **Step 2: .env.local を作成（実際の値を入れる）**

```bash
cd /Users/taity/Desktop/bella_frutta/web
cp .env.local.example .env.local
# .env.local に実際の Google API 認証情報を記入（次のタスクで説明）
```

- [ ] **Step 3: Google Sheets フェッチャーを作成**

`web/src/lib/sheets.ts`:

```typescript
import { google } from 'googleapis'
import type { MenuItem, CalendarEntry } from './types'

function getAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
}

async function getSheet(range: string): Promise<string[][]> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  if (!spreadsheetId) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is not set')

  const sheets = google.sheets({ version: 'v4', auth: getAuth() })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })
  return (response.data.values ?? []) as string[][]
}

export async function getMenuItems(): Promise<MenuItem[]> {
  // ヘッダー行をスキップ（2行目から取得）
  const rows = await getSheet('menu!A2:I')
  return rows
    .filter((row) => row[8]?.toLowerCase() === 'true')
    .map((row) => ({
      id: row[0] ?? '',
      category: (row[1] ?? 'other') as MenuItem['category'],
      name_ja: row[2] ?? '',
      name_en: row[3] ?? '',
      price: parseInt(row[4] ?? '0', 10),
      description_ja: row[5] ?? '',
      description_en: row[6] ?? '',
      image_url: row[7] ?? '',
      active: row[8]?.toLowerCase() === 'true',
    }))
}

export async function getCalendarEntries(): Promise<CalendarEntry[]> {
  const rows = await getSheet('calendar!A2:H')
  return rows.map((row) => ({
    month: parseInt(row[0] ?? '0', 10),
    fruit_ja: row[1] ?? '',
    fruit_en: row[2] ?? '',
    origin_ja: row[3] ?? '',
    origin_en: row[4] ?? '',
    note_ja: row[5] ?? '',
    note_en: row[6] ?? '',
  }))
}
```

- [ ] **Step 4: sheets.ts のユニットテストを作成**

`web/__tests__/lib/sheets.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Google APIをモック
vi.mock('googleapis', () => ({
  google: {
    auth: {
      JWT: vi.fn().mockImplementation(() => ({})),
    },
    sheets: vi.fn().mockReturnValue({
      spreadsheets: {
        values: {
          get: vi.fn(),
        },
      },
    }),
  },
}))

import { google } from 'googleapis'
import { getMenuItems } from '@/lib/sheets'

describe('getMenuItems', () => {
  beforeEach(() => {
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = 'test_id'
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test.com'
    process.env.GOOGLE_PRIVATE_KEY = 'test_key'
  })

  it('should parse menu rows correctly', async () => {
    const mockGet = vi.fn().mockResolvedValue({
      data: {
        values: [
          ['1', 'smoothie', 'いちごスムージー', 'Strawberry Smoothie', '800',
           '旬のいちご', 'Seasonal strawberry', '/images/menu/strawberry.jpg', 'TRUE'],
          ['2', 'smoothie', '非表示商品', 'Hidden', '500', '', '', '', 'FALSE'],
        ],
      },
    })
    const sheets = google.sheets({ version: 'v4', auth: {} as any })
    ;(sheets.spreadsheets.values.get as any) = mockGet

    const items = await getMenuItems()
    expect(items).toHaveLength(1)
    expect(items[0].name_ja).toBe('いちごスムージー')
    expect(items[0].price).toBe(800)
    expect(items[0].active).toBe(true)
  })
})
```

- [ ] **Step 5: テストを実行**

```bash
cd /Users/taity/Desktop/bella_frutta/web
npm test
```

Expected: PASS

---

## Task 4: next-intl 多言語設定

**Files:**
- Create: `web/src/i18n/routing.ts`
- Create: `web/src/i18n/request.ts`
- Create: `web/src/middleware.ts`
- Create: `web/messages/ja.json`
- Create: `web/messages/en.json`

- [ ] **Step 1: i18n ルーティング設定を作成**

`web/src/i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ja', 'en'],
  defaultLocale: 'ja',
})
```

- [ ] **Step 2: リクエスト設定を作成**

`web/src/i18n/request.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 3: ミドルウェアを作成**

`web/src/middleware.ts`:

```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 4: 日本語メッセージファイルを作成**

`web/messages/ja.json`:

```json
{
  "nav": {
    "menu": "メニュー",
    "calendar": "果物カレンダー",
    "corporate": "法人のお客様",
    "access": "アクセス",
    "lang": "English"
  },
  "hero": {
    "catch": "旬の果物を、\n五感で体験する。",
    "sub": "水・氷ゼロ。果実100%のスムージー。",
    "cta_menu": "メニューを見る",
    "cta_access": "アクセス"
  },
  "concept": {
    "label": "CONCEPT",
    "title": "旬の果物を五感で体験する",
    "body": "Bella Fruttaのスムージーは、水も氷も使いません。厳選した旬の果物だけを、そのまま一杯に。飲む体験ではなく、五感で果物の本来の甘さと香りを味わっていただくことが、私たちのこだわりです。"
  },
  "philosophy": {
    "label": "PHILOSOPHY",
    "title": "こだわり",
    "p1_title": "水・氷ゼロ、果実100%",
    "p1_body": "一般的なスムージーには水や氷が使われますが、Bella Fruttaは果実のみ。だからこそ、素材の甘さがそのまま伝わります。",
    "p2_title": "必ず試食してもらう",
    "p2_body": "スムージーを作る前に、必ず果物を試食していただきます。食べる体験も含めて、五感で味わってほしいから。",
    "p3_title": "旬の仕入れにこだわる",
    "p3_body": "香川のあきやま農園のデコポン、させほ・出島の花のみかんなど、信頼できる農家から旬の果物を直接仕入れています。"
  },
  "products": {
    "label": "MENU",
    "title": "商品一覧",
    "unit": "円（税込）"
  },
  "farmers": {
    "label": "FARMERS",
    "title": "仕入れ先・農家紹介"
  },
  "owner": {
    "label": "OWNER",
    "title": "店長紹介"
  },
  "instagram": {
    "label": "INSTAGRAM",
    "title": "最新の投稿",
    "link": "Instagramをフォロー"
  },
  "access": {
    "label": "ACCESS",
    "title": "アクセス・店舗情報",
    "hours": "営業時間",
    "closed": "定休日",
    "line": "LINEで問い合わせる",
    "map": "Google マップで見る"
  },
  "footer": {
    "corporate": "法人のお客様",
    "copy": "© 2026 Bella Frutta DAIKANYAMA"
  },
  "menu_page": {
    "title": "メニュー",
    "description": "旬の果物を使ったスムージー・カットフルーツをご用意しています。",
    "all": "すべて",
    "smoothie": "スムージー",
    "fruit": "カットフルーツ"
  },
  "calendar_page": {
    "title": "果物カレンダー",
    "description": "季節ごとに変わる旬の果物をお楽しみください。",
    "month_label": "月",
    "origin": "産地"
  },
  "corporate_page": {
    "title": "法人のお客様へ",
    "description": "スムージーの卸・フルーツギフトなど、法人向けのご相談を承っています。",
    "services_label": "SERVICES",
    "services_title": "ご提供サービス",
    "service1_title": "スムージー卸",
    "service1_body": "店頭と同等の商品を法人様向けにご提供します。デザートメニューとしての採用やイベント・ケータリングにもご対応します。",
    "service2_title": "フルーツギフト",
    "service2_body": "旬の果物を使ったギフトをご提案します。贈り物のシーンに合わせてご相談ください。",
    "cta_label": "CONTACT",
    "cta_title": "お問い合わせ",
    "cta_body": "ご質問・ご相談はGoogleフォームよりお気軽にご連絡ください。",
    "cta_button": "お問い合わせフォームへ"
  }
}
```

- [ ] **Step 5: 英語メッセージファイルを作成**

`web/messages/en.json`:

```json
{
  "nav": {
    "menu": "Menu",
    "calendar": "Fruit Calendar",
    "corporate": "Corporate",
    "access": "Access",
    "lang": "日本語"
  },
  "hero": {
    "catch": "Experience Seasonal Fruits\nWith All Five Senses.",
    "sub": "No water. No ice. 100% pure fruit smoothies.",
    "cta_menu": "View Menu",
    "cta_access": "Access"
  },
  "concept": {
    "label": "CONCEPT",
    "title": "Experience Seasonal Fruits With All Five Senses",
    "body": "Our smoothies contain no water and no ice — only carefully selected seasonal fruits. We don't just offer a drink. We invite you to taste the natural sweetness and aroma of fruit with all your senses."
  },
  "philosophy": {
    "label": "PHILOSOPHY",
    "title": "Our Philosophy",
    "p1_title": "Zero Water. Zero Ice. 100% Fruit.",
    "p1_body": "Most smoothies use water or ice, but not ours. Only fruit — so the natural sweetness comes through exactly as nature intended.",
    "p2_title": "Always a Tasting First",
    "p2_body": "Before we blend, we always offer a taste of the fresh fruit. Because the full experience includes eating, not just drinking.",
    "p3_title": "Sourced from Trusted Farmers",
    "p3_body": "From Akiyama Farm's Dekopon in Kagawa to Dejima no Hana's mikan in Sasebo — we source directly from farmers we trust."
  },
  "products": {
    "label": "MENU",
    "title": "Products",
    "unit": "JPY (tax included)"
  },
  "farmers": {
    "label": "FARMERS",
    "title": "Our Farmers"
  },
  "owner": {
    "label": "OWNER",
    "title": "Meet the Owner"
  },
  "instagram": {
    "label": "INSTAGRAM",
    "title": "Latest Posts",
    "link": "Follow on Instagram"
  },
  "access": {
    "label": "ACCESS",
    "title": "Access & Hours",
    "hours": "Hours",
    "closed": "Closed",
    "line": "Contact via LINE",
    "map": "View on Google Maps"
  },
  "footer": {
    "corporate": "Corporate",
    "copy": "© 2026 Bella Frutta DAIKANYAMA"
  },
  "menu_page": {
    "title": "Menu",
    "description": "Fresh smoothies and cut fruit made with seasonal ingredients.",
    "all": "All",
    "smoothie": "Smoothies",
    "fruit": "Cut Fruit"
  },
  "calendar_page": {
    "title": "Fruit Calendar",
    "description": "Discover what's in season at Bella Frutta.",
    "month_label": "Month",
    "origin": "Origin"
  },
  "corporate_page": {
    "title": "Corporate Inquiries",
    "description": "We offer smoothie wholesale and fruit gift services for businesses.",
    "services_label": "SERVICES",
    "services_title": "Our Services",
    "service1_title": "Smoothie Wholesale",
    "service1_body": "We supply the same quality products available in our store to corporate clients. Ideal for restaurant dessert menus, events, and catering.",
    "service2_title": "Fruit Gifts",
    "service2_body": "We offer seasonal fruit gifts tailored to your gifting needs. Please get in touch to discuss your requirements.",
    "cta_label": "CONTACT",
    "cta_title": "Get in Touch",
    "cta_body": "For inquiries, please use our contact form.",
    "cta_button": "Contact Form"
  }
}
```

- [ ] **Step 6: next.config.ts を next-intl 対応に更新**

`web/next.config.ts`:

```typescript
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
```

---

## Task 5: UIコンポーネント（共通部品）

**Files:**
- Create: `web/src/components/ui/SectionTitle.tsx`
- Create: `web/src/components/ui/LineButton.tsx`
- Create: `web/__tests__/components/ui/SectionTitle.test.tsx`

- [ ] **Step 1: SectionTitle コンポーネントを作成**

`web/src/components/ui/SectionTitle.tsx`:

```typescript
type Props = {
  label: string   // 英字ラベル（例: "CONCEPT"）
  title: string   // メイン見出し（日本語）
  center?: boolean
}

export function SectionTitle({ label, title, center = false }: Props) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      <p
        className="text-xs tracking-[0.2em] uppercase mb-3"
        style={{ color: 'var(--bf-gold)' }}
      >
        {label}
      </p>
      <h2
        className="text-2xl md:text-3xl tracking-[0.05em] leading-snug"
        style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
      >
        {title}
      </h2>
    </div>
  )
}
```

- [ ] **Step 2: LineButton コンポーネントを作成**

`web/src/components/ui/LineButton.tsx`:

```typescript
import { SITE_LINKS } from '@/lib/site-links'

type Props = {
  label: string
  className?: string
}

export function LineButton({ label, className = '' }: Props) {
  return (
    <a
      href={SITE_LINKS.line}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm tracking-wider text-white transition-colors ${className}`}
      style={{ backgroundColor: '#06C755' }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5c-.2.3-.5.5-.8.5H8.3c-.3 0-.6-.2-.8-.5-.2-.3-.1-.6.1-.8l2.7-3.2H8.3c-.4 0-.7-.3-.7-.7v-2c0-.4.3-.7.7-.7h3.4V7.7c0-.4.3-.7.7-.7s.7.3.7.7v.9h1.6c.4 0 .7.3.7.7s-.3.7-.7.7h-1.6v1.2l2.7 3.2c.2.2.3.5.1.8z"/>
      </svg>
      {label}
    </a>
  )
}
```

- [ ] **Step 3: SectionTitle テストを作成**

`web/__tests__/components/ui/SectionTitle.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { SectionTitle } from '@/components/ui/SectionTitle'

describe('SectionTitle', () => {
  it('renders label and title', () => {
    render(<SectionTitle label="CONCEPT" title="旬の果物を五感で体験する" />)
    expect(screen.getByText('CONCEPT')).toBeInTheDocument()
    expect(screen.getByText('旬の果物を五感で体験する')).toBeInTheDocument()
  })

  it('applies center class when center prop is true', () => {
    const { container } = render(
      <SectionTitle label="TEST" title="テスト" center />
    )
    expect(container.firstChild).toHaveClass('text-center')
  })
})
```

- [ ] **Step 4: テストを実行**

```bash
cd /Users/taity/Desktop/bella_frutta/web
npm test
```

Expected: PASS

---

## Task 6: レイアウト（Header / Footer）

**Files:**
- Create: `web/src/components/layout/Header.tsx`
- Create: `web/src/components/layout/Footer.tsx`
- Create: `web/src/app/[locale]/layout.tsx`

- [ ] **Step 1: Header コンポーネントを作成**

`web/src/components/layout/Header.tsx`:

```typescript
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
```

- [ ] **Step 2: Footer コンポーネントを作成**

`web/src/components/layout/Footer.tsx`:

```typescript
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
```

- [ ] **Step 3: ルートレイアウトを作成**

`web/src/app/[locale]/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Bella Frutta DAIKANYAMA',
  description: '旬の果物を五感で体験する。水・氷ゼロ、果実100%のスムージー。代官山。',
  openGraph: {
    title: 'Bella Frutta DAIKANYAMA',
    description: '旬の果物を五感で体験する。水・氷ゼロ、果実100%のスムージー。代官山。',
    type: 'website',
  },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
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
          <main className="pt-16">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: 動作確認**

```bash
cd /Users/taity/Desktop/bella_frutta/web
npm run dev
```

`http://localhost:3000` でヘッダー・フッターが表示されることを確認。`http://localhost:3000/en` で英語表示になることを確認。

---

## Task 7: トップページ（HeroSlider + Concept + Philosophy）

**Files:**
- Create: `web/src/components/home/HeroSlider.tsx`
- Create: `web/src/components/home/ConceptSection.tsx`
- Create: `web/src/components/home/PhilosophySection.tsx`
- Modify: `web/src/app/[locale]/page.tsx`

- [ ] **Step 1: HeroSlider コンポーネントを作成**

`web/src/components/home/HeroSlider.tsx`:

```typescript
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const SLIDES = [
  { src: '/images/menu/strawberry.jpg', alt: 'いちごスムージー' },
  { src: '/images/menu/mango.jpg', alt: 'マンゴースムージー' },
  { src: '/images/menu/melon.jpg', alt: 'メロンスムージー' },
  { src: '/images/menu/orange.jpg', alt: 'オレンジスムージー' },
  { src: '/images/others/292A7361.jpg', alt: 'Bella Frutta' },
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
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
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

      {/* ドットインジケーター */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{ backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.4)' }}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: ConceptSection を作成**

`web/src/components/home/ConceptSection.tsx`:

```typescript
import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'

export function ConceptSection() {
  const t = useTranslations('concept')

  return (
    <section
      className="py-24 px-4"
      style={{ backgroundColor: 'var(--bf-base)' }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <SectionTitle label={t('label')} title={t('title')} center />
        <p
          className="leading-[2] tracking-wider text-sm md:text-base"
          style={{ color: 'var(--bf-ink-muted)' }}
        >
          {t('body')}
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: PhilosophySection を作成**

`web/src/components/home/PhilosophySection.tsx`:

```typescript
import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'

export function PhilosophySection() {
  const t = useTranslations('philosophy')

  const points = [
    { title: t('p1_title'), body: t('p1_body') },
    { title: t('p2_title'), body: t('p2_body') },
    { title: t('p3_title'), body: t('p3_body') },
  ]

  return (
    <section
      className="py-24 px-4"
      style={{ backgroundColor: 'var(--bf-base-2)' }}
    >
      <div className="max-w-4xl mx-auto">
        <SectionTitle label={t('label')} title={t('title')} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((point) => (
            <div
              key={point.title}
              className="p-6 rounded-2xl"
              style={{ backgroundColor: 'var(--bf-surface)' }}
            >
              <h3
                className="text-base mb-3 tracking-wider"
                style={{
                  color: 'var(--bf-ink)',
                  fontFamily: '"Noto Serif JP", serif',
                }}
              >
                {point.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--bf-ink-muted)' }}
              >
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: トップページを作成（暫定版）**

`web/src/app/[locale]/page.tsx`:

```typescript
import { HeroSlider } from '@/components/home/HeroSlider'
import { ConceptSection } from '@/components/home/ConceptSection'
import { PhilosophySection } from '@/components/home/PhilosophySection'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <ConceptSection />
      <PhilosophySection />
      {/* 残りのセクションは後続タスクで追加 */}
    </>
  )
}
```

- [ ] **Step 5: 動作確認**

```bash
cd /Users/taity/Desktop/bella_frutta/web
npm run dev
```

- ヒーロースライドショーが自動で切り替わることを確認
- コンセプト・こだわりセクションが表示されることを確認
- `/en` で英語表示になることを確認

---

## Task 8: トップページ（Products + Farmers + Owner + Instagram + Access）

**Files:**
- Create: `web/src/components/home/ProductsSection.tsx`
- Create: `web/src/components/home/FarmersSection.tsx`
- Create: `web/src/components/home/OwnerSection.tsx`
- Create: `web/src/components/home/InstagramSection.tsx`
- Create: `web/src/components/home/AccessSection.tsx`
- Modify: `web/src/app/[locale]/page.tsx`

- [ ] **Step 1: ProductsSection を作成（Sheetsデータ使用）**

`web/src/components/home/ProductsSection.tsx`:

```typescript
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'
import type { MenuItem } from '@/lib/types'

type Props = {
  items: MenuItem[]
}

export function ProductsSection({ items }: Props) {
  const t = useTranslations('products')
  const locale = useLocale()

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle label={t('label')} title={t('title')} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--bf-surface)' }}
            >
              {item.image_url && (
                <div className="relative aspect-square">
                  <Image
                    src={item.image_url}
                    alt={locale === 'ja' ? item.name_ja : item.name_en}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-3">
                <p
                  className="text-sm font-medium mb-1 tracking-wide"
                  style={{ color: 'var(--bf-ink)' }}
                >
                  {locale === 'ja' ? item.name_ja : item.name_en}
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--bf-ink-muted)' }}
                >
                  ¥{item.price.toLocaleString()} {t('unit')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: FarmersSection を作成（ダミーコンテンツ）**

`web/src/components/home/FarmersSection.tsx`:

```typescript
import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'

// TODO: 店舗側から仕入れ先情報・写真を受け取り次第、差し替える
const DUMMY_FARMERS = [
  {
    id: 'akiyama',
    name_ja: '香川 あきやま農園',
    name_en: 'Akiyama Farm, Kagawa',
    fruit_ja: 'デコポン',
    fruit_en: 'Dekopon',
    note_ja: '2〜3ヶ月熟成させた、めちゃくちゃ甘いデコポン。',
    note_en: 'Aged 2-3 months for exceptional sweetness.',
  },
  {
    id: 'dejima',
    name_ja: 'させほ 出島の花',
    name_en: 'Dejima no Hana, Sasebo',
    fruit_ja: 'みかん',
    fruit_en: 'Mikan',
    note_ja: '糖度18度。通常の約2倍の甘さを誇る希少なみかん。',
    note_en: 'Brix 18° — nearly twice as sweet as standard mikan.',
  },
  {
    id: 'yukimilk',
    name_ja: '雪みるく農家',
    name_en: 'Yukimilk Farm',
    fruit_ja: '各種フルーツ',
    fruit_en: 'Various Fruits',
    note_ja: '（紹介テキスト準備中）',
    note_en: '(Description coming soon)',
  },
]

export function FarmersSection() {
  const t = useTranslations('farmers')

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base-2)' }}>
      <div className="max-w-4xl mx-auto">
        <SectionTitle label={t('label')} title={t('title')} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DUMMY_FARMERS.map((farmer) => (
            <div
              key={farmer.id}
              className="p-6 rounded-2xl"
              style={{ backgroundColor: 'var(--bf-surface)' }}
            >
              <p
                className="text-xs tracking-widest uppercase mb-2"
                style={{ color: 'var(--bf-gold)' }}
              >
                {farmer.fruit_ja}
              </p>
              <h3
                className="text-base mb-3 tracking-wider"
                style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
              >
                {farmer.name_ja}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--bf-ink-muted)' }}>
                {farmer.note_ja}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: OwnerSection を作成（ダミーコンテンツ）**

`web/src/components/home/OwnerSection.tsx`:

```typescript
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'

// TODO: 店長の写真（`/images/others/292A7361.jpg`）と紹介テキストを入れる
export function OwnerSection() {
  const t = useTranslations('owner')

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-4xl mx-auto">
        <SectionTitle label={t('label')} title={t('title')} />
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="w-full md:w-64 flex-shrink-0">
            <div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--bf-base-2)' }}
            >
              <Image
                src="/images/others/292A7361.jpg"
                alt="店長"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <h3
              className="text-xl mb-4 tracking-wider"
              style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
            >
              店長名（準備中）
            </h3>
            <p className="text-sm leading-[2] tracking-wider" style={{ color: 'var(--bf-ink-muted)' }}>
              店長の紹介テキストをここに入れます。
              果物への想い、Bella Fruttaを始めたきっかけ、
              お客様に伝えたいメッセージなど。
              （テキスト準備中 — 店舗側と確認後に更新）
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: InstagramSection を作成**

`web/src/components/home/InstagramSection.tsx`:

```typescript
import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { SITE_LINKS } from '@/lib/site-links'

export function InstagramSection() {
  const t = useTranslations('instagram')

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base-2)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <SectionTitle label={t('label')} title={t('title')} center />
        {/* Instagram 埋め込みウィジェット（Elfsightなど） */}
        {/* TODO: Instagram埋め込みウィジェットのスクリプトをここに挿入 */}
        <div
          className="h-64 rounded-2xl flex items-center justify-center mb-8"
          style={{ backgroundColor: 'var(--bf-base)' }}
        >
          <p className="text-sm" style={{ color: 'var(--bf-ink-faint)' }}>
            Instagram フィード（準備中）
          </p>
        </div>
        <a
          href={SITE_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm tracking-widest underline underline-offset-4"
          style={{ color: 'var(--bf-ink-muted)' }}
        >
          {t('link')} →
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: AccessSection を作成**

`web/src/components/home/AccessSection.tsx`:

```typescript
import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { LineButton } from '@/components/ui/LineButton'
import { SITE_LINKS, STORE_INFO } from '@/lib/site-links'

export function AccessSection() {
  const t = useTranslations('access')

  return (
    <section id="access" className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-4xl mx-auto">
        <SectionTitle label={t('label')} title={t('title')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* 地図 */}
          <div className="rounded-2xl overflow-hidden h-64 md:h-auto">
            <iframe
              src="https://maps.google.com/maps?q=Bella+Frutta+Daikanyama&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 256 }}
              allowFullScreen
              loading="lazy"
              title="Bella Frutta DAIKANYAMA 地図"
            />
          </div>

          {/* 店舗情報 */}
          <div className="flex flex-col gap-6 justify-center">
            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--bf-gold)' }}>
                {t('hours')}
              </p>
              <p className="text-base tracking-wider" style={{ color: 'var(--bf-ink)' }}>
                {STORE_INFO.hours_ja}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--bf-gold)' }}>
                {t('closed')}
              </p>
              <p className="text-base tracking-wider" style={{ color: 'var(--bf-ink)' }}>
                {STORE_INFO.closed_ja}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--bf-gold)' }}>
                ACCESS
              </p>
              <p className="text-sm leading-relaxed tracking-wider" style={{ color: 'var(--bf-ink-muted)' }}>
                {STORE_INFO.address_ja}
              </p>
              <a
                href={SITE_LINKS.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-widest mt-1 inline-block underline underline-offset-4"
                style={{ color: 'var(--bf-ink-faint)' }}
              >
                {t('map')} →
              </a>
            </div>
            <LineButton label={t('line')} />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: トップページを完成させる**

`web/src/app/[locale]/page.tsx`:

```typescript
import { HeroSlider } from '@/components/home/HeroSlider'
import { ConceptSection } from '@/components/home/ConceptSection'
import { PhilosophySection } from '@/components/home/PhilosophySection'
import { ProductsSection } from '@/components/home/ProductsSection'
import { FarmersSection } from '@/components/home/FarmersSection'
import { OwnerSection } from '@/components/home/OwnerSection'
import { InstagramSection } from '@/components/home/InstagramSection'
import { AccessSection } from '@/components/home/AccessSection'
import { getMenuItems } from '@/lib/sheets'

export const revalidate = 3600 // 1時間ごとに再検証

export default async function HomePage() {
  let menuItems = []
  try {
    const all = await getMenuItems()
    // トップページには最初の8件だけ表示
    menuItems = all.slice(0, 8)
  } catch (e) {
    console.error('Failed to fetch menu items:', e)
  }

  return (
    <>
      <HeroSlider />
      <ConceptSection />
      <PhilosophySection />
      <ProductsSection items={menuItems} />
      <FarmersSection />
      <OwnerSection />
      <InstagramSection />
      <AccessSection />
    </>
  )
}
```

- [ ] **Step 7: 動作確認**

```bash
cd /Users/taity/Desktop/bella_frutta/web
npm run dev
```

全セクションがトップページに表示されることを確認。Google Sheets未設定の場合は商品一覧が空になるが、エラーにならないことを確認。

---

## Task 9: メニューページ（/menu）

**Files:**
- Create: `web/src/components/menu/MenuGrid.tsx`
- Create: `web/src/app/[locale]/menu/page.tsx`

- [ ] **Step 1: MenuGrid コンポーネントを作成**

`web/src/components/menu/MenuGrid.tsx`:

```typescript
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import type { MenuItem } from '@/lib/types'

type Props = {
  items: MenuItem[]
}

export function MenuGrid({ items }: Props) {
  const t = useTranslations('menu_page')
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState<'all' | 'smoothie' | 'fruit'>('all')

  const filtered = activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory)

  const tabs = [
    { key: 'all' as const, label: t('all') },
    { key: 'smoothie' as const, label: t('smoothie') },
    { key: 'fruit' as const, label: t('fruit') },
  ]

  return (
    <>
      {/* タブ */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className="px-5 py-2 rounded-full text-sm tracking-wider transition-colors"
            style={{
              backgroundColor: activeCategory === tab.key ? 'var(--bf-accent)' : 'var(--bf-base-2)',
              color: activeCategory === tab.key ? 'white' : 'var(--bf-ink-muted)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* グリッド */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--bf-surface)' }}
          >
            {item.image_url && (
              <div className="relative aspect-square">
                <Image
                  src={item.image_url}
                  alt={locale === 'ja' ? item.name_ja : item.name_en}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <p
                className="text-sm font-medium mb-1 tracking-wide"
                style={{ color: 'var(--bf-ink)' }}
              >
                {locale === 'ja' ? item.name_ja : item.name_en}
              </p>
              <p className="text-xs mb-2" style={{ color: 'var(--bf-ink-muted)' }}>
                {locale === 'ja' ? item.description_ja : item.description_en}
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--bf-accent)' }}
              >
                ¥{item.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 2: メニューページを作成**

`web/src/app/[locale]/menu/page.tsx`:

```typescript
import { useTranslations } from 'next-intl'
import { getMenuItems } from '@/lib/sheets'
import { MenuGrid } from '@/components/menu/MenuGrid'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'メニュー | Bella Frutta DAIKANYAMA',
  description: '旬の果物を使ったスムージー・カットフルーツをご用意しています。',
}

export default async function MenuPage() {
  let items = []
  try {
    items = await getMenuItems()
  } catch (e) {
    console.error('Failed to fetch menu:', e)
  }

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: 'var(--bf-gold)' }}
          >
            MENU
          </p>
          <h1
            className="text-3xl tracking-wider mb-4"
            style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
          >
            メニュー
          </h1>
        </div>
        <MenuGrid items={items} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 動作確認**

`http://localhost:3000/menu` でメニューページが表示されることを確認。カテゴリタブが機能することを確認。

---

## Task 10: 果物カレンダーページ（/calendar）

**Files:**
- Create: `web/src/components/calendar/FruitCalendarTable.tsx`
- Create: `web/src/app/[locale]/calendar/page.tsx`

- [ ] **Step 1: FruitCalendarTable を作成**

`web/src/components/calendar/FruitCalendarTable.tsx`:

```typescript
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
  const byMonth: Record<number, CalendarEntry[]> = {}
  entries.forEach((entry) => {
    if (!byMonth[entry.month]) byMonth[entry.month] = []
    byMonth[entry.month].push(entry)
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
              {locale === 'ja' ? '果物' : 'Fruit'}
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
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
            const monthEntries = byMonth[month] ?? []
            if (monthEntries.length === 0) return null
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
```

- [ ] **Step 2: カレンダーページを作成**

`web/src/app/[locale]/calendar/page.tsx`:

```typescript
import { getCalendarEntries } from '@/lib/sheets'
import { FruitCalendarTable } from '@/components/calendar/FruitCalendarTable'
import type { Metadata } from 'next'

export const revalidate = 86400 // 1日ごとに再検証

export const metadata: Metadata = {
  title: '果物カレンダー | Bella Frutta DAIKANYAMA',
  description: '代官山 Bella Frutta の旬の果物カレンダー。季節ごとの仕入れ情報をご覧いただけます。',
}

export default async function CalendarPage() {
  let entries = []
  try {
    entries = await getCalendarEntries()
  } catch (e) {
    console.error('Failed to fetch calendar:', e)
  }

  // Sheetsデータがない場合のダミーデータ
  if (entries.length === 0) {
    entries = [
      { month: 1, fruit_ja: 'みかん', fruit_en: 'Mikan', origin_ja: '佐世保・出島の花', origin_en: 'Sasebo, Dejima no Hana', note_ja: '糖度18度', note_en: 'Brix 18°' },
      { month: 2, fruit_ja: 'いちご', fruit_en: 'Strawberry', origin_ja: '栃木', origin_en: 'Tochigi', note_ja: '', note_en: '' },
      { month: 3, fruit_ja: 'デコポン', fruit_en: 'Dekopon', origin_ja: '香川・あきやま農園', origin_en: 'Kagawa, Akiyama Farm', note_ja: '2〜3ヶ月熟成', note_en: 'Aged 2-3 months' },
      { month: 4, fruit_ja: 'いちご', fruit_en: 'Strawberry', origin_ja: '栃木', origin_en: 'Tochigi', note_ja: '', note_en: '' },
      { month: 5, fruit_ja: 'メロン', fruit_en: 'Melon', origin_ja: '茨城', origin_en: 'Ibaraki', note_ja: '', note_en: '' },
      { month: 6, fruit_ja: 'マンゴー', fruit_en: 'Mango', origin_ja: '宮崎', origin_en: 'Miyazaki', note_ja: '', note_en: '' },
      { month: 7, fruit_ja: 'スイカ', fruit_en: 'Watermelon', origin_ja: '熊本', origin_en: 'Kumamoto', note_ja: '', note_en: '' },
      { month: 8, fruit_ja: 'もも', fruit_en: 'Peach', origin_ja: '山梨', origin_en: 'Yamanashi', note_ja: '', note_en: '' },
      { month: 9, fruit_ja: 'ぶどう', fruit_en: 'Grape', origin_ja: '山梨', origin_en: 'Yamanashi', note_ja: '', note_en: '' },
      { month: 10, fruit_ja: 'なし', fruit_en: 'Pear', origin_ja: '千葉', origin_en: 'Chiba', note_ja: '', note_en: '' },
      { month: 11, fruit_ja: 'りんご', fruit_en: 'Apple', origin_ja: '青森', origin_en: 'Aomori', note_ja: '', note_en: '' },
      { month: 12, fruit_ja: 'みかん', fruit_en: 'Mikan', origin_ja: '佐世保・出島の花', origin_en: 'Sasebo, Dejima no Hana', note_ja: '', note_en: '' },
    ]
  }

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: 'var(--bf-base)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
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
            果物カレンダー
          </h1>
          <p className="text-sm" style={{ color: 'var(--bf-ink-muted)' }}>
            季節ごとに変わる旬の果物をお楽しみください。
          </p>
        </div>
        <FruitCalendarTable entries={entries} />
      </div>
    </div>
  )
}
```

---

## Task 11: 法人ページ（/corporate）

**Files:**
- Create: `web/src/app/[locale]/corporate/page.tsx`

- [ ] **Step 1: 法人ページを作成**

`web/src/app/[locale]/corporate/page.tsx`:

```typescript
import { useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { SITE_LINKS } from '@/lib/site-links'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '法人のお客様へ | Bella Frutta DAIKANYAMA',
  description: 'スムージーの卸・フルーツギフトなど、法人向けのご相談を承っています。',
}

export default function CorporatePage() {
  const t = useTranslations('corporate_page')

  const services = [
    { title: t('service1_title'), body: t('service1_body') },
    { title: t('service2_title'), body: t('service2_body') },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bf-base)' }}>
      {/* ヒーロー */}
      <div
        className="py-32 px-4 text-center"
        style={{ backgroundColor: 'var(--bf-base-2)' }}
      >
        <p
          className="text-xs tracking-[0.2em] uppercase mb-4"
          style={{ color: 'var(--bf-gold)' }}
        >
          CORPORATE
        </p>
        <h1
          className="text-3xl md:text-4xl tracking-wider mb-4"
          style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
        >
          {t('title')}
        </h1>
        <p className="text-sm md:text-base max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--bf-ink-muted)' }}>
          {t('description')}
        </p>
      </div>

      {/* サービス */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle label={t('services_label')} title={t('services_title')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="p-8 rounded-2xl"
                style={{ backgroundColor: 'var(--bf-surface)' }}
              >
                <h3
                  className="text-lg mb-4 tracking-wider"
                  style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
                >
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--bf-ink-muted)' }}>
                  {service.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 問い合わせCTA */}
      <section className="py-24 px-4" style={{ backgroundColor: 'var(--bf-base-2)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <SectionTitle label={t('cta_label')} title={t('cta_title')} center />
          <p className="text-sm mb-10 leading-relaxed" style={{ color: 'var(--bf-ink-muted)' }}>
            {t('cta_body')}
          </p>
          {SITE_LINKS.corporateForm ? (
            <a
              href={SITE_LINKS.corporateForm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 rounded-full text-sm tracking-widest text-white transition-colors"
              style={{ backgroundColor: 'var(--bf-accent)' }}
            >
              {t('cta_button')}
            </a>
          ) : (
            <p className="text-sm" style={{ color: 'var(--bf-ink-faint)' }}>
              （フォームURL準備中）
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
```

---

## Task 12: Google Sheets セットアップ（実際のデータ連携）

**Files:**
- Modify: `web/.env.local`

> ⚠️ このタスクはGoogleのコンソール操作が必要です。

- [ ] **Step 1: Google Cloud プロジェクトを作成**

1. `https://console.cloud.google.com/` を開く
2. プロジェクトを新規作成（例: `bella-frutta-web`）
3. 「APIとサービス」→「ライブラリ」→ **Google Sheets API** を検索して有効化

- [ ] **Step 2: サービスアカウントを作成**

1. 「APIとサービス」→「認証情報」→「認証情報を作成」→「サービスアカウント」
2. 名前: `bella-frutta-sheets-reader`
3. 作成後、サービスアカウントのメールアドレスをコピー（例: `xxx@bella-frutta-web.iam.gserviceaccount.com`）
4. 「キー」タブ → 「鍵を追加」→「JSON」でダウンロード

- [ ] **Step 3: Google スプレッドシートを作成**

1. `https://sheets.google.com` で新規スプレッドシートを作成
2. シート名を `menu` に変更
3. 1行目（ヘッダー）を以下の通り入力:

```
id | category | name_ja | name_en | price | description_ja | description_en | image_url | active
```

4. 2行目以降にサンプルデータを入力（例）:

```
1 | smoothie | いちごスムージー | Strawberry Smoothie | 800 | 旬のいちごを使用 | Made with seasonal strawberries | /images/menu/strawberry.jpg | TRUE
2 | smoothie | マンゴースムージー | Mango Smoothie | 900 | 宮崎産マンゴー | Miyazaki mango | /images/menu/mango.jpg | TRUE
```

5. サービスアカウントのメールアドレスを「共有」で **閲覧者** として追加
6. スプレッドシートIDをURLからコピー（`/spreadsheets/d/[THIS_IS_THE_ID]/edit`）

- [ ] **Step 4: .env.local に認証情報を入力**

`web/.env.local`:

```bash
GOOGLE_SHEETS_SPREADSHEET_ID=<スプレッドシートIDを貼り付け>
GOOGLE_SERVICE_ACCOUNT_EMAIL=<サービスアカウントのメールを貼り付け>
GOOGLE_PRIVATE_KEY="<JSONの private_key の値を貼り付け（\n を含むまま）>"
REVALIDATE_SECRET=<ランダムな文字列（例: openssl rand -hex 32 で生成）>
```

- [ ] **Step 5: データ取得を確認**

```bash
cd /Users/taity/Desktop/bella_frutta/web
npm run dev
```

`http://localhost:3000/menu` でメニューアイテムが表示されることを確認。

---

## Task 13: Netlify デプロイ設定

**Files:**
- Create: `web/netlify.toml`

- [ ] **Step 1: netlify.toml を作成**

`web/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

- [ ] **Step 2: Netlify プラグインをインストール**

```bash
cd /Users/taity/Desktop/bella_frutta/web
npm install --save-dev @netlify/plugin-nextjs
```

- [ ] **Step 3: Netlify にデプロイ**

1. `https://app.netlify.com/` でアカウントを作成（または既存アカウントでログイン）
2. 「Add new site」→「Deploy manually」
3. `web/` フォルダをビルドして `.next` をアップロード、またはGitリポジトリと連携

**Gitリポジトリ連携の場合:**

```bash
# まずgit initが必要（ルートディレクトリで）
cd /Users/taity/Desktop/bella_frutta
git init
git add .
git commit -m "initial commit"
# GitHubにpushしてNetlifyと連携
```

- [ ] **Step 4: Netlifyの環境変数を設定**

Netlify管理画面 → Site settings → Environment variables で以下を設定:

```
GOOGLE_SHEETS_SPREADSHEET_ID = <スプレッドシートID>
GOOGLE_SERVICE_ACCOUNT_EMAIL = <サービスアカウントメール>
GOOGLE_PRIVATE_KEY = <秘密鍵（\nをそのまま含む文字列）>
REVALIDATE_SECRET = <ランダム文字列>
```

- [ ] **Step 5: Build Hook の URL を取得**

Netlify管理画面 → Site settings → Build & deploy → Build hooks → 「Add build hook」
- 名前: `Google Sheets Update`
- ブランチ: `main`
- 生成されたURLをコピー

- [ ] **Step 6: Google スプレッドシートにビルドトリガーを設定**

スプレッドシートの「ツール」→「Apps Script」で以下を貼り付け:

```javascript
function triggerNetlifyBuild() {
  const hookUrl = 'https://api.netlify.com/build_hooks/XXXX'; // ← 取得したURLに置き換え
  const response = UrlFetchApp.fetch(hookUrl, { method: 'post' });
  Browser.msgBox('ビルドをトリガーしました。5〜10分後にサイトに反映されます。');
}
```

「実行」ボタンをスプレッドシートのメニューに追加:

```javascript
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Bella Frutta')
    .addItem('サイトを更新する', 'triggerNetlifyBuild')
    .addToUi();
}
```

- [ ] **Step 7: 本番環境で動作確認**

- Netlifyが発行したURL（例: `https://bella-frutta.netlify.app`）にアクセス
- メニューページ・カレンダー・法人ページが正常表示されることを確認
- 日英切り替えが動作することを確認
- スプレッドシートのメニューから「サイトを更新する」を実行し、変更が反映されることを確認

---

## 公開前チェックリスト

- [ ] 全リンク有効（Instagram・LINE・Googleマップ）
- [ ] 法人フォームURL確定後に `site-links.ts` に追加
- [ ] メニューがGoogle Sheetsの内容と一致
- [ ] スマホ表示確認（iPhone Safari / Android Chrome）
- [ ] PC表示確認（Chrome / Firefox / Safari）
- [ ] `/en/` 英語ページ全ページ確認
- [ ] favicon設定（`public/favicon.ico`）
- [ ] OGP画像設定（`public/og-image.jpg` — 1200×630px）
- [ ] 営業時間・住所を `site-links.ts` の `STORE_INFO` に正確な情報を入力
- [ ] ダミーコンテンツを実際の内容に差し替え（農家・店長紹介）

---

## Self-Review

**Spec coverage:**
- ✅ トップページ（ヒーロー・ストーリー・商品・農家・店長・Instagram・アクセス）
- ✅ `/menu` ページ（QRコード飛び先、カテゴリタブ）
- ✅ `/calendar` ページ（果物カレンダー）
- ✅ `/corporate` ページ（Googleフォームリンク含む）
- ✅ 日英切り替え（next-intl）
- ✅ Google Sheets連携（menu・calendarシート）
- ✅ Netlify Build Hook（スプレッドシートからデプロイトリガー）
- ✅ LINE誘導（電話番号なし）
- ✅ ダミーコンテンツ（農家・店長）
- ✅ Googleマップ埋め込み

**Gaps:**
- Instagram埋め込みは「準備中」プレースホルダー。Elfsightなどのサービスを店舗側と決定後に実装。
- newsシートはフェーズBのため今回スコープ外（型定義は含む）。
