"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  cabinNumber?: string
  phoneNumber: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("cruise-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number"
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return "Password must contain at least one special character (@$!%*?&)"
    }
    return null
  }

  const login = async (email: string, password: string, role: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists in registered users
    const registeredUsers = JSON.parse(localStorage.getItem("cruise-registered-users") || "[]")
    const existingUser = registeredUsers.find((u: any) => u.email === email)

    if (!existingUser) {
      throw new Error("User not found. Please register first.")
    }

    // Check password (in real app, this would be hashed)
    if (existingUser.password !== password) {
      throw new Error("Invalid password.")
    }

    // Check if user is trying to login with correct role
    if (existingUser.role !== role) {
      throw new Error(`This email is registered as ${existingUser.role}. Please select the correct role.`)
    }

    // Use registered user data exactly as stored
    const mockUser: User = {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      role: existingUser.role,
      cabinNumber: existingUser.cabinNumber,
      phoneNumber: existingUser.phoneNumber,
    }

    setUser(mockUser)
    localStorage.setItem("cruise-user", JSON.stringify(mockUser))
  }

  const register = async (userData: any) => {
    // Validate password strength
    const passwordError = validatePassword(userData.password)
    if (passwordError) {
      throw new Error(passwordError)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem("cruise-registered-users") || "[]")
    const existingUser = registeredUsers.find((u: any) => u.email === userData.email)

    if (existingUser) {
      throw new Error("User with this email already exists.")
    }

    // Generate consistent cabin number based on email
    const generateCabinNumber = (email: string, role: string) => {
      if (role !== "voyager") return undefined

      // Create a simple hash from email to ensure consistency
      let hash = 0
      for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash // Convert to 32-bit integer
      }

      // Generate cabin number between A-101 to A-300
      const cabinNum = Math.abs(hash % 200) + 101
      return `A-${cabinNum}`
    }

    const newUser = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password, // In real app, this would be hashed
      role: userData.role,
      cabinNumber: generateCabinNumber(userData.email, userData.role),
      phoneNumber: userData.phoneNumber,
    }

    // Store registered user
    registeredUsers.push(newUser)
    localStorage.setItem("cruise-registered-users", JSON.stringify(registeredUsers))

    console.log("User registered:", newUser)
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("cruise-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
