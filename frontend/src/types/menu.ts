export type MenuItem = {
    id: string
    venueId: string
    menuItemId: string
    name: string
    description?: string
    price: number
    currency?: string
    imageKey?: string
    category?: string
    isActive: boolean
    ingredients: string[]
    labels?: Record<string, boolean>
    portion?: Record<string, any>
    spicyLevel: number
    nutrition?: Record<string, number>
    createdAt: string
    updatedAt: string
}