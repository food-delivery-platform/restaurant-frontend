import Link from 'next/link'
import { Box, Heading, Text, Button, Badge, Image } from '@chakra-ui/react'
import type { Restaurant } from '../model/restaurant'

export function RestaurantDetail({ restaurant }: { restaurant: Restaurant }) {
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
