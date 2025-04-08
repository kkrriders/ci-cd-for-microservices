import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function CategoriesPage() {
  const mainCategories = [
    {
      name: "Electronics",
      href: "/categories/electronics",
      image: "/placeholder.svg?height=400&width=600",
      description: "Discover the latest gadgets and tech innovations.",
      featured: ["Smartphones", "Laptops", "Smart Home", "Audio"]
    },
    {
      name: "Clothing",
      href: "/categories/clothing",
      image: "/placeholder.svg?height=400&width=600",
      description: "Shop the latest fashion trends for every season.",
      featured: ["Men's", "Women's", "Children's", "Activewear"]
    },
    {
      name: "Home & Garden",
      href: "/categories/home",
      image: "/placeholder.svg?height=400&width=600",
      description: "Transform your living space inside and out.",
      featured: ["Furniture", "Decor", "Kitchen", "Garden"]
    },
    {
      name: "Beauty",
      href: "/categories/beauty",
      image: "/placeholder.svg?height=400&width=600",
      description: "Premium skincare, makeup, and fragrance collections.",
      featured: ["Skincare", "Makeup", "Fragrance", "Hair Care"]
    },
    {
      name: "Sports",
      href: "/categories/sports",
      image: "/placeholder.svg?height=400&width=600",
      description: "Gear up for your active lifestyle and sporting needs.",
      featured: ["Fitness", "Outdoor", "Team Sports", "Equipment"]
    },
    {
      name: "Toys",
      href: "/categories/toys",
      image: "/placeholder.svg?height=400&width=600",
      description: "Fun and educational toys for all ages.",
      featured: ["Educational", "Action Figures", "Games", "Outdoor Play"]
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories", active: true },
          ]}
        />
        
        <div className="flex flex-col items-center justify-center py-6">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Shop by Category</h1>
          <p className="text-muted-foreground max-w-2xl text-center mb-8">
            Browse our extensive collection of products by category to find exactly what you're looking for.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainCategories.map((category) => (
            <Link key={category.name} href={category.href} className="no-underline">
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h2 className="text-white font-bold text-2xl">{category.name}</h2>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Popular in {category.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.featured.map((item) => (
                        <span
                          key={item}
                          className="bg-muted px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 bg-muted/50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4">Seasonal Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/sales" className="block no-underline">
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-1">Summer Sale</h3>
                <p className="text-sm text-muted-foreground">Hot deals on seasonal favorites</p>
              </div>
            </Link>
            <Link href="/categories/clothing" className="block no-underline">
              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-1">Fall Fashion</h3>
                <p className="text-sm text-muted-foreground">New arrivals for the season</p>
              </div>
            </Link>
            <Link href="/categories/home" className="block no-underline">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-1">Home Refresh</h3>
                <p className="text-sm text-muted-foreground">Upgrade your living space</p>
              </div>
            </Link>
            <Link href="/categories/electronics" className="block no-underline">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-1">Tech Deals</h3>
                <p className="text-sm text-muted-foreground">Latest gadgets on sale</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
} 