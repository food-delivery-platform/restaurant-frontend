import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRestaurantCache } from '../../restaurants/api/useRestaurantCache'
import { useCart } from '../../cart/context/CartContext'
import { getMenuItem } from '../api/menu'
import type { MenuItem } from '../model/menu'
import {
    Box,
    Button,
    Heading,
    Spinner,
    Stack,
    Text,
    Badge,
    Flex,
} from '@chakra-ui/react'

export function MenuItemDetail() {
    const { menuItemId } = useParams<{ menuItemId: string }>()
    const navigate = useNavigate()
    const { addItem } = useCart()

    const [item, setItem] = useState<MenuItem | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [addedToCart, setAddedToCart] = useState(false)

    const { restaurant } = useRestaurantCache(item?.restaurantId || '')

    useEffect(() => {
        if (!menuItemId) return

        setLoading(true)
        setError(null)

        getMenuItem(menuItemId)
            .then((data) => {
                setItem(data)
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch item')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [menuItemId])

    if (loading) {
        return (
            <Box p={5}>
                <Spinner />
            </Box>
        )
    }

    if (error || !item) {
        return (
            <Box p={5}>
                <Text color="red.500">{error || 'Item not found'}</Text>
                <Button mt={4} onClick={() => navigate('/menu_items')}>
                    Back to Menu
                </Button>
            </Box>
        )
    }

    return (
        <Box maxW="600px" mx="auto" p={5}>
            <Button variant="ghost" mb={4} onClick={() => navigate('/menu_items')}>
                ← Back to Menu
            </Button>

            {restaurant && (
                <Text fontSize="sm" color="gray.500" mb={3}>
                    {restaurant.name}
                </Text>
            )}

            <Heading size="lg" mb={4}>{item.name}</Heading>

            {item.description && (
                <Text fontSize="md" color="gray.600" mb={4}>
                    {item.description}
                </Text>
            )}

            <Stack gap={4} mb={6}>
                <Flex justify="space-between" align="center">
                    <Text fontWeight="semibold">Price</Text>
                    <Heading size="md">
                        {item.price} {item.currency}
                    </Heading>
                </Flex>

                {item.category && (
                    <Flex justify="space-between" align="center">
                        <Text fontWeight="semibold">Category</Text>
                        <Text>{item.category.name}</Text>
                    </Flex>
                )}

                <Flex justify="space-between" align="center">
                    <Text fontWeight="semibold">Status</Text>
                    <Badge colorPalette={item.isAvailable ? 'green' : 'red'}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                </Flex>

                {item.spicyLevel !== undefined && (
                    <Flex justify="space-between" align="center">
                        <Text fontWeight="semibold">Spicy Level</Text>
                        <Text>{item.spicyLevel} / 3 🌶️</Text>
                    </Flex>
                )}
            </Stack>

            {item.ingredients && item.ingredients.length > 0 && (
                <Box mb={6}>
                    <Text fontWeight="semibold" mb={2}>Ingredients</Text>
                    <Flex gap={2} wrap="wrap">
                        {item.ingredients.map((ingredient, idx) => (
                            <Badge key={idx} colorPalette="gray">
                                {ingredient}
                            </Badge>
                        ))}
                    </Flex>
                </Box>
            )}

            {item.labels && Object.entries(item.labels).some(([, v]) => v) && (
                <Box mb={6}>
                    <Text fontWeight="semibold" mb={2}>Labels</Text>
                    <Flex gap={2} wrap="wrap">
                        {Object.entries(item.labels).map(([label, value]) =>
                            value ? (
                                <Badge key={label} colorPalette="blue">
                                    {label}
                                </Badge>
                            ) : null
                        )}
                    </Flex>
                </Box>
            )}

            {item.nutrition && (
                <Box mb={6}>
                    <Text fontWeight="semibold" mb={2}>Nutrition (per serving)</Text>
                    <Stack gap={1} fontSize="sm" color="gray.600">
                        {item.nutrition.calories && <Text>🔥 Calories: {item.nutrition.calories}</Text>}
                        {item.nutrition.protein && <Text>🥚 Protein: {item.nutrition.protein}g</Text>}
                        {item.nutrition.fat && <Text>🧈 Fat: {item.nutrition.fat}g</Text>}
                        {item.nutrition.carbs && <Text>🍞 Carbs: {item.nutrition.carbs}g</Text>}
                    </Stack>
                </Box>
            )}

            {item.portion && (
                <Box mb={6}>
                    <Text fontWeight="semibold" mb={2}>Portion</Text>
                    <Text color="gray.600">{item.portion.description}</Text>
                </Box>
            )}

            <Flex gap={3}>
                <Button
                    colorPalette={addedToCart ? 'green' : 'blue'}
                    flex={1}
                    disabled={!item.isAvailable}
                    opacity={item.isAvailable ? 1 : 0.5}
                    onClick={() => {
                        addItem(item.id)
                        setAddedToCart(true)
                        setTimeout(() => setAddedToCart(false), 2000)
                    }}
                    title={!item.isAvailable ? 'This item is unavailable' : ''}
                >
                    {!item.isAvailable ? '❌ Unavailable' : (addedToCart ? '✓ Added to Cart' : '🛒 Add to Cart')}
                </Button>
                <Button
                    colorPalette="blue"
                    variant="outline"
                    onClick={() => navigate(`/menu_items/edit/${item.id}`)}
                >
                    Edit
                </Button>
                <Button
                    variant="outline"
                    onClick={() => navigate('/menu_items')}
                >
                    Close
                </Button>
            </Flex>
        </Box>
    )
}
