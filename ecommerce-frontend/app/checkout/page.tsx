import { CheckoutForm } from "@/features/checkout/checkout-form"
import { CheckoutSummary } from "@/features/checkout/checkout-summary"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout", href: "/checkout", active: true },
          ]}
        />
        <h1 className="text-3xl font-bold mt-6 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>
          <div>
            <CheckoutSummary />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

