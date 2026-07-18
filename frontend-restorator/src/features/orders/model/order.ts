export type OrderItemStatus = 'NEED_COOK' | 'READY'

export type OrderItem = {
    id: string
    order_id: string
    menu_item_id: string
    quantity: number
    unit_price: number
    special_instructions: string | null
    menu_item_name: string
    status: OrderItemStatus
    created_at: string
    line_total: number
}

export type OrderStatus =
    | 'AWAITING_PAYMENT'
    | 'RESTAURANT_ACCEPTED'
    | 'PREPARING'
    | 'READY_FOR_PICKUP'
    | 'DELIVERED'
    | 'CANCELLED'

export type Order = {
    id: string
    customerName: string
    customer_id: string
    venue_id: string
    delivery_address_id: string
    status: OrderStatus
    subtotal: number
    delivery_fee: number
    total: number
    currency: string
    special_instructions: string | null
    estimated_delivery_at: string | null
    venue_confirmation_deadline: string
    cancelled_reason?: string
    created_at: string
    updated_at: string
    courier_id: string | null
    order_items: OrderItem[]
}
