import { useCallback, useEffect, useState } from 'react'
import type { Venue, Category } from '../model/restaurant'
import { getRestaurantInfo, getCategories, addCategory } from './restaurant'

const RESTAURANT_ID = 'my'

export function useRestaurantInfo() {
    const [venue, setVenue] = useState<Venue | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [savingCategory, setSavingCategory] = useState(false)

    const loadData = useCallback(async () => {
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
    }, [])

    useEffect(() => {
        // Standard fetch-on-mount pattern (react.dev/learn/you-might-not-need-an-effect#fetching-data).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData()
    }, [loadData])

    const handleAddCategory = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newCategoryName.trim()) {
            setError('Category name is required')
            return
        }

        setSavingCategory(true)
        setError(null)

        try {
            await addCategory(RESTAURANT_ID, newCategoryName.trim())
            setNewCategoryName('')
            await loadData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add category')
        } finally {
            setSavingCategory(false)
        }
    }, [newCategoryName, loadData])

    return {
        venue,
        categories,
        loading,
        error,
        newCategoryName,
        setNewCategoryName,
        savingCategory,
        handleAddCategory,
    }
}
