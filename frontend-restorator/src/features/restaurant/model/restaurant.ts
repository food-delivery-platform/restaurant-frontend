export type Venue = {
    id: string
    name: string
    slug: string
    description: string
    is_active: boolean
    rating: number
    image_url: string
}

export type Category = {
    id: string
    restaurantId: string
    name: string
}
