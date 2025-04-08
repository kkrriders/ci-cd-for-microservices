import { Hero } from "@/components/hero"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoryNavigation } from "@/components/category-navigation"
import { PersonalizedRecommendations } from "@/components/personalized-recommendations"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CategoryNavigation />
        <FeaturedProducts />
        <PersonalizedRecommendations />
        <NewsletterSignup />
      </main>
      <SiteFooter />
    </div>
  )
}

