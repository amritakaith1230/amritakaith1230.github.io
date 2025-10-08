"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Clock, CheckCircle, AlertCircle, Info } from "lucide-react"
import { useOrders } from "@/lib/order-context"
import { useState, useEffect } from "react"

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const { orders } = useOrders()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Generate notifications from recent orders
    const recentNotifications: Notification[] = orders.slice(0, 10).map((order) => ({
      id: `notif-${order.id}`,
      title: getNotificationTitle(order.type, order.status),
      message: `${order.name} - ₹${order.amount.toFixed(2)}`,
      type: getNotificationType(order.status),
      timestamp: order.date,
      read: false,
    }))

    // Add some system notifications
    const systemNotifications: Notification[] = [
      {
        id: "welcome",
        title: "Welcome to Cruise Ship Services!",
        message: "Explore our premium services and enjoy your journey",
        type: "info",
        timestamp: new Date().toISOString(),
        read: false,
      },
    ]

    setNotifications([...recentNotifications, ...systemNotifications])
  }, [orders])

  const getNotificationTitle = (type: string, status: string) => {
    const typeNames = {
      catering: "Food Order",
      stationery: "Gift Order",
      beauty: "Beauty Appointment",
      fitness: "Fitness Booking",
      party: "Party Booking",
      dining: "Dining Reservation",
      movie: "Movie Ticket",
    }

    const statusText = {
      pending: "Received",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
    }

    return `${typeNames[type as keyof typeof typeNames] || type} ${statusText[status as keyof typeof statusText] || status}`
  }

  const getNotificationType = (status: string): "info" | "success" | "warning" | "error" => {
    switch (status) {
      case "completed":
        return "success"
      case "cancelled":
        return "error"
      case "confirmed":
        return "info"
      default:
        return "warning"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {notifications.some((n) => !n.read) && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>Stay updated with your bookings and services</CardDescription>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[70vh]">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`border-l-4 ${
                    notification.read ? "bg-gray-50 border-l-gray-300" : "bg-white border-l-blue-500"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${notification.read ? "text-gray-600" : "text-gray-900"}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${notification.read ? "text-gray-500" : "text-gray-700"}`}>
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

