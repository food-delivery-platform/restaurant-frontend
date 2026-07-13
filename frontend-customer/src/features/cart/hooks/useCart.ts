import { useState, useEffect, useCallback } from 'react'
import type { CartItem } from '../api/cart'

const CART_STORAGE_KEY = 'cart'

function loadCartFromStorage(): CartItem[] {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch (e) {
            console.error('Failed to parse cart from localStorage', e)
            return []
        }
    }
    return []
}

export function useCart() {
    const [items, setItems] = useState<CartItem[]>(loadCartFromStorage())

    // Сохранить корзину в localStorage при изменении
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }, [items])

    // Слушать изменения localStorage из других табов/компонентов
    useEffect(() => {
        const handleStorageChange = () => {
            setItems(loadCartFromStorage())
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const addItem = (id: string, quantity: number = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === id)
            if (existing) {
                return prev.map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }
            return [...prev, { id, quantity }]
        })
    }

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id)
            return
        }
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    return {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart
    }
}
