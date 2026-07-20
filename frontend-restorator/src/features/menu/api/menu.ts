import { apiGet, apiPost, apiPatch } from '../../../shared/api/client'
import {
    MenuItemSchema,
    GetMenuItemsResponseSchema,
    MenuItemResponseSchema,
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

    const params = new URLSearchParams({ restaurantId })
    if (onlyAvailable) {
        params.set('available', 'true')
    }

    const data = await apiGet<unknown>(`/api/menu-items?${params.toString()}`)
    return GetMenuItemsResponseSchema.parse(data).items
}

export async function getMenuItem(menuItemId: string): Promise<MenuItem> {
    const data = await apiGet<unknown>(`/api/menu-items/${menuItemId}`)
    return MenuItemSchema.parse(data)
}

export async function createMenuItem(item: CreateMenuItemRequest): Promise<MenuItem> {
    const payload = CreateMenuItemRequestSchema.parse(item)
    const data = await apiPost<unknown, CreateMenuItemRequest>('/api/menu-items', payload)
    return MenuItemResponseSchema.parse(data).item
}

export async function updateMenuItem(
    menuItemId: string,
    item: UpdateMenuItemRequest
): Promise<MenuItem> {
    const payload = UpdateMenuItemRequestSchema.parse(item)
    const data = await apiPatch<unknown, UpdateMenuItemRequest>(`/api/menu-items/${menuItemId}`, payload)
    return MenuItemResponseSchema.parse(data).item
}
