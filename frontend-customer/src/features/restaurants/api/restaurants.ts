import { serverApiGet } from '@/src/shared/api/server'
import type { Restaurant } from '../model/restaurant'

export async function getRestaurants(): Promise<Restaurant[]> {
  return serverApiGet<Restaurant[]>('/api/restaurants')
}

export async function getRestaurant(restaurantId: string): Promise<Restaurant> {
  return serverApiGet<Restaurant>(`/api/restaurants/${restaurantId}`)
}
