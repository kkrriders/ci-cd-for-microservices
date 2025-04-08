"use client"

import type React from "react"

import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"
import { useCart } from "@/features/cart/use-cart"
import { formatPrice, truncateText } from "@/lib/utils"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useFavorites } from "@/hooks/use-favorites"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const { favorites, toggleFavorite } = useFavorites()
  const [isWishlisted, setIsWishlisted] = useState(favorites.includes(product.id))

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    toggleFavorite(product.id)
    
    toast({
      title: isWishlisted ? "Removed from favorites" : "Added to favorites",
      description: isWishlisted 
        ? `${product.name} has been removed from your favorites`
        : `${product.name} has been added to your favorites`,
      duration: 2000,
    })
  }

  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0

  return (
    <Card className={cn("h-full overflow-hidden transition-all hover:shadow-lg", className)}>
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          <CardContent className="p-0">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={product.images[0] || "/placeholder.svg?height=400&width=400"}
                alt={product.name}
                className="object-cover w-full h-full transition-transform hover:scale-105"
                loading="lazy"
              />
            </div>
            {product.isNew && <Badge className="absolute top-2 left-2">New</Badge>}
            {product.discount > 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                {product.discount}% OFF
              </Badge>
            )}
            <button
              className={cn(
                "absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors",
                isWishlisted ? "text-red-500" : "text-gray-500"
              )}
              onClick={handleFavoriteClick}
              aria-label={isWishlisted ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("h-4 w-4", isWishlisted ? "fill-current" : "")} />
            </button>
          </CardContent>
          <CardFooter className="flex flex-col items-start p-4">
            <div className="space-y-1 mb-2 w-full">
              <h3 className="font-medium">{truncateText(product.name, 40)}</h3>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1">
                {product.discount > 0 ? (
                  <>
                    <span className="font-bold">{formatPrice(discountedPrice)}</span>
                    <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  </>
                ) : (
                  <span className="font-bold">{formatPrice(product.price)}</span>
                )}
              </div>
              <Button size="sm" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </CardFooter>
        </div>
      </Link>
    </Card>
  )
}

