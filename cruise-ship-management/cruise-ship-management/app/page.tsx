"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Ship,
  Utensils,
  Package,
  Calendar,
  Scissors,
  Dumbbell,
  PartyPopper,
  MapPin,
  Phone,
  Mail,
  User,
  LogOut,
  Headphones,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useSystem } from "@/lib/system-context"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, logout } = useAuth()
  const { settings } = useSystem()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
  }

  const goToDashboard = () => {
    if (user?.role) {
      router.push(`/dashboard/${user.role}`)
    }
  }

  const services = [
    {
      title: "Catering Services",
      description: "Delicious Indian and international cuisine delivered to your cabin",
      icon: Utensils,
      color: "text-blue-600",
      href: "/services/catering",
      features: ["24/7 Room Service", "Multi-cuisine Options", "Special Dietary Needs"],
    },
    {
      title: "Stationery & Gifts",
      description: "Books, souvenirs, chocolates, and personalized Indian gifts",
      icon: Package,
      color: "text-green-600",
      href: "/services/stationery",
      features: ["Duty-free Shopping", "Custom Gifts", "Local Souvenirs"],
    },
    {
      title: "Movie Theater",
      description: "Latest Bollywood and Hollywood movies with premium seating",
      icon: Calendar,
      color: "text-purple-600",
      href: "/services/movies",
      features: ["Latest Releases", "Premium Seating", "Private Screenings"],
    },
    {
      title: "Beauty Salon",
      description: "Professional beauty treatments and Ayurvedic wellness services",
      icon: Scissors,
      color: "text-pink-600",
      href: "/services/beauty",
      features: ["Hair Styling", "Spa Treatments", "Ayurvedic Therapy"],
    },
    {
      title: "Fitness Center",
      description: "State-of-the-art gym with yoga and meditation sessions",
      icon: Dumbbell,
      color: "text-red-600",
      href: "/services/fitness",
      features: ["Modern Equipment", "Yoga Classes", "Personal Trainers"],
    },
    {
      title: "Party Hall",
      description: "Elegant venues for Indian celebrations and special events",
      icon: PartyPopper,
      color: "text-yellow-600",
      href: "/services/party",
      features: ["Multiple Venues", "Event Planning", "Cultural Celebrations"],
    },
    {
      title: "Resort Dining",
      description: "Premium dining experiences with ocean views",
      icon: MapPin,
      color: "text-indigo-600",
      href: "/services/dining",
      features: ["Ocean View", "Fine Dining", "Cultural Cuisine"],
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer service in multiple languages",
      icon: Headphones,
      color: "text-cyan-600",
      href: "/services/support",
      features: ["Multilingual Support", "Emergency Services", "Concierge"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Ship className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">CruiseShip Manager</span>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.firstName?.[0] || "U"}</span>
                    </div>
                    <span className="hidden md:block">
                      {user.firstName} {user.lastName}
                    </span>
                  </Button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                      <div className="p-4 border-b">
                        <p className="font-semibold">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                        {user.cabinNumber && <p className="text-sm text-gray-500">Cabin: {user.cabinNumber}</p>}
                      </div>
                      <div className="p-2">
                        <Button variant="ghost" className="w-full justify-start" onClick={goToDashboard}>
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              CruiseShip Manager
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your complete cruise experience management platform. Book services, manage reservations, and enjoy luxury
            amenities all in one place.
          </p>
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={goToDashboard} className="text-lg px-8 py-3">
                Go to Dashboard
              </Button>
              <Link href="#services">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Explore Services
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8 py-3">
                  Get Started
                </Button>
              </Link>
              <Link href="#services">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Explore Services
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Premium Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience luxury and convenience with our comprehensive range of onboard services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors`}>
                        <IconComponent className={`h-8 w-8 ${service.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={service.href}>
                      <Button size="sm" className="w-full group-hover:bg-blue-700 transition-colors">
                        Access Service
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ship Info Section - Using dynamic settings */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{settings.shipName}</h2>
              <p className="text-xl text-blue-100 mb-8">
                Experience the ultimate luxury cruise with world-class amenities, exceptional service, and unforgettable
                destinations across the Indian Ocean.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{settings.capacity.toLocaleString()}</h3>
                  <p className="text-blue-100">Guest Capacity</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">15</h3>
                  <p className="text-blue-100">Decks</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">1,200</h3>
                  <p className="text-blue-100">Crew Members</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">24/7</h3>
                  <p className="text-blue-100">Service</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Current Journey</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-200" />
                  <div>
                    <p className="font-semibold">Current Location</p>
                    <p className="text-blue-100">{settings.currentLocation}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Ship className="h-5 w-5 text-blue-200" />
                  <div>
                    <p className="font-semibold">Next Destination</p>
                    <p className="text-blue-100">{settings.nextPort}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-200" />
                  <div>
                    <p className="font-semibold">Arrival Time</p>
                    <p className="text-blue-100">{settings.arrivalTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Ship className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">CruiseShip Manager</span>
              </div>
              <p className="text-gray-400">
                Your premier cruise experience management platform for luxury travel and exceptional service.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Catering Services</li>
                <li>Stationery & Gifts</li>
                <li>Entertainment</li>
                <li>Beauty & Wellness</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>24/7 Customer Service</li>
                <li>Concierge</li>
                <li>Emergency Services</li>
                <li>Guest Relations</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 1800-123-CRUISE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@cruiseshipmanager.in</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CruiseShip Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Click outside to close user menu */}
      {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />}
    </div>
  )
}
