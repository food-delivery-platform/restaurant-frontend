import { useEffect, useState } from 'react'
import type { MenuItem } from '../types/menu'
import { getMenu } from '../api/menu'

export function useMenu(restaurantId: string, onlyAvailable: boolean) {
    const [items, setItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let alive = true

        setLoading(true)

        getMenu(restaurantId, onlyAvailable)
            .then(data => {
                if (!alive) return
                setItems(data)
            })
            .catch(e => {
                if (!alive) return
                setError(e.message)
            })
            .finally(() => {
                if (!alive) return
                setLoading(false)
            })

        return () => {
            alive = false
        }
    }, [restaurantId, onlyAvailable])

    return { items, loading, error }
}