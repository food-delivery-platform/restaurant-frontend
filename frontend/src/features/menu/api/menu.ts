import { apiGet, apiPost, apiPatch } from '../../../shared/api/client'
import type { MenuItem } from '../model/menu'


export function getMenu(
    _venueId: string,
    onlyAvailable = false
): Promise<MenuItem[]> {
    const query = onlyAvailable ? '&available=true' : ''

    return apiGet<MenuItem[]>(
        `/venues/my/menu?${query}`
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

