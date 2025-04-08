import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  
  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error)
        setFavorites([])
      }
    }
  }, [])
  
  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])
  
  // Add or remove an item from favorites
  const toggleFavorite = (productId: string) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter(id => id !== productId)
      } else {
        return [...prevFavorites, productId]
      }
    })
  }
  
  // Check if an item is in favorites
  const isFavorite = (productId: string) => {
    return favorites.includes(productId)
  }
  
  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([])
  }
  
  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  }
} 