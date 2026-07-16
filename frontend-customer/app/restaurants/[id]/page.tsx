import Link from 'next/link'
import { Box, Text, Button } from '@chakra-ui/react'
import { getRestaurant, getRestaurants } from '@/src/features/restaurants/api/restaurants'
import { RestaurantDetail } from '@/src/features/restaurants/components/RestaurantDetail'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const restaurants = await getRestaurants()
    return restaurants.map((r) => ({
      id: r.id,
    }))
  } catch {
    return []
  }
}

export default async function RestaurantDetailPage({
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
