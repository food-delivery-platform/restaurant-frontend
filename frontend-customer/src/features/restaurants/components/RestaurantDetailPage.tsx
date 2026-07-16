import Link from 'next/link'
import { Box, Text, Button } from '@chakra-ui/react'
import { getRestaurant } from '../api/restaurants'
import { RestaurantDetail } from './RestaurantDetail'

export async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let restaurant = null
  let error = null

  try {
    restaurant = await getRestaurant(id)
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch restaurant'
  }

  if (error || !restaurant) {
    return (
      <Box>
        <Text color="red.500">{error || 'Restaurant not found'}</Text>
        <Button mt={4} asChild>
          <Link href="/restaurants">Back to Restaurants</Link>
        </Button>
      </Box>
    )
  }

  return <RestaurantDetail restaurant={restaurant} />
}
