import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { useRestaurants } from '../api/useRestaurants'
import { RestaurantsList } from './RestaurantsList'

export function RestaurantsPage() {
    const { restaurants, loading, error } = useRestaurants()

    if (error) return <Text color="red.500">{error}</Text>

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={5}>
                <Heading size="md">Restaurants</Heading>

                <Button asChild colorPalette="green" borderRadius="full" w="40px" h="40px" fontSize="20px" fontWeight="bold">
                    <RouterLink to="/restaurants/new">+</RouterLink>
                </Button>
            </Flex>

            {!loading && restaurants.length === 0 && (
                <Text color="gray.500">No restaurants found.</Text>
            )}

            <RestaurantsList restaurants={restaurants} loading={loading} />
        </Box>
    )
}
