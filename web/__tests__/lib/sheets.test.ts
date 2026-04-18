import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }))

// Google APIをモック
vi.mock('googleapis', () => ({
  google: {
    auth: {
      // JWT must be a constructor function (not arrow function)
      JWT: vi.fn().mockImplementation(function () { return {} }),
    },
    sheets: vi.fn().mockReturnValue({
      spreadsheets: {
        values: {
          get: mockGet,
        },
      },
    }),
  },
}))

import { getMenuItems, getCalendarEntries } from '@/lib/sheets'

describe('getMenuItems', () => {
  beforeEach(() => {
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = 'test_id'
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test.com'
    process.env.GOOGLE_PRIVATE_KEY = 'test_key'
    vi.clearAllMocks()
  })

  it('should parse menu rows correctly and filter inactive items', async () => {
    mockGet.mockResolvedValue({
      data: {
        values: [
          ['1', 'smoothie', 'いちごスムージー', 'Strawberry Smoothie', '800',
           '旬のいちご', 'Seasonal strawberry', '/images/menu/strawberry.jpg', 'TRUE'],
          ['2', 'smoothie', '非表示商品', 'Hidden', '500', '', '', '', 'FALSE'],
        ],
      },
    })

    const items = await getMenuItems()
    expect(items).toHaveLength(1)
    expect(items[0].name_ja).toBe('いちごスムージー')
    expect(items[0].price).toBe(800)
    expect(items[0].active).toBe(true)
  })

  it('should return empty array when no rows', async () => {
    mockGet.mockResolvedValue({
      data: { values: null },
    })

    const items = await getMenuItems()
    expect(items).toHaveLength(0)
  })
})

describe('getCalendarEntries', () => {
  beforeEach(() => {
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = 'test_id'
    vi.clearAllMocks()
  })

  it('should parse calendar rows correctly', async () => {
    mockGet.mockResolvedValue({
      data: {
        values: [
          ['4', 'いちご', 'Strawberry', '栃木', 'Tochigi', '春の定番', 'Spring classic'],
        ],
      },
    })

    const entries = await getCalendarEntries()
    expect(entries).toHaveLength(1)
    expect(entries[0].month).toBe(4)
    expect(entries[0].fruit_ja).toBe('いちご')
  })
})
