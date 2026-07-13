import { Link } from 'react-router-dom'
import { Box, Flex, Text, Badge, Spinner, Center } from '@chakra-ui/react'
import type { Restaurant } from '../model/restaurant'

type Props = {
    restaurants: Restaurant[]
    loading: boolean
}

type Column = {
    title: string
    width?: number | string
    getValue: (restaurant: Restaurant) => React.ReactNode
}

const COLUMNS: Column[] = [
    {
        title: 'Name',
        width: 200,
        getValue: (restaurant) => (
            <Box
                as={Link}
                to={`/restaurants/view/${restaurant.id}`}
                color="blue.500"
                fontWeight="semibold"
                _hover={{ textDecoration: 'underline' }}
            >
                {restaurant.name}
            </Box>
        ),
    },
    {
        title: 'Description',
        width: 250,
        getValue: (restaurant) => restaurant.description || '—',
    },
    {
        title: 'Rating',
        width: 80,
        getValue: (restaurant) => restaurant.rating ? `⭐ ${restaurant.rating}` : '—',
    },
    {
        title: 'Status',
        width: 100,
        getValue: (restaurant) => (
            <Badge
                colorPalette={restaurant.isOpen ? 'green' : 'red'}
            >
                {restaurant.isOpen ? 'Open' : 'Closed'}
            </Badge>
        ),
    },
]

export function RestaurantsList({ restaurants, loading }: Props) {
    if (loading) {
        return (
            <Center py={10}>
                <Spinner />
            </Center>
        )
    }

    return (
        <Box>
            {/* header */}
            <Flex
                fontWeight="600"
                borderBottom="2px solid"
                borderColor="blackAlpha.800"
                pb={2}
                mb={3}
                gap={3}
            >
                {COLUMNS.map((col, idx) => (
                    <Box key={idx} w={col.width}>
                        {col.title}
                    </Box>
                ))}
            </Flex>

            {/* rows */}
            {restaurants.map((restaurant) => (
                <Flex
                    key={restaurant.id}
                    gap={3}
                    align="center"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    pb={2}
                    mb={2}
                >
                    {COLUMNS.map((col, idx) => (
                        <Box key={idx} w={col.width}>
                            <Text>{col.getValue(restaurant)}</Text>
                        </Box>
                    ))}
                </Flex>
            ))}
        </Box>
    )
}
