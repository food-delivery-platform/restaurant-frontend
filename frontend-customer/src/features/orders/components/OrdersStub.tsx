import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export function OrdersStub() {
    return (
        <Box>
            <Heading size="md" mb={4}>My Orders</Heading>
            <VStack align="start" gap={4}>
                <Text color="gray.600">
                    Order tracking functionality will be available soon.
                </Text>
            </VStack>
        </Box>
    )
}
