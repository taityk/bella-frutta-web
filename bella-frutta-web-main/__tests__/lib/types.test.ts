import { describe, it, expect } from 'vitest'
import type { MenuItem, CalendarEntry, NewsItem } from '@/lib/types'

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

describe('NewsItem type', () => {
  it('should accept valid news item', () => {
    const item: NewsItem = {
      id: '1',
      title_ja: 'お知らせ',
      title_en: 'Announcement',
      body_ja: '本文',
      body_en: 'Body text',
      published_at: '2026-04-19',
      active: true,
    }
    expect(item.active).toBe(true)
    expect(item.published_at).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
