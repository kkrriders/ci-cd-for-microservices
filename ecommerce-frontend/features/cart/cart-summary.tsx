"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "./use-cart"
import { useState } from "react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CartSummary() {
  const { subtotal, itemCount } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [promoError, setPromoError] = useState("")
  const [promoSuccess, setPromoSuccess] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const { toast } = useToast()

  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax - discount

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code")
      return
    }

    setIsApplying(true)
    setPromoError("")
    setPromoSuccess("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Example promo code logic
      if (promoCode.toUpperCase() === "DISCOUNT20") {
        const discountAmount = subtotal * 0.2
        setDiscount(discountAmount)
        setPromoSuccess("Promo code applied successfully!")
        toast({
          title: "Promo code applied",
          description: `You saved ${formatPrice(discountAmount)}!`,
        })
      } else {
        setPromoError("Invalid promo code")
        setDiscount(0)
      }
    } catch (error) {
      setPromoError("Failed to apply promo code. Please try again.")
    } finally {
      setIsApplying(false)
    }
  }

  if (itemCount === 0) {
    return null
  }

  return (
    <div className="border rounded-lg p-6 space-y-4 sticky top-20">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <form onSubmit={handleApplyPromo} className="pt-2">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="outline" disabled={isApplying}>
            {isApplying ? "Applying..." : "Apply"}
          </Button>
        </div>

        {promoError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{promoError}</AlertDescription>
          </Alert>
        )}

        {promoSuccess && (
          <Alert variant="success" className="mt-2 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>{promoSuccess}</AlertDescription>
          </Alert>
        )}
      </form>

      <Button className="w-full" size="lg" asChild>
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>

      <div className="text-xs text-center text-muted-foreground space-y-1">
        <p>Free shipping on orders over $50</p>
        <p>30-day easy returns</p>
        <div className="flex justify-center space-x-2 pt-2">
          <img src="/placeholder.svg?height=20&width=30&text=Visa" alt="Visa" className="h-5" />
          <img src="/placeholder.svg?height=20&width=30&text=MC" alt="Mastercard" className="h-5" />
          <img src="/placeholder.svg?height=20&width=30&text=Amex" alt="American Express" className="h-5" />
          <img src="/placeholder.svg?height=20&width=30&text=PayPal" alt="PayPal" className="h-5" />
        </div>
      </div>
    </div>
  )
}

