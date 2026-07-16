import { getMenu } from '@/src/features/menu_items/api/menu'
import { getRestaurants } from '@/src/features/restaurants/api/restaurants'

export { MenuItemDetailPage as default } from '@/src/features/menu_items/components/MenuItemDetailPage'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const restaurants = await getRestaurants()
    const params: Array<{ id: string; menuItemId: string }> = []

    for (const restaurant of restaurants) {
      const menuItems = await getMenu(restaurant.id)
      menuItems.forEach((item) => {
        params.push({ id: restaurant.id, menuItemId: item.id })
        if (restaurant.slug) {
          params.push({ id: restaurant.slug, menuItemId: item.id })
        }
      })
    }

    return params
  } catch {
    return []
  }
}
