import { Box, Heading, Text } from '@chakra-ui/react'
import { useRestaurants } from '../api/useRestaurants'
import { RestaurantsList } from './RestaurantsList'

export function RestaurantsPage() {
    const { restaurants, loading, error } = useRestaurants()

    if (error) return <Text color="red.500">{error}</Text>

    return (
        <Box>
            <Heading size="md" mb={5}>Restaurants</Heading>

            {!loading && restaurants.length === 0 && (
                <Text color="gray.500">No restaurants found.</Text>
            )}

            <RestaurantsList restaurants={restaurants} loading={loading} />
        </Box>
    )
}
