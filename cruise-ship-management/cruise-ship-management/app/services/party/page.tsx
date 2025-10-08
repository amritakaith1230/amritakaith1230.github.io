"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  PartyPopper,
  Users,
  Clock,
  MapPin,
  Calendar,
  Gift,
  Heart,
  Cake,
  Briefcase,
  Star,
  Bell,
  History,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import PaymentModal from "@/components/payment-modal"
import NotificationsModal from "@/components/notifications-modal"
import OrderHistoryModal from "@/components/order-history-modal"
import type { PaymentDetails, PaymentResult } from "@/lib/payment"

interface PartyHall {
  id: number
  name: string
  capacity: number
  description: string
  features: string[]
  pricePerHour: number
  image: string
  availability: string[]
  popular?: boolean
}

interface PartyPackage {
  id: number
  name: string
  type: string
  description: string
  includes: string[]
  price: number
  duration: string
  image: string
  maxGuests: number
}

export default function PartyPage() {
  const { user } = useAuth()
  const { orders, addOrder } = useOrders()
  const [selectedHall, setSelectedHall] = useState<number | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [guestCount, setGuestCount] = useState("")
  const [partyType, setPartyType] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const unreadNotifications = orders.filter((order) => order.status === "pending").length

  const partyHalls: PartyHall[] = [
    {
      id: 1,
      name: "Grand Ballroom",
      capacity: 200,
      description: "Elegant ballroom with crystal chandeliers and ocean views, perfect for weddings and formal events",
      features: ["Crystal Chandeliers", "Ocean View", "Dance Floor", "Stage", "Premium Sound System", "Bridal Suite"],
      pricePerHour: 7500,
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
      availability: ["10:00", "14:00", "18:00"],
      popular: true,
    },
    {
      id: 2,
      name: "Sunset Terrace",
      capacity: 100,
      description: "Open-air terrace with stunning sunset views, ideal for cocktail parties and celebrations",
      features: ["Sunset Views", "Open Air", "Bar Setup", "Lounge Seating", "String Lights", "Weather Protection"],
      pricePerHour: 5000,
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
      availability: ["16:00", "18:00", "20:00"],
    },
    {
      id: 3,
      name: "Intimate Lounge",
      capacity: 50,
      description: "Cozy lounge perfect for small gatherings, birthday parties, and business meetings",
      features: ["Cozy Atmosphere", "Private Bar", "Comfortable Seating", "AV Equipment", "Catering Kitchen Access"],
      pricePerHour: 3750,
      image: "https://media.istockphoto.com/id/1461779553/photo/couple-relaxing-and-drinking-wine-on-deck-chairs-in-an-over-water-bungalow.jpg?s=612x612&w=0&k=20&c=6D_DENOr4M25OsYzbnbU4ny1iwsMMUZaIqtzN2mNtiI=",
      availability: ["12:00", "15:00", "19:00"],
    },
    {
      id: 4,
      name: "Poolside Pavilion",
      capacity: 80,
      description: "Tropical poolside venue with palm trees and water features, great for casual celebrations",
      features: ["Pool Access", "Tropical Setting", "BBQ Area", "Tiki Bar", "Water Features", "Outdoor Games"],
      pricePerHour: 4500,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      availability: ["11:00", "14:00", "17:00"],
      popular: true,
    },
  ]

  const partyPackages: PartyPackage[] = [
    {
      id: 1,
      name: "Wedding Celebration",
      type: "wedding",
      description: "Complete wedding package with ceremony and reception setup",
      includes: [
        "Ceremony Setup",
        "Reception Dinner",
        "Wedding Cake",
        "Floral Arrangements",
        "Photography",
        "DJ Service",
        "Bridal Suite",
      ],
      price: 62500,
      duration: "8 hours",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop",
      maxGuests: 150,
    },
    {
      id: 2,
      name: "Birthday Bash",
      type: "birthday",
      description: "Fun birthday party package with decorations and entertainment",
      includes: ["Birthday Decorations", "Custom Cake", "Party Games", "Music & DJ", "Photo Booth", "Party Favors"],
      price: 20000,
      duration: "4 hours",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=200&fit=crop",
      maxGuests: 50,
    },
    {
      id: 3,
      name: "Corporate Event",
      type: "business",
      description: "Professional corporate event package for business celebrations",
      includes: [
        "AV Equipment",
        "Catering Service",
        "Professional Setup",
        "Welcome Reception",
        "Networking Area",
        "Presentation Support",
      ],
      price: 30000,
      duration: "6 hours",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop",
      maxGuests: 100,
    },
    {
      id: 4,
      name: "Engagement Party",
      type: "engagement",
      description: "Romantic engagement party with elegant decorations and dining",
      includes: [
        "Romantic Decorations",
        "Champagne Toast",
        "Elegant Dinner",
        "Live Music",
        "Floral Centerpieces",
        "Memory Book",
      ],
      price: 37500,
      duration: "5 hours",
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=300&h=200&fit=crop",
      maxGuests: 80,
    },
  ]

  const partyTypes = [
    { id: "birthday", name: "Birthday Party", icon: Cake },
    { id: "wedding", name: "Wedding", icon: Heart },
    { id: "engagement", name: "Engagement", icon: Gift },
    { id: "business", name: "Corporate Event", icon: Briefcase },
    { id: "get-together", name: "Family Reunion", icon: Users },
    { id: "anniversary", name: "Anniversary", icon: Star },
  ]

  const timeSlots = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ]

  const handleSelectVenue = (hallId: number) => {
    if (!user) {
      alert("Please login to select venues")
      return
    }
    setSelectedHall(hallId)
  }

  const handleBooking = () => {
    if (!user) {
      alert("Please login to book events")
      return
    }
    if (!selectedHall || !selectedDate || !selectedTime || !guestCount) {
      alert("Please fill all booking details")
      return
    }
    setShowPayment(true)
  }

  const handlePaymentSuccess = (result: PaymentResult) => {
    const hall = partyHalls.find((h) => h.id === selectedHall)
    const pkg = partyPackages.find((p) => p.id === selectedPackage)

    addOrder({
      name: `${hall?.name} - Party Booking`,
      type: "party",
      amount: (hall?.pricePerHour || 0) * 4 + (pkg?.price || 0),
      status: "confirmed",
      details: {
        hall: hall?.name,
        package: pkg?.name,
        date: selectedDate,
        time: selectedTime,
        guests: guestCount,
      },
      transactionId: result.transactionId,
    })

    alert(`Party booking confirmed! Transaction ID: ${result.transactionId}`)
    setSelectedHall(null)
    setSelectedPackage(null)
    setSelectedDate("")
    setSelectedTime("")
    setGuestCount("")
  }

  const selectedHallData = partyHalls.find((h) => h.id === selectedHall)
  const selectedPackageData = partyPackages.find((p) => p.id === selectedPackage)
  const totalCost = (selectedHallData?.pricePerHour || 0) * 4 + (selectedPackageData?.price || 0)

  const paymentDetails: PaymentDetails = {
    amount: totalCost,
    currency: "INR",
    orderId: `PTY${Date.now()}`,
    customerInfo: {
      name: user ? `${user.firstName} ${user.lastName}` : "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      cabinNumber: user?.cabinNumber,
    },
    items: [
      ...(selectedHallData
        ? [
            {
              id: selectedHallData.id.toString(),
              name: `${selectedHallData.name} (4 hours)`,
              quantity: 1,
              price: selectedHallData.pricePerHour * 4,
            },
          ]
        : []),
      ...(selectedPackageData
        ? [
            {
              id: selectedPackageData.id.toString(),
              name: selectedPackageData.name,
              quantity: 1,
              price: selectedPackageData.price,
            },
          ]
        : []),
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
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
                <div className="p-2 bg-yellow-100 rounded-full">
                  <PartyPopper className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Party Hall Booking</h1>
                  <p className="text-sm text-gray-600">Reserve the perfect venue for your celebration</p>
                </div>
              </div>
            </div>

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
              Orders ({orders.filter((o) => o.type === "party").length})
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="venues">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="venues">Party Venues</TabsTrigger>
            <TabsTrigger value="packages">Party Packages</TabsTrigger>
            <TabsTrigger value="booking">Book Event</TabsTrigger>
          </TabsList>

          {/* Venues Tab */}
          <TabsContent value="venues" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Choose Your Venue</h2>
              <p className="text-gray-600">Select from our premium party halls and event spaces</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partyHalls.map((hall) => (
                <Card
                  key={hall.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={hall.image || "/placeholder.svg"}
                      alt={hall.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {hall.popular && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="flex items-center space-x-1 text-white">
                          <Users className="h-3 w-3" />
                          <span className="text-xs font-medium">Up to {hall.capacity}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="flex-grow">
                    <CardTitle className="text-xl">{hall.name}</CardTitle>
                    <CardDescription>{hall.description}</CardDescription>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{hall.capacity} guests</span>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-600">₹{hall.pricePerHour}/hr</span>
                    </div>
                  </CardHeader>

                  <CardContent className="mt-auto">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {hall.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Available Today:</h4>
                        <div className="flex flex-wrap gap-2">
                          {hall.availability.map((time) => (
                            <Badge key={time} variant="outline" className="text-xs">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" onClick={() => handleSelectVenue(hall.id)}>
                        <MapPin className="h-4 w-4 mr-2" />
                        Select This Venue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Party Packages</h2>
              <p className="text-gray-600">Complete party packages tailored for different celebrations</p>
            </div>

            {/* Party Type Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button variant={partyType === "" ? "default" : "outline"} size="sm" onClick={() => setPartyType("")}>
                All Packages
              </Button>
              {partyTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <Button
                    key={type.id}
                    variant={partyType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPartyType(type.id)}
                    className="flex items-center space-x-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{type.name}</span>
                  </Button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {partyPackages
                .filter((pkg) => partyType === "" || pkg.type === partyType)
                .map((pkg) => (
                  <Card
                    key={pkg.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={pkg.image || "/placeholder.svg"}
                        alt={pkg.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <div className="bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                          <div className="flex items-center space-x-1 text-white">
                            <Users className="h-3 w-3" />
                            <span className="text-xs">{pkg.maxGuests}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardHeader className="flex-grow">
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{pkg.duration}</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">₹{pkg.price}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="mt-auto">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Package Includes:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {pkg.includes.slice(0, 4).map((item) => (
                              <li key={item} className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                <span>{item}</span>
                              </li>
                            ))}
                            {pkg.includes.length > 4 && (
                              <li className="text-xs text-gray-500">+{pkg.includes.length - 4} more items...</li>
                            )}
                          </ul>
                        </div>

                        <Button className="w-full" onClick={() => setSelectedPackage(pkg.id)}>
                          Select Package
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Booking Tab */}
          <TabsContent value="booking" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Book Your Event</h2>
              <p className="text-gray-600">Complete your party booking with all the details</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription>Tell us about your celebration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="eventType">Event Type</Label>
                    <select
                      id="eventType"
                      className="w-full p-2 border rounded-md mt-1"
                      value={partyType}
                      onChange={(e) => setPartyType(e.target.value)}
                    >
                      <option value="">Select event type...</option>
                      {partyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="venue">Select Venue</Label>
                    <select
                      id="venue"
                      className="w-full p-2 border rounded-md mt-1"
                      value={selectedHall || ""}
                      onChange={(e) => setSelectedHall(Number(e.target.value))}
                    >
                      <option value="">Choose a venue...</option>
                      {partyHalls.map((hall) => (
                        <option key={hall.id} value={hall.id}>
                          {hall.name} - ₹{hall.pricePerHour}/hr (up to {hall.capacity} guests)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="package">Add Package (Optional)</Label>
                    <select
                      id="package"
                      className="w-full p-2 border rounded-md mt-1"
                      value={selectedPackage || ""}
                      onChange={(e) => setSelectedPackage(Number(e.target.value))}
                    >
                      <option value="">No package</option>
                      {partyPackages
                        .filter((pkg) => partyType === "" || pkg.type === partyType)
                        .map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} - ₹{pkg.price} ({pkg.duration})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Event Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Input
                        id="guests"
                        type="number"
                        placeholder="Expected guests"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Start Time</Label>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className="text-xs"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requests">Special Requests</Label>
                    <textarea
                      id="requests"
                      className="w-full p-2 border rounded-md mt-1"
                      rows={3}
                      placeholder="Any special decorations, dietary requirements, or other requests..."
                    />
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleBooking}
                    disabled={!selectedHall || !selectedDate || !selectedTime || !guestCount}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Event
                  </Button>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                  <CardDescription>Review your event details</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedHall ? (
                    <div className="space-y-4">
                      {(() => {
                        const hall = partyHalls.find((h) => h.id === selectedHall)
                        const pkg = partyPackages.find((p) => p.id === selectedPackage)

                        return hall ? (
                          <>
                            <div className="flex items-center space-x-3">
                              <img
                                src={hall.image || "/placeholder.svg"}
                                alt={hall.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <h4 className="font-semibold">{hall.name}</h4>
                                <p className="text-sm text-gray-600">Up to {hall.capacity} guests</p>
                                <p className="text-lg font-bold text-green-600">₹{hall.pricePerHour}/hour</p>
                              </div>
                            </div>

                            {pkg && (
                              <div className="border-t pt-4">
                                <h5 className="font-medium mb-2">Selected Package</h5>
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={pkg.image || "/placeholder.svg"}
                                    alt={pkg.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <div>
                                    <p className="font-medium">{pkg.name}</p>
                                    <p className="text-sm text-gray-600">{pkg.duration}</p>
                                    <p className="text-lg font-bold text-green-600">₹{pkg.price}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {selectedDate && selectedTime && guestCount && (
                              <div className="border-t pt-4">
                                <h5 className="font-medium mb-2">Event Details</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center space-x-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>{selectedDate}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <span>{selectedTime}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-gray-600">
                                    <Users className="h-4 w-4" />
                                    <span>{guestCount} guests</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="border-t pt-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Venue (4 hours):</span>
                                  <span>₹{(hall.pricePerHour * 4).toFixed(2)}</span>
                                </div>
                                {pkg && (
                                  <div className="flex justify-between text-sm">
                                    <span>Package:</span>
                                    <span>₹{pkg.price.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                                  <span>Total Amount:</span>
                                  <span className="text-green-600">₹{totalCost.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <PartyPopper className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a venue to see booking summary</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        paymentDetails={paymentDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <OrderHistoryModal isOpen={showOrderHistory} onClose={() => setShowOrderHistory(false)} />
    </div>
  )
}
