import Link from "next/link"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const routes = [
    {
      href: "/products",
      label: "All Products",
    },
    {
      href: "/categories/electronics",
      label: "Electronics",
    },
    {
      href: "/categories/clothing",
      label: "Clothing",
    },
    {
      href: "/categories/home",
      label: "Home & Garden",
    },
    {
      href: "/sale",
      label: "Sale",
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-6", className)}>
      {routes.map((route) => (
        <Link key={route.href} href={route.href} className="text-sm font-medium transition-colors hover:text-primary">
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

