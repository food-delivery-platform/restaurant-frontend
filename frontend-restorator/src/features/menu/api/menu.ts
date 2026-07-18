import { apiGet, apiPost, apiPatch } from '../../../shared/api/client'
import {
    MenuItemSchema,
    MenuItemListSchema,
    CreateMenuItemRequestSchema,
    UpdateMenuItemRequestSchema,
    type MenuItem,
    type CreateMenuItemRequest,
    type UpdateMenuItemRequest,
} from '../model/menu'


export async function getMenu(
    restaurantId: string,
    onlyAvailable = false
): Promise<MenuItem[]> {
    if (!restaurantId) {
        return []
    }

    const query = onlyAvailable ? '?available=true' : ''

    const data = await apiGet<unknown>(
        `/api/restaurants/${restaurantId}/menu-items${query}`
    )
    return MenuItemListSchema.parse(data)
}

export async function getMenuItem(menuItemId: string): Promise<MenuItem> {
    const data = await apiGet<unknown>(`/api/menu-items/${menuItemId}`)
    return MenuItemSchema.parse(data)
}

export async function createMenuItem(item: CreateMenuItemRequest): Promise<MenuItem> {
    const payload = CreateMenuItemRequestSchema.parse(item)
    const data = await apiPost<unknown, CreateMenuItemRequest>('/api/menu-items', payload)
    return MenuItemSchema.parse(data)
}

export async function updateMenuItem(
    menuItemId: string,
    item: UpdateMenuItemRequest
): Promise<MenuItem> {
    const payload = UpdateMenuItemRequestSchema.parse(item)
    const data = await apiPatch<unknown, UpdateMenuItemRequest>(`/api/menu-items/${menuItemId}`, payload)
    return MenuItemSchema.parse(data)
}
