import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Discover Quality Products for Every Need
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Shop the latest trends with free shipping on orders over $50. Satisfaction guaranteed with our 30-day
                return policy.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/sale">View Sale</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="Hero Image"
              className="aspect-video overflow-hidden rounded-xl object-cover object-center"
              height="500"
              src="/placeholder.svg?height=500&width=800"
              width="800"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

