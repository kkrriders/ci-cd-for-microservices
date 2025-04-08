"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/features/products/product-card"
import { getRelatedProducts } from "@/lib/api/products"
import type { Product } from "@/types/product"

interface RelatedProductsProps {
  productId: string
}

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const relatedProducts = await getRelatedProducts(productId)
        setProducts(relatedProducts)
      } catch (error) {
        console.error("Failed to load related products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [productId])

  if (products.length === 0 && !loading) {
    return null
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm h-[350px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

