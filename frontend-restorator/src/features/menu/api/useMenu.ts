import { useEffect, useState } from 'react'
import type { MenuItem } from '../model/menu'
import { getMenu } from './menu.ts'

export function useMenu(restaurantId: string, onlyAvailable: boolean) {
    const [items, setItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!restaurantId) {
            // Standard fetch-on-param-change reset (react.dev/learn/you-might-not-need-an-effect#fetching-data).
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setItems([])
            return
        }

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