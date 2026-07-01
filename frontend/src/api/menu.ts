import { apiGet } from './client'
import type { MenuItem } from '../types/menu'

export function getMenu(
    restaurantId: string,
    onlyAvailable = false
): Promise<MenuItem[]> {
    const query = onlyAvailable ? '&available=true' : ''

    return apiGet<MenuItem[]>(
        `/restaurants/my/menu?${query}`
    )
    // also `/restaurants/${restaurantId}/menu?${query}` possible
}
