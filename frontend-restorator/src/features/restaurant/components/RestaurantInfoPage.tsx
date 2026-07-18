import { Box, Heading, Spinner, Text } from '@chakra-ui/react'
import { useRestaurantInfo } from '../api/useRestaurantInfo'
import { RestaurantDetailsCard } from './RestaurantDetailsCard'
import { CategoryList } from './CategoryList'
import { AddCategoryForm } from './AddCategoryForm'

export function RestaurantInfoPage() {
    const {
        venue,
        categories,
        loading,
        error,
        newCategoryName,
        setNewCategoryName,
        savingCategory,
        handleAddCategory,
    } = useRestaurantInfo()

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
