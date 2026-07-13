import { apiPost } from '../../../shared/api/client'
import type { MenuItem } from '../../menu/model/menu'

export type CartItem = {
    id: string
    quantity: number
}

export type GetMenuItemsByIdsResponse = {
    items: MenuItem[]
    unavailableItemIds: string[]
    totalPrice: string
}

export function getMenuItemsByIds(menuItemIds: string[]): Promise<GetMenuItemsByIdsResponse> {
    return apiPost<GetMenuItemsByIdsResponse>('/api/menu-items/by-ids', {
        menuItemIds
    })
}
