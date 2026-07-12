import {Box, Flex, Heading, Text, Badge, Button, Card, Separator, VStack} from '@chakra-ui/react'
import type {Order} from '../model/order'
import {OrderItemView} from './OrderItemView'

type Props = {
    order: Order
    onItemReady: (orderId: string, itemId: string) => void
    onDeliver: (orderId: string) => void
}

export function OrderCard({order, onItemReady, onDeliver}: Props) {
    const allItemsReady = order.order_items.every(item => item.status === 'READY')
    const canDeliver = allItemsReady && (order.status === 'RESTAURANT_ACCEPTED' || order.status === 'PREPARING')

    return (
        <Card.Root p={4} variant="outline">
            <Card.Body>
                <Flex justify="space-between" align="center" mb={3}>
                    <Box>
                        <Heading size="sm">{order.customerName}</Heading>
                        <Text fontSize="sm" color="gray.500">
                            {new Date(order.created_at).toLocaleString()} &middot; {order.currency}{' '}
                            {order.total.toFixed(2)}
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

                <Separator mb={3}/>

                <VStack gap={2} align="stretch" mb={3}>
                    {order.order_items.map(item => (
                        <OrderItemView
                            key={item.id}
                            item={item}
                            currency={order.currency}
                            onMarkReady={itemId => onItemReady(order.id, itemId)}
                        />
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
                        disabled={!canDeliver}
                        opacity={canDeliver ? 1 : 0.5}
                        onClick={() => onDeliver(order.id)}
                    >
                        Deliver
                    </Button>
                </Flex>
            </Card.Body>
        </Card.Root>
    )
}
