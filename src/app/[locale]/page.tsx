import { HeroSlider } from '@/components/home/HeroSlider'
import { ConceptSection } from '@/components/home/ConceptSection'
import { ProductsSection } from '@/components/home/ProductsSection'
import { OwnerSection } from '@/components/home/OwnerSection'
import { InstagramSection } from '@/components/home/InstagramSection'
import { AccessSection } from '@/components/home/AccessSection'
import { STATIC_MENU_ITEMS } from '@/lib/static-menu'

export default function HomePage() {
  const menuItems = STATIC_MENU_ITEMS.slice(0, 8)

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
