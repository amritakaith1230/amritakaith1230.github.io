"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChefHat, Clock, CheckCircle, AlertCircle } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"

export default function HeadCookDashboard() {
  const { user } = useAuth()
  const [cateringOrders, setCateringOrders] = useState<any[]>([])

  useEffect(() => {
    // Get only catering orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("cruise-orders") || "[]")
    const cateringOnly = storedOrders
      .filter((order: any) => order.type === "catering" || order.orderType === "catering")
      .map((order: any) => ({
        ...order,
        customer: order.customerName || "Unknown Customer",
        items: order.items || "Food Items",
        status: order.status || "pending",
        time: order.estimatedTime || "20 mins",
        priority: order.priority || "Medium",
      }))

    setCateringOrders(cateringOnly)
  }, [])

  const stats = [
    {
      title: "Active Orders",
      value: cateringOrders.filter((o) => o.status !== "delivered").length.toString(),
      icon: ChefHat,
      color: "text-blue-600",
    },
    {
      title: "Preparing",
      value: cateringOrders.filter((o) => o.status === "preparing").length.toString(),
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Ready to Serve",
      value: cateringOrders.filter((o) => o.status === "ready").length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending",
      value: cateringOrders.filter((o) => o.status === "pending").length.toString(),
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // Update in localStorage
    const storedOrders = JSON.parse(localStorage.getItem("cruise-orders") || "[]")
    const updatedOrders = storedOrders.map((order: any) =>
      order.id === orderId ? { ...order, status: newStatus } : order,
    )
    localStorage.setItem("cruise-orders", JSON.stringify(updatedOrders))

    // Update local state
    setCateringOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Head Cook Dashboard</h1>
          <p className="text-orange-100">Welcome back, Chef {user?.firstName || "Cook"}! Manage kitchen operations.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Orders Management */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="preparing">Preparing</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Kitchen Orders</CardTitle>
                <CardDescription>Manage all incoming catering orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cateringOrders.filter((o) => o.status !== "delivered").length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No active catering orders. When voyagers order food, it will appear here.
                    </p>
                  ) : (
                    cateringOrders
                      .filter((o) => o.status !== "delivered")
                      .map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">{order.customer}</p>
                            <p className="text-sm text-gray-600">{order.items}</p>
                            <p className="text-xs text-gray-500">ETA: {order.time}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                order.priority === "High"
                                  ? "destructive"
                                  : order.priority === "Medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {order.priority}
                            </Badge>
                            <Badge
                              variant={
                                order.status === "ready"
                                  ? "default"
                                  : order.status === "preparing"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const nextStatus =
                                  order.status === "pending"
                                    ? "preparing"
                                    : order.status === "preparing"
                                      ? "ready"
                                      : "delivered"
                                updateOrderStatus(order.id, nextStatus)
                              }}
                            >
                              {order.status === "pending"
                                ? "Start Cooking"
                                : order.status === "preparing"
                                  ? "Mark Ready"
                                  : "Deliver"}
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preparing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Orders Being Prepared</CardTitle>
                <CardDescription>Currently cooking orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cateringOrders
                    .filter((o) => o.status === "preparing")
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.items}</p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateOrderStatus(order.id, "ready")}
                        >
                          Mark Ready
                        </Button>
                      </div>
                    ))}
                  {cateringOrders.filter((o) => o.status === "preparing").length === 0 && (
                    <p className="text-center text-gray-500 py-8">No orders being prepared</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ready" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ready to Serve</CardTitle>
                <CardDescription>Orders ready for delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cateringOrders
                    .filter((o) => o.status === "ready")
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.items}</p>
                        </div>
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, "delivered")}>
                          Mark Delivered
                        </Button>
                      </div>
                    ))}
                  {cateringOrders.filter((o) => o.status === "ready").length === 0 && (
                    <p className="text-center text-gray-500 py-8">No orders ready</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Orders</CardTitle>
                <CardDescription>Successfully delivered orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cateringOrders
                    .filter((o) => o.status === "delivered")
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.items}</p>
                        </div>
                        <Badge variant="outline">Delivered</Badge>
                      </div>
                    ))}
                  {cateringOrders.filter((o) => o.status === "delivered").length === 0 && (
                    <p className="text-center text-gray-500 py-8">No completed orders</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
