import Link from 'next/link'
import { Box, Heading, Text, SimpleGrid, Card } from '@chakra-ui/react'

export default function HomePage() {
  return (
    <Box>
      <Heading size="lg" mb={3}>
        Welcome to TastyFood
      </Heading>
      <Text color="gray.500" mb={6}>
        Order food from your favorite restaurants.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <Card.Root asChild p={5} _hover={{ shadow: 'md', cursor: 'pointer' }}>
          <Link href="/restaurants">
            <Card.Body>
              <Heading size="sm" mb={2}>
                🏪 Restaurants
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Browse and select restaurants.
              </Text>
            </Card.Body>
          </Link>
        </Card.Root>


        <Card.Root asChild p={5} _hover={{ shadow: 'md', cursor: 'pointer' }}>
          <Link href="/cart">
            <Card.Body>
              <Heading size="sm" mb={2}>
                🛒 Cart
              </Heading>
              <Text color="gray.500" fontSize="sm">
                View and manage your cart.
              </Text>
            </Card.Body>
          </Link>
        </Card.Root>
      </SimpleGrid>
    </Box>
  )
}
