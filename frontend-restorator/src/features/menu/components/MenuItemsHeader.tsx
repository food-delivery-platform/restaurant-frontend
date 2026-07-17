import { Box, Button, Heading } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function MenuItemsHeader() {
    return (
        <Box mb={5}>
            <Heading size="md">Menu Items</Heading>
            <Button asChild colorPalette="green" borderRadius="full" w="40px" h="40px" fontSize="20px" fontWeight="bold" mt={3}>
                <RouterLink to="/menu_items/new">+</RouterLink>
            </Button>
        </Box>
    )
}
