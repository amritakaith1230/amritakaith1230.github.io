"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, X, Clock, CheckCircle, XCircle, Package, Trash2 } from "lucide-react"
import { useOrders } from "@/lib/order-context"

interface OrderHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OrderHistoryModal({ isOpen, onClose }: OrderHistoryModalProps) {
  const { orders, clearOrders } = useOrders()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Order History</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {orders.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearOrders}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>View all your past orders and bookings</CardDescription>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[70vh]">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="catering">Food</TabsTrigger>
              <TabsTrigger value="stationery">Gifts</TabsTrigger>
              <TabsTrigger value="beauty">Beauty</TabsTrigger>
              <TabsTrigger value="fitness">Fitness</TabsTrigger>
              <TabsTrigger value="party">Party</TabsTrigger>
              <TabsTrigger value="dining">Dining</TabsTrigger>
              <TabsTrigger value="movie">Movies</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders yet</p>
                  <p className="text-sm">Your order history will appear here</p>
                </div>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <CardTitle className="text-lg">{order.name}</CardTitle>
                            <CardDescription>
                              {new Date(order.date).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge>
                          <p className="text-lg font-bold text-green-600 mt-1">₹{order.amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Order ID: {order.id}</span>
                        {order.transactionId && <span>Transaction: {order.transactionId}</span>}
                        <Badge variant="outline" className="capitalize">
                          {order.type}
                        </Badge>
                      </div>
                      {order.details && (
                        <div className="mt-2 text-sm text-gray-600">
                          {Object.entries(order.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {["catering", "stationery", "beauty", "fitness", "party", "dining", "movie"].map((type) => (
              <TabsContent key={type} value={type} className="space-y-4 mt-4">
                {orders.filter((order) => order.type === type).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No {type} orders yet</p>
                  </div>
                ) : (
                  orders
                    .filter((order) => order.type === type)
                    .map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(order.status)}
                              <div>
                                <CardTitle className="text-lg">{order.name}</CardTitle>
                                <CardDescription>
                                  {new Date(order.date).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge>
                              <p className="text-lg font-bold text-green-600 mt-1">₹{order.amount.toFixed(2)}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Order ID: {order.id}</span>
                            {order.transactionId && <span>Transaction: {order.transactionId}</span>}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
