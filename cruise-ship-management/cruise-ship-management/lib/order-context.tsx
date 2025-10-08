"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface OrderItem {
  id: string
  name: string
  type: "catering" | "stationery" | "beauty" | "fitness" | "party" | "dining" | "movie"
  amount: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  date: string
  details: any
  transactionId?: string
}

interface OrderContextType {
  orders: OrderItem[]
  addOrder: (order: Omit<OrderItem, "id" | "date">) => void
  updateOrderStatus: (orderId: string, status: OrderItem["status"]) => void
  getOrdersByType: (type: OrderItem["type"]) => OrderItem[]
  clearOrders: () => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<OrderItem[]>([])

  useEffect(() => {
    const savedOrders = localStorage.getItem("cruise-orders")
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (error) {
        console.error("Error loading orders:", error)
        setOrders([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cruise-orders", JSON.stringify(orders))
  }, [orders])

  const addOrder = (order: Omit<OrderItem, "id" | "date">) => {
    const newOrder: OrderItem = {
      ...order,
      id: `ORD${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
    }
    setOrders((prev) => [newOrder, ...prev])
  }

  const updateOrderStatus = (orderId: string, status: OrderItem["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  const getOrdersByType = (type: OrderItem["type"]) => {
    return orders.filter((order) => order.type === type)
  }

  const clearOrders = () => {
    setOrders([])
    localStorage.removeItem("cruise-orders")
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrdersByType, clearOrders }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}
