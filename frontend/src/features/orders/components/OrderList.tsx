import { Box, Heading, Text, Spinner, VStack } from '@chakra-ui/react'
import { useOrders } from '../api/useOrders'
import { OrderCard } from './OrderCard'

export function OrderList() {
    const { orders, loading, error, setItemReady, deliverOrder } = useOrders()

    if (loading) return <Spinner />
    if (error) return <Text color="red.500">{error}</Text>

    return (
        <Box>
            <Heading size="md" mb={5}>Orders</Heading>

            {orders.length === 0 && (
                <Text color="gray.500">No orders yet.</Text>
            )}

            <VStack gap={4} align="stretch">
                {orders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onItemReady={setItemReady}
                        onDeliver={deliverOrder}
                    />
                ))}
            </VStack>
        </Box>
    )
}
