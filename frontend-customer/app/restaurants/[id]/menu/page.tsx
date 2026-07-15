import Link from 'next/link'
import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  Badge,
  Button,
  Text,
} from '@chakra-ui/react'
import { getMenu } from '@/lib/services/menu'
import { getRestaurant, getRestaurants } from '@/lib/services/restaurants'
import { MenuItemCardClient } from '@/components/MenuItemCardClient'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const restaurants = await getRestaurants()
    return restaurants.flatMap((r) => [
      { id: r.id },
      { id: r.slug || r.id },
    ])
  } catch {
    return []
  }
}

async function MenuList({ items }: { items: any[] }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
      {items.map((item) => (
        <Card.Root key={item.id} _hover={{ shadow: 'lg' }}>
          <Card.Body>
            <Heading size="sm" mb={2}>
              {item.name}
            </Heading>
            {item.description && (
              <Text fontSize="sm" color="gray.600" mb={2}>
                {item.description}
              </Text>
            )}
            {item.category && (
              <Text fontSize="xs" color="gray.500" mb={2}>
                {item.category.name}
              </Text>
            )}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
              <Badge colorPalette={item.isAvailable ? 'green' : 'red'}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
              {item.spicyLevel && (
                <Badge colorPalette="orange">🌶️ {item.spicyLevel}/3</Badge>
              )}
              {item.labels?.vegetarian && (
                <Badge colorPalette="green">Vegetarian</Badge>
              )}
              {item.labels?.vegan && (
                <Badge colorPalette="green">Vegan</Badge>
              )}
            </Box>
            <Heading size="md" mb={3}>
              {item.price} {item.currency}
            </Heading>
            <Box display="flex" gap={2}>
              <MenuItemCardClient menuItem={item} />
              <Button variant="outline" asChild flex={1}>
                <Link href={`/restaurants/${item.restaurantId}/menu/${item.id}`}>
                  View
                </Link>
              </Button>
            </Box>
          </Card.Body>
        </Card.Root>
      ))}
    </SimpleGrid>
  )
}

export default async function MenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ available?: string }>
}) {
  const { id } = await params
  const { available } = await searchParams
  const onlyAvailable = available === 'true'
  let restaurant = null
  let items = []
  let error = null

  try {
    restaurant = await getRestaurant(id)
    items = await getMenu(id, onlyAvailable)
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch data'
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
    <Box>
      <Button variant="ghost" mb={4} asChild>
        <Link href={`/restaurants/${id}`}>← Back to Restaurant</Link>
      </Button>

      <Box mb={5}>
        <Heading size="md">Menu: {restaurant.name}</Heading>
        {restaurant.description && (
          <Text fontSize="sm" color="gray.500">
            {restaurant.description}
          </Text>
        )}
      </Box>

      <Button
        size="sm"
        variant={onlyAvailable ? 'solid' : 'outline'}
        mb={4}
        asChild
      >
        <Link href={`/restaurants/${id}/menu${onlyAvailable ? '' : '?available=true'}`}>
          {onlyAvailable ? 'Showing available only' : 'Show available only'}
        </Link>
      </Button>

      {items.length === 0 ? (
        <Text color="gray.500">No menu items available.</Text>
      ) : (
        <MenuList items={items} />
      )}
    </Box>
  )
}
