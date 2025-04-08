"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, Star, Truck, ShieldCheck, RotateCcw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/types/product"
import { useCart } from "@/features/cart/use-cart"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    // Validate required options are selected
    if (product.colors?.length && !selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      })
      return
    }

    if (product.sizes?.length && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      })
      return
    }

    addItem({
      ...product,
      quantity,
      selectedOptions: {
        color: selectedColor,
        size: selectedSize,
      },
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)

    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this product with others.",
      })
    }
  }

  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="flex items-center mt-2 space-x-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{product.reviewCount} reviews</span>
          {product.inStock ? (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
              In Stock
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {product.discount > 0 ? (
          <>
            <span className="text-3xl font-bold">{formatPrice(discountedPrice)}</span>
            <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
            <Badge variant="destructive">{product.discount}% OFF</Badge>
          </>
        ) : (
          <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
        )}
      </div>

      <div className="space-y-4">
        {product.colors && product.colors.length > 0 && (
          <div>
            <label className="text-sm font-medium">Color</label>
            <div className="flex items-center space-x-2 mt-2">
              {product.colors.map((color) => (
                <TooltipProvider key={color.value}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color.value ? "border-primary" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(color.value)}
                        aria-label={`Select ${color.name} color`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{color.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <div>
            <label className="text-sm font-medium">Size</label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Quantity</label>
          <div className="flex items-center space-x-2 mt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </Button>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-16 text-center"
              aria-label="Quantity"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={!product.inStock}>
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          <span className="sr-only">Add to wishlist</span>
        </Button>
        <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share product">
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
        <div className="flex items-center space-x-2">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Free Shipping</p>
            <p className="text-xs text-muted-foreground">On orders over $50</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Secure Payment</p>
            <p className="text-xs text-muted-foreground">Encrypted transactions</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <RotateCcw className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Easy Returns</p>
            <p className="text-xs text-muted-foreground">30-day return policy</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-4">
          <p className="text-muted-foreground">{product.description}</p>
        </TabsContent>
        <TabsContent value="specifications" className="pt-4">
          <ul className="space-y-2">
            {product.specifications?.map((spec, index) => (
              <li key={index} className="flex">
                <span className="font-medium w-1/3">{spec.name}:</span>
                <span className="text-muted-foreground">{spec.value}</span>
              </li>
            )) || <p className="text-muted-foreground">No specifications available.</p>}
          </ul>
        </TabsContent>
        <TabsContent value="shipping" className="pt-4">
          <p className="text-muted-foreground">
            Free shipping on orders over $50. Standard delivery 3-5 business days. Express delivery 1-2 business days.
          </p>
          <p className="text-muted-foreground mt-2">
            We ship to all 50 states and international destinations. Additional fees may apply for international
            shipping.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

