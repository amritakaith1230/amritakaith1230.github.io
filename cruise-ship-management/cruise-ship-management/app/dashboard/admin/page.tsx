"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Package, Settings, Plus, Edit, Trash2, Search, UserPlus, IndianRupee, Save } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import { useSystem } from "@/lib/system-context"

interface MenuItem {
  id: string
  name: string
  description: string
  category: string
  price: number
  image: string
  status: "active" | "inactive"
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  cabinNumber?: string
  phoneNumber: string
  status: "active" | "inactive"
}

// Define Order interface locally since it's not exported from order-context
interface OrderData {
  id: string
  type: string
  items: any[]
  total: number
  status: "pending" | "confirmed" | "preparing" | "completed" | "cancelled"
  paymentMethod: string
  transactionId: string
  customerInfo: {
    name: string
    email: string
    phone: string
    cabin?: string
  }
  createdAt: Date | string
  deliveryTime?: string
  specialInstructions?: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { orders } = useOrders()
  const { settings, updateSettings } = useSystem()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showEditItemModal, setShowEditItemModal] = useState(false)

  // Get real registered users from localStorage
  const getRegisteredUsers = (): User[] => {
    const registeredUsers = JSON.parse(localStorage.getItem("cruise-registered-users") || "[]")
    return registeredUsers.map((user: any) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      cabinNumber: user.cabinNumber,
      phoneNumber: user.phoneNumber,
      status: "active",
    }))
  }

  // Get real menu items from localStorage
  const getMenuItems = (): MenuItem[] => {
    const menuItems = JSON.parse(localStorage.getItem("menuItems") || "[]")
    return menuItems
  }

  const [users, setUsers] = useState<User[]>(getRegisteredUsers())
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getMenuItems())

  // Calculate real stats from actual data - Fixed TypeScript errors
  const totalRevenue = orders.reduce((sum, order: any) => {
    return sum + (order.total || 0)
  }, 0)

  const today = new Date().toDateString()
  const todayOrders = orders.filter((order: any) => {
    const orderDate =
      order.createdAt instanceof Date ? order.createdAt.toDateString() : new Date(order.createdAt).toDateString()
    return orderDate === today
  })

  const todayRevenue = todayOrders.reduce((sum, order: any) => {
    return sum + (order.total || 0)
  }, 0)

  const stats = [
    { title: "Total Users", value: users.length.toString(), icon: Users, color: "text-blue-600" },
    { title: "Menu Items", value: menuItems.length.toString(), icon: Package, color: "text-green-600" },
    {
      title: "Active Orders",
      value: orders.filter((o: any) => o.status === "pending" || o.status === "confirmed").length.toString(),
      icon: Settings,
      color: "text-purple-600",
    },
    {
      title: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: "text-yellow-600",
    },
  ]

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Add new menu item
  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      price: Number(formData.get("price")),
      image: formData.get("image") as string,
      status: "active",
    }

    const updatedItems = [...menuItems, newItem]
    setMenuItems(updatedItems)
    localStorage.setItem("menuItems", JSON.stringify(updatedItems))
    setShowAddItemModal(false)

    // Show success message
    alert("Menu item added successfully!")
  }

  // Edit menu item
  const handleEditMenuItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMenuItem) return

    const formData = new FormData(e.target as HTMLFormElement)
    const updatedItem: MenuItem = {
      ...selectedMenuItem,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      price: Number(formData.get("price")),
      image: formData.get("image") as string,
    }

    const updatedItems = menuItems.map((item) => (item.id === selectedMenuItem.id ? updatedItem : item))
    setMenuItems(updatedItems)
    localStorage.setItem("menuItems", JSON.stringify(updatedItems))
    setShowEditItemModal(false)
    setSelectedMenuItem(null)

    // Show success message
    alert("Menu item updated successfully!")
  }

  // Delete menu item
  const handleDeleteMenuItem = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const updatedItems = menuItems.filter((item) => item.id !== id)
      setMenuItems(updatedItems)
      localStorage.setItem("menuItems", JSON.stringify(updatedItems))
      alert("Menu item deleted successfully!")
    }
  }

  // Add new user
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    // Generate cabin number for voyagers
    const role = formData.get("role") as string
    let cabinNumber = formData.get("cabinNumber") as string
    if (role === "voyager" && !cabinNumber) {
      // Generate cabin number based on email hash
      const email = formData.get("email") as string
      const hash = email.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0)
        return a & a
      }, 0)
      const cabinLetter = String.fromCharCode(65 + (Math.abs(hash) % 26))
      const cabinNum = (Math.abs(hash) % 999) + 100
      cabinNumber = `${cabinLetter}-${cabinNum}`
    }

    const newUser: User = {
      id: Date.now().toString(),
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      role: role,
      cabinNumber: cabinNumber,
      phoneNumber: formData.get("phoneNumber") as string,
      status: "active",
    }

    // Add to registered users
    const registeredUsers = JSON.parse(localStorage.getItem("cruise-registered-users") || "[]")
    registeredUsers.push({
      ...newUser,
      password: "TempPass123!", // Default password
    })
    localStorage.setItem("cruise-registered-users", JSON.stringify(registeredUsers))

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    setShowAddUserModal(false)

    // Show success message
    alert("User added successfully!")
  }

  // Edit user
  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    const formData = new FormData(e.target as HTMLFormElement)
    const updatedUser: User = {
      ...selectedUser,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      cabinNumber: formData.get("cabinNumber") as string,
      phoneNumber: formData.get("phoneNumber") as string,
    }

    // Update in registered users
    const registeredUsers = JSON.parse(localStorage.getItem("cruise-registered-users") || "[]")
    const updatedRegisteredUsers = registeredUsers.map((user: any) =>
      user.id === selectedUser.id ? { ...user, ...updatedUser } : user,
    )
    localStorage.setItem("cruise-registered-users", JSON.stringify(updatedRegisteredUsers))

    const updatedUsers = users.map((user) => (user.id === selectedUser.id ? updatedUser : user))
    setUsers(updatedUsers)
    setShowEditUserModal(false)
    setSelectedUser(null)

    // Show success message
    alert("User updated successfully!")
  }

  // Delete user
  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      // Remove from registered users
      const registeredUsers = JSON.parse(localStorage.getItem("cruise-registered-users") || "[]")
      const updatedRegisteredUsers = registeredUsers.filter((user: any) => user.id !== id)
      localStorage.setItem("cruise-registered-users", JSON.stringify(updatedRegisteredUsers))

      const updatedUsers = users.filter((user) => user.id !== id)
      setUsers(updatedUsers)

      // Show success message
      alert("User deleted successfully!")
    }
  }

  // Save system settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const newSettings = {
      shipName: formData.get("shipName") as string,
      capacity: Number(formData.get("capacity")),
      currentLocation: formData.get("currentLocation") as string,
      nextPort: formData.get("nextPort") as string,
      arrivalTime: formData.get("arrivalTime") as string,
    }
    updateSettings(newSettings)
    alert("Settings saved successfully!")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-purple-100">
            Welcome back, {user?.firstName || "Admin"}! Manage your cruise ship operations.
          </p>
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

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="items">Menu Items</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage registered users and their accounts</CardDescription>
                  </div>
                  <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>Create a new user account</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddUser} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" name="firstName" required />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" name="lastName" required />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" required />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select name="role" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="voyager">Voyager</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="head-cook">Head Cook</SelectItem>
                              <SelectItem value="supervisor">Supervisor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="cabinNumber">Cabin Number (for Voyagers)</Label>
                          <Input id="cabinNumber" name="cabinNumber" placeholder="e.g., A-101" />
                        </div>
                        <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input id="phoneNumber" name="phoneNumber" required />
                        </div>
                        <Button type="submit" className="w-full">
                          Add User
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredUsers.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No users found</p>
                    ) : (
                      filteredUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user.email} • {user.role}
                            </p>
                            {user.role === "voyager" && user.cabinNumber && (
                              <p className="text-sm text-gray-500">Cabin: {user.cabinNumber}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="default">Active</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowEditUserModal(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Menu Items Management</CardTitle>
                    <CardDescription>Add, edit, or remove menu items</CardDescription>
                  </div>
                  <Dialog open={showAddItemModal} onOpenChange={setShowAddItemModal}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Menu Item</DialogTitle>
                        <DialogDescription>Create a new menu item</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddMenuItem} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Item Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" name="description" required />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select name="category" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="catering">Catering</SelectItem>
                              <SelectItem value="stationery">Stationery & Gifts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="price">Price (₹)</Label>
                          <Input id="price" name="price" type="number" required />
                        </div>
                        <div>
                          <Label htmlFor="image">Image URL</Label>
                          <Input id="image" name="image" placeholder="https://images.unsplash.com/..." required />
                        </div>
                        <Button type="submit" className="w-full">
                          Add Item
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {menuItems.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No menu items found</p>
                    ) : (
                      menuItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.category} • ₹{item.price}
                              </p>
                              <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="default">Active</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMenuItem(item)
                                setShowEditItemModal(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteMenuItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipName">Ship Name</Label>
                      <Input id="shipName" name="shipName" defaultValue={settings.shipName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Ship Capacity</Label>
                      <Input id="capacity" name="capacity" type="number" defaultValue={settings.capacity} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentLocation">Current Location</Label>
                      <Input id="currentLocation" name="currentLocation" defaultValue={settings.currentLocation} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextPort">Next Port</Label>
                      <Input id="nextPort" name="nextPort" defaultValue={settings.nextPort} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="arrivalTime">Arrival Time</Label>
                      <Input id="arrivalTime" name="arrivalTime" defaultValue={settings.arrivalTime} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Modal */}
        <Dialog open={showEditUserModal} onOpenChange={setShowEditUserModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <form onSubmit={handleEditUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editFirstName">First Name</Label>
                    <Input id="editFirstName" name="firstName" defaultValue={selectedUser.firstName} required />
                  </div>
                  <div>
                    <Label htmlFor="editLastName">Last Name</Label>
                    <Input id="editLastName" name="lastName" defaultValue={selectedUser.lastName} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="editEmail">Email</Label>
                  <Input id="editEmail" name="email" type="email" defaultValue={selectedUser.email} required />
                </div>
                <div>
                  <Label htmlFor="editRole">Role</Label>
                  <Select name="role" defaultValue={selectedUser.role} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="voyager">Voyager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="head-cook">Head Cook</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editCabinNumber">Cabin Number</Label>
                  <Input
                    id="editCabinNumber"
                    name="cabinNumber"
                    defaultValue={selectedUser.cabinNumber}
                    placeholder="e.g., A-101"
                  />
                </div>
                <div>
                  <Label htmlFor="editPhoneNumber">Phone Number</Label>
                  <Input id="editPhoneNumber" name="phoneNumber" defaultValue={selectedUser.phoneNumber} required />
                </div>
                <Button type="submit" className="w-full">
                  Update User
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Menu Item Modal */}
        <Dialog open={showEditItemModal} onOpenChange={setShowEditItemModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
              <DialogDescription>Update menu item information</DialogDescription>
            </DialogHeader>
            {selectedMenuItem && (
              <form onSubmit={handleEditMenuItem} className="space-y-4">
                <div>
                  <Label htmlFor="editItemName">Item Name</Label>
                  <Input id="editItemName" name="name" defaultValue={selectedMenuItem.name} required />
                </div>
                <div>
                  <Label htmlFor="editItemDescription">Description</Label>
                  <Textarea
                    id="editItemDescription"
                    name="description"
                    defaultValue={selectedMenuItem.description}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editItemCategory">Category</Label>
                  <Select name="category" defaultValue={selectedMenuItem.category} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="catering">Catering</SelectItem>
                      <SelectItem value="stationery">Stationery & Gifts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editItemPrice">Price (₹)</Label>
                  <Input id="editItemPrice" name="price" type="number" defaultValue={selectedMenuItem.price} required />
                </div>
                <div>
                  <Label htmlFor="editItemImage">Image URL</Label>
                  <Input id="editItemImage" name="image" defaultValue={selectedMenuItem.image} required />
                </div>
                <Button type="submit" className="w-full">
                  Update Item
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
