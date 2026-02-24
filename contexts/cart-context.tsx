"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { SiteOrLocation } from "@/types"

interface CartContextValue {
  items: SiteOrLocation[]
  count: number
  addItem: (item: SiteOrLocation) => void
  removeItem: (id: string) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SiteOrLocation[]>([])

  const addItem = useCallback((item: SiteOrLocation) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const isInCart = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      addItem,
      removeItem,
      clearCart,
      isInCart,
    }),
    [items, addItem, removeItem, clearCart, isInCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return ctx
}
