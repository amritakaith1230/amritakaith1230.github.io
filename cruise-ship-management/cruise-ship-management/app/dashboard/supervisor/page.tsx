"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, Clock, CheckCircle, Eye, DollarSign } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"

interface StationeryOrder {
  id: string
  name: string
  type: "catering" | "stationery" | "beauty" | "fitness" | "party" | "dining" | "movie"
  amount: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  date: string
  details: any
  transactionId?: string
  customerName?: string
  customerEmail?: string
}

export default function SupervisorDashboard() {
  const { user } = useAuth()
  const { orders } = useOrders()
  const [stationeryOrders, setStationeryOrders] = useState<StationeryOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<StationeryOrder | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  useEffect(() => {
    // Get real stationery orders from order context
    const stationeryOnly = orders
      .filter((order: any) => order.type === "stationery")
      .map((order: any) => ({
        ...order,
        customerName: getCurrentUserName() || order.details?.customerName || "Unknown Customer",
        customerEmail: getCurrentUserEmail() || order.details?.customerEmail || "unknown@email.com",
      }))

    setStationeryOrders(stationeryOnly)
  }, [orders])

  const getCurrentUserName = () => {
    if (typeof window !== "undefined") {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      return currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : null
    }
    return null
  }

  const getCurrentUserEmail = () => {
    if (typeof window !== "undefined") {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      return currentUser.email || null
    }
    return null
  }

  // Calculate real stats
  const totalRevenue = stationeryOrders.reduce((sum, order) => sum + (order.amount || 0), 0)
  const today = new Date().toDateString()
  const todayOrders = stationeryOrders.filter((order) => new Date(order.date).toDateString() === today)
  const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.amount || 0), 0)

  const stats = [
    {
      title: "Total Orders",
      value: stationeryOrders.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Orders",
      value: stationeryOrders.filter((o) => o.status !== "completed" && o.status !== "cancelled").length.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completed Today",
      value: todayOrders.filter((o) => o.status === "completed").length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const updateOrderStatus = (orderId: string, newStatus: "pending" | "confirmed" | "completed" | "cancelled") => {
    // Update in localStorage orders
    const storedOrders = JSON.parse(localStorage.getItem("cruise-orders") || "[]")
    const updatedOrders = storedOrders.map((order: any) =>
      order.id === orderId ? { ...order, status: newStatus } : order,
    )
    localStorage.setItem("cruise-orders", JSON.stringify(updatedOrders))

    // Update local state
    setStationeryOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

    // Show success message
    alert(`Order ${orderId} status updated to ${newStatus}`)
  }

  const viewOrderDetails = (order: StationeryOrder) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
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

  const getNextStatus = (currentStatus: string): "pending" | "confirmed" | "completed" | "cancelled" => {
    switch (currentStatus) {
      case "pending":
        return "confirmed"
      case "confirmed":
        return "completed"
      default:
        return "completed"
    }
  }

  const getActionText = (status: string) => {
    switch (status) {
      case "pending":
        return "Confirm Order"
      case "confirmed":
        return "Mark Completed"
      default:
        return "Complete"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Supervisor Dashboard</h1>
          <p className="text-purple-100">
            Welcome back, {user?.firstName || "Supervisor"}! Manage stationery & gift orders efficiently.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
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
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Stationery Orders</CardTitle>
                <CardDescription>Complete overview of all stationery and gift orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stationeryOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No stationery orders yet</p>
                      <p className="text-gray-400">When voyagers order gifts/stationery, they will appear here</p>
                    </div>
                  ) : (
                    stationeryOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <p className="font-semibold">{order.customerName}</p>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{order.customerEmail}</p>
                          <p className="text-sm text-gray-500">
                            1 item • ₹{order.amount.toLocaleString()} • {order.type}
                          </p>
                          <p className="text-xs text-gray-400">
                            Order ID: {order.id} • {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => viewOrderDetails(order)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {order.status !== "completed" && order.status !== "cancelled" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {getActionText(order.status)}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs with filtered content */}
          {["pending", "confirmed", "completed", "cancelled"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{status} Orders</CardTitle>
                  <CardDescription>Orders with {status} status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stationeryOrders
                      .filter((o) => o.status === status)
                      .map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold">{order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.customerEmail}</p>
                            <p className="text-sm text-gray-500">
                              {order.name} • ₹{order.amount.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => viewOrderDetails(order)}>
                              View Details
                            </Button>
                            {status !== "completed" && status !== "cancelled" && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                              >
                                {getActionText(order.status)}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    {stationeryOrders.filter((o) => o.status === status).length === 0 && (
                      <p className="text-center text-gray-500 py-8">No {status} orders</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Order Details Modal */}
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>Complete information about the order</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Customer</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customerName}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Order Info</p>
                    <p className="text-sm text-gray-600">ID: {selectedOrder.id}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(selectedOrder.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-2">Order Details</p>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>{selectedOrder.name}</span>
                      <span>₹{selectedOrder.amount.toLocaleString()}</span>
                    </div>
                    {selectedOrder.details && (
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Details:</strong> {JSON.stringify(selectedOrder.details, null, 2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="font-semibold">Transaction ID: {selectedOrder.transactionId || "N/A"}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(selectedOrder.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">Total: ₹{selectedOrder.amount.toLocaleString()}</p>
                    <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
