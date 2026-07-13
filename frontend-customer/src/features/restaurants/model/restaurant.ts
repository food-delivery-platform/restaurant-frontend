export type Restaurant = {
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
