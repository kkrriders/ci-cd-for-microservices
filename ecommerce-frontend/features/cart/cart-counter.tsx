"use client"

import { useCart } from "./use-cart"

export function CartCounter() {
  const { itemCount } = useCart()

  if (itemCount === 0) {
    return null
  }

  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  )
}

