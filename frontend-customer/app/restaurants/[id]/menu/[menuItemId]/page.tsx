import Link from 'next/link'
import { Box, Button, Text } from '@chakra-ui/react'
import { getMenuItem, getMenu } from '@/src/features/menu_items/api/menu'
import { getRestaurant, getRestaurants } from '@/src/features/restaurants/api/restaurants'
import { MenuItemDetail } from '@/src/features/menu_items/components/MenuItemDetail'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const restaurants = await getRestaurants()
    const params: Array<{ id: string; menuItemId: string }> = []

    for (const restaurant of restaurants) {
      const menuItems = await getMenu(restaurant.id)
      menuItems.forEach((item) => {
        params.push({ id: restaurant.id, menuItemId: item.id })
        if (restaurant.slug) {
          params.push({ id: restaurant.slug, menuItemId: item.id })
        }
      })
    }

    return params
  } catch {
    return []
  }
}

export default async function MenuItemDetailPage({
  params,
}: {
  params: Promise<{ id: string; menuItemId: string }>
}) {
  const { id, menuItemId } = await params
  let item = null
  let restaurant = null
  let error = null

  try {
    item = await getMenuItem(menuItemId)
    restaurant = await getRestaurant(id)
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch item'
  }

  if (error || !item || !restaurant) {
    return (
      <Box p={5}>
        <Text color="red.500">{error || 'Item not found'}</Text>
        <Button mt={4} asChild>
          <Link href={`/restaurants/${id}/menu`}>Back to Menu</Link>
        </Button>
      </Box>
    )
  }

  return <MenuItemDetail item={item} restaurant={restaurant} restaurantId={id} />
}
