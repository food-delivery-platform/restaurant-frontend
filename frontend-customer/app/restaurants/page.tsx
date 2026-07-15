import Link from 'next/link'
import { Box, Heading, Text, SimpleGrid, Card, Image, Badge, Spinner } from '@chakra-ui/react'
import { getRestaurants } from '@/lib/services/restaurants'

export const revalidate = 60 // ISR: revalidate every 60 seconds

async function RestaurantsList({ restaurants }: { restaurants: any[] }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
      {restaurants.map((restaurant) => (
        <Card.Root key={restaurant.id} asChild _hover={{ shadow: 'lg' }}>
          <Link href={`/restaurants/${restaurant.id}`}>
            {restaurant.imageUrl && (
              <Image
                src={restaurant.imageUrl}
                alt={restaurant.name}
                height="200px"
                objectFit="cover"
              />
            )}
            <Card.Body>
              <Heading size="sm" mb={2}>
                {restaurant.name}
              </Heading>
              {restaurant.description && (
                <Text fontSize="sm" color="gray.600" mb={2}>
                  {restaurant.description}
                </Text>
              )}
              <Box display="flex" gap={2} alignItems="center">
                <Badge colorPalette={restaurant.isOpen ? 'green' : 'red'}>
                  {restaurant.isOpen ? '✓ Open' : '✗ Closed'}
                </Badge>
                {restaurant.rating && (
                  <Text fontSize="sm" fontWeight="semibold">
                    ⭐ {restaurant.rating}
                  </Text>
                )}
              </Box>
            </Card.Body>
          </Link>
        </Card.Root>
      ))}
    </SimpleGrid>
  )
}

export default async function RestaurantsPage() {
  let restaurants = []
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
