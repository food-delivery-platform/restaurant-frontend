import { z } from 'zod'

const CategorySchema = z.object({
    id: z.string(),
    restaurantId: z.string(),
    name: z.string(),
})

const LabelsSchema = z.object({
    spicy: z.boolean().optional(),
    vegetarian: z.boolean().optional(),
    vegan: z.boolean().optional(),
    kosher: z.boolean().optional(),
    glutenFree: z.boolean().optional(),
    lactoseFree: z.boolean().optional(),
    halal: z.boolean().optional(),
})

const PortionSchema = z.object({
    weightGrams: z.number().optional(),
    volumeMl: z.number().optional(),
    pieces: z.number().optional(),
    description: z.string().optional(),
})

const NutritionSchema = z.object({
    calories: z.number().optional(),
    protein: z.number().optional(),
    fat: z.number().optional(),
    carbs: z.number().optional(),
})

const SpicyLevelSchema = z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
])

// --- API response (what the backend returns) ---

export const MenuItemSchema = z.object({
    id: z.string(),
    restaurantId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    category: CategorySchema.optional(),
    price: z.string(),
    currency: z.string(),
    isAvailable: z.boolean(),
    ingredients: z.array(z.string()).optional(),
    allergens: z.array(z.string()).optional(),
    labels: LabelsSchema.optional(),
    portion: PortionSchema.optional(),
    spicyLevel: SpicyLevelSchema.optional(),
    nutrition: NutritionSchema.optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
})

export type MenuItem = z.infer<typeof MenuItemSchema>

export const MenuItemListSchema = z.array(MenuItemSchema)

export const GetMenuItemsResponseSchema = z.object({
    restaurantId: z.string(),
    items: MenuItemListSchema,
})

export const MenuItemResponseSchema = z.object({
    item: MenuItemSchema,
})

// --- API requests (what we send) ---

const MenuItemCategoryInputSchema = z.object({
    id: z.string(),
    restaurantId: z.string(),
    name: z.string(),
})

export const CreateMenuItemRequestSchema = z.object({
    restaurantId: z.string(),
    name: z.string().min(1),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/),
    currency: z.string(),
    category: MenuItemCategoryInputSchema.optional(),
    description: z.string().optional(),
    isAvailable: z.boolean(),
    spicyLevel: SpicyLevelSchema.optional(),
    ingredients: z.array(z.string()).optional(),
})

export type CreateMenuItemRequest = z.infer<typeof CreateMenuItemRequestSchema>

export const UpdateMenuItemRequestSchema = CreateMenuItemRequestSchema.omit({
    restaurantId: true,
})

export type UpdateMenuItemRequest = z.infer<typeof UpdateMenuItemRequestSchema>

// --- Form values (what the edit form works with) ---

export const MenuItemFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid decimal (e.g., 12.99)'),
    category: z.string(),
    description: z.string(),
    ingredientsText: z.string(),
    isAvailable: z.boolean(),
    spicyLevel: z.number(),
})

export type MenuItemFormValues = z.infer<typeof MenuItemFormSchema>
