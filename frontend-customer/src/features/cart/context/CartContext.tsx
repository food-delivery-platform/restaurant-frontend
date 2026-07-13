import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { CartItem } from '../api/cart'

const CART_STORAGE_KEY = 'cart'

type CartContextType = {
    items: CartItem[]
    addItem: (id: string, quantity: number) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
            try {
                return JSON.parse(stored)
            } catch {
                return []
            }
        }
        return []
    })

    // Сохранить в localStorage при изменении
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }, [items])

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

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within CartProvider')
    }
    return context
}
