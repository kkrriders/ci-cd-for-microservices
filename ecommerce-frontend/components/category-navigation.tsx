import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export function CategoryNavigation() {
  const categories = [
    {
      name: "Electronics",
      href: "/categories/electronics",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Clothing",
      href: "/categories/clothing",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Home & Garden",
      href: "/categories/home",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Beauty",
      href: "/categories/beauty",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Sports",
      href: "/categories/sports",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Toys",
      href: "/categories/toys",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <section className="w-full py-12 bg-background">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <h3 className="text-white font-medium text-lg">{category.name}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

