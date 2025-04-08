import { ProductGrid } from "@/features/products/product-grid"
import { ProductFilters } from "@/features/products/product-filters"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"

export default function HomeAndGardenPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: "Home & Garden", href: "/categories/home", active: true },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-6 bg-muted/50 mb-8 rounded-lg">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Home & Garden</h1>
          <p className="text-muted-foreground max-w-2xl text-center">
            Transform your living space with our collection of furniture, decor, garden tools, and more.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          <div className="w-full md:w-1/4 lg:w-1/5">
            <ProductFilters
              categories={[
                "Furniture", 
                "Kitchen", 
                "Bedding", 
                "Bathroom", 
                "Decor", 
                "Garden Tools", 
                "Outdoor Furniture", 
                "Lighting",
                "Storage"
              ]}
              brands={[
                "IKEA", 
                "West Elm", 
                "Crate & Barrel", 
                "Pottery Barn", 
                "Wayfair", 
                "Ashley Furniture",
                "Home Depot"
              ]}
              priceRanges={[
                "Under $50",
                "$50 - $200",
                "$200 - $500",
                "$500 - $1000",
                "Over $1000"
              ]}
              roomTypes={[
                "Living Room",
                "Bedroom",
                "Kitchen",
                "Bathroom",
                "Office",
                "Outdoor",
                "Dining Room"
              ]}
              materials={[
                "Wood", 
                "Metal", 
                "Glass", 
                "Plastic", 
                "Fabric", 
                "Ceramic", 
                "Leather"
              ]}
            />
          </div>
          <div className="w-full md:w-3/4 lg:w-4/5">
            <ProductGrid category="home" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
} 