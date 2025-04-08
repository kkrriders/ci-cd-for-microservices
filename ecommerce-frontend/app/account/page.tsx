import { AccountDashboard } from "@/features/account/account-dashboard"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"

export default function AccountPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account", active: true },
          ]}
        />
        <h1 className="text-3xl font-bold mt-6 mb-8">Your Account</h1>
        <AccountDashboard />
      </main>
      <SiteFooter />
    </div>
  )
}

