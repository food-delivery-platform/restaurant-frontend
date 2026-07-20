export type Venue = {
    id: string
    ownerId: string
    addressId: string
    name: string
    slug?: string
    description?: string
    isOpen: boolean
    rating?: number
    imageUrl?: string
    createdAt: string
    updatedAt: string
}

export type Category = {
    id: string
    restaurantId: string
    name: string
}
