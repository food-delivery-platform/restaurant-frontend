import { Box, Heading, Text, SimpleGrid, Card } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function HomePage() {
    return (
        <Box>
            <Heading size="lg" mb={3}>Welcome to TastyFood</Heading>
            <Text color="gray.500" mb={6}>
                Order food from your favorite restaurants.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                <Card.Root as={RouterLink} to="/restaurants" p={5} _hover={{ shadow: 'md' }}>
                    <Card.Body>
                        <Heading size="sm" mb={2}>🏪 Restaurants</Heading>
                        <Text color="gray.500" fontSize="sm">
                            Browse and select restaurants.
                        </Text>
                    </Card.Body>
                </Card.Root>

                <Card.Root as={RouterLink} to="/menu_items" p={5} _hover={{ shadow: 'md' }}>
                    <Card.Body>
                        <Heading size="sm" mb={2}>🍽️ Menu</Heading>
                        <Text color="gray.500" fontSize="sm">
                            Browse menu items and add to cart.
                        </Text>
                    </Card.Body>
                </Card.Root>

                <Card.Root as={RouterLink} to="/cart" p={5} _hover={{ shadow: 'md' }}>
                    <Card.Body>
                        <Heading size="sm" mb={2}>🛒 Cart</Heading>
                        <Text color="gray.500" fontSize="sm">
                            View and manage your cart.
                        </Text>
                    </Card.Body>
                </Card.Root>
            </SimpleGrid>
        </Box>
    )
}
