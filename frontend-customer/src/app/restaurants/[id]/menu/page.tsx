import { getRestaurants } from '@/src/features/restaurants/api/restaurants'

export { MenuPage as default } from '@/src/features/menu_items/components/MenuPage'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const restaurants = await getRestaurants()
    return restaurants.flatMap((r) => [
      { id: r.id },
      { id: r.slug || r.id },
    ])
  } catch {
    return []
  }
}
