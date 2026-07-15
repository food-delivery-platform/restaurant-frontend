export type MenuItem = {
  id: string
  restaurantId: string
  name: string
  description?: string
  category?: {
    id: string
    restaurantId: string
    name: string
  }
  price: string
  currency: string
  isAvailable: boolean
  ingredients?: string[]
  allergens?: string[]
  labels?: {
    spicy?: boolean
    vegetarian?: boolean
    vegan?: boolean
    kosher?: boolean
    glutenFree?: boolean
    lactoseFree?: boolean
    halal?: boolean
  }
  portion?: {
    weightGrams?: number
    volumeMl?: number
    pieces?: number
    description?: string
  }
  spicyLevel?: 0 | 1 | 2 | 3
  nutrition?: {
    calories?: number
    protein?: number
    fat?: number
    carbs?: number
  }
  createdAt?: string
  updatedAt?: string
}

export type CartItem = {
  id: string
  quantity: number
}
