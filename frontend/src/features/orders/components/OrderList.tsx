import { Box, Heading, Text, Spinner, VStack, Card, HStack, Badge, Button, Flex, Separator } from '@chakra-ui/react'
import { useOrders } from '../api/useOrders'

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
                {orders.map(order => {
                    const allItemsReady = order.order_items.every(
                        item => item.status === 'READY'
                    )

                    return (
                        <Card.Root key={order.id} p={4} variant="outline">
                            <Card.Body>
                                <Flex justify="space-between" align="center" mb={3}>
                                    <Box>
                                        <Heading size="sm">{order.customerName}</Heading>
                                        <Text fontSize="sm" color="gray.500">
                                            {new Date(order.created_at).toLocaleString()} &middot; {order.currency} {order.total.toFixed(2)}
                                        </Text>
                                    </Box>
                                    <Badge
                                        colorPalette={
                                            order.status === 'DELIVERED' || order.status === 'CANCELLED'
                                                ? 'gray'
                                                : order.status === 'PREPARING'
                                                    ? 'yellow'
                                                    : order.status === 'READY_FOR_PICKUP'
                                                        ? 'green'
                                                        : 'blue'
                                        }
                                        size="lg"
                                    >
                                        {order.status}
                                    </Badge>
                                </Flex>

                                <Separator mb={3} />

                                <VStack gap={2} align="stretch" mb={3}>
                                    {order.order_items.map(item => (
                                        <Flex
                                            key={item.id}
                                            justify="space-between"
                                            align="center"
                                            p={2}
                                            bg={item.status === 'NEED_COOK' ? 'red.50' : 'green.50'}
                                            borderRadius="md"
                                        >
                                            <Box>
                                                <Text fontWeight="medium">
                                                    {item.menu_item_name}
                                                </Text>
                                                <Text fontSize="sm" color="gray.500">
                                                    x{item.quantity} &middot; {order.currency} {item.line_total.toFixed(2)}
                                                    {item.special_instructions && (
                                                        <Text as="span" color="orange.600" ml={2}>
                                                            &mdash; {item.special_instructions}
                                                        </Text>
                                                    )}
                                                </Text>
                                            </Box>
                                            <HStack gap={2}>
                                                <Badge
                                                    colorPalette={item.status === 'READY' ? 'green' : 'red'}
                                                >
                                                    {item.status}
                                                </Badge>
                                                {item.status === 'NEED_COOK' && (
                                                    <Button
                                                        size="xs"
                                                        colorPalette="green"
                                                        onClick={() => setItemReady(order.id, item.id)}
                                                    >
                                                        Ready
                                                    </Button>
                                                )}
                                            </HStack>
                                        </Flex>
                                    ))}
                                </VStack>

                                {order.special_instructions && (
                                    <Text fontSize="sm" fontStyle="italic" color="gray.600" mb={3}>
                                        📝 {order.special_instructions}
                                    </Text>
                                )}

                                <Flex justify="flex-end">
                                    <Button
                                        colorPalette="blue"
                                        disabled={!allItemsReady}
                                        opacity={allItemsReady ? 1 : 0.5}
                                        onClick={() => deliverOrder(order.id)}
                                    >
                                        Deliver
                                    </Button>
                                </Flex>
                            </Card.Body>
                        </Card.Root>
                    )
                })}
            </VStack>
        </Box>
    )
}
