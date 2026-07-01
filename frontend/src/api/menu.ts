import { apiGet, apiPost, apiPatch } from './client'
import type { MenuItem } from '../types/menu'

export function getMenu(
    restaurantId: string,
    onlyAvailable = false
): Promise<MenuItem[]> {
    const query = onlyAvailable ? '&available=true' : ''

    return apiGet<MenuItem[]>(
        `/restaurants/my/menu?${query}`
    )
}

export function getMenuItem(menuItemId: string): Promise<MenuItem> {
    return apiGet<MenuItem>(`/menu-items/${menuItemId}`)
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

