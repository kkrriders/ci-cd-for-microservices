import { ProductGrid } from "@/features/products/product-grid"
import { ProductFilters } from "@/features/products/product-filters"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ClothingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: "Clothing", href: "/categories/clothing", active: true },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-6 bg-muted/50 mb-8 rounded-lg">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Clothing</h1>
          <p className="text-muted-foreground max-w-2xl text-center">
            Shop the latest trends in fashion with our curated collection of clothing for men, women, and children.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          <div className="w-full md:w-1/4 lg:w-1/5">
            <ProductFilters
              categories={["Men", "Women", "Children", "Activewear", "Outerwear", "Accessories"]}
              brands={["Nike", "Adidas", "Zara", "H&M", "Levi's", "Under Armour", "Gap"]}
              priceRanges={[
                "Under $25",
                "$25 - $50",
                "$50 - $100",
                "$100 - $200",
                "Over $200"
              ]}
              sizes={["XS", "S", "M", "L", "XL", "XXL"]}
              colors={["Black", "White", "Blue", "Red", "Green", "Yellow", "Brown"]}
            />
          </div>
          <div className="w-full md:w-3/4 lg:w-4/5">
            <ProductGrid category="clothing" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
} 