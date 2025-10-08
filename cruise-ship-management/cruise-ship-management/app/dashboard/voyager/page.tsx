"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Utensils,
  Package,
  Calendar,
  Scissors,
  Dumbbell,
  PartyPopper,
  ShoppingCart,
  Clock,
  MapPin,
  Headphones,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"

export default function VoyagerDashboard() {
  const { user } = useAuth()
  const { orders } = useOrders()
  const router = useRouter()

  const activeOrders = orders.filter((order: any) => order.status === "pending" || order.status === "confirmed")

  const [upcomingBookings] = useState([
    { id: 1, type: "Movie", title: "Dangal", time: "8:00 PM", location: "Theater A" },
    { id: 2, type: "Fitness", title: "Yoga Session", time: "6:00 AM", location: "Deck 5" },
  ])

  const services = [
    {
      title: "Catering Services",
      description: "Order meals, snacks, and beverages",
      icon: Utensils,
      color: "text-blue-600",
      href: "/services/catering",
    },
    {
      title: "Stationery & Gifts",
      description: "Order gifts, chocolates, and books",
      icon: Package,
      color: "text-green-600",
      href: "/services/stationery",
    },
    {
      title: "Movie Tickets",
      description: "Book movie tickets",
      icon: Calendar,
      color: "text-purple-600",
      href: "/services/movies",
    },
    {
      title: "Beauty Salon",
      description: "Schedule beauty appointments",
      icon: Scissors,
      color: "text-pink-600",
      href: "/services/beauty",
    },
    {
      title: "Fitness Center",
      description: "Book gym equipment and sessions",
      icon: Dumbbell,
      color: "text-red-600",
      href: "/services/fitness",
    },
    {
      title: "Party Hall",
      description: "Reserve halls for celebrations",
      icon: PartyPopper,
      color: "text-yellow-600",
      href: "/services/party",
    },
    {
      title: "Resort Dining",
      description: "Reserve tables and order food",
      icon: MapPin,
      color: "text-orange-600",
      href: "/services/dining",
    },
    {
      title: "24/7 Support",
      description: "Get help and assistance anytime",
      icon: Headphones,
      color: "text-indigo-600",
      href: "/services/support",
    },
  ]

  const handleServiceAccess = (href: string) => {
    router.push(href)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Welcome aboard, {user?.firstName || "Voyager"}!</h1>
          <p className="text-blue-100">
            {user?.cabinNumber ? `Cabin ${user.cabinNumber}` : "Guest"} • Deck 5 • Oceanview Suite
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold">{activeOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Bookings Today</p>
                  <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Next Activity</p>
                  <p className="text-lg font-semibold">6:00 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Current Location</p>
                  <p className="text-lg font-semibold">Arabian Sea</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`h-8 w-8 ${service.color}`} />
                      <div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <CardDescription className="text-sm">{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => handleServiceAccess(service.href)}>
                      Access Service
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="bookings">Upcoming Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Orders</CardTitle>
                <CardDescription>Track your current orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeOrders.length > 0 ? (
                    activeOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{order.name}</p>
                          <p className="text-sm text-gray-600">{order.type}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
                          <p className="text-sm text-gray-600 mt-1">₹{order.amount}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No active orders</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Your scheduled activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{booking.title}</p>
                        <p className="text-sm text-gray-600">{booking.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{booking.time}</p>
                        <p className="text-sm text-gray-600">{booking.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
