import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/react'
import { HomeNavCard } from './HomeNavCard'

const NAV_CARDS = [
    {
        to: '/restaurant',
        icon: '🏪',
        title: 'Restaurant Info',
        description: 'View and manage restaurant details and categories.',
    },
    {
        to: '/menu_items',
        icon: '🍽️',
        title: 'Menu Items',
        description: 'Browse, add and edit menu items.',
    },
    {
        to: '/orders',
        icon: '📋',
        title: 'Orders',
        description: 'View and manage incoming orders.',
    },
]

export function HomePage() {
    return (
        <Box>
            <Heading size="lg" mb={3}>Welcome to TastyFood</Heading>
            <Text color="gray.500" mb={6}>
                Manage your restaurant operations from one place.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                {NAV_CARDS.map((card) => (
                    <HomeNavCard key={card.to} {...card} />
                ))}
            </SimpleGrid>
        </Box>
    )
}
