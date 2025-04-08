import type { Product, Category } from "@/types/product";

// Set base API URL from environment variable or default to local development URL
const API_BASE_URL = process.env.NEXT_PUBLIC_CATALOG_API_URL || 'http://localhost:8082/api/v1/catalog';

/**
 * Get all products with optional filtering
 */
export async function getProducts(
  page = 1,
  limit = 10,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  sortBy?: string
): Promise<{ products: Product[]; totalCount: number; totalPages: number }> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (category) params.append('category', category);
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
    if (sortBy) params.append('sortBy', sortBy);

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      products: data.products,
      totalCount: data.totalCount,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { products: [], totalCount: 0, totalPages: 0 };
  }
}

/**
 * Get a single product by ID
 */
export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    return null;
  }
}

/**
 * Get all product categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

/**
 * Search products by query string
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams({
      q: query,
    });

    const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error searching products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to search products with query "${query}":`, error);
    return [];
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/featured`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching featured products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
}

/**
 * Check product availability
 */
export async function checkProductAvailability(productId: string, quantity: number): Promise<{ available: boolean; remainingStock?: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}/availability?quantity=${quantity}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error checking product availability: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to check availability for product ${productId}:`, error);
    return { available: false };
  }
} 