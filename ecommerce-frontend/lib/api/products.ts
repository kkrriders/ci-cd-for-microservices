import type { Product, Review } from "@/types/product"

// Mock data for products
const mockProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  description: `This is a description for Product ${i + 1}. It includes all the amazing features and benefits that make this product special.`,
  price: 50 + i * 10,
  discount: i % 3 === 0 ? 10 : 0,
  rating: 3 + (i % 3),
  reviewCount: 10 + i * 5,
  category: i % 2 === 0 ? "Electronics" : i % 3 === 0 ? "Clothing" : "Home & Garden",
  images: [
    `/placeholder.svg?height=600&width=600&text=Product+${i + 1}`,
    `/placeholder.svg?height=600&width=600&text=Product+${i + 1}+View+2`,
    `/placeholder.svg?height=600&width=600&text=Product+${i + 1}+View+3`,
  ],
  isNew: i < 3,
  inStock: true,
  colors: [
    { name: "Black", value: "black", hex: "#000000" },
    { name: "White", value: "white", hex: "#ffffff" },
    { name: "Blue", value: "blue", hex: "#0000ff" },
  ],
  sizes: ["S", "M", "L", "XL"],
  specifications: [
    { name: "Material", value: "Premium Quality" },
    { name: "Dimensions", value: "10 x 20 x 5 cm" },
    { name: "Weight", value: "500g" },
  ],
  createdAt: new Date(2023, i % 12, i + 1).toISOString(),
}))

// Mock reviews
const mockReviews: Review[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `review-${i + 1}`,
  userId: `user-${i + 1}`,
  userName: `User ${i + 1}`,
  rating: 3 + (i % 3),
  comment: `This is a review for the product. I ${
    i % 2 === 0 ? "really liked" : "loved"
  } it and would recommend it to others. The quality is great and it arrived quickly.`,
  date: new Date(2023, i % 12, i + 1).toISOString(),
  avatar: "",
}))

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Get all products
export async function getProducts(): Promise<Product[]> {
  await delay(500)
  return mockProducts
}

// Get a single product by ID
export async function getProduct(id: string): Promise<Product | null> {
  await delay(300)
  const product = mockProducts.find((p) => p.id === id)
  return product || null
}

// Get featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  await delay(500)
  return mockProducts.slice(0, 4)
}

// Get recommended products
export async function getRecommendedProducts(): Promise<Product[]> {
  await delay(500)
  return mockProducts.slice(4, 8)
}

// Get related products
export async function getRelatedProducts(productId: string): Promise<Product[]> {
  await delay(500)
  const currentProduct = mockProducts.find((p) => p.id === productId)
  if (!currentProduct) return []

  return mockProducts.filter((p) => p.id !== productId && p.category === currentProduct.category).slice(0, 4)
}

// Get product reviews
export async function getProductReviews(productId: string): Promise<Review[]> {
  await delay(500)
  return mockReviews
}

