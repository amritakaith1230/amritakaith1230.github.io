"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Clock,
  Star,
  Search,
  Filter,
  Utensils,
  Coffee,
  Wine,
  Cookie,
  Bell,
  History,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import CartModal from "@/components/cart-modal"
import NotificationsModal from "@/components/notifications-modal"
import OrderHistoryModal from "@/components/order-history-modal"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  rating: number
  prepTime: string
  isVegetarian?: boolean
  isSpicy?: boolean
}

export default function CateringPage() {
  const { items, addItem, updateQuantity, getTotalItems, getTotalPrice } = useCart()
  const { user } = useAuth()
  const { orders } = useOrders()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCart, setShowCart] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Grilled Lobster Thermidor",
      description: "Fresh lobster with creamy thermidor sauce, served with garlic butter",
      price: 2299,
      category: "main",
      image: "https://media.istockphoto.com/id/1410900159/photo/lobster-thermidor.jpg?s=612x612&w=0&k=20&c=KlAq2tfUj3sd0AjaHpsNIM-uTztkdEb82DiKJcBaNX0=",
      rating: 4.8,
      prepTime: "25-30 mins",
    },
    {
      id: 2,
      name: "Butter Chicken with Naan",
      description: "Creamy butter chicken with fresh naan bread and basmati rice",
      price: 899,
      category: "main",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&h=200&fit=crop",
      rating: 4.9,
      prepTime: "20-25 mins",
    },
    {
      id: 3,
      name: "Seafood Biryani",
      description: "Aromatic basmati rice with fresh seafood and traditional spices",
      price: 1299,
      category: "main",
      image: "https://media.istockphoto.com/id/488481490/photo/fish-biryani-with-basmati-rice-indian-food.jpg?s=612x612&w=0&k=20&c=9xEw3VOQSz9TP8yQr60L47uExyKF9kogRhQdlghlC00=",
      rating: 4.7,
      prepTime: "30-35 mins",
      isSpicy: true,
    },
    {
      id: 4,
      name: "Paneer Tikka Masala",
      description: "Cottage cheese in rich tomato and cream gravy with Indian spices",
      price: 649,
      category: "main",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop",
      rating: 4.6,
      prepTime: "15-20 mins",
      isVegetarian: true,
    },
    {
      id: 5,
      name: "Gulab Jamun with Ice Cream",
      description: "Traditional Indian sweet dumplings with vanilla ice cream",
      price: 299,
      category: "dessert",
      image: "https://media.istockphoto.com/id/1365064094/photo/gulab-jamun-with-ice-cream-dessert-or-sweet-of-indian-subcontinent-festival-food.jpg?s=612x612&w=0&k=20&c=GOuj7EQkwFDi7K-XISFz-QKgvF8wE2sXI1LlfzdhY6Y=",
      rating: 4.8,
      prepTime: "10-15 mins",
    },
    {
      id: 6,
      name: "Fresh Fruit Platter",
      description: "Seasonal tropical fruits beautifully arranged",
      price: 399,
      category: "dessert",
      image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=200&fit=crop",
      rating: 4.5,
      prepTime: "5-10 mins",
      isVegetarian: true,
    },
    {
      id: 7,
      name: "Masala Chai",
      description: "Traditional Indian spiced tea with milk and aromatic spices",
      price: 149,
      category: "beverage",
      image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=200&fit=crop",
      rating: 4.7,
      prepTime: "5 mins",
    },
    {
      id: 8,
      name: "Fresh Lime Soda",
      description: "Refreshing lime soda with mint and black salt",
      price: 199,
      category: "beverage",
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop",
      rating: 4.4,
      prepTime: "3-5 mins",
      isVegetarian: true,
    },
    {
      id: 9,
      name: "Club Sandwich",
      description: "Multi-layered sandwich with chicken, vegetables and crispy fries",
      price: 549,
      category: "snack",
      image: "https://media.istockphoto.com/id/614135582/photo/ham-sandwich.jpg?s=612x612&w=0&k=20&c=-t22w7hmyHs_0oND9xlc2AAJW6vZoX-W8xG-VREz0hE=",
      rating: 4.3,
      prepTime: "10-15 mins",
    },
    {
      id: 10,
      name: "Samosa Chaat",
      description: "Crispy samosas with chutneys, yogurt and spices",
      price: 299,
      category: "snack",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop",
      rating: 4.6,
      prepTime: "5 mins",
      isVegetarian: true,
    },
  ]

  const categories = [
    { id: "all", name: "All Items", icon: Utensils },
    { id: "main", name: "Main Course", icon: Utensils },
    { id: "dessert", name: "Desserts", icon: Cookie },
    { id: "beverage", name: "Beverages", icon: Wine },
    { id: "snack", name: "Snacks", icon: Coffee },
  ]

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getItemQuantity = (itemId: number) => {
    const cartItem = items.find((item) => item.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      alert("Please login to add items to cart")
      return
    }
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image,
    })
  }

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    updateQuantity(itemId, newQuantity)
  }

  const unreadNotifications = orders.filter((order) => order.status === "pending").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
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
                <div className="p-2 bg-blue-100 rounded-full">
                  <Utensils className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Catering Services</h1>
                  <p className="text-sm text-gray-600">Order delicious meals to your cabin</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
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

              <Button onClick={() => setShowCart(true)} className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({getTotalItems()})
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
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
                placeholder="Search for dishes, ingredients..."
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
            <TabsList className="grid w-full grid-cols-5">
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

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const quantity = getItemQuantity(item.id)
            return (
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
                    {item.isVegetarian && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Veg
                      </Badge>
                    )}
                    {item.isSpicy && (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        Spicy
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
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{item.prepTime}</span>
                  </div>
                </CardHeader>

                <CardContent className="mt-auto">
                  <div className="flex items-center justify-between">
                    {quantity > 0 ? (
                      <div className="flex items-center space-x-3 flex-1">
                        <Button variant="outline" size="sm" onClick={() => handleUpdateQuantity(item.id, quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium text-lg">{quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => handleUpdateQuantity(item.id, quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => handleAddToCart(item)} className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />
      <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
            <OrderHistoryModal isOpen={showOrderHistory} onClose={() => setShowOrderHistory(false)} />
    </div>
  )
}
