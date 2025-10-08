"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import PaymentModal from "./payment-modal"
import type { PaymentDetails, PaymentResult } from "@/lib/payment"

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart()
  const { user } = useAuth()
  const { addOrder } = useOrders()
  const [showPayment, setShowPayment] = useState(false)

  const handleCheckout = () => {
    if (!user) {
      alert("Please login to proceed with checkout")
      return
    }
    if (items.length === 0) {
      alert("Your cart is empty")
      return
    }
    setShowPayment(true)
  }

  const handlePaymentSuccess = (result: PaymentResult) => {
    // Add order to order history
    const orderType = items[0]?.category === "stationery" ? "stationery" : "catering"
    const orderName =
      items.length === 1
        ? items[0].name
        : `${items.length} items from ${orderType === "stationery" ? "Stationery & Gifts" : "Catering"}`

    addOrder({
      name: orderName,
      type: orderType,
      amount: getTotalPrice(),
      status: "confirmed",
      details: {
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        paymentMethod: result.paymentMethod,
        deliveryLocation: user?.cabinNumber || "Cabin",
      },
      transactionId: result.transactionId,
    })

    alert(`Payment successful! Order placed successfully. Transaction ID: ${result.transactionId}`)
    clearCart()
    setShowPayment(false)
    onClose()
  }

  const paymentDetails: PaymentDetails = {
    amount: getTotalPrice(),
    currency: "INR",
    orderId: `ORD${Date.now()}`,
    customerInfo: {
      name: user ? `${user.firstName} ${user.lastName}` : "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      cabinNumber: user?.cabinNumber,
    },
    items: items.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Shopping Cart</span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Review your items before checkout</CardDescription>
          </CardHeader>

          <CardContent className="overflow-y-auto max-h-[60vh]">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold">{item.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      <p className="text-lg font-bold text-green-600">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium text-lg w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total: ₹{getTotalPrice().toFixed(2)}</span>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={clearCart}>
                        Clear Cart
                      </Button>
                      <Button onClick={handleCheckout}>Proceed to Checkout</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        paymentDetails={paymentDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  )
}
