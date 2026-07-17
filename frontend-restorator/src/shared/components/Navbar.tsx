import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Flex, Link, Heading, HStack } from '@chakra-ui/react'

const navItems = [
    { label: 'Restaurant', path: '/restaurant' },
    { label: 'Menu Items', path: '/menu_items' },
    { label: 'Orders', path: '/orders' },
]

export function Navbar() {
    const { pathname } = useLocation()

    return (
        <Flex as="nav" justify="space-between" align="center" mb={5} pb={3} borderBottom="1px solid" borderColor="gray.200">
            <Heading size="md">
                <Link asChild _hover={{ textDecoration: 'none' }}>
                    <RouterLink to="/">TastyFood</RouterLink>
                </Link>
            </Heading>

            <HStack gap={4}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        asChild
                        fontWeight={pathname.startsWith(item.path) ? 'bold' : 'normal'}
                        color={pathname.startsWith(item.path) ? 'blue.600' : 'gray.600'}
                    >
                        <RouterLink to={item.path}>{item.label}</RouterLink>
                    </Link>
                ))}
            </HStack>
        </Flex>
    )
}
