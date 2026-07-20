import { apiGet, apiPost } from '../../../shared/api/client'
import type { Venue, Category } from '../model/restaurant'

export function getRestaurantInfo(restaurantId: string): Promise<{ venue: Venue }> {
    return apiGet<Venue>(`/api/restaurants/${restaurantId}`).then((venue) => ({ venue }))
}

let categoriesCache: Promise<Category[]> | null = null

export function getCategories(restaurantId: string): Promise<Category[]> {
    if (!categoriesCache) {
        categoriesCache = apiGet<Category[]>(`/api/restaurants/${restaurantId}/menu-item-categories`)
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
