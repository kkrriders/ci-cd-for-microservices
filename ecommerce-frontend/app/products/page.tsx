import { ProductGrid } from "@/features/products/product-grid"
import { ProductFilters } from "@/features/products/product-filters"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products", active: true },
          ]}
        />
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          <div className="w-full md:w-1/4">
            <ProductFilters />
          </div>
          <div className="w-full md:w-3/4">
            <ProductGrid />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

