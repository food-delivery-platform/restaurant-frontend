import {useEffect, useState} from 'react'
import type {Restaurant} from '../model/restaurant'
import {getRestaurants} from './restaurants.ts'

export function useRestaurants() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let alive = true

        setLoading(true)

        getRestaurants()
            .then(data => {
                if (!alive) return
                setRestaurants(data)
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
    }, [])

    return { restaurants, loading, error }
}
