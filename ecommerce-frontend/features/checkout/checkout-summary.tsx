"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/features/cart/use-cart"
import Link from "next/link"

export function CheckoutSummary() {
  const { items, subtotal } = useCart()

  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax

  return (
    <div className="border rounded-lg p-6 space-y-4 sticky top-20">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.id}-${JSON.stringify(item.selectedOptions)}`} className="flex gap-4">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={item.images[0] || "/placeholder.svg?height=64&width=64"}
                alt={item.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {Object.entries(item.selectedOptions)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")}
                </p>
              )}
              <div className="flex justify-between mt-1">
                <p className="text-sm">Qty: {item.quantity}</p>
                <p className="text-sm font-medium">
                  $
                  {((item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price) * item.quantity).toFixed(
                    2,
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="pt-4">
        <Button asChild variant="outline" className="w-full">
          <Link href="/cart">Edit Cart</Link>
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        All orders are processed securely and are eligible for our 30-day return policy.
      </p>
    </div>
  )
}

