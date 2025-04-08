"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { useCart } from "./use-cart"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export function CartItems() {
  const { items, updateItemQuantity, removeItem } = useCart()
  const { toast } = useToast()

  const handleRemoveItem = (itemId: string, itemName: string, options?: Record<string, string>) => {
    removeItem(itemId, options)
    toast({
      title: "Item removed",
      description: `${itemName} has been removed from your cart.`,
    })
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const itemKey = `${item.id}-${JSON.stringify(item.selectedOptions)}`
        const discountedPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price

        return (
          <div key={itemKey} className="flex flex-col sm:flex-row border rounded-lg overflow-hidden">
            <div className="w-full sm:w-1/4 aspect-square">
              <Link href={`/products/${item.id}`}>
                <img
                  src={item.images[0] || "/placeholder.svg?height=200&width=200"}
                  alt={item.name}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </Link>
            </div>
            <div className="p-4 flex flex-col justify-between w-full sm:w-3/4">
              <div>
                <div className="flex justify-between">
                  <Link href={`/products/${item.id}`} className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id, item.name, item.selectedOptions)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.category}</p>

                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                  <div className="mt-2 text-sm">
                    {Object.entries(item.selectedOptions).map(([key, value]) => (
                      <p key={key}>
                        <span className="font-medium capitalize">{key}:</span> {value}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      item.quantity > 1 && updateItemQuantity(item.id, item.quantity - 1, item.selectedOptions)
                    }
                    aria-label="Decrease quantity"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value)
                      if (value > 0) {
                        updateItemQuantity(item.id, value, item.selectedOptions)
                      }
                    }}
                    className="w-14 h-8 text-center"
                    aria-label="Quantity"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1, item.selectedOptions)}
                    aria-label="Increase quantity"
                  >
                    +
                  </Button>
                </div>

                <div className="text-right">
                  {item.discount > 0 ? (
                    <div>
                      <span className="font-bold">{formatPrice(discountedPrice * item.quantity)}</span>
                      <p className="text-sm text-muted-foreground">
                        <span className="line-through">{formatPrice(item.price * item.quantity)}</span> ({item.discount}
                        % off)
                      </p>
                    </div>
                  ) : (
                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

