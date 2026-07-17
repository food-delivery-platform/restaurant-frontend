import { useState, useEffect } from 'react'
import { Box, Heading, Spinner, Text } from '@chakra-ui/react'
import { apiGet, apiPost } from '../../../shared/api/client'
import { RestaurantDetailsCard, type Venue } from './RestaurantDetailsCard'
import { CategoryList, type Category } from './CategoryList'
import { AddCategoryForm } from './AddCategoryForm'

export function RestaurantInfoPage() {
    const restaurantId = 'my'
    const [venue, setVenue] = useState<Venue | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [savingCategory, setSavingCategory] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            setError(null)
            const [venueData, categoriesData] = await Promise.all([
                apiGet<{ venue: Venue }>('/api/restaurants/my/info'),
                apiGet<Category[]>('/api/restaurants/my/menu-item-categories')
            ])
            setVenue(venueData.venue)
            setCategories(categoriesData)
        } catch (err: any) {
            setError(err.message || 'Failed to load restaurant info')
        } finally {
            setLoading(false)
        }
    }

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newCategoryName.trim()) {
            setError('Category name is required')
            return
        }

        setSavingCategory(true)
        setError(null)

        try {
            await apiPost(`/api/restaurants/${restaurantId}/menu-item-categories`, {
                name: newCategoryName.trim(),
            })
            setNewCategoryName('')
            await loadData()
        } catch (err: any) {
            setError(err.message || 'Failed to add category')
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
