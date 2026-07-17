import { useState, useEffect } from 'react'
import { Box, Heading, Spinner, Text } from '@chakra-ui/react'
import { getRestaurantInfo, getCategories, addCategory } from '../api/restaurant'
import type { Venue, Category } from '../model/restaurant'
import { RestaurantDetailsCard } from './RestaurantDetailsCard'
import { CategoryList } from './CategoryList'
import { AddCategoryForm } from './AddCategoryForm'

export function RestaurantInfoPage() {
    const restaurantId = 'my'
    const [venue, setVenue] = useState<Venue | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [savingCategory, setSavingCategory] = useState(false)

    const loadData = async () => {
        try {
            setLoading(true)
            setError(null)
            const venuePromise = getRestaurantInfo()
            const categoriesPromise = getCategories()
            const venueData = await venuePromise
            const categoriesData = await categoriesPromise
            setVenue(venueData.venue)
            setCategories(categoriesData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load restaurant info')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Standard fetch-on-mount pattern (react.dev/learn/you-might-not-need-an-effect#fetching-data).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData()
    }, [])

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newCategoryName.trim()) {
            setError('Category name is required')
            return
        }

        setSavingCategory(true)
        setError(null)

        try {
            await addCategory(restaurantId, newCategoryName.trim())
            setNewCategoryName('')
            await loadData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add category')
        } finally {
            setSavingCategory(false)
        }
    }

    if (loading) {
        return (
            <Box p={5}>
                <Spinner />
            </Box>
        )
    }

    if (!venue) {
        return (
            <Box p={5}>
                <Text color="red.500">{error || 'Failed to load restaurant info'}</Text>
            </Box>
        )
    }

    return (
        <Box maxW="800px" mx="auto" p={5}>
            <Heading size="lg" mb={6}>Restaurant Info</Heading>

            {error && <Text color="red.500" mb={4}>{error}</Text>}

            <RestaurantDetailsCard venue={venue} />

            <Box p={5} border="1px solid" borderColor="gray.200" borderRadius="md">
                <Heading size="md" mb={4}>Menu Item Categories</Heading>

                <CategoryList categories={categories} />

                <AddCategoryForm
                    value={newCategoryName}
                    onChange={setNewCategoryName}
                    onSubmit={handleAddCategory}
                    saving={savingCategory}
                />
            </Box>
        </Box>
    )
}
