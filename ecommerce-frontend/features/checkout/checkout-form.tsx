"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CreditCard, Truck, Building } from "lucide-react"

export function CheckoutForm() {
  const [step, setStep] = useState<"shipping" | "payment">("shipping")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [sameAsShipping, setSameAsShipping] = useState(true)

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault()
    // Process payment and submit order
    console.log("Order submitted")
  }

  return (
    <div className="space-y-8">
      <Accordion
        type="single"
        defaultValue="shipping"
        value={step}
        onValueChange={(value) => setStep(value as "shipping" | "payment")}
        className="w-full"
      >
        <AccordionItem value="shipping">
          <AccordionTrigger className="text-lg font-semibold">Shipping Information</AccordionTrigger>
          <AccordionContent>
            <form onSubmit={handleSubmitShipping} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Select>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                      <SelectItem value="fl">Florida</SelectItem>
                      <SelectItem value="il">Illinois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP/Postal Code</Label>
                  <Input id="zip" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select defaultValue="us">
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Shipping Method</Label>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-2">
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4" />
                          <span>Standard Shipping (3-5 business days)</span>
                        </div>
                        <span>Free</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4" />
                          <span>Express Shipping (1-2 business days)</span>
                        </div>
                        <span>$9.99</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full">
                Continue to Payment
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payment">
          <AccordionTrigger className="text-lg font-semibold">Payment Information</AccordionTrigger>
          <AccordionContent>
            <form onSubmit={handleSubmitPayment} className="space-y-6">
              <div className="space-y-4">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Credit or Debit Card</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4" />
                        <span>PayPal</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "credit-card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiration Date</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAsShipping"
                    checked={sameAsShipping}
                    onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                  />
                  <label
                    htmlFor="sameAsShipping"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Billing address is the same as shipping address
                  </label>
                </div>

                {!sameAsShipping && (
                  <div className="space-y-4 pt-4">
                    <h3 className="font-medium">Billing Address</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingFirstName">First Name</Label>
                        <Input id="billingFirstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingLastName">Last Name</Label>
                        <Input id="billingLastName" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billingAddress">Street Address</Label>
                      <Input id="billingAddress" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingCity">City</Label>
                        <Input id="billingCity" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingState">State/Province</Label>
                        <Select>
                          <SelectTrigger id="billingState">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ca">California</SelectItem>
                            <SelectItem value="ny">New York</SelectItem>
                            <SelectItem value="tx">Texas</SelectItem>
                            <SelectItem value="fl">Florida</SelectItem>
                            <SelectItem value="il">Illinois</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingZip">ZIP/Postal Code</Label>
                        <Input id="billingZip" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billingCountry">Country</Label>
                      <Select defaultValue="us">
                        <SelectTrigger id="billingCountry">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full">
                Place Order
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By placing your order, you agree to our{" "}
                <a href="/terms" className="underline underline-offset-2">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline underline-offset-2">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

