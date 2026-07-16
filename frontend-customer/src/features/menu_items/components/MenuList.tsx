import Link from 'next/link'
import { Box, Heading, SimpleGrid, Card, Badge, Button, Text } from '@chakra-ui/react'
import type { MenuItem } from '../model/menu'
import { MenuItemCardClient } from './MenuItemCardClient'

export function MenuList({ items }: { items: MenuItem[] }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
      {items.map((item) => (
        <Card.Root key={item.id} _hover={{ shadow: 'lg' }}>
          <Card.Body>
            <Heading size="sm" mb={2}>
              {item.name}
            </Heading>
            {item.description && (
              <Text fontSize="sm" color="gray.600" mb={2}>
                {item.description}
              </Text>
            )}
            {item.category && (
              <Text fontSize="xs" color="gray.500" mb={2}>
                {item.category.name}
              </Text>
            )}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
              <Badge colorPalette={item.isAvailable ? 'green' : 'red'}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
              {item.spicyLevel && (
                <Badge colorPalette="orange">🌶️ {item.spicyLevel}/3</Badge>
              )}
              {item.labels?.vegetarian && (
                <Badge colorPalette="green">Vegetarian</Badge>
              )}
              {item.labels?.vegan && (
                <Badge colorPalette="green">Vegan</Badge>
              )}
            </Box>
            <Heading size="md" mb={3}>
              {item.price} {item.currency}
            </Heading>
            <Box display="flex" gap={2}>
              <MenuItemCardClient menuItem={item} />
              <Button variant="outline" asChild flex={1}>
                <Link href={`/restaurants/${item.restaurantId}/menu/${item.id}`}>
                  View
                </Link>
              </Button>
            </Box>
          </Card.Body>
        </Card.Root>
      ))}
    </SimpleGrid>
  )
}
