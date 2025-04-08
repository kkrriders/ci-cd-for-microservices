import { ProductGallery } from "@/features/products/product-gallery"
import { ProductInfo } from "@/features/products/product-info"
import { RelatedProducts } from "@/features/products/related-products"
import { ProductReviews } from "@/features/products/product-reviews"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { getProduct } from "@/lib/api/products"

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.name, href: `/products/${product.id}`, active: true },
          ]}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <ProductGallery images={product.images} />
          <ProductInfo product={product} />
        </div>
        <div className="mt-16">
          <RelatedProducts productId={product.id} />
        </div>
        <div className="mt-16">
          <ProductReviews productId={product.id} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

