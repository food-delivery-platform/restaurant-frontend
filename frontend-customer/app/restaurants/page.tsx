import { Box, Heading, Text } from '@chakra-ui/react'
import { getRestaurants } from '@/src/features/restaurants/api/restaurants'
import { RestaurantsList } from '@/src/features/restaurants/components/RestaurantsList'

export const revalidate = 60 // ISR: revalidate every 60 seconds

export default async function RestaurantsPage() {
  let restaurants: Awaited<ReturnType<typeof getRestaurants>> = []
  let error = null

  try {
    restaurants = await getRestaurants()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch restaurants'
  }

  if (error) {
    return <Text color="red.500">{error}</Text>
  }

  if (!restaurants || restaurants.length === 0) {
    return <Text color="gray.500">No restaurants found.</Text>
  }

  return (
    <Box>
      <Heading size="md" mb={5}>
        Restaurants
      </Heading>
      <RestaurantsList restaurants={restaurants} />
    </Box>
  )
}
