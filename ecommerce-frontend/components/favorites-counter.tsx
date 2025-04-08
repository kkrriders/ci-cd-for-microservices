'use client'

import { Badge } from "@/components/ui/badge"
import { useFavoritesCounter } from "@/hooks/use-favorites-counter"

export function FavoritesCounter() {
  const count = useFavoritesCounter()
  
  if (count === 0) {
    return null
  }
  
  return (
    <Badge 
      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
      variant="destructive"
    >
      {count > 99 ? '99+' : count}
    </Badge>
  )
} 