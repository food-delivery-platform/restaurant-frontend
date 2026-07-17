import { apiGet, apiPost } from '../../../shared/api/client'
import type { Venue, Category } from '../model/restaurant'

export function getRestaurantInfo(): Promise<{ venue: Venue }> {
    return apiGet<{ venue: Venue }>('/api/restaurants/my/info')
}

let categoriesCache: Promise<Category[]> | null = null

export function getCategories(): Promise<Category[]> {
    if (!categoriesCache) {
        categoriesCache = apiGet<Category[]>('/api/restaurants/my/menu-item-categories')
            .catch((err: unknown) => {
                categoriesCache = null
                throw err
            })
    }
    return categoriesCache
}

export function addCategory(restaurantId: string, name: string): Promise<Category> {
    return apiPost<Category>(`/api/restaurants/${restaurantId}/menu-item-categories`, { name })
        .then((category) => {
            categoriesCache = null
            return category
        })
}
