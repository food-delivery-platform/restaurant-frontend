import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Heading,
    Input,
    Select,
    Spinner,
    Stack,
    Text,
    Textarea,
    createListCollection
} from '@chakra-ui/react'

import { getMenuItem, createMenuItem, updateMenuItem } from '../api/menu'
import { useRestaurants } from '../../restaurants/api/useRestaurants'
import type { MenuItem } from '../model/menu'

const spicyOptions = createListCollection({
    items: [
        { label: "0 - Not Spicy", value: "0" },
        { label: "1 - Mild", value: "1" },
        { label: "2 - Medium", value: "2" },
        { label: "3 - Hot", value: "3" },
    ],
})

export function MenuEditPanel() {
    const { menuItemId } = useParams<{ menuItemId: string }>()
    const navigate = useNavigate()
    const { restaurants } = useRestaurants()

    const isEditMode = !!menuItemId
    const restaurantId = restaurants[0]?.id || ''

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [isAvailable, setIsAvailable] = useState(true)
    const [spicyLevel, setSpicyLevel] = useState(0)
    const [ingredientsText, setIngredientsText] = useState('')

    useEffect(() => {
        if (!menuItemId) return

        setLoading(true)
        setError(null)

        getMenuItem(menuItemId)
            .then((item) => {
                setName(item.name)
                setPrice(item.price)
                setCategory(item.category?.name || '')
                setDescription(item.description || '')
                setIsAvailable(item.isAvailable)
                setSpicyLevel(item.spicyLevel ?? 0)
                setIngredientsText(item.ingredients?.join(', ') || '')
            })
            .catch((err) => setError(err.message || 'Failed to fetch'))
            .finally(() => setLoading(false))
    }, [menuItemId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            setError('Name is required')
            return
        }

        if (!price.match(/^\d+(\.\d{1,2})?$/)) {
            setError('Price must be a valid decimal (e.g., 12.99)')
            return
        }

        setSaving(true)
        setError(null)

        const payload: Partial<MenuItem> = {
            name: name.trim(),
            price,
            currency: 'ILS',
            category: category.trim() ? { name: category.trim(), restaurantId, id: '' } : undefined,
            description: description.trim() || undefined,
            isAvailable,
            spicyLevel: spicyLevel as 0 | 1 | 2 | 3,
            ingredients: ingredientsText
                .split(',')
                .map((i) => i.trim())
                .filter(Boolean),
            ...(isEditMode ? {} : { restaurantId }),
        }

        try {
            if (isEditMode) {
                await updateMenuItem(menuItemId!, payload)
            } else {
                if (!restaurantId) {
                    setError('No restaurant available')
                    setSaving(false)
                    return
                }
                await createMenuItem(payload)
            }
            navigate('/menu_items')
        } catch (err: any) {
            setError(err.message || 'Save failed')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <Box p={5}>
                <Spinner />
            </Box>
        )
    }

    return (
        <Box maxW="500px" mx="auto" p={5}>
            <Heading size="md" mb={4}>
                {isEditMode ? 'Edit Menu Item' : 'Add Menu Item'}
            </Heading>

            {error && (
                <Text color="red.500" fontWeight="bold" mb={3}>
                    {error}
                </Text>
            )}

            <Box as="form" onSubmit={handleSubmit}>
                <Stack gap={4}>
                    <Box>
                        <Text mb={1} fontWeight="semibold">
                            Name
                        </Text>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </Box>

                    <Flex gap={4}>
                        <Box flex={1}>
                            <Text mb={1} fontWeight="semibold">
                                Price
                            </Text>
                            <Input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Box>

                        <Box flex={1}>
                            <Text mb={1} fontWeight="semibold">
                                Category
                            </Text>
                            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
                        </Box>
                    </Flex>

                    <Box>
                        <Text mb={1} fontWeight="semibold">
                            Description
                        </Text>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Box>

                    <Box>
                        <Text mb={1} fontWeight="semibold">
                            Ingredients
                        </Text>
                        <Input
                            value={ingredientsText}
                            onChange={(e) => setIngredientsText(e.target.value)}
                        />
                    </Box>

                    <Flex gap={6} align="center">

                        <Checkbox.Root
                            checked={isAvailable}
                            onCheckedChange={(e) => setIsAvailable(!!e.checked)}
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>
                                Available
                            </Checkbox.Label>
                        </Checkbox.Root>

                        <Box>
                            <Text mb={1} fontWeight="semibold">
                                Spicy
                            </Text>

                            <Select.Root
                                collection={spicyOptions}
                                value={[String(spicyLevel)]}
                                onValueChange={(e) => setSpicyLevel(Number(e.value[0]))}
                            >
                                <Select.Trigger>
                                    <Select.ValueText />
                                </Select.Trigger>

                                <Select.Content>
                                    <Select.Item item="0">0 - Not Spicy</Select.Item>
                                    <Select.Item item="1">1 - Mild</Select.Item>
                                    <Select.Item item="2">2 - Medium</Select.Item>
                                    <Select.Item item="3">3 - Hot</Select.Item>
                                </Select.Content>
                            </Select.Root>

                        </Box>

                    </Flex>

                    <Flex gap={3} mt={3}>
                        <Button
                            type="submit"
                            colorPalette="blue"
                            flex={1}
                            isLoading={saving}
                        >
                            {isEditMode ? 'Save' : 'Add'}
                        </Button>

                        <Button variant="outline" onClick={() => navigate('/')}>
                            Cancel
                        </Button>
                    </Flex>
                </Stack>
            </Box>

        </Box>
    )
}
