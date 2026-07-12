import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Flex, Heading, Checkbox, Button, Spinner, Text } from '@chakra-ui/react'
import { useMenu } from '../api/useMenu'
import { useRestaurants } from '../../restaurants/api/useRestaurants'
import { useRestaurantCache } from '../../restaurants/api/useRestaurantCache'
import {MenuList} from "./MenuList.tsx";

export function SuperMenuList() {
    const [onlyAvailable, setOnlyAvailable] = useState(false)
    const { restaurants, loading: restaurantsLoading } = useRestaurants()
    const [restaurantId, setRestaurantId] = useState<string>('')

    useEffect(() => {
        if (restaurants.length > 0) {
            setRestaurantId(restaurants[0].id)
        }
    }, [restaurants])

    const { items, loading, error } = useMenu(restaurantId, onlyAvailable)
    const { restaurant, loading: restaurantLoading } = useRestaurantCache(restaurantId)

    if (!restaurantId) {
        return <Text color="gray.500">No restaurants available</Text>
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={5}>
                <Box>
                    <Heading size="md">
                        {restaurantLoading ? '...' : restaurant?.name || 'Menu List'}
                    </Heading>
                    {restaurant?.description && (
                        <Text fontSize="sm" color="gray.500">{restaurant.description}</Text>
                    )}
                </Box>

                <Button asChild colorPalette="green" borderRadius="full" w="40px" h="40px" fontSize="20px" fontWeight="bold">
                    <RouterLink to="/menu_items/new">+</RouterLink>
                </Button>
            </Flex>

            <Checkbox.Root
                mb={4}
                checked={onlyAvailable}
                onCheckedChange={(e) => setOnlyAvailable(!!e.checked)}
            >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>
                    available only
                </Checkbox.Label>
            </Checkbox.Root>

            {(loading || restaurantsLoading) && <Spinner />}
            {error && <Text color="red.500">{error}</Text>}

             <MenuList items={items} />

        </Box>
    )
}
