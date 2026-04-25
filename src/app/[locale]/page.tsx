import { HeroSlider } from '@/components/home/HeroSlider'
import { ConceptSection } from '@/components/home/ConceptSection'
import { ProductsSection } from '@/components/home/ProductsSection'
import { OwnerSection } from '@/components/home/OwnerSection'
import { InstagramSection } from '@/components/home/InstagramSection'
import { AccessSection } from '@/components/home/AccessSection'
import { getMenuItems } from '@/lib/sheets'

export const revalidate = 3600 // 1時間ごとに再検証

export default async function HomePage() {
  let menuItems: Awaited<ReturnType<typeof getMenuItems>> = []
  try {
    const all = await getMenuItems()
    menuItems = all.slice(0, 8)
  } catch {
    // Google Sheets not configured yet — show empty product section
  }

  return (
    <>
      <HeroSlider />
      <ConceptSection />
      <ProductsSection items={menuItems} />
      <OwnerSection />
      <InstagramSection />
      <AccessSection />
    </>
  )
}
