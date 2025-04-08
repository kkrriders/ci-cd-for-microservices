import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function generatePagination(currentPage: number, totalPages: number) {
  // If total pages is 7 or less, show all pages
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // If current page is among the first 3 pages, show first 3, ellipsis, and last 2
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages]
  }

  // If current page is among the last 3 pages, show first 2, ellipsis, and last 3
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages]
  }

  // If current page is somewhere in the middle, show first, ellipsis, current-1, current, current+1, ellipsis, last
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
}

