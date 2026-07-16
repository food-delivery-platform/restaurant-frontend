'use client'

import { useState } from 'react'
import { Button } from '@chakra-ui/react'
import { useCart } from '@/src/features/cart/components/CartProvider'
import type { MenuItem } from '../model/menu'

export function MenuItemCardClient({ menuItem }: { menuItem: MenuItem }) {
  const { addItem } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    addItem(menuItem.id)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
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
          ? '✓ Added'
          : '🛒 Add'}
    </Button>
  )
}
