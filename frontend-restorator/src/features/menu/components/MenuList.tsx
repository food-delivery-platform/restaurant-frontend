import { Link } from 'react-router-dom'
import { Box, Flex, Text } from '@chakra-ui/react'
import type { MenuItem } from '../model/menu'

type Props = {
    items: MenuItem[]
}

type Column = {
    title: string
    width?: number | string
    getValue: (item: MenuItem) => React.ReactNode
}

const COLUMNS: Column[] = [
    {
        title: 'Name',
        width: 200,
        getValue: (item) => (
            <Box asChild color="blue.500" fontWeight="semibold" _hover={{ textDecoration: 'underline' }}>
                <Link to={`/menu_items/view/${item.id}`}>
                    {item.name}
                </Link>
            </Box>
        ),
    },
    {
        title: 'Price',
        width: 80,
        getValue: (item) => item.price,
    },
    {
        title: 'Category',
        width: 120,
        getValue: (item) => item.category?.name || '—',
    },
    {
        title: 'Status',
        width: 100,
        getValue: (item) => (item.isAvailable ? 'available' : 'unavailable'),
    },
    {
        title: 'Actions',
        getValue: (item) => (
            <Box asChild color="blue.500" fontWeight="semibold" _hover={{ textDecoration: 'underline' }}>
                <Link to={`/menu_items/edit/${item.id}`}>
                    Edit
                </Link>
            </Box>
        ),
    },
]

export function MenuList({ items }: Props) {
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
            {items.map((item) => (
                <Flex
                    key={item.id}
                    gap={3}
                    align="center"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    pb={2}
                    mb={2}
                >
                    {COLUMNS.map((col, idx) => (
                        <Box key={idx} w={col.width}>
                            <Text>{col.getValue(item)}</Text>
                        </Box>
                    ))}
                </Flex>
            ))}
        </Box>
    )
}