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
        return fetchOrders()
    }, [fetchOrders])

    const setItemReady = useCallback(async (orderId: string, itemId: string) => {
        try {
            const updated = await markItemReady(orderId, itemId)
            setOrders(prev =>
                prev.map(o => (o.id === orderId ? updated : o))
            )
        } catch (e: any) {
            setError(e.message)
        }
    }, [])

    const deliverOrder = useCallback(async (orderId: string) => {
        try {
            const updated = await markOrderDeliver(orderId)
            setOrders(prev =>
                prev.map(o => (o.id === orderId ? updated : o))
            )
        } catch (e: any) {
            setError(e.message)
        }
    }, [])

    return { orders, loading, error, setItemReady, deliverOrder, refresh: fetchOrders }
}
