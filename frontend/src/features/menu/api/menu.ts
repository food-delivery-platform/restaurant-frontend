import { apiGet, apiPost, apiPatch } from '../../../shared/api/client'
import type { MenuItem } from '../model/menu'


export function getMenu(
    restaurantId: string,
    onlyAvailable = false
): Promise<MenuItem[]> {
    if (!restaurantId) {
        return Promise.resolve([])
    }

    const query = onlyAvailable ? '?available=true' : ''

    return apiGet<MenuItem[]>(
        `/api/restaurants/${restaurantId}/menu-items${query}`
    )
}

export function getMenuItem(menuItemId: string): Promise<MenuItem> {
    return apiGet<MenuItem>(`/api/menu-items/${menuItemId}`)
}

export function createMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    return apiPost<MenuItem>('/menu_items/new', item)
}

export function updateMenuItem(
    menuItemId: string,
    item: Partial<MenuItem>
): Promise<MenuItem> {
    return apiPatch<MenuItem>(`/menu-items/${menuItemId}`, item)
}

