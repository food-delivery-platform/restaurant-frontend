'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Box, Heading, Text, Button, Table } from '@chakra-ui/react'
import { useCart } from './CartProvider'
import { apiGet } from '@/src/shared/api/client'
import type { MenuItem } from '@/src/features/menu_items/model/menu'

interface CartItemWithDetails extends MenuItem {
  quantity: number
}

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const [itemsWithDetails, setItemsWithDetails] = useState<CartItemWithDetails[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (items.length === 0) {
      setItemsWithDetails([])
      return
    }

    setLoading(true)
    Promise.all(
      items.map((item) =>
        apiGet<MenuItem>(`/api/menu-items/${item.id}`)
          .then((menuItem) => ({
            ...menuItem,
            quantity: item.quantity,
          }))
          .catch(() => null)
      )
    )
      .then((results) => {
        setItemsWithDetails(results.filter((item) => item !== null))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [items])

  const total = itemsWithDetails.reduce((sum, item) => {
    const price = parseFloat(item.price)
    return sum + price * item.quantity
  }, 0)

  if (loading) {
    return <Text>Loading cart...</Text>
  }

  if (itemsWithDetails.length === 0) {
    return (
      <Box>
        <Heading size="md" mb={5}>
          Your Cart
        </Heading>
        <Text color="gray.500" mb={4}>
          Your cart is empty.
        </Text>
        <Button asChild>
          <Link href="/restaurants">Continue Shopping</Link>
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Heading size="md" mb={5}>
        Your Cart
      </Heading>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Item</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Price</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Quantity</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Total</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {itemsWithDetails.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>
                <Link href={`/menu_items/${item.id}`}>
                  {item.name}
                </Link>
              </Table.Cell>
              <Table.Cell textAlign="right">
                {item.price} {item.currency}
              </Table.Cell>
              <Table.Cell textAlign="right">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                  style={{
                    width: '60px',
                    padding: '4px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </Table.Cell>
              <Table.Cell textAlign="right">
                {(parseFloat(item.price) * item.quantity).toFixed(2)}{' '}
                {item.currency}
              </Table.Cell>
              <Table.Cell textAlign="center">
                <Button
                  size="sm"
                  colorPalette="red"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Box mt={6} display="flex" justifyContent="flex-end" gap={4}>
        <Box>
          <Heading size="md">
            Total: {total.toFixed(2)} {itemsWithDetails[0]?.currency || 'USD'}
          </Heading>
        </Box>
      </Box>

      <Box mt={6} display="flex" gap={4}>
        <Button asChild>
          <Link href="/restaurants">Continue Shopping</Link>
        </Button>
        <Button colorPalette="red" onClick={clearCart}>
          Clear Cart
        </Button>
        <Button colorPalette="green">Checkout</Button>
      </Box>
    </Box>
  )
}
