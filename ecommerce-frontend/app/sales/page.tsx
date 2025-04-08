import { ProductGrid } from "@/features/products/product-grid"
import { ProductFilters } from "@/features/products/product-filters"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { BadgePercent, Clock, CalendarClock } from "lucide-react"

export default function SalesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Sales", href: "/sales", active: true },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 mb-8 rounded-lg">
          <BadgePercent className="h-12 w-12 text-red-500 mb-2" />
          <h1 className="text-4xl font-bold tracking-tight mb-2">Special Offers & Deals</h1>
          <p className="text-muted-foreground max-w-2xl text-center">
            Shop our current sales and limited-time offers on a wide range of products.
          </p>
        </div>
        
        <Tabs defaultValue="current" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Sales</TabsTrigger>
            <TabsTrigger value="flash">Flash Deals</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Sales</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
              <Card className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                  <h3 className="text-2xl font-bold">Summer Clearance</h3>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2 text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Ends in 7 days</span>
                  </div>
                  <p className="font-medium">Up to 50% off seasonal items</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center bg-gradient-to-r from-green-500/20 to-teal-500/20">
                  <h3 className="text-2xl font-bold">Back to School</h3>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2 text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Ends in 14 days</span>
                  </div>
                  <p className="font-medium">Save on electronics and supplies</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center bg-gradient-to-r from-yellow-500/20 to-red-500/20">
                  <h3 className="text-2xl font-bold">Weekend Special</h3>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2 text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Ends in 2 days</span>
                  </div>
                  <p className="font-medium">Extra 15% off with code WEEKEND15</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="flash">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
              <Card className="overflow-hidden border-red-200">
                <div className="h-32 bg-red-500/10 flex items-center justify-center">
                  <h3 className="text-xl font-bold">Flash Deal</h3>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2 text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Ends in 4 hours</span>
                  </div>
                  <p className="font-medium">Wireless Earbuds</p>
                  <p className="text-red-500 font-bold">70% OFF</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-red-200">
                <div className="h-32 bg-red-500/10 flex items-center justify-center">
                  <h3 className="text-xl font-bold">Flash Deal</h3>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2 text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Ends in 2 hours</span>
                  </div>
                  <p className="font-medium">Smart Watch</p>
                  <p className="text-red-500 font-bold">50% OFF</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-red-200">
                <div className="h-32 bg-red-500/10 flex items-center justify-center">
                  <h3 className="text-xl font-bold">Flash Deal</h3>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2 text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Ends in 6 hours</span>
                  </div>
                  <p className="font-medium">Bluetooth Speaker</p>
                  <p className="text-red-500 font-bold">60% OFF</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-red-200">
                <div className="h-32 bg-red-500/10 flex items-center justify-center">
                  <h3 className="text-xl font-bold">Flash Deal</h3>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2 text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Ends in 8 hours</span>
                  </div>
                  <p className="font-medium">Power Bank</p>
                  <p className="text-red-500 font-bold">45% OFF</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
              <Card className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-indigo-500/20">
                  <h3 className="text-2xl font-bold">Black Friday</h3>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2 text-muted-foreground">
                    <CalendarClock className="h-4 w-4 mr-2" />
                    <span>Coming November 24</span>
                  </div>
                  <p className="font-medium">Our biggest sale of the year!</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center bg-gradient-to-r from-pink-500/20 to-red-500/20">
                  <h3 className="text-2xl font-bold">Holiday Special</h3>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2 text-muted-foreground">
                    <CalendarClock className="h-4 w-4 mr-2" />
                    <span>Coming December 1</span>
                  </div>
                  <p className="font-medium">Great gifts for everyone on your list</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                  <h3 className="text-2xl font-bold">New Year Sale</h3>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2 text-muted-foreground">
                    <CalendarClock className="h-4 w-4 mr-2" />
                    <span>Coming January 1</span>
                  </div>
                  <p className="font-medium">Start the year with amazing deals</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <h2 className="text-2xl font-bold tracking-tight mb-6">Featured Sale Items</h2>
        <ProductGrid onSale={true} />
      </main>
      <SiteFooter />
    </div>
  )
} 