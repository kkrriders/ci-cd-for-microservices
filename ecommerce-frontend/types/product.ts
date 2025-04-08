export interface Product {
  id: string
  name: string
  description: string
  price: number
  discount: number
  rating: number
  reviewCount: number
  category: string
  images: string[]
  isNew: boolean
  inStock: boolean
  colors?: {
    name: string
    value: string
    hex: string
  }[]
  sizes?: string[]
  specifications?: {
    name: string
    value: string
  }[]
  createdAt: string
}

export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  avatar: string
}

