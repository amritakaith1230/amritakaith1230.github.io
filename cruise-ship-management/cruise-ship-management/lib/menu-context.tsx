"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface MenuItem {
  id: string
  name: string
  description: string
  category: string
  price: number
  image: string
  status: "active" | "inactive"
}

interface MenuContextType {
  menuItems: MenuItem[]
  addMenuItem: (item: Omit<MenuItem, "id">) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  // Load menu items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem("menuItems")
    if (savedItems) {
      setMenuItems(JSON.parse(savedItems))
    } else {
      // Initialize with default items
      const defaultItems: MenuItem[] = [
        {
          id: "1",
          name: "Butter Chicken",
          description: "Creamy tomato-based chicken curry",
          category: "catering",
          price: 450,
          image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
          status: "active",
        },
        {
          id: "2",
          name: "Paneer Tikka",
          description: "Grilled cottage cheese with spices",
          category: "catering",
          price: 350,
          image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
          status: "active",
        },
        {
          id: "3",
          name: "Chocolate Gift Box",
          description: "Premium assorted chocolates",
          category: "stationery",
          price: 250,
          image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400",
          status: "active",
        },
      ]
      setMenuItems(defaultItems)
      localStorage.setItem("menuItems", JSON.stringify(defaultItems))
    }
  }, [])

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem = { ...item, id: Date.now().toString() }
    const updatedItems = [...menuItems, newItem]
    setMenuItems(updatedItems)
    localStorage.setItem("menuItems", JSON.stringify(updatedItems))
  }

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const updatedItems = menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    setMenuItems(updatedItems)
    localStorage.setItem("menuItems", JSON.stringify(updatedItems))
  }

  const deleteMenuItem = (id: string) => {
    const updatedItems = menuItems.filter((item) => item.id !== id)
    setMenuItems(updatedItems)
    localStorage.setItem("menuItems", JSON.stringify(updatedItems))
  }

  return (
    <MenuContext.Provider value={{ menuItems, addMenuItem, updateMenuItem, deleteMenuItem }}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}
