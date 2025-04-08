'use client'

import { useState, useEffect } from 'react'
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductCard } from "@/features/products/product-card"
import { useFavorites } from "@/hooks/use-favorites"
import { Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { EmptyState } from "@/components/empty-state"

// Mock API call to get product details from IDs
const getProductsById = async (ids: string[]) => {
  // In a real app, this would be an API call to fetch products by their IDs
  // For demo purposes, we'll use a mock
  const mockProducts = [
    {
      id: "1",
      name: "Wireless Bluetooth Earbuds",
      price: 79.99,
      originalPrice: 129.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
      rating: 4.5,
      reviews: 128,
      isNew: false,
      isFeatured: true,
      isOnSale: true,
      outOfStock: false,
    },
    {
      id: "2",
      name: "Smart Watch Series 5",
      price: 249.99,
      originalPrice: 299.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
      rating: 4.7,
      reviews: 256,
      isNew: true,
      isFeatured: true,
      isOnSale: true,
      outOfStock: false,
    },
    {
      id: "3",
      name: "Noise Cancelling Headphones",
      price: 199.99,
      originalPrice: 249.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
      rating: 4.8,
      reviews: 189,
      isNew: false,
      isFeatured: false,
      isOnSale: true,
      outOfStock: false,
    },
    {
      id: "4",
      name: "Smartphone 13 Pro",
      price: 999.99,
      originalPrice: null,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
      rating: 4.9,
      reviews: 512,
      isNew: true,
      isFeatured: true,
      isOnSale: false,
      outOfStock: false,
    },
    {
      id: "5",
      name: "Laptop Ultra Slim",
      price: 1299.99,
      originalPrice: 1499.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
      rating: 4.6,
      reviews: 324,
      isNew: false,
      isFeatured: true,
      isOnSale: true,
      outOfStock: false,
    },
    {
      id: "6",
      name: "Premium Cotton T-Shirt",
      price: 24.99,
      originalPrice: 34.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "clothing",
      rating: 4.3,
      reviews: 156,
      isNew: false,
      isFeatured: false,
      isOnSale: true,
      outOfStock: false,
    },
    {
      id: "7",
      name: "Designer Jeans",
      price: 89.99,
      originalPrice: 119.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "clothing",
      rating: 4.5,
      reviews: 178,
      isNew: false,
      isFeatured: true,
      isOnSale: true,
      outOfStock: false,
    },
    {
      id: "8",
      name: "Modern Coffee Table",
      price: 199.99,
      originalPrice: 249.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "home",
      rating: 4.4,
      reviews: 85,
      isNew: false,
      isFeatured: true,
      isOnSale: true,
      outOfStock: false,
    },
  ]
  
  return mockProducts.filter(product => ids.includes(product.id))
}

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites()
  const { toast } = useToast()
  const [favoriteProducts, setFavoriteProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true)
      if (favorites.length === 0) {
        setFavoriteProducts([])
        setIsLoading(false)
        return
      }
      
      try {
        const products = await getProductsById(favorites)
        setFavoriteProducts(products)
      } catch (error) {
        console.error('Error loading favorite products:', error)
        toast({
          title: "Error loading favorites",
          description: "There was a problem loading your favorite products. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadFavorites()
  }, [favorites, toast])

  const handleClearFavorites = () => {
    clearFavorites()
    toast({
      title: "Favorites cleared",
      description: "All items have been removed from your favorites.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Favorites", href: "/favorites", active: true },
          ]}
        />
        
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
          </div>
          
          {favorites.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearFavorites}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
        
        <Separator className="mb-6" />
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <div className="bg-muted aspect-square w-full"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your favorites list is empty</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Save items you like by clicking the heart icon on any product. Your favorites will be saved here for easy access.
            </p>
            <Button asChild>
              <a href="/products">Explore Products</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
} 