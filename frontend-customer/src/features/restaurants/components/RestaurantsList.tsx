import Link from 'next/link'
import { Box, Heading, Text, SimpleGrid, Card, Image, Badge } from '@chakra-ui/react'
import type { Restaurant } from '../model/restaurant'

export function RestaurantsList({ restaurants }: { restaurants: Restaurant[] }) {
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
