import { google } from 'googleapis'
import type { MenuItem, CalendarEntry } from './types'

const VALID_CATEGORIES = ['smoothie', 'fruit', 'other'] as const

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (!email) throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is not set')
  if (!privateKey) throw new Error('GOOGLE_PRIVATE_KEY is not set')
  return new google.auth.JWT({
    email,
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
    .map((row) => {
      const rawCategory = row[1] ?? 'other'
      const category: MenuItem['category'] = (VALID_CATEGORIES as readonly string[]).includes(rawCategory)
        ? (rawCategory as MenuItem['category'])
        : 'other'
      return {
        id: row[0] ?? '',
        category,
        name_ja: row[2] ?? '',
        name_en: row[3] ?? '',
        price: parseInt(row[4] ?? '0', 10),
        description_ja: row[5] ?? '',
        description_en: row[6] ?? '',
        image_url: row[7] ?? '',
        active: true,  // already filtered by active=TRUE above
      }
    })
}

export async function getCalendarEntries(): Promise<CalendarEntry[]> {
  const rows = await getSheet('calendar!A2:G')
  return rows
    .map((row) => {
      const month = parseInt(row[0] ?? '', 10)
      if (!Number.isInteger(month) || month < 1 || month > 12) return null
      return {
        month: month as CalendarEntry['month'],
        fruit_ja: row[1] ?? '',
        fruit_en: row[2] ?? '',
        origin_ja: row[3] ?? '',
        origin_en: row[4] ?? '',
        note_ja: row[5] ?? '',
        note_en: row[6] ?? '',
      }
    })
    .filter((entry): entry is CalendarEntry => entry !== null)
}
