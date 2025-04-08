"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ProductImageGalleryProps {
  images: string[]
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handlePrevious = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current) return

    const { left, top, width, height } = imageRef.current.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    setZoomPosition({ x, y })
  }

  // Reset zoom when changing images
  useEffect(() => {
    setIsZoomed(false)
  }, [currentImage])

  // If no images are provided, use a placeholder
  const displayImages = images.length > 0 ? images : ["/placeholder.svg?height=600&width=600"]

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border" ref={imageRef}>
        <div
          className={`aspect-square relative ${isZoomed && !isMobile ? "cursor-zoom-out" : "cursor-zoom-in"}`}
          onClick={isMobile ? undefined : toggleZoom}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isZoomed && setIsZoomed(false)}
        >
          <img
            src={displayImages[currentImage] || "/placeholder.svg"}
            alt="Product"
            className={`object-cover w-full h-full transition-all duration-300 ${
              isZoomed && !isMobile ? "opacity-0" : "opacity-100"
            }`}
            loading="lazy"
          />

          {isZoomed && !isMobile && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                backgroundImage: `url(${displayImages[currentImage]})`,
                backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                backgroundSize: "200%",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background/90"
            onClick={(e) => {
              e.stopPropagation()
              toggleZoom()
            }}
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            <span className="sr-only">{isZoomed ? "Zoom out" : "Zoom in"}</span>
          </Button>
        </div>

        {displayImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background/90"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background/90"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                currentImage === index ? "border-primary" : "border-transparent"
              }`}
              onClick={() => setCurrentImage(index)}
              aria-label={`View product image ${index + 1}`}
              aria-current={currentImage === index ? "true" : "false"}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Product thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

