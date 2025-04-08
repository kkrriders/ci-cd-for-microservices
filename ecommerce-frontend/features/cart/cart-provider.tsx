"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import type { Product } from "@/types/product"
import { useLocalStorage } from "@/hooks/use-local-storage"

export interface CartItem extends Product {
  quantity: number
  selectedOptions?: Record<string, string>
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string, options?: Record<string, string>) => void
  updateItemQuantity: (itemId: string, quantity: number, options?: Record<string, string>) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

export const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateItemQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0,
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("cart-items", [])
  const [mounted, setMounted] = useState(false)

  // Calculate derived values
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce(
    (total, item) => total + (item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price) * item.quantity,
    0,
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists in cart with the same options
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === item.id && JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions),
      )

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      } else {
        // Add new item to cart
        return [...prevItems, item]
      }
    })
  }

  const removeItem = (itemId: string, options?: Record<string, string>) => {
    setItems((prevItems) => {
      if (options) {
        // Remove specific item with matching options
        return prevItems.filter(
          (item) => !(item.id === itemId && JSON.stringify(item.selectedOptions) === JSON.stringify(options)),
        )
      } else {
        // Remove all items with matching id regardless of options
        return prevItems.filter((item) => item.id !== itemId)
      }
    })
  }

  const updateItemQuantity = (itemId: string, quantity: number, options?: Record<string, string>) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        removeItem(itemId, options)
        return prevItems.filter(
          (item) => item.id !== itemId || (options && JSON.stringify(item.selectedOptions) !== JSON.stringify(options)),
        )
      }

      return prevItems.map((item) => {
        if (item.id === itemId) {
          if (options && JSON.stringify(item.selectedOptions) !== JSON.stringify(options)) {
            return item
          }
          return { ...item, quantity }
        }
        return item
      })
    })
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
        updateItemQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

