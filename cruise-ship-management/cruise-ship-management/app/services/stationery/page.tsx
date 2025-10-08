"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NotificationsModal from "@/components/notifications-modal"
import OrderHistoryModal from "@/components/order-history-modal"
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Search,
  Filter,
  Package,
  Gift,
  BookOpen,
  Heart,
  Star,
  Bell,
  History
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import CartModal from "@/components/cart-modal"


interface StationeryItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  rating: number
  inStock: boolean
  popular?: boolean
}

export default function StationeryPage() {
  const { items, addItem, updateQuantity, getTotalItems, getTotalPrice } = useCart()
  const { user } = useAuth()
  const { orders } = useOrders()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCart, setShowCart] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)

  const unreadNotifications = orders.filter((order) => order.status === "pending").length

  const stationeryItems: StationeryItem[] = [
    {
      id: 1,
      name: "Premium Chocolate Gift Box",
      description: "Assorted luxury chocolates in elegant packaging, perfect for special occasions",
      price: 1299,
      category: "gifts",
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&h=200&fit=crop",
      rating: 4.8,
      inStock: true,
      popular: true,
    },
    {
      id: 2,
      name: "Handcrafted Jewelry Set",
      description: "Beautiful handmade jewelry set with traditional Indian designs",
      price: 2499,
      category: "gifts",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop",
      rating: 4.9,
      inStock: true,
    },
    {
      id: 3,
      name: "Bestseller Novel Collection",
      description: "Collection of popular Indian and international bestseller novels",
      price: 899,
      category: "books",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
      rating: 4.6,
      inStock: true,
    },
    {
      id: 4,
      name: "Premium Notebook Set",
      description: "High-quality leather-bound notebooks for writing and journaling",
      price: 649,
      category: "stationery",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
      rating: 4.5,
      inStock: true,
    },
    {
      id: 5,
      name: "Artisan Tea Collection",
      description: "Premium Indian tea varieties in beautiful gift packaging",
      price: 799,
      category: "gifts",
      image: "https://media.istockphoto.com/id/2167226914/photo/a-beautiful-collection-of-colorful-and-unique-teapots-displayed-on-a-decorative-shelf.jpg?s=612x612&w=0&k=20&c=-arvdTaF4L_wwmbaoDd-88yV5pCM46daKnG6o5N3D70=",
      rating: 4.7,
      inStock: true,
      popular: true,
    },
    {
      id: 6,
      name: "Luxury Pen Set",
      description: "Premium fountain pen and ballpoint pen set in elegant case",
      price: 1899,
      category: "stationery",
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=200&fit=crop",
      rating: 4.8,
      inStock: true,
    },
    {
      id: 7,
      name: "Travel Guide Books",
      description: "Comprehensive travel guides for popular Indian destinations",
      price: 549,
      category: "books",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop",
      rating: 4.4,
      inStock: true,
    },
    {
      id: 8,
      name: "Handmade Soaps Gift Set",
      description: "Natural handmade soaps with traditional Indian fragrances",
      price: 449,
      category: "gifts",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=200&fit=crop",
      rating: 4.6,
      inStock: false,
    },
    {
      id: 9,
      name: "Art Supplies Kit",
      description: "Complete art supplies kit for sketching and painting",
      price: 1199,
      category: "stationery",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop",
      rating: 4.7,
      inStock: true,
    },
    {
      id: 10,
      name: "Spiritual Books Collection",
      description: "Collection of spiritual and motivational books by Indian authors",
      price: 699,
      category: "books",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      rating: 4.5,
      inStock: true,
    },
  ]

  const categories = [
    { id: "all", name: "All Items", icon: Package },
    { id: "gifts", name: "Gifts", icon: Gift },
    { id: "books", name: "Books", icon: BookOpen },
    { id: "stationery", name: "Stationery", icon: Heart },
  ]

  // Filter items based on search and category
  const filteredItems = stationeryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (item: StationeryItem) => {
    if (!user) {
      alert("Please login to add items to cart")
      return
    }
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: "stationery",
    })
  }

  const getItemQuantity = (itemId: number) => {
    const cartItem = items.find((item) => item.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleCheckout = () => {
    if (!user) {
      alert("Please login to proceed with checkout")
      return
    }
    if (getTotalItems() === 0) {
      alert("Your cart is empty")
      return
    }
    setShowCart(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Stationery & Gifts</h1>
                  <p className="text-sm text-gray-600">Order gifts, books, and stationery items</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">

              <Button onClick={handleCheckout} className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({getTotalItems()})
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowNotifications(true)} className="relative">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </Button>

          <Button variant="outline" onClick={() => setShowOrderHistory(true)}>
            <History className="h-4 w-4 mr-2" />
            Orders
          </Button>

              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-lg font-bold text-green-600">₹{getTotalPrice().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for gifts, books, stationery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
            >
              <div className="relative">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  {item.popular && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  {!item.inStock && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-2 left-2">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{item.rating}</span>
                  </div>
                </div>
              </div>

              <CardHeader className="flex-grow">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">{item.description}</CardDescription>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-green-600">₹{item.price}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="mt-auto">
                <div className="flex items-center justify-between">
                  {!item.inStock ? (
                    <Button disabled className="flex-1">
                      Out of Stock
                    </Button>
                  ) : getItemQuantity(item.id) > 0 ? (
                    <div className="flex items-center space-x-3 flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium text-lg">{getItemQuantity(item.id)}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, getItemQuantity(item.id) + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => addToCart(item)} className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Checkout Section */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
            <div className="container mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{getTotalItems()} items in cart</p>
                  <p className="text-xl font-bold">Total: ₹{getTotalPrice().toFixed(2)}</p>
                </div>
                <Button size="lg" className="px-8" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />
       <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <OrderHistoryModal isOpen={showOrderHistory} onClose={() => setShowOrderHistory(false)} />
    </div>
  )
}
