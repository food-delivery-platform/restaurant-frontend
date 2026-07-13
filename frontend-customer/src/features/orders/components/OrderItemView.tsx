import { Flex, Box, Text, HStack, Badge, Button } from '@chakra-ui/react'
import type { OrderItem } from '../model/order'

type Props = {
    item: OrderItem
    currency: string
    onMarkReady: (itemId: string) => void
}

export function OrderItemView({ item, currency, onMarkReady }: Props) {
    return (
        <Flex
            justify="space-between"
            align="center"
            p={2}
            bg={item.status === 'NEED_COOK' ? 'red.50' : 'green.50'}
            borderRadius="md"
        >
            <Box>
                <Text fontWeight="medium">{item.menu_item_name}</Text>
                <Text fontSize="sm" color="gray.500">
                    x{item.quantity} &middot; {currency} {item.line_total.toFixed(2)}
                    {item.special_instructions && (
                        <Text as="span" color="orange.600" ml={2}>
                            &mdash; {item.special_instructions}
                        </Text>
                    )}
                </Text>
            </Box>

            <HStack gap={2}>
                <Badge colorPalette={item.status === 'READY' ? 'green' : 'red'}>
                    {item.status}
                </Badge>
                {item.status === 'NEED_COOK' && (
                    <Button size="xs" colorPalette="green" onClick={() => onMarkReady(item.id)}>
                        Ready
                    </Button>
                )}
            </HStack>
        </Flex>
    )
}
