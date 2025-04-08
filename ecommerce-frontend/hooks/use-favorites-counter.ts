'use client'

import { useState, useEffect } from 'react'
import { useFavorites } from './use-favorites'

export function useFavoritesCounter() {
  const { favorites } = useFavorites()
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    setCount(favorites.length)
  }, [favorites])
  
  return count
} 