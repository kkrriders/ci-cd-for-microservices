import { ProductGrid } from "@/features/products/product-grid"
import { ProductFilters } from "@/features/products/product-filters"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ElectronicsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: "Electronics", href: "/categories/electronics", active: true },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-6 bg-muted/50 mb-8 rounded-lg">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Electronics</h1>
          <p className="text-muted-foreground max-w-2xl text-center">
            Discover the latest gadgets and tech, from smartphones and laptops to smart home devices and audio equipment.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          <div className="w-full md:w-1/4 lg:w-1/5">
            <ProductFilters
              categories={["Smartphones", "Laptops", "Audio", "Smart Home", "Accessories", "Tablets"]}
              brands={["Apple", "Samsung", "Sony", "Google", "Microsoft", "Bose", "LG"]}
              priceRanges={[
                "Under $100",
                "$100 - $500",
                "$500 - $1000",
                "$1000 - $2000",
                "Over $2000"
              ]}
            />
          </div>
          <div className="w-full md:w-3/4 lg:w-4/5">
            <ProductGrid category="electronics" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
} 