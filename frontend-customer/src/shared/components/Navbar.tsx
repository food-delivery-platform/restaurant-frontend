import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Flex, Link, Heading, HStack } from '@chakra-ui/react'

const navItems = [
    { label: 'Restaurants', path: '/restaurants' },
    { label: 'Menu Items', path: '/menu_items' },
    { label: '🛒 Cart', path: '/cart' },
    { label: 'Orders', path: '/orders' },
]

export function Navbar() {
    const { pathname } = useLocation()

    return (
        <Flex as="nav" justify="space-between" align="center" mb={5} pb={3} borderBottom="1px solid" borderColor="gray.200">
            <Heading size="md">
                <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                    TastyFood
                </Link>
            </Heading>

            <HStack gap={4}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        as={RouterLink}
                        to={item.path}
                        fontWeight={pathname.startsWith(item.path) ? 'bold' : 'normal'}
                        color={pathname.startsWith(item.path) ? 'blue.600' : 'gray.600'}
                    >
                        {item.label}
                    </Link>
                ))}
            </HStack>
        </Flex>
    )
}
