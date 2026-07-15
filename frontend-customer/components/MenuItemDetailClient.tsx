'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Flex, Button } from '@chakra-ui/react'
import { useCart } from '@/components/CartProvider'
import type { MenuItem } from '@/lib/models/menu'

interface MenuItemDetailClientProps {
  menuItem: MenuItem
  restaurantId?: string
}

export function MenuItemDetailClient({ menuItem, restaurantId }: MenuItemDetailClientProps) {
  const { addItem } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    addItem(menuItem.id)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const backLink = restaurantId
    ? `/restaurants/${restaurantId}/menu`
    : '/cart'

  return (
    <Flex gap={3}>
      <Button
        colorPalette={addedToCart ? 'green' : 'blue'}
        flex={1}
        disabled={!menuItem.isAvailable}
        opacity={menuItem.isAvailable ? 1 : 0.5}
        onClick={handleAddToCart}
        title={!menuItem.isAvailable ? 'This item is unavailable' : ''}
      >
        {!menuItem.isAvailable
          ? '❌ Unavailable'
          : addedToCart
            ? '✓ Added to Cart'
            : '🛒 Add to Cart'}
      </Button>
      <Button variant="outline" asChild>
        <Link href={backLink}>Close</Link>
      </Button>
    </Flex>
  )
}
