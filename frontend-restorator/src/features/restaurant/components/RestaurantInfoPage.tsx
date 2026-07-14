import { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Heading,
    Input,
    Spinner,
    Stack,
    Text,
    VStack,
    HStack,
    Badge,
} from '@chakra-ui/react'
import { apiGet, apiPost } from '../../../shared/api/client'

interface Venue {
    id: string
    name: string
    slug: string
    description: string
    is_active: boolean
    rating: number
    image_url: string
}

interface Category {
    id: string
    restaurantId: string
    name: string
}

export function RestaurantInfoPage() {
    const restaurantId = 'my'
    const [venue, setVenue] = useState<Venue | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [savingCategory, setSavingCategory] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            setError(null)
            const [venueData, categoriesData] = await Promise.all([
                apiGet('/api/restaurants/my/info'),
                apiGet('/api/restaurants/my/menu-item-categories')
            ])
            setVenue(venueData.venue)
            setCategories(categoriesData)
        } catch (err: any) {
            setError(err.message || 'Failed to load restaurant info')
        } finally {
            setLoading(false)
        }
    }

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newCategoryName.trim()) {
            setError('Category name is required')
            return
        }

        setSavingCategory(true)
        setError(null)

        try {
            await apiPost(`/api/restaurants/${restaurantId}/menu-item-categories`, {
                name: newCategoryName.trim(),
            })
            setNewCategoryName('')
            await loadData()
        } catch (err: any) {
            setError(err.message || 'Failed to add category')
        } finally {
            setSavingCategory(false)
        }
    }

    if (loading) {
        return (
            <Box p={5}>
                <Spinner />
            </Box>
        )
    }

    if (!venue) {
        return (
            <Box p={5}>
                <Text color="red.500">{error || 'Failed to load restaurant info'}</Text>
            </Box>
        )
    }

    return (
        <Box maxW="800px" mx="auto" p={5}>
            <Heading size="lg" mb={6}>Restaurant Info</Heading>

            {error && <Text color="red.500" mb={4}>{error}</Text>}

            {/* Venue Info */}
            <Box mb={8} p={5} border="1px solid" borderColor="gray.200" borderRadius="md">
                <Heading size="md" mb={4}>Restaurant Details</Heading>

                <Stack gap={4}>
                    <Box>
                        <Text fontWeight="semibold" mb={1}>Name</Text>
                        <Text>{venue.name}</Text>
                    </Box>

                    <Box>
                        <Text fontWeight="semibold" mb={1}>Description</Text>
                        <Text>{venue.description}</Text>
                    </Box>

                    <HStack>
                        <Box>
                            <Text fontWeight="semibold" mb={1}>Rating</Text>
                            <Text>⭐ {venue.rating}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="semibold" mb={1}>Status</Text>
                            <Badge colorPalette={venue.is_active ? 'green' : 'red'}>
                                {venue.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </Box>
                    </HStack>
                </Stack>
            </Box>

            {/* Categories */}
            <Box p={5} border="1px solid" borderColor="gray.200" borderRadius="md">
                <Heading size="md" mb={4}>Menu Item Categories</Heading>

                <VStack align="stretch" gap={3} mb={6}>
                    {categories && categories.length > 0 ? (
                        categories.map((cat) => (
                            <Box
                                key={cat.id}
                                p={3}
                                border="1px solid"
                                borderColor="gray.100"
                                borderRadius="md"
                                bg="gray.50"
                            >
                                <Text fontWeight="semibold">{cat.name}</Text>
                            </Box>
                        ))
                    ) : (
                        <Text color="gray.500">No categories yet</Text>
                    )}
                </VStack>

                {/* Add Category Form */}
                <Box as="form" onSubmit={handleAddCategory}>
                    <Text fontWeight="semibold" mb={2}>Add New Category</Text>
                    <HStack gap={2}>
                        <Input
                            placeholder="Category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            disabled={savingCategory}
                        />
                        <Button
                            type="submit"
                            colorPalette="green"
                            disabled={savingCategory || !newCategoryName.trim()}
                        >
                            {savingCategory ? <Spinner size="sm" /> : 'Add'}
                        </Button>
                    </HStack>
                </Box>
            </Box>
        </Box>
    )
}
