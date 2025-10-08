"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  Eye,
  Film,
  Scissors,
  Dumbbell,
  PartyPopper,
  UtensilsCrossed,
  Utensils,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"

interface BookingItem {
  id: string
  type: string
  customer: string
  venue: string
  time: string
  status: string
  total?: number
  amount?: number
  items?: string
  createdAt: string | Date
  customerName?: string
  serviceName?: string
  serviceType?: string
  userId?: string
  userName?: string
}

export default function ManagerDashboard() {
  const { user } = useAuth()
  const { orders } = useOrders()
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)

  // Get all orders from localStorage (real user orders)
  const [allBookings, setAllBookings] = useState<BookingItem[]>([])

  // Get current logged in user's name for orders
  const getCurrentUserName = () => {
    const currentUser = JSON.parse(localStorage.getItem("cruise-current-user") || "{}")
    return currentUser.firstName || currentUser.name || "Unknown User"
  }

  useEffect(() => {
    // Get orders from order context and localStorage
    const storedOrders = JSON.parse(localStorage.getItem("cruise-orders") || "[]")
    const storedBookings = JSON.parse(localStorage.getItem("cruise-bookings") || "[]")
    const currentUserName = getCurrentUserName()

    // Combine all bookings and orders
    const combined: BookingItem[] = [
      ...orders.map((order: any) => ({
        ...order,
        type: order.type || "Order",
        customer: order.customerName || order.userName || currentUserName,
        venue: order.items || "Multiple Items",
        time: new Date(order.createdAt).toLocaleString(),
        status: order.status || "pending",
      })),
      ...storedOrders.map((order: any) => ({
        ...order,
        type: order.type || "Order",
        customer: order.customerName || order.userName || currentUserName,
        venue: order.items || "Multiple Items",
        time: new Date(order.createdAt).toLocaleString(),
        status: order.status || "pending",
      })),
      ...storedBookings.map((booking: any) => ({
        ...booking,
        type: booking.serviceType || booking.type || "Booking",
        customer: booking.customerName || booking.userName || currentUserName,
        venue: booking.venue || booking.serviceName || "Service",
        time: new Date(booking.createdAt).toLocaleString(),
        status: booking.status || "pending",
      })),
    ]

    setAllBookings(combined)
  }, [orders])

  const stats = [
    {
      title: "Today's Bookings",
      value: allBookings
        .filter((b) => {
          const today = new Date().toDateString()
          const bookingDate = new Date(b.createdAt).toDateString()
          return bookingDate === today
        })
        .length.toString(),
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Pending Approvals",
      value: allBookings.filter((b) => b.status === "pending").length.toString(),
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Completed",
      value: allBookings
        .filter((b) => b.status === "completed" || b.status === "delivered" || b.status === "finished")
        .length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Total Bookings",
      value: allBookings.length.toString(),
      icon: Users,
      color: "text-purple-600",
    },
  ]

  const handleApprove = (booking: BookingItem) => {
    // Update status in localStorage
    const storedOrders = JSON.parse(localStorage.getItem("cruise-orders") || "[]")
    const storedBookings = JSON.parse(localStorage.getItem("cruise-bookings") || "[]")

    // Update in orders
    const updatedOrders = storedOrders.map((order: any) =>
      order.id === booking.id ? { ...order, status: "confirmed" } : order,
    )

    // Update in bookings
    const updatedBookings = storedBookings.map((b: any) => (b.id === booking.id ? { ...b, status: "confirmed" } : b))

    localStorage.setItem("cruise-orders", JSON.stringify(updatedOrders))
    localStorage.setItem("cruise-bookings", JSON.stringify(updatedBookings))

    // Update local state
    setAllBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: "confirmed" } : b)))
  }

  const handleReject = (booking: BookingItem) => {
    // Update status in localStorage
    const storedOrders = JSON.parse(localStorage.getItem("cruise-orders") || "[]")
    const storedBookings = JSON.parse(localStorage.getItem("cruise-bookings") || "[]")

    // Update in orders
    const updatedOrders = storedOrders.map((order: any) =>
      order.id === booking.id ? { ...order, status: "cancelled" } : order,
    )

    // Update in bookings
    const updatedBookings = storedBookings.map((b: any) => (b.id === booking.id ? { ...b, status: "cancelled" } : b))

    localStorage.setItem("cruise-orders", JSON.stringify(updatedOrders))
    localStorage.setItem("cruise-bookings", JSON.stringify(updatedBookings))

    // Update local state
    setAllBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: "cancelled" } : b)))
  }

  const handleComplete = (booking: BookingItem) => {
    // Mark as completed
    const storedOrders = JSON.parse(localStorage.getItem("cruise-orders") || "[]")
    const storedBookings = JSON.parse(localStorage.getItem("cruise-bookings") || "[]")

    // Update in orders
    const updatedOrders = storedOrders.map((order: any) =>
      order.id === booking.id ? { ...order, status: "completed" } : order,
    )

    // Update in bookings
    const updatedBookings = storedBookings.map((b: any) => (b.id === booking.id ? { ...b, status: "completed" } : b))

    localStorage.setItem("cruise-orders", JSON.stringify(updatedOrders))
    localStorage.setItem("cruise-bookings", JSON.stringify(updatedBookings))

    // Update local state
    setAllBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: "completed" } : b)))
  }

  // Filter bookings by service type
  const getBookingsByType = (serviceType: string) => {
    return allBookings.filter((booking) => {
      const type = booking.type.toLowerCase()
      const serviceTypeLower = serviceType.toLowerCase()
      return type.includes(serviceTypeLower) || booking.serviceType?.toLowerCase().includes(serviceTypeLower)
    })
  }

  const renderBookingsList = (bookings: BookingItem[], emptyMessage: string) => (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 py-8">{emptyMessage}</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-semibold">{booking.customer}</p>
              <p className="text-sm text-gray-600">
                {booking.type} • {booking.venue} • {booking.time}
              </p>
              <p className="text-xs text-gray-500">Total: ₹{booking.total || booking.amount || 0}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  booking.status === "confirmed"
                    ? "default"
                    : booking.status === "pending"
                      ? "secondary"
                      : booking.status === "completed" ||
                          booking.status === "delivered" ||
                          booking.status === "finished"
                        ? "outline"
                        : "destructive"
                }
              >
                {booking.status}
              </Badge>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                    <DialogDescription>Complete information about this booking</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <p>
                        <strong>Customer:</strong> {booking.customer}
                      </p>
                      <p>
                        <strong>Service:</strong> {booking.type}
                      </p>
                      <p>
                        <strong>Status:</strong> {booking.status}
                      </p>
                      <p>
                        <strong>Date:</strong> {booking.time}
                      </p>
                      <p>
                        <strong>Total:</strong> ₹{booking.total || booking.amount || 0}
                      </p>
                    </div>
                    {booking.items && (
                      <div>
                        <p>
                          <strong>Items:</strong> {booking.items}
                        </p>
                      </div>
                    )}
                    {booking.venue && (
                      <div>
                        <p>
                          <strong>Venue:</strong> {booking.venue}
                        </p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {booking.status === "pending" && (
                <>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(booking)}>
                    Approve
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleReject(booking)}>
                    Reject
                  </Button>
                </>
              )}

              {booking.status === "confirmed" && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleComplete(booking)}>
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
          <p className="text-green-100">Welcome back, {user?.firstName || "Manager"}! Manage all service bookings.</p>
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

        {/* Bookings Management */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-10 gap-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="catering" className="flex items-center gap-1">
              <Utensils className="h-4 w-4" />
              Catering
            </TabsTrigger>
            <TabsTrigger value="movies" className="flex items-center gap-1">
              <Film className="h-4 w-4" />
              Movies
            </TabsTrigger>
            <TabsTrigger value="beauty" className="flex items-center gap-1">
              <Scissors className="h-4 w-4" />
              Beauty
            </TabsTrigger>
            <TabsTrigger value="fitness" className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              Fitness
            </TabsTrigger>
            <TabsTrigger value="party" className="flex items-center gap-1">
              <PartyPopper className="h-4 w-4" />
              Party
            </TabsTrigger>
            <TabsTrigger value="dining" className="flex items-center gap-1">
              <UtensilsCrossed className="h-4 w-4" />
              Dining
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Service Bookings</CardTitle>
                <CardDescription>Manage all customer bookings across services</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBookingsList(allBookings, "No bookings yet. When voyagers place orders, they will appear here.")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Bookings waiting for approval</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBookingsList(
                  allBookings.filter((b) => b.status === "pending"),
                  "No pending approvals",
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Confirmed Bookings</CardTitle>
                <CardDescription>Approved and confirmed bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBookingsList(
                  allBookings.filter((b) => b.status === "confirmed"),
                  "No confirmed bookings",
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="catering" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Catering Orders
                </CardTitle>
                <CardDescription>All food and catering service orders</CardDescription>
              </CardHeader>
              <CardContent>{renderBookingsList(getBookingsByType("catering"), "No catering orders yet")}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Movie Bookings
                </CardTitle>
                <CardDescription>All movie ticket bookings and reservations</CardDescription>
              </CardHeader>
              <CardContent>{renderBookingsList(getBookingsByType("movie"), "No movie bookings yet")}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="beauty" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Beauty Salon Bookings
                </CardTitle>
                <CardDescription>All beauty salon appointments and services</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBookingsList(getBookingsByType("beauty"), "No beauty salon bookings yet")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fitness" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Fitness Center Bookings
                </CardTitle>
                <CardDescription>All fitness center equipment and trainer bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBookingsList(getBookingsByType("fitness"), "No fitness center bookings yet")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="party" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PartyPopper className="h-5 w-5" />
                  Party Hall Bookings
                </CardTitle>
                <CardDescription>All party hall and event venue bookings</CardDescription>
              </CardHeader>
              <CardContent>{renderBookingsList(getBookingsByType("party"), "No party hall bookings yet")}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dining" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  Resort Dining Bookings
                </CardTitle>
                <CardDescription>All restaurant table reservations and dining bookings</CardDescription>
              </CardHeader>
              <CardContent>{renderBookingsList(getBookingsByType("dining"), "No dining reservations yet")}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Bookings</CardTitle>
                <CardDescription>Successfully completed bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBookingsList(
                  allBookings.filter(
                    (b) => b.status === "completed" || b.status === "delivered" || b.status === "finished",
                  ),
                  "No completed bookings yet. Orders will appear here after completion.",
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
