import { apiGet, apiPost } from '../../../shared/api/client'
import type { Venue, Category } from '../model/restaurant'

export function getRestaurantInfo(restaurantId: string): Promise<{ venue: Venue }> {
    return apiGet<{ restaurant: Venue }>(`/api/restaurants/${restaurantId}`)
        .then(({ restaurant }) => ({ venue: restaurant }))
}

let categoriesCache: Promise<Category[]> | null = null

export function getCategories(restaurantId: string): Promise<Category[]> {
    if (!categoriesCache) {
        categoriesCache = apiGet<{ categories: Category[] }>(
            `/api/categories?restaurantId=${encodeURIComponent(restaurantId)}`
        )
            .then(({ categories }) => categories)
            .catch((err: unknown) => {
                categoriesCache = null
                throw err
            })
    }
    return categoriesCache
}

export function addCategory(restaurantId: string, name: string): Promise<Category> {
    return apiPost<{ category: Category }>('/api/categories', { restaurantId, name })
        .then(({ category }) => {
            categoriesCache = null
            return category
        })
}
