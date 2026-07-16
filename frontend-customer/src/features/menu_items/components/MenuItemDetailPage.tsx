import Link from 'next/link'
import { Box, Button, Text } from '@chakra-ui/react'
import { getMenuItem } from '../api/menu'
import { getRestaurant } from '@/src/features/restaurants/api/restaurants'
import { MenuItemDetail } from './MenuItemDetail'

export async function MenuItemDetailPage({
  params,
}: {
  params: Promise<{ menuItemId: string }>
}) {
  const { menuItemId } = await params
  let item = null
  let restaurant = null
  let error = null

  try {
    item = await getMenuItem(menuItemId)
    restaurant = await getRestaurant(item.restaurantId)
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch item'
  }

  if (error || !item || !restaurant) {
    return (
      <Box p={5}>
        <Text color="red.500">{error || 'Item not found'}</Text>
        <Button mt={4} asChild>
          <Link href="/restaurants">Back to Restaurants</Link>
        </Button>
      </Box>
    )
  }

  return <MenuItemDetail item={item} restaurant={restaurant} />
}
