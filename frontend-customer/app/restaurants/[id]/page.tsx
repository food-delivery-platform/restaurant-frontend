import Link from 'next/link'
import { Box, Heading, Text, Button, Badge, Image } from '@chakra-ui/react'
import { getRestaurant, getRestaurants } from '@/lib/services/restaurants'

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

  return (
    <Box maxW="800px" mx="auto">
      <Button variant="ghost" mb={4} asChild>
        <Link href="/restaurants">← Back to Restaurants</Link>
      </Button>

      {restaurant.imageUrl && (
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          borderRadius="md"
          mb={4}
          maxHeight="400px"
          objectFit="cover"
          width="100%"
        />
      )}

      <Heading size="lg" mb={3}>
        {restaurant.name}
      </Heading>

      {restaurant.description && (
        <Text fontSize="md" color="gray.600" mb={4}>
          {restaurant.description}
        </Text>
      )}

      <Box mb={4} display="flex" gap={2}>
        <Badge colorPalette={restaurant.isOpen ? 'green' : 'red'}>
          {restaurant.isOpen ? '✓ Open' : '✗ Closed'}
        </Badge>
        {restaurant.rating && (
          <Badge colorPalette="yellow">⭐ {restaurant.rating}</Badge>
        )}
      </Box>

      <Button asChild colorPalette="blue" mb={6}>
        <Link href={`/restaurants/${restaurant.id}/menu`}>
          View Menu
        </Link>
      </Button>
    </Box>
  )
}
