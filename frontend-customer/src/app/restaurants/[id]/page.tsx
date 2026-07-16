import { getRestaurants } from '@/src/features/restaurants/api/restaurants'

export { RestaurantDetailPage as default } from '@/src/features/restaurants/components/RestaurantDetailPage'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const restaurants = await getRestaurants()
    return restaurants.map((r) => ({
      id: r.id,
    }))
  } catch {
    return []
  }
}
