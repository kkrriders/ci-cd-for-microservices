"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/features/products/product-card"
import { getRecommendedProducts } from "@/lib/api/products"
import type { Product } from "@/types/product"

export function PersonalizedRecommendations() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const recommendedProducts = await getRecommendedProducts()
        setProducts(recommendedProducts)
      } catch (error) {
        console.error("Failed to load recommended products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (products.length === 0 && !loading) {
    return null
  }

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Recommended For You</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border bg-card text-card-foreground shadow-sm h-[350px] animate-pulse"
              />
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
    </section>
  )
}

