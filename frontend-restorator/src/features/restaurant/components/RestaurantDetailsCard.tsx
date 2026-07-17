import { Badge, Box, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import type { Venue } from '../model/restaurant'

type Props = {
    venue: Venue
}

export function RestaurantDetailsCard({ venue }: Props) {
    return (
        <Box mb={8} p={5} border="1px solid" borderColor="gray.200" borderRadius="md">
            <Heading size="md" mb={4}>Restaurant Details</Heading>

            <Stack gap={4}>
                <Box>
                    <Text fontWeight="semibold" mb={1}>Name</Text>
                    <Text>{venue.name}</Text>
                </Box>

                <Box>
                    <Text fontWeight="semibold" mb={1}>Description</Text>
                    <Text>{venue.description}</Text>
                </Box>

                <HStack>
                    <Box>
                        <Text fontWeight="semibold" mb={1}>Rating</Text>
                        <Text>⭐ {venue.rating}</Text>
                    </Box>

                    <Box>
                        <Text fontWeight="semibold" mb={1}>Status</Text>
                        <Badge colorPalette={venue.is_active ? 'green' : 'red'}>
                            {venue.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </Box>
                </HStack>
            </Stack>
        </Box>
    )
}
