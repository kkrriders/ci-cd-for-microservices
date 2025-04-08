"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

export function MobileNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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

  const accountLinks = [
    {
      href: "/account",
      label: "My Account",
    },
    {
      href: "/account/orders",
      label: "Orders",
    },
    {
      href: "/favorites",
      label: "Favorites",
    },
    {
      href: "/cart",
      label: "Cart",
    },
  ]

  return (
    <div className="flex h-full flex-col overflow-y-auto py-4">
      <div className="px-2 mb-4">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">ModernShop</span>
        </Link>
      </div>

      {isSearchOpen ? (
        <div className="px-2 mb-4 flex items-center">
          <Input type="search" placeholder="Search products..." className="flex-1" autoFocus />
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close search</span>
          </Button>
        </div>
      ) : (
        <Button variant="outline" className="mx-2 mb-4 justify-start" onClick={() => setIsSearchOpen(true)}>
          <Search className="mr-2 h-4 w-4" />
          Search products...
        </Button>
      )}

      <div className="px-2">
        <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight">Shop</h3>
        <div className="space-y-1">
          {routes.map((route) => (
            <Button key={route.href} variant="ghost" className="w-full justify-start" asChild>
              <Link href={route.href}>{route.label}</Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="px-2 mt-6">
        <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight">Account</h3>
        <div className="space-y-1">
          {accountLinks.map((link) => (
            <Button key={link.href} variant="ghost" className="w-full justify-start" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-auto px-2">
        <Button variant="outline" className="w-full">
          Sign Out
        </Button>
      </div>
    </div>
  )
}

