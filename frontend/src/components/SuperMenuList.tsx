import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Flex, Heading, Checkbox, Button, Spinner, Text } from '@chakra-ui/react'
import { useMenu } from '../hooks/useMenu'
import {MenuList} from "./MenuList.tsx";




export function SuperMenuList() {
    const [onlyAvailable, setOnlyAvailable] = useState(false)

    const { items, loading, error } = useMenu('my', onlyAvailable)
    return (
        <Box>
            <Flex justify="space-between" align="center" mb={5}>
                <Heading size="md">Menu List</Heading>

                <Button asChild colorPalette="green" borderRadius="full" w="40px" h="40px" fontSize="20px" fontWeight="bold">
                    <RouterLink to="/menu_items/new">+</RouterLink>
                </Button>
            </Flex>


            <Checkbox.Root
                mb={4}
                checked={onlyAvailable}
                onCheckedChange={(e) => setOnlyAvailable(!!e.checked)}
            >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>
                    available only
                </Checkbox.Label>
            </Checkbox.Root>

            {loading && <Spinner />}
            {error && <Text color="red.500">{error}</Text>}

             <MenuList items={items} />

        </Box>
    )
}
