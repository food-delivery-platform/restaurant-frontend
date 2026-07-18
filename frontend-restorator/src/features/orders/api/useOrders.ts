import { useEffect, useState, useCallback, useRef } from 'react'
import type { Order } from '../model/order'
import { getOrders, markItemReady, markOrderDeliver } from './orders'
import { ORDERS_POLL_INTERVAL_MS } from '../../../shared/config'

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const aliveRef = useRef(true)

    const fetchOrders = useCallback((options?: { silent?: boolean }) => {
        const silent = options?.silent ?? false

        if (!silent) {
            setLoading(true)
        }
        setError(null)

        return getOrders()
            .then(data => {
                if (!aliveRef.current) return
                setOrders(data)
            })
            .catch((e: unknown) => {
                if (!aliveRef.current) return
                setError(e instanceof Error ? e.message : 'Failed to fetch orders')
            })
            .finally(() => {
                if (!aliveRef.current) return
                if (!silent) {
                    setLoading(false)
                }
            })
    }, [])

    useEffect(() => {
        aliveRef.current = true

        // Standard fetch-on-mount pattern (react.dev/learn/you-might-not-need-an-effect#fetching-data).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrders()

        // Poll for new/updated orders so the dashboard stays current without a manual refresh.
        const intervalId = setInterval(() => {
            fetchOrders({ silent: true })
        }, ORDERS_POLL_INTERVAL_MS)

        return () => {
            aliveRef.current = false
            clearInterval(intervalId)
        }
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
