export const SITE_LINKS: {
  line: string
  instagram: string
  corporateForm: string | null
  googleMaps: string
} = {
  line: 'https://lin.ee/Uq5FESU',
  instagram: 'https://www.instagram.com/bella_frutta.daikanyama/',
  corporateForm: 'https://forms.gle/g2j1JQ3W9CQVA2Ch8',
  googleMaps: 'https://maps.google.com/?q=Bella+Frutta+Daikanyama',
}

export const STORE_INFO = {
  name_ja: 'Bella Frutta DAIKANYAMA',
  name_en: 'Bella Frutta DAIKANYAMA',
  address_ja: '東京都渋谷区代官山町', // TODO: 正確な住所に更新
  address_en: 'Daikanyama, Shibuya, Tokyo', // TODO
  phone: '070-9394-7270',
  hours_ja: '水・金・土・日  11:00 – 18:00\n木  13:00 – 18:00',
  hours_en: 'Wed / Fri / Sat / Sun  11:00 AM – 6:00 PM\nThu  1:00 PM – 6:00 PM',
  closed_ja: '月・火曜日定休',
  closed_en: 'Closed Mon & Tue',
} as const
