import Link from "next/link"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link
        href="/categories"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Categories
      </Link>
      <Link
        href="/categories/electronics"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Electronics
      </Link>
      <Link
        href="/categories/clothing"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Clothing
      </Link>
      <Link
        href="/categories/home"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Home & Garden
      </Link>
      <Link
        href="/sales"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Sales
      </Link>
    </nav>
  )
}

