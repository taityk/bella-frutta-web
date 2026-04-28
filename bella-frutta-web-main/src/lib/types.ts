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
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
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
  published_at: string // ISO date string (YYYY-MM-DD); validate at ingestion in sheets.ts
  active: boolean
}
