import { useState } from 'react'
import { Box, Spinner, Text } from '@chakra-ui/react'
import { useMenu } from '../api/useMenu'
import { MenuList } from './MenuList'
import { MenuItemsHeader } from './MenuItemsHeader'
import { AvailabilityFilter } from './AvailabilityFilter'

export function SuperMenuList() {
    const [onlyAvailable, setOnlyAvailable] = useState(false)
    const restaurantId = 'my'

    const { items, loading, error } = useMenu(restaurantId, onlyAvailable)

    return (
        <Box>
            <MenuItemsHeader />

            <AvailabilityFilter checked={onlyAvailable} onChange={setOnlyAvailable} />

            {loading && <Spinner />}
            {error && <Text color="red.500">{error}</Text>}

            <MenuList items={items} />
        </Box>
    )
}
