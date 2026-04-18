export const SITE_LINKS: {
  line: string
  instagram: string
  corporateForm: string | null
  googleMaps: string
} = {
  line: 'https://lin.ee/Uq5FESU',
  instagram: 'https://www.instagram.com/bellafrutta_daikanyama/',
  corporateForm: null, // TODO: Googleフォームを店舗側から入手したら追記
  googleMaps: 'https://maps.google.com/?q=Bella+Frutta+Daikanyama',
}

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
