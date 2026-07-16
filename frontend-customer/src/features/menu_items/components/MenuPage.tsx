import Link from 'next/link'
import { Box, Heading, Button, Text } from '@chakra-ui/react'
import { getMenu } from '../api/menu'
import { getRestaurant } from '@/src/features/restaurants/api/restaurants'
import { MenuList } from './MenuList'

export async function MenuPage({
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
  let items: Awaited<ReturnType<typeof getMenu>> = []
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
