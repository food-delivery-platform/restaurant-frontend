import { serverApiGet } from '@/lib/api/server'
import type { MenuItem } from '@/lib/models/menu'

export async function getMenu(
  restaurantId: string,
  onlyAvailable = false
): Promise<MenuItem[]> {
  if (!restaurantId) {
    return []
  }

  const query = onlyAvailable ? '?available=true' : ''
  return serverApiGet<MenuItem[]>(`/api/restaurants/${restaurantId}/menu-items${query}`)
}

export async function getMenuItem(menuItemId: string): Promise<MenuItem> {
  return serverApiGet<MenuItem>(`/api/menu-items/${menuItemId}`)
}
