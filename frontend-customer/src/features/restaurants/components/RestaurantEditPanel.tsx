import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Heading,
    Input,
    Spinner,
    Stack,
    Text,
    Textarea,
} from '@chakra-ui/react'

import { getRestaurant, createRestaurant, updateRestaurant } from '../api/restaurants'
import type { Restaurant } from '../model/restaurant'

export function RestaurantEditPanel() {
    const { restaurantId } = useParams<{ restaurantId: string }>()
    const navigate = useNavigate()

    const isEditMode = !!restaurantId

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [isOpen, setIsOpen] = useState(true)
    const [rating, setRating] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [ownerId, setOwnerId] = useState('')
    const [addressId, setAddressId] = useState('')

    useEffect(() => {
        if (!restaurantId) return

        setLoading(true)
        setError(null)

        getRestaurant(restaurantId)
            .then((restaurant) => {
                setName(restaurant.name)
                setSlug(restaurant.slug || '')
                setDescription(restaurant.description || '')
                setIsOpen(restaurant.isOpen)
                setRating(restaurant.rating ? String(restaurant.rating) : '')
                setImageUrl(restaurant.imageUrl || '')
                setOwnerId(restaurant.ownerId)
                setAddressId(restaurant.addressId)
            })
            .catch((err) => setError(err.message || 'Failed to fetch'))
            .finally(() => setLoading(false))
    }, [restaurantId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            setError('Name is required')
            return
        }

        if (!ownerId.trim()) {
            setError('Owner ID is required')
            return
        }

        if (!addressId.trim()) {
            setError('Address ID is required')
            return
        }

        const ratingNum = rating ? parseFloat(rating) : undefined
        if (rating && (isNaN(ratingNum!) || ratingNum! < 0 || ratingNum! > 5)) {
            setError('Rating must be between 0 and 5')
            return
        }

        setSaving(true)
        setError(null)

        const payload: Partial<Restaurant> = {
            name: name.trim(),
            slug: slug.trim() || undefined,
            description: description.trim() || undefined,
            isOpen,
            rating: ratingNum,
            imageUrl: imageUrl.trim() || undefined,
            ownerId: ownerId.trim(),
            addressId: addressId.trim(),
        }

        try {
            if (isEditMode) {
                await updateRestaurant(restaurantId!, payload)
            } else {
                await createRestaurant(payload)
            }
            navigate('/restaurants')
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
                {isEditMode ? 'Edit Restaurant' : 'Add Restaurant'}
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
                            Name *
                        </Text>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </Box>

                    <Box>
                        <Text mb={1} fontWeight="semibold">
                            Slug
                        </Text>
                        <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
                    </Box>

                    <Flex gap={4}>
                        <Box flex={1}>
                            <Text mb={1} fontWeight="semibold">
                                Owner ID *
                            </Text>
                            <Input
                                value={ownerId}
                                onChange={(e) => setOwnerId(e.target.value)}
                                placeholder="e.g., 3f1d9b62-2c4e-4d9a-8f24-5d2f1f7c8a11"
                            />
                        </Box>

                        <Box flex={1}>
                            <Text mb={1} fontWeight="semibold">
                                Address ID *
                            </Text>
                            <Input
                                value={addressId}
                                onChange={(e) => setAddressId(e.target.value)}
                                placeholder="e.g., address-venue-001"
                            />
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

                    <Flex gap={4}>
                        <Box flex={1}>
                            <Text mb={1} fontWeight="semibold">
                                Rating (0-5)
                            </Text>
                            <Input
                                type="number"
                                step="0.1"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                placeholder="e.g., 4.8"
                            />
                        </Box>

                        <Box flex={1}>
                            <Text mb={1} fontWeight="semibold">
                                Image URL
                            </Text>
                            <Input
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </Box>
                    </Flex>

                    <Checkbox.Root
                        checked={isOpen}
                        onCheckedChange={(e) => setIsOpen(!!e.checked)}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>
                            Is Open
                        </Checkbox.Label>
                    </Checkbox.Root>

                    <Flex gap={3} mt={3}>
                        <Button
                            type="submit"
                            colorPalette="blue"
                            flex={1}
                            isLoading={saving}
                        >
                            {isEditMode ? 'Save' : 'Add'}
                        </Button>

                        <Button variant="outline" onClick={() => navigate('/restaurants')}>
                            Cancel
                        </Button>
                    </Flex>
                </Stack>
            </Box>

        </Box>
    )
}
