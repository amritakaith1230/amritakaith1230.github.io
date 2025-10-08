"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ship, Home, LogOut, Menu, X, Bell, History } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import NotificationsModal from "@/components/notifications-modal"
import OrderHistoryModal from "@/components/order-history-modal"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const { user, logout } = useAuth()
  const { orders } = useOrders()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const getNavigationItems = () => {
    const baseItems = [{ name: "Dashboard", href: `/dashboard/${user?.role}`, icon: Home }]

    switch (user?.role) {
      case "voyager":
        return [
          ...baseItems,
          // Voyager only has dashboard - all services in main dashboard
        ]
      case "admin":
        return [
          ...baseItems,
          // Admin only has dashboard - all management in main dashboard
        ]
      case "manager":
        return [
          ...baseItems,
          // Manager only has dashboard - all services managed in main dashboard
        ]
      case "head-cook":
        return [
          ...baseItems,
          // Head cook only has dashboard - all orders in main dashboard
        ]
      case "supervisor":
        return [
          ...baseItems,
          // Supervisor only has dashboard - all orders in main dashboard
        ]
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()
  const unreadNotifications = orders.filter((order) => order.status === "pending").length

  // Show notification and history buttons only for voyager role
  const showNotificationButtons = user?.role === "voyager"

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? "lg:hidden" : "hidden lg:flex"} flex-col w-64 bg-white border-r border-gray-200`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Ship className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">CruiseShip</span>
        </div>
        {mobile && (
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <IconComponent className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Notification and History Buttons - Only for voyager */}
      {showNotificationButtons && (
        <div className="px-4 py-2 border-t border-gray-200">
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start relative"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setShowOrderHistory(true)}
            >
              <History className="h-4 w-4 mr-2" />
              Order History
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{user?.firstName?.[0] || "U"}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Ship className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">CruiseShip</span>
            </div>
            {/* Show notification buttons only for voyager in mobile */}
            {showNotificationButtons && (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setShowNotifications(true)} className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowOrderHistory(true)}>
                  <History className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!showNotificationButtons && <div className="w-8" />}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      {/* Modals - Only for voyager */}
      {showNotificationButtons && (
        <>
          <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
          <OrderHistoryModal isOpen={showOrderHistory} onClose={() => setShowOrderHistory(false)} />
        </>
      )}
    </div>
  )
}
