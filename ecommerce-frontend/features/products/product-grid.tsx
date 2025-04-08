"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/features/products/product-card"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/api/products"
import type { Product } from "@/types/product"
import { Grid, List, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounce } from "@/hooks/use-debounce"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { generatePagination } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { Heart } from "lucide-react"

interface ProductGridProps {
  category?: string;
  onSale?: boolean;
  isNew?: boolean;
  featured?: boolean;
  searchTerm?: string;
}

export function ProductGrid({ 
  category, 
  onSale = false, 
  isNew = false, 
  featured = false,
  searchTerm = ""
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [searchQuery, setSearchQuery] = useState(searchTerm)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getProducts()
        setProducts(allProducts)
        
        // Apply initial filters based on props
        let initialFiltered = [...allProducts];
        
        // Filter by category if provided
        if (category) {
          initialFiltered = initialFiltered.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
          );
        }
        
        // Filter by sale status if requested
        if (onSale) {
          initialFiltered = initialFiltered.filter(product => 
            product.isOnSale || product.discount > 0
          );
        }
        
        // Filter by new items if requested
        if (isNew) {
          initialFiltered = initialFiltered.filter(product => product.isNew);
        }
        
        // Filter by featured items if requested
        if (featured) {
          initialFiltered = initialFiltered.filter(product => product.isFeatured);
        }
        
        setFilteredProducts(initialFiltered);
      } catch (error) {
        console.error("Failed to load products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category, onSale, isNew, featured])

  useEffect(() => {
    // Filter products based on search query
    if (debouncedSearchQuery.trim() === "") {
      // Apply only the category/sale/new/featured filters without search
      let currentFiltered = [...products];
      
      if (category) {
        currentFiltered = currentFiltered.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (onSale) {
        currentFiltered = currentFiltered.filter(product => 
          product.isOnSale || product.discount > 0
        );
      }
      
      if (isNew) {
        currentFiltered = currentFiltered.filter(product => product.isNew);
      }
      
      if (featured) {
        currentFiltered = currentFiltered.filter(product => product.isFeatured);
      }
      
      setFilteredProducts(currentFiltered);
    } else {
      // Apply search filter along with category/sale/new/featured filters
      let searchFiltered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      
      if (category) {
        searchFiltered = searchFiltered.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (onSale) {
        searchFiltered = searchFiltered.filter(product => 
          product.isOnSale || product.discount > 0
        );
      }
      
      if (isNew) {
        searchFiltered = searchFiltered.filter(product => product.isNew);
      }
      
      if (featured) {
        searchFiltered = searchFiltered.filter(product => product.isFeatured);
      }
      
      setFilteredProducts(searchFiltered);
    }
    // Reset to first page when search changes
    setCurrentPage(1)
  }, [debouncedSearchQuery, products, category, onSale, isNew, featured])

  useEffect(() => {
    // Sort products when sortBy changes
    const sortedProducts = sortProducts(filteredProducts, sortBy)
    setFilteredProducts(sortedProducts)
  }, [sortBy])

  const sortProducts = (products: Product[], sortOption: string) => {
    const productsCopy = [...products]

    switch (sortOption) {
      case "price-low":
        return productsCopy.sort((a, b) => a.price - b.price)
      case "price-high":
        return productsCopy.sort((a, b) => b.price - a.price)
      case "newest":
        return productsCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "discount":
        return productsCopy.sort((a, b) => b.discount - a.discount)
      case "rating":
        return productsCopy.sort((a, b) => b.rating - a.rating)
      default:
        return productsCopy
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginationRange = generatePagination(currentPage, totalPages)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of product grid
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Determine the title based on props
  const getTitle = () => {
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
    if (onSale) return "Sale Items";
    if (isNew) return "New Arrivals"; 
    if (featured) return "Featured Products";
    return "All Products";
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold">{getTitle()}</h1>
          <p className="text-muted-foreground">{filteredProducts.length} products available</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-full sm:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="discount">Biggest Discount</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button
                variant={view === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
                className="rounded-none rounded-l-md"
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                className="rounded-none rounded-r-md"
                aria-label="List view"
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[350px]" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria.</p>
          <Button
            onClick={() => {
              setSearchQuery("")
              setSortBy("featured")
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : view === "grid" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(currentPage - 1)
                      }}
                    />
                  </PaginationItem>
                )}

                {paginationRange.map((page, i) => {
                  if (page === "...") {
                    return (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  return (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(page as number)
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(currentPage + 1)
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {currentItems.map((product) => (
            <div
              key={product.id}
              className="flex flex-col md:flex-row border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="w-full md:w-1/4 relative">
                <img
                  src={product.images[0] || "/placeholder.svg?height=200&width=200"}
                  alt={product.name}
                  className="h-48 md:h-full w-full object-cover"
                  loading="lazy"
                />
                {product.isNew && <Badge className="absolute top-2 left-2">New</Badge>}
                {product.discount > 0 && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
              <div className="w-full md:w-3/4 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    {product.discount > 0 ? (
                      <>
                        <span className="font-bold text-lg">{formatPrice(product.price * (1 - product.discount / 100))}</span>
                        <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
                      </>
                    ) : (
                      <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                    )}
                    {product.freeShipping && <Badge variant="outline">Free Shipping</Badge>}
                  </div>
                  <Button>Add to Cart</Button>
                </div>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(currentPage - 1)
                      }}
                    />
                  </PaginationItem>
                )}

                {paginationRange.map((page, i) => {
                  if (page === "...") {
                    return (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  return (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(page as number)
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(currentPage + 1)
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  )
}

