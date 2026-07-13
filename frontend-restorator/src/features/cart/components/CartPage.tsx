import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Button,
    Flex,
    Heading,
    Spinner,
    Stack,
    Text,
    VStack,
    Table,
    Badge,
    HStack,
} from '@chakra-ui/react'

import { useCart } from '../context/CartContext'
import { getMenuItemsByIds } from '../api/cart'
import type { MenuItem } from '../../menu/model/menu'

const AUTHORIZED = false

export function CartPage() {
    const navigate = useNavigate()
    const { items, removeItem, updateQuantity, clearCart } = useCart()

    const [menuItems, setMenuItems] = useState<Map<string, MenuItem>>(new Map())
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [unavailableIds, setUnavailableIds] = useState<string[]>([])

    // Загрузить детали товаров из API
    useEffect(() => {
        if (items.length === 0) {
            return
        }

        setLoading(true)
        setError(null)

        const itemIds = items.map((item) => item.id)
        getMenuItemsByIds(itemIds)
            .then((response) => {
                const map = new Map<string, MenuItem>()
                response.items.forEach((item) => {
                    map.set(item.id, item)
                })
                setMenuItems(map)
                setUnavailableIds(response.unavailableIds || [])
            })
            .catch((err) => {
                setError(err.message || 'Failed to load cart items')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [items])

    if (!AUTHORIZED) {
        // Неавторизованный пользователь
        if (items.length === 0) {
            return (
                <Box maxW="600px" mx="auto" p={5}>
                    <Heading size="md" mb={5}>Cart</Heading>
                    <Text color="gray.500">Your cart is empty</Text>
                    <Button colorPalette="blue" mt={4} onClick={() => navigate('/menu_items')}>
                        Continue Shopping
                    </Button>
                </Box>
            )
        }

        if (loading) {
            return (
                <Box p={5}>
                    <Spinner />
                </Box>
            )
        }

        if (error) {
            return (
                <Box maxW="600px" mx="auto" p={5}>
                    <Text color="red.500">{error}</Text>
                    <Button mt={4} onClick={() => navigate('/menu_items')}>
                        Back to Menu
                    </Button>
                </Box>
            )
        }

        const totalPrice = Array.from(menuItems.values()).reduce((sum, item) => {
            const cartItem = items.find((ci) => ci.id === item.id)
            if (!cartItem) return sum
            const price = parseFloat(item.price)
            return sum + price * cartItem.quantity
        }, 0)

        return (
            <Box maxW="800px" mx="auto" p={5}>
                <Heading size="md" mb={5}>Cart</Heading>

                {unavailableIds.length > 0 && (
                    <Box mb={4} p={3} bg="yellow.50" borderRadius="md">
                        <Text color="yellow.800" fontSize="sm">
                            ⚠️ Some items are no longer available and have been removed
                        </Text>
                    </Box>
                )}

                <VStack gap={4} align="stretch" mb={6}>
                    {items.map((cartItem) => {
                        const menuItem = menuItems.get(cartItem.id)
                        if (!menuItem) return null

                        const itemTotal = (parseFloat(menuItem.price) * cartItem.quantity).toFixed(2)

                        return (
                            <Box
                                key={cartItem.id}
                                p={4}
                                borderWidth="1px"
                                borderRadius="md"
                                borderColor="gray.200"
                            >
                                <Flex justify="space-between" align="start" mb={2}>
                                    <Box flex={1}>
                                        <Heading size="sm">{menuItem.name}</Heading>
                                        <Text fontSize="sm" color="gray.600">
                                            {menuItem.price} {menuItem.currency} each
                                        </Text>
                                    </Box>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        colorPalette="red"
                                        onClick={() => removeItem(cartItem.id)}
                                    >
                                        Remove
                                    </Button>
                                </Flex>

                                <Flex justify="space-between" align="center">
                                    <HStack gap={2}>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                updateQuantity(cartItem.id, cartItem.quantity - 1)
                                            }
                                        >
                                            −
                                        </Button>
                                        <Text fontWeight="semibold" minW="30px" textAlign="center">
                                            {cartItem.quantity}
                                        </Text>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                updateQuantity(cartItem.id, cartItem.quantity + 1)
                                            }
                                        >
                                            +
                                        </Button>
                                    </HStack>
                                    <Text fontWeight="semibold">
                                        {itemTotal} {menuItem.currency}
                                    </Text>
                                </Flex>
                            </Box>
                        )
                    })}
                </VStack>

                <Box p={4} bg="gray.50" borderRadius="md" mb={6}>
                    <Flex justify="space-between" align="center" mb={3}>
                        <Text fontWeight="semibold">Total:</Text>
                        <Heading size="md">
                            {totalPrice.toFixed(2)} ILS
                        </Heading>
                    </Flex>
                </Box>

                <Stack gap={3}>
                    <Button colorPalette="green" size="lg">
                        Checkout
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/menu_items')}>
                        Continue Shopping
                    </Button>
                    <Button variant="ghost" colorPalette="red" onClick={clearCart}>
                        Clear Cart
                    </Button>
                </Stack>
            </Box>
        )
    } else {
        // Авторизованный пользователь (заглушка)
        return (
            <Box maxW="600px" mx="auto" p={5}>
                <Heading size="md" mb={5}>Cart</Heading>
                <Text color="gray.500">
                    Cart for authorized users is coming soon
                </Text>
                <Button mt={4} onClick={() => navigate('/')}>
                    Back Home
                </Button>
            </Box>
        )
    }
}
