import Link from 'next/link'
import { Box, Button, Heading, Stack, Text, Badge, Flex } from '@chakra-ui/react'
import type { MenuItem } from '../model/menu'
import type { Restaurant } from '@/src/features/restaurants/model/restaurant'
import { MenuItemDetailClient } from './MenuItemDetailClient'

export function MenuItemDetail({
  item,
  restaurant,
}: {
  item: MenuItem
  restaurant: Restaurant
}) {
  return (
    <Box maxW="600px" mx="auto" p={5}>
      <Button variant="ghost" mb={4} asChild>
        <Link href={`/restaurants/${restaurant.id}/menu`}>← Back to Menu</Link>
      </Button>

      <Text fontSize="sm" color="gray.500" mb={3}>
        {restaurant.name}
      </Text>

      <Heading size="lg" mb={4}>
        {item.name}
      </Heading>

      {item.description && (
        <Text fontSize="md" color="gray.600" mb={4}>
          {item.description}
        </Text>
      )}

      <Stack gap={4} mb={6}>
        <Flex justify="space-between" align="center">
          <Text fontWeight="semibold">Price</Text>
          <Heading size="md">
            {item.price} {item.currency}
          </Heading>
        </Flex>

        {item.category && (
          <Flex justify="space-between" align="center">
            <Text fontWeight="semibold">Category</Text>
            <Text>{item.category.name}</Text>
          </Flex>
        )}

        <Flex justify="space-between" align="center">
          <Text fontWeight="semibold">Status</Text>
          <Badge colorPalette={item.isAvailable ? 'green' : 'red'}>
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </Flex>

        {item.spicyLevel !== undefined && (
          <Flex justify="space-between" align="center">
            <Text fontWeight="semibold">Spicy Level</Text>
            <Text>{item.spicyLevel} / 3 🌶️</Text>
          </Flex>
        )}
      </Stack>

      {item.ingredients && item.ingredients.length > 0 && (
        <Box mb={6}>
          <Text fontWeight="semibold" mb={2}>
            Ingredients
          </Text>
          <Flex gap={2} wrap="wrap">
            {item.ingredients.map((ingredient, idx) => (
              <Badge key={idx} colorPalette="gray">
                {ingredient}
              </Badge>
            ))}
          </Flex>
        </Box>
      )}

      {item.labels && Object.entries(item.labels).some(([, v]) => v) && (
        <Box mb={6}>
          <Text fontWeight="semibold" mb={2}>
            Labels
          </Text>
          <Flex gap={2} wrap="wrap">
            {Object.entries(item.labels).map(([label, value]) =>
              value ? (
                <Badge key={label} colorPalette="blue">
                  {label}
                </Badge>
              ) : null
            )}
          </Flex>
        </Box>
      )}

      {item.nutrition && (
        <Box mb={6}>
          <Text fontWeight="semibold" mb={2}>
            Nutrition (per serving)
          </Text>
          <Stack gap={1} fontSize="sm" color="gray.600">
            {item.nutrition.calories && (
              <Text>🔥 Calories: {item.nutrition.calories}</Text>
            )}
            {item.nutrition.protein && (
              <Text>🥚 Protein: {item.nutrition.protein}g</Text>
            )}
            {item.nutrition.fat && (
              <Text>🧈 Fat: {item.nutrition.fat}g</Text>
            )}
            {item.nutrition.carbs && (
              <Text>🍞 Carbs: {item.nutrition.carbs}g</Text>
            )}
          </Stack>
        </Box>
      )}

      {item.portion && (
        <Box mb={6}>
          <Text fontWeight="semibold" mb={2}>
            Portion
          </Text>
          <Text color="gray.600">{item.portion.description}</Text>
        </Box>
      )}

      <MenuItemDetailClient menuItem={item} />
    </Box>
  )
}
