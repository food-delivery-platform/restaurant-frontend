import { serverApiGet } from '@/lib/api/server'
import type { Restaurant } from '@/lib/models/restaurant'

export async function getRestaurants(): Promise<Restaurant[]> {
  return serverApiGet<Restaurant[]>('/api/restaurants')
}

export async function getRestaurant(restaurantId: string): Promise<Restaurant> {
  return serverApiGet<Restaurant>(`/api/restaurants/${restaurantId}`)
}
