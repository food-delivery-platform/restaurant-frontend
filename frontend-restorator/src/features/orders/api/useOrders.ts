import { useEffect, useState, useCallback } from 'react'
import type { Order } from '../model/order'
import { getOrders, markItemReady, markOrderDeliver } from './orders'

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchOrders = useCallback(() => {
        let alive = true

        setLoading(true)
        setError(null)

        getOrders()
            .then(data => {
                if (!alive) return
                setOrders(data)
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

    useEffect(() => {
        // Standard fetch-on-mount pattern (react.dev/learn/you-might-not-need-an-effect#fetching-data).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        return fetchOrders()
    }, [fetchOrders])

    const setItemReady = useCallback(async (orderId: string, itemId: string) => {
        try {
            const updated = await markItemReady(orderId, itemId)
            setOrders(prev =>
                prev.map(o => (o.id === orderId ? updated : o))
            )
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to mark item ready')
        }
    }, [])

    const deliverOrder = useCallback(async (orderId: string) => {
        try {
            const updated = await markOrderDeliver(orderId)
            setOrders(prev =>
                prev.map(o => (o.id === orderId ? updated : o))
            )
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to deliver order')
        }
    }, [])

    return { orders, loading, error, setItemReady, deliverOrder, refresh: fetchOrders }
}
