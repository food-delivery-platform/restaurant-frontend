'use client'

import Link from 'next/link'
import { Flex, Button, Box } from '@chakra-ui/react'

export function Navbar() {
  return (
    <Flex justify="space-between" align="center" mb={8} py={4} borderBottomWidth={1}>
      <Box fontWeight="bold" fontSize="lg">
        🍕 TastyFood
      </Box>
      <Flex gap={4}>
        <Button variant="ghost" asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/restaurants">Restaurants</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/cart">Cart</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/orders">Orders</Link>
        </Button>
      </Flex>
    </Flex>
  )
}
