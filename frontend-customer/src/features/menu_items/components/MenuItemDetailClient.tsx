'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Flex, Button } from '@chakra-ui/react'
import { useCart } from '@/src/features/cart/components/CartProvider'
import type { MenuItem } from '../model/menu'

interface MenuItemDetailClientProps {
  menuItem: MenuItem
}

export function MenuItemDetailClient({ menuItem }: MenuItemDetailClientProps) {
  const { addItem } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    addItem(menuItem.id)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

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
        <Link href={`/restaurants/${menuItem.restaurantId}/menu`}>Close</Link>
      </Button>
    </Flex>
  )
}
