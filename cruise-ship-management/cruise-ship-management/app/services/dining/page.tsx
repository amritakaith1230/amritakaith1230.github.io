"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Clock, MapPin, Calendar, Star, Utensils, Bell, History } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import PaymentModal from "@/components/payment-modal"
import NotificationsModal from "@/components/notifications-modal"
import OrderHistoryModal from "@/components/order-history-modal"
import type { PaymentDetails, PaymentResult } from "@/lib/payment"

interface DiningVenue {
  id: number
  name: string
  type: string
  description: string
  cuisine: string[]
  capacity: number
  priceRange: string
  image: string
  rating: number
  features: string[]
  timeSlots: string[]
  popular?: boolean
}

export default function DiningPage() {
  const { user } = useAuth()
  const { orders, addOrder } = useOrders()
  const [selectedVenue, setSelectedVenue] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [guestCount, setGuestCount] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)

  const unreadNotifications = orders.filter((order) => order.status === "pending").length
  const diningOrders = orders.filter((order) => order.type === "dining")

  const diningVenues: DiningVenue[] = [
    {
      id: 1,
      name: "Ocean View Restaurant",
      type: "fine-dining",
      description: "Elegant fine dining with panoramic ocean views and world-class cuisine",
      cuisine: ["Continental", "Indian", "Mediterranean"],
      capacity: 80,
      priceRange: "₹2000-3500",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      rating: 4.9,
      features: ["Ocean View", "Live Music", "Wine Pairing", "Private Dining"],
      timeSlots: ["18:00", "19:30", "21:00"],
      popular: true,
    },
    {
      id: 2,
      name: "Sunset Terrace Café",
      type: "casual",
      description: "Relaxed outdoor dining with stunning sunset views and fresh seafood",
      cuisine: ["Seafood", "Continental", "Asian"],
      capacity: 60,
      priceRange: "₹1200-2500",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      rating: 4.7,
      features: ["Sunset Views", "Outdoor Seating", "Fresh Seafood", "Cocktail Bar"],
      timeSlots: ["17:00", "18:30", "20:00"],
    },
    {
      id: 3,
      name: "Royal Balcony Dining",
      type: "luxury",
      description: "Exclusive balcony dining experience with personalized chef service",
      cuisine: ["Indian Royal", "Mughlai", "Continental"],
      capacity: 24,
      priceRange: "₹3500-5000",
      image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop",
      rating: 4.8,
      features: ["Private Balcony", "Personal Chef", "Premium Service", "Customized Menu"],
      timeSlots: ["19:00", "20:30"],
      popular: true,
    },
    {
      id: 4,
      name: "Spice Garden Lounge",
      type: "themed",
      description: "Traditional Indian dining in a beautiful garden setting with live performances",
      cuisine: ["North Indian", "South Indian", "Rajasthani"],
      capacity: 100,
      priceRange: "₹1500-2800",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
      rating: 4.6,
      features: ["Garden Setting", "Live Performances", "Traditional Decor", "Buffet Option"],
      timeSlots: ["18:30", "20:00", "21:30"],
    },
  ]

  const timeSlots = ["12:00", "13:30", "17:00", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]

  const handleReserveTable = (venueId: number) => {
    if (!user) {
      alert("Please login to make reservations")
      return
    }
    setSelectedVenue(venueId)
  }

  const handleReservation = () => {
    if (!user) {
      alert("Please login to make reservations")
      return
    }
    if (!selectedVenue || !selectedDate || !selectedTime || !guestCount) {
      alert("Please fill all reservation details")
      return
    }
    setShowPayment(true)
  }

  const handlePaymentSuccess = (result: PaymentResult) => {
    const venue = diningVenues.find((v) => v.id === selectedVenue)
    if (!venue) return

    addOrder({
      name: `${venue.name} - Dining Reservation`,
      type: "dining",
      amount: 2500,
      status: "confirmed",
      details: {
        venue: venue.name,
        date: selectedDate,
        time: selectedTime,
        guests: guestCount,
        venueType: venue.type,
        cuisine: venue.cuisine.join(", "),
      },
      transactionId: result.transactionId,
    })

    alert(`Reservation confirmed! Transaction ID: ${result.transactionId}`)
    setSelectedVenue(null)
    setSelectedDate("")
    setSelectedTime("")
    setGuestCount("")
    setShowPayment(false)
  }

  const selectedVenueData = diningVenues.find((v) => v.id === selectedVenue)

  // Create payment details with proper error handling
  const paymentDetails: PaymentDetails =
    selectedVenueData && user
      ? {
          amount: 2500,
          currency: "INR",
          orderId: `DIN${Date.now()}`,
          customerInfo: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phoneNumber,
            cabinNumber: user.cabinNumber,
          },
          items: [
            {
              id: selectedVenueData.id.toString(),
              name: `${selectedVenueData.name} - Table Reservation`,
              quantity: 1,
              price: 2500,
            },
          ],
        }
      : {
          amount: 0,
          currency: "INR",
          orderId: "",
          customerInfo: {
            name: "",
            email: "",
            phone: "",
            cabinNumber: "",
          },
          items: [],
        }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
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
                <div className="p-2 bg-orange-100 rounded-full">
                  <Utensils className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Resort Dining</h1>
                  <p className="text-sm text-gray-600">Book premium dining experiences</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
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
                Orders ({diningOrders.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="venues">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="venues">Browse Venues</TabsTrigger>
            <TabsTrigger value="booking">Make Reservation</TabsTrigger>
          </TabsList>

          {/* Venues Tab */}
          <TabsContent value="venues" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Dining Venues</h2>
              <p className="text-gray-600">Choose from our premium dining experiences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {diningVenues.map((venue) => (
                <Card
                  key={venue.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={venue.image || "/placeholder.svg"}
                      alt={venue.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {venue.popular && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{venue.rating}</span>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="flex-grow">
                    <CardTitle className="text-xl">{venue.name}</CardTitle>
                    <CardDescription>{venue.description}</CardDescription>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {venue.cuisine.map((c) => (
                        <Badge key={c} variant="secondary" className="text-xs">
                          {c}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Up to {venue.capacity}</span>
                      </div>
                      <span className="font-semibold text-green-600">{venue.priceRange}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="mt-auto">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {venue.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {venue.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{venue.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Available Today:</p>
                        <div className="flex flex-wrap gap-1">
                          {venue.timeSlots.map((time) => (
                            <Badge key={time} variant="outline" className="text-xs">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" onClick={() => handleReserveTable(venue.id)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Reserve Table
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
              <h2 className="text-2xl font-bold mb-2">Make a Reservation</h2>
              <p className="text-gray-600">Book your perfect dining experience</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Reservation Details</CardTitle>
                  <CardDescription>Fill in your dining preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="venue">Select Venue</Label>
                    <select
                      id="venue"
                      className="w-full p-2 border rounded-md mt-1"
                      value={selectedVenue || ""}
                      onChange={(e) => setSelectedVenue(Number(e.target.value))}
                    >
                      <option value="">Choose a venue...</option>
                      {diningVenues.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name} - {venue.priceRange}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
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
                        placeholder="How many guests?"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Preferred Time</Label>
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
                    <Label htmlFor="dietary">Dietary Preferences</Label>
                    <select id="dietary" className="w-full p-2 border rounded-md mt-1">
                      <option>No specific requirements</option>
                      <option>Vegetarian</option>
                      <option>Vegan</option>
                      <option>Jain</option>
                      <option>Gluten-free</option>
                      <option>Diabetic-friendly</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="occasion">Special Occasion (Optional)</Label>
                    <select id="occasion" className="w-full p-2 border rounded-md mt-1">
                      <option>None</option>
                      <option>Birthday</option>
                      <option>Anniversary</option>
                      <option>Engagement</option>
                      <option>Business Dinner</option>
                      <option>Family Celebration</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="requests">Special Requests</Label>
                    <textarea
                      id="requests"
                      className="w-full p-2 border rounded-md mt-1"
                      rows={3}
                      placeholder="Any special requests, allergies, or preferences..."
                    />
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleReservation}
                    disabled={!selectedVenue || !selectedDate || !selectedTime || !guestCount}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Confirm Reservation
                  </Button>
                </CardContent>
              </Card>

              {/* Reservation Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Reservation Summary</CardTitle>
                  <CardDescription>Review your booking details</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedVenue ? (
                    <div className="space-y-4">
                      {(() => {
                        const venue = diningVenues.find((v) => v.id === selectedVenue)

                        return venue ? (
                          <>
                            <div className="flex items-center space-x-3">
                              <img
                                src={venue.image || "/placeholder.svg"}
                                alt={venue.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <h4 className="font-semibold">{venue.name}</h4>
                                <p className="text-sm text-gray-600">{venue.type.replace("-", " ")}</p>
                                <p className="text-lg font-bold text-green-600">{venue.priceRange}</p>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <h5 className="font-medium mb-2">Cuisine Types</h5>
                              <div className="flex flex-wrap gap-1">
                                {venue.cuisine.map((c) => (
                                  <Badge key={c} variant="secondary" className="text-xs">
                                    {c}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <h5 className="font-medium mb-2">Features</h5>
                              <div className="flex flex-wrap gap-1">
                                {venue.features.map((feature) => (
                                  <Badge key={feature} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {selectedDate && selectedTime && guestCount && (
                              <div className="border-t pt-4">
                                <h5 className="font-medium mb-2">Reservation Details</h5>
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
                                  <div className="flex items-center space-x-2 text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span>Capacity: {venue.capacity} guests</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Rating:</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-bold">{venue.rating}/5</span>
                                </div>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center text-lg font-bold">
                                <span>Estimated Cost:</span>
                                <span className="text-green-600">₹2,500</span>
                              </div>
                            </div>
                          </>
                        ) : null
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a venue to see reservation summary</p>
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
