"use client"

import { ProductImageGallery } from "@/components/product-image-gallery"

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  return <ProductImageGallery images={images} />
}

