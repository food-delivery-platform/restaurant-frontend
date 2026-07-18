import { useEffect, useState } from 'react'
import type { Category } from '../model/restaurant'
import { getCategories } from './restaurant'

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let alive = true

        // Standard fetch-on-mount pattern (react.dev/learn/you-might-not-need-an-effect#fetching-data).
        // getCategories() itself caches the request, so repeated mounts don't refetch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true)

        getCategories()
            .then((data) => {
                if (!alive) return
                setCategories(data)
            })
            .catch((e: unknown) => {
                if (!alive) return
                setError(e instanceof Error ? e.message : 'Failed to fetch categories')
            })
            .finally(() => {
                if (!alive) return
                setLoading(false)
            })

        return () => {
            alive = false
        }
    }, [])

    return { categories, loading, error }
}
