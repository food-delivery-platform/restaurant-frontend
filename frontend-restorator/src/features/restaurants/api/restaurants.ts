import {apiGet, apiPatch, apiPost} from '../../../shared/api/client'
import type {Restaurant} from '../model/restaurant'

export function getRestaurants(): Promise<Restaurant[]> {
    return apiGet<Restaurant[]>('/api/restaurants')
}

export function getRestaurant(restaurantId: string): Promise<Restaurant> {
    return apiGet<Restaurant>(`/api/restaurants/${restaurantId}`)
}

export function createRestaurant(restaurant: Partial<Restaurant>): Promise<Restaurant> {
    return apiPost<Restaurant>('/api/restaurants', restaurant)
}

export function updateRestaurant(
    restaurantId: string,
    restaurant: Partial<Restaurant>
): Promise<Restaurant> {
    return apiPatch<Restaurant>(`/api/restaurants/${restaurantId}`, restaurant)
}
