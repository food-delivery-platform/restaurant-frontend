import { apiGet, apiPost } from '../../../shared/api/client'
import type { Venue, Category } from '../model/restaurant'

export function getRestaurantInfo(): Promise<{ venue: Venue }> {
    return apiGet<{ venue: Venue }>('/api/restaurants/my/info')
}

export function getCategories(): Promise<Category[]> {
    return apiGet<Category[]>('/api/restaurants/my/menu-item-categories')
}

export function addCategory(restaurantId: string, name: string): Promise<Category> {
    return apiPost<Category>(`/api/restaurants/${restaurantId}/menu-item-categories`, { name })
}
