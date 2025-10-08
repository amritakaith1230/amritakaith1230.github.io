// TypeScript type definitions
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "voyager" | "admin" | "manager" | "head-cook" | "supervisor"
  cabinNumber?: string
  phoneNumber: string
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export interface MenuItem {
  id: string
  name: string
  description: string
  category: "catering" | "stationery" | "fitness" | "beauty" | "party"
  price: number
  image?: string
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  deliveryLocation: string
  specialInstructions?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
  subtotal: number
}

export interface Booking {
  id: string
  userId: string
  type: "movie" | "beauty" | "fitness" | "party"
  title: string
  date: Date
  time: string
  location: string
  duration?: number
  participants?: number
  specialRequests?: string
  status: "confirmed" | "cancelled" | "completed"
  createdAt: Date
  updatedAt: Date
}

export interface MovieBooking extends Booking {
  movieTitle: string
  seats: string[]
  theater: string
}

export interface FitnessBooking extends Booking {
  equipment: string[]
  trainer?: string
}

export interface PartyBooking extends Booking {
  partyType: "birthday" | "wedding" | "engagement" | "business" | "get-together"
  guestCount: number
  catering: boolean
  decorations: boolean
}
