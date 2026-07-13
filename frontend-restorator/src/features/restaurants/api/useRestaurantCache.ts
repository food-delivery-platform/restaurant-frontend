import { useEffect, useRef, useState } from 'react'
import type { Restaurant } from '../model/restaurant'
import { getRestaurant } from './restaurants'

const cache = new Map<string, Restaurant>()

export function useRestaurantCache(restaurantId: string) {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    useEffect(() => {
        if (!restaurantId) {
            setRestaurant(null)
            return
        }

        if (cache.has(restaurantId)) {
            setRestaurant(cache.get(restaurantId)!)
            return
        }

        setLoading(true)
        setError(null)

        getRestaurant(restaurantId)
            .then((data) => {
                if (isMountedRef.current) {
                    cache.set(restaurantId, data)
                    setRestaurant(data)
                }
            })
            .catch((err) => {
                if (isMountedRef.current) {
                    setError(err.message || 'Failed to fetch')
                }
            })
            .finally(() => {
                if (isMountedRef.current) {
                    setLoading(false)
                }
            })
    }, [restaurantId])

    return { restaurant, loading, error }
}
