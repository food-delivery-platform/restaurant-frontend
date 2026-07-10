import { apiGet, apiPatch } from '../../../shared/api/client'
import type { Order } from '../model/order'

export function getOrders(): Promise<Order[]> {
    return apiGet<Order[]>('/orders')
}

export function markItemReady(orderId: string, itemId: string): Promise<Order> {
    return apiPatch<Order>(`/orders/${orderId}/items/${itemId}/ready`, {})
}

export function markOrderDeliver(orderId: string): Promise<Order> {
    return apiPatch<Order>(`/orders/${orderId}/deliver`, {})
}
