import { Box, Text, VStack } from '@chakra-ui/react'
import type { Category } from '../model/restaurant'

type Props = {
    categories: Category[]
}

export function CategoryList({ categories }: Props) {
    if (!categories || categories.length === 0) {
        return <Text color="gray.500">No categories yet</Text>
    }

    return (
        <VStack align="stretch" gap={3} mb={6}>
            {categories.map((cat) => (
                <Box
                    key={cat.id}
                    p={3}
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius="md"
                    bg="gray.50"
                >
                    <Text fontWeight="semibold">{cat.name}</Text>
                </Box>
            ))}
        </VStack>
    )
}
