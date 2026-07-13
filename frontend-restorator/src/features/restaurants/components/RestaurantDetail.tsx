import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getRestaurant } from '../api/restaurants'
import type { Restaurant } from '../model/restaurant'
import {
    Box,
    Button,
    Heading,
    Spinner,
    Stack,
    Text,
    Badge,
    Flex,
    VStack,
} from '@chakra-ui/react'

export function RestaurantDetail() {
    const { restaurantId } = useParams<{ restaurantId: string }>()
    const navigate = useNavigate()

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!restaurantId) return

        setLoading(true)
        setError(null)

        getRestaurant(restaurantId)
            .then((data) => {
                setRestaurant(data)
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch restaurant')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [restaurantId])

    if (loading) {
        return (
            <Box p={5}>
                <Spinner />
            </Box>
        )
    }

    if (error || !restaurant) {
        return (
            <Box p={5}>
                <Text color="red.500">{error || 'Restaurant not found'}</Text>
                <Button mt={4} onClick={() => navigate('/restaurants')}>
                    Back to Restaurants
                </Button>
            </Box>
        )
    }

    return (
        <Box maxW="600px" mx="auto" p={5}>
            <Button variant="ghost" mb={4} onClick={() => navigate('/restaurants')}>
                ← Back to Restaurants
            </Button>

            <VStack align="stretch" gap={4}>
                <Box>
                    <Heading size="lg" mb={2}>{restaurant.name}</Heading>
                    {restaurant.slug && (
                        <Text fontSize="sm" color="gray.500">
                            {restaurant.slug}
                        </Text>
                    )}
                </Box>

                {restaurant.description && (
                    <Box>
                        <Text fontSize="md" color="gray.600">
                            {restaurant.description}
                        </Text>
                    </Box>
                )}

                <Stack gap={3} my={4}>
                    <Flex justify="space-between" align="center">
                        <Text fontWeight="semibold">Status</Text>
                        <Badge colorPalette={restaurant.isOpen ? 'green' : 'red'}>
                            {restaurant.isOpen ? 'Open' : 'Closed'}
                        </Badge>
                    </Flex>

                    {restaurant.rating !== undefined && (
                        <Flex justify="space-between" align="center">
                            <Text fontWeight="semibold">Rating</Text>
                            <Heading size="md">⭐ {restaurant.rating}</Heading>
                        </Flex>
                    )}

                    <Flex justify="space-between" align="center">
                        <Text fontWeight="semibold">Owner ID</Text>
                        <Text fontSize="sm" color="gray.600">{restaurant.ownerId}</Text>
                    </Flex>

                    <Flex justify="space-between" align="center">
                        <Text fontWeight="semibold">Address ID</Text>
                        <Text fontSize="sm" color="gray.600">{restaurant.addressId}</Text>
                    </Flex>
                </Stack>

                {restaurant.imageUrl && (
                    <Box>
                        <Text fontWeight="semibold" mb={2}>Image URL</Text>
                        <Text fontSize="sm" color="blue.500" wordBreak="break-all">
                            {restaurant.imageUrl}
                        </Text>
                    </Box>
                )}

                <Box pt={4} borderTop="1px solid" borderColor="gray.200">
                    <Text fontSize="xs" color="gray.500">
                        Created: {new Date(restaurant.createdAt).toLocaleString()}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                        Updated: {new Date(restaurant.updatedAt).toLocaleString()}
                    </Text>
                </Box>

                <Flex gap={3} pt={4}>
                    <Button
                        colorPalette="blue"
                        flex={1}
                        onClick={() => navigate(`/restaurants/edit/${restaurant.id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        colorPalette="green"
                        flex={1}
                        onClick={() => navigate(`/menu_items`)}
                    >
                        View Menu
                    </Button>
                    <Button
                        variant="outline"
                        flex={1}
                        onClick={() => navigate('/restaurants')}
                    >
                        Close
                    </Button>
                </Flex>
            </VStack>
        </Box>
    )
}
