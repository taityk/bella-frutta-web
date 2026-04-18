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
    month: parseInt(row[0] ?? '0', 10) as CalendarEntry['month'],
    fruit_ja: row[1] ?? '',
    fruit_en: row[2] ?? '',
    origin_ja: row[3] ?? '',
    origin_en: row[4] ?? '',
    note_ja: row[5] ?? '',
    note_en: row[6] ?? '',
  }))
}
